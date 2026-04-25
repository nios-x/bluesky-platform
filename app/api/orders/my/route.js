import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMyOrdersController } from "@/controllers/order";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      // Allow fetching specific order by session ID (for confirmation page, Stripe mostly)
      const { data: payment, error: paymentError } = await supabaseAdmin
        .from('payments')
        .select('order_id')
        .eq('transaction_id', sessionId)
        .single();

      if (paymentError) {
        console.error("Order fetch error by session (payment lookup):", paymentError);
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          items:order_services(*)
        `)
        .eq('id', payment.order_id)
        .single();
        
      if (error) {
        console.error("Order fetch error by session:", error);
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, order: data });
    }

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error: fetchError } = await getMyOrdersController(
      supabase,
      user,
    );

    if (fetchError) throw fetchError;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
