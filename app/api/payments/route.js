import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

export async function POST(request) {
  try {
    const { amount, currency, paymentMethod, cardData } = await request.json();

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