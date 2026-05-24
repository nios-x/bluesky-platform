import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { calculateServerSideTotal } from '@/lib/services/pricingService'
import { createPendingOrder } from '@/lib/services/orderService'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    console.log("headers", origin)
    const body = await req.json()
    const { bookingsData, contactInfo } = body
    console.log(body)

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

    // Create the order as PENDING_PAYMENT before initiating Stripe Checkout
    let orderId = undefined;
    try {
      const order = await createPendingOrder(bookingsData, contactInfo, {
        amount: serverAmount,
        method: 'stripe_checkout'
      })
      if (order && order.id) {
        orderId = order.id;
        if (webhookId) {
          await supabaseAdmin.from('payment_webhooks').update({
            order_id: order.id
          }).eq('id', webhookId)
        }
      }
    } catch (dbError) {
      console.error('Failed to create pending order:', dbError)
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
          orderId: orderId ? orderId.toString() : '',
        }
      }
    }, {
      // Idempotency: prevent duplicate charges for the exact same form submission intent
      idempotencyKey: webhookId ? `checkout_session_${webhookId}` : undefined
    })

    // Stripe checkout url will be returned
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
