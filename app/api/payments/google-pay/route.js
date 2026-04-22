import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { processOrderAndSaveToDB } from '@/lib/services/orderService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

export async function POST(request) {
  try {
    const { paymentData, amount, currency, bookingData, contactInfo } = await request.json();

    console.log('Received Google Pay data:', JSON.stringify(paymentData, null, 2));

    // Extract the payment token from Google Pay
    let token;
    if (paymentData.paymentMethodData && paymentData.paymentMethodData.tokenizationData) {
      token = paymentData.paymentMethodData.tokenizationData.token;
    } else {
      console.error('Unexpected payment data structure. Available keys:', Object.keys(paymentData));
      if (paymentData.tokenizationData) {
        token = paymentData.tokenizationData.token;
      } else {
        throw new Error('Unable to extract payment token from Google Pay data');
      }
    }

    console.log('Extracted token:', token ? 'present' : 'missing');

    let paymentIntentId = `dev_gpay_${Date.now()}`;
    let status = 'succeeded';

    // For development/example gateway, simulate success
    if (token === 'example' || !token || token.includes('example')) {
      console.log('Development mode: Simulating Google Pay payment success');
    } else {
      // Create a payment intent with Stripe using the Google Pay token
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        payment_method_data: {
          type: 'card',
          card: {
            token: token,
          },
        },
        confirm: true,
        automatic_payment_methods: {
          enabled: false,
        },
      });
      paymentIntentId = paymentIntent.id;
      status = paymentIntent.status;
    }

    if (status === 'succeeded' && bookingData && contactInfo) {
      try {
        await processOrderAndSaveToDB(bookingData, contactInfo, {
          amount: amount,
          method: 'google-pay',
          paymentIntentId: paymentIntentId
        });
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