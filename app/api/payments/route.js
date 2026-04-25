import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { processOrderAndSaveToDB } from '@/lib/services/orderService';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculateServerSideTotal } from '@/lib/services/pricingService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { currency, paymentMethod, bookingsData, contactInfo } = body;

    // RULE: Server-Side Amount Validation
    const serverAmount = await calculateServerSideTotal(bookingsData, contactInfo);
    
    if (!serverAmount || serverAmount <= 0) {
      throw new Error('Invalid or empty order amount calculated on server');
    }

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

    // RULE: Never Handle Raw Card Data
    // Removed `credit-card` block entirely. Use Stripe Checkout or Elements instead.

    if (paymentMethod === 'paypal') {
      // For demo, simulate PayPal success. Real implementation would redirect to PayPal SDK.
      paymentIntent = {
        id: 'pi_paypal_' + Date.now(),
        status: 'succeeded',
      };
    } else if (paymentMethod === 'apple-pay') {
      // For demo, simulate Apple Pay. Real implementation would use Stripe Payment Request Button / Elements.
      paymentIntent = {
        id: 'pi_applepay_' + Date.now(),
        status: 'succeeded',
      };
    } else {
      throw new Error('Unsupported payment method');
    }

    // Ideally, for real payment gateways, you would handle this via Webhooks (Rule: Idempotency & Webhooks)
    // Because this is currently simulating Paypal/Apple Pay on the backend without webhooks, we process it here.
    if (paymentIntent.status === 'succeeded' && bookingsData && contactInfo) {
      console.log(paymentIntent)
      try {
        // RULE: Idempotency keys should be used if we were calling Stripe APIs here.
        // We simulate order processing.
        const order = await processOrderAndSaveToDB(bookingsData, contactInfo, {
          amount: serverAmount,
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
