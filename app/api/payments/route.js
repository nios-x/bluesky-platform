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
    const { amount, currency, paymentMethod, cardData, bookingsData, contactInfo } = body;

    let webhookId = null;
    // Save the raw form data in the database
    try {
      const { data, error } = await supabaseAdmin.from('payment_webhooks').insert({
        gateway: paymentMethod || 'unknown',
        payload: body,
        processed: false
      }).select().single();
      if (data && !error) webhookId = data.id;
    } catch (e) {
      console.error('Failed to save form data to payment_webhooks:', e);
    }

    let paymentIntent;

    if (paymentMethod === 'credit-card') {
      // Create a payment method with card details
      const paymentMethodObj = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardData.cardNumber.replace(/\s/g, ''),
          exp_month: parseInt(cardData.expiry.split('/')[0]),
          exp_year: parseInt('20' + cardData.expiry.split('/')[1]),
          cvc: cardData.cvc,
        },
      });

      // Create payment intent
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        payment_method: paymentMethodObj.id,
        confirm: true,
        automatic_payment_methods: {
          enabled: false,
        },
      });
    } else if (paymentMethod === 'paypal') {
      // For demo, simulate PayPal
      paymentIntent = {
        id: 'pi_paypal_' + Date.now(),
        status: 'succeeded',
      };
    } else if (paymentMethod === 'apple-pay') {
      // For demo, simulate Apple Pay
      paymentIntent = {
        id: 'pi_applepay_' + Date.now(),
        status: 'succeeded',
      };
    } else {
      throw new Error('Unsupported payment method');
    }

    if (paymentIntent.status === 'succeeded' && bookingsData && contactInfo) {
      console.log(paymentIntent)
      try {
        const order = await processOrderAndSaveToDB(bookingsData, contactInfo, {
          amount: amount,
          method: paymentMethod,
          paymentIntentId: paymentIntent.id
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
        // Note: You might want to refund the payment here in a production environment
      }
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}