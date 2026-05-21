import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { calculateServerSideTotal } from '@/lib/services/pricingService'
import { processOrderAndSaveToDB } from '@/lib/services/orderService'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const body = await req.json()
    const { bookingsData, contactInfo } = body

    // Server-side amount validation
    const serverAmount = await calculateServerSideTotal(bookingsData, contactInfo)
    const amountInCents = Math.round(serverAmount * 100)

    if (!amountInCents || amountInCents <= 0) {
      throw new Error('Invalid or empty order amount')
    }

    let webhookId = null
    try {
      const { data, error } = await supabaseAdmin.from('payment_webhooks').insert({
        gateway: 'stripe_checkout',
        payload: body,
        processed: false
      }).select().single()
      if (data && !error) webhookId = data.id
    } catch (e) {
      console.error('Failed to save form data to payment_webhooks:', e)
    }

    // Create Checkout Sessions from body params using price_data for dynamic pricing
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: contactInfo?.email,
      billing_address_collection: 'required',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Dumpster Rental Booking',
            },
            unit_amount: amountInCents, // Securely calculated amount
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/order`, // Redirect back to booking step 1 if canceled
      client_reference_id: webhookId ? webhookId.toString() : undefined, // Map webhook payload
      payment_intent_data: {
        description: 'Dumpster Rental Booking - Services',
        metadata: {
          webhookId: webhookId ? webhookId.toString() : '',
        }
      }
    }, {
      // Idempotency: prevent duplicate charges for the exact same form submission intent
      idempotencyKey: webhookId ? `checkout_session_${webhookId}` : undefined
    })

    // Process the order synchronously so it shows up in the database immediately
    // Note: In a strict production environment, this should only happen inside a Stripe Webhook.
    // However, we are saving it here so it mirrors the immediate behavior of Google Pay/PayPal.
    try {
      const order = await processOrderAndSaveToDB(bookingsData, contactInfo, {
        amount: serverAmount,
        method: 'stripe_checkout',
        paymentIntentId: session.id
      })

      if (webhookId && order && order.id) {
        await supabaseAdmin.from('payment_webhooks').update({
          order_id: order.id,
          processed: true
        }).eq('id', webhookId)
      }
    } catch (dbError) {
      console.error('Failed to save order to database:', dbError)
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
