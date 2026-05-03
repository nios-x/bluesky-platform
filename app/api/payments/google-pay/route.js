import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { processOrderAndSaveToDB } from '@/lib/services/orderService';
import { supabaseAdmin } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentData, amount, currency, bookingsData, contactInfo } = body;

    let webhookId = null;
    // Save the raw form data in the database
    try {
      const { data, error } = await supabaseAdmin.from('payment_webhooks').insert({
        gateway: 'google-pay',
        payload: body,
        processed: false
      }).select().single();
      if (data && !error) webhookId = data.id;
    } catch (e) {
      console.error('Failed to save form data to payment_webhooks:', e);
    }

    console.log('Received Google Pay data:', JSON.stringify(paymentData, null, 2));

    // Extract the payment token from Google Pay
    let token;
    if (paymentData.paymentMethodData && paymentData.paymentMethodData.tokenizationData) {
      token = paymentData.paymentMethodData.tokenizationData.token;
    } else if (paymentData.paymentMethod && paymentData.paymentMethod.tokenizationData) {
      token = paymentData.paymentMethod.tokenizationData.token;
    } else {
      console.error('Unexpected payment data structure. Available keys:', Object.keys(paymentData));
      throw new Error('Unable to extract payment token from Google Pay data');
    }

    // Parse token if it's a string (it might be JSON)
    if (typeof token === 'string') {
      try {
        const parsed = JSON.parse(token);
        if (parsed.id) {
          token = parsed.id;
        }
      } catch (e) {
        // Token is already a string ID, not JSON
      }
    }

    console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'missing');

    let paymentIntentId = `dev_gpay_${Date.now()}`;
    let status = 'succeeded';

    // For development/example gateway, simulate success
    if (token === 'example' || !token || token.includes('example')) {
      console.log('Development mode: Simulating Google Pay payment success');
    } else {
      try {
        const customerName = contactInfo?.fullName || 'Guest Customer';
        const customerAddress = {
          line1: bookingsData?.[0]?.address || contactInfo?.address || '123 Main St',
          city: bookingsData?.[0]?.city || contactInfo?.city || 'Detroit',
          state: bookingsData?.[0]?.state || contactInfo?.state || 'MI',
          postal_code: bookingsData?.[0]?.zipCode || contactInfo?.zipCode || '48201',
          country: 'US',
        };

        const customer = await stripe.customers.create({
          name: customerName,
          email: contactInfo?.email,
          address: customerAddress,
          source: token,
          shipping: {
            name: customerName,
            address: customerAddress
          }
        });

        // When using a Stripe token (tok_*), we need to create a payment intent differently
        // Option 1: Use the Charges API (legacy but simpler for tokens)
        const charge = await stripe.charges.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          customer: customer.id,
          description: `Google Pay payment for Dumpster Rental Services`,
          shipping: {
            name: customerName,
            address: customerAddress
          }
        });
        
        paymentIntentId = charge.id;
        status = charge.status === 'succeeded' ? 'succeeded' : 'failed';
      } catch (stripeError) {
        console.error('Stripe charge error:', stripeError.message);
        throw new Error(`Stripe payment failed: ${stripeError.message}`);
      }
    }

    if (status === 'succeeded' && bookingsData && contactInfo) {
      try {
        const order = await processOrderAndSaveToDB(bookingsData, contactInfo, {
          amount: amount,
          method: 'google-pay',
          paymentIntentId: paymentIntentId
        });

        // Update the webhook with the order_id and set processed to true
        if (webhookId && order && order.id) {
          await supabaseAdmin.from('payment_webhooks').update({
            order_id: order.id,
            processed: true
          }).eq('id', webhookId);
        }
      } catch (dbError) {
        console.error('Failed to save order to database:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntentId,
      status: status,
    });
    
  } catch (error) {
    console.error('Google Pay processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}