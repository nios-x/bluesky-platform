import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { processOrderAndSaveToDB } from '@/lib/services/orderService';
import { calculateServerSideTotal } from '@/lib/services/pricingService';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '' // Ensure this is in .env
    );
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle specific events
  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    let webhookId;
    let paymentIntentId;
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      webhookId = session.client_reference_id || session.metadata?.webhookId;
      paymentIntentId = session.payment_intent;
    } else {
      const paymentIntent = event.data.object as any;
      webhookId = paymentIntent.metadata?.webhookId;
      paymentIntentId = paymentIntent.id;
    }

    if (!webhookId) {
      console.warn('Webhook received but no webhookId was attached.');
      return NextResponse.json({ received: true });
    }

    try {
      // 1. Check if we already processed it (Idempotency check)
      const { data: webhookRecord, error: fetchError } = await supabaseAdmin
        .from('payment_webhooks')
        .select('*')
        .eq('id', webhookId)
        .single();

      if (fetchError || !webhookRecord) {
        console.error(`Webhook record ${webhookId} not found in DB.`);
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      if (webhookRecord.processed) {
        // Already processed successfully previously
        return NextResponse.json({ received: true });
      }

      // 2. We have the payload, process the order
      const payload = webhookRecord.payload;
      const { bookingsData, contactInfo } = payload;
      
      // Calculate final exact amount to confirm logic (if needed, but Stripe was paid)
      const serverAmount = await calculateServerSideTotal(bookingsData, contactInfo);

      const order = await processOrderAndSaveToDB(bookingsData, contactInfo, {
        amount: serverAmount,
        method: webhookRecord.gateway || 'stripe_checkout',
        paymentIntentId: paymentIntentId
      });

      // 3. Mark processed
      if (order && order.id) {
        await supabaseAdmin.from('payment_webhooks').update({
          order_id: order.id,
          processed: true
        }).eq('id', webhookId);
      }

    } catch (e: any) {
      console.error('Failed processing webhook order:', e);
      // Stripe will retry if we return 500, which might be desired on DB failure
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
