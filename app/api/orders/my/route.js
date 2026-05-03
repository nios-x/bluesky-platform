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
          items:order_services(*),
          customer_data:customers(first_name, last_name, phone, company_name, user_id),
          billing_address:billing_addresses(full_name, email, phone, address, city, state, zip)
        `)
        .eq('id', payment.order_id)
        .single();
        
      if (error) {
        console.error("Order fetch error by session:", error);
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      // Get auth user email from the customer's user_id
      let email = data.billing_address?.email || '';
      if (!email && data.customer_data?.user_id) {
        const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(data.customer_data.user_id);
        if (user && !userError) {
          email = user.email;
        }
      }

      // Transform items to use camelCase field names
      const transformedItems = (data.items || []).map(item => ({
        id: item.id,
        order_id: item.order_id,
        dumpster_id: item.dumpster_id,
        dumpsterType: item.dumpster_type,
        dumpster_type_id: item.dumpster_type,
        dumpsterSize: item.dumpster_size,
        size: item.dumpster_size,
        deliveryDate: item.delivery_date,
        pickup_date: item.pickup_date,
        pickupDate: item.pickup_date,
        service_address_id: item.service_address_id,
        totalPrice: item.price,
        price: item.price,
        zipCode: data.billing_address?.zip,
        rentalPeriod: item.rental_period || 7, // Default to 7 days if not set
        dumpsterCapacity: item.weight_capacity_tons,
        weightCapacity: item.weight_capacity_tons
      }));

      // Transform the data to match what the frontend expects
      const transformedOrder = {
        ...data,
        items: transformedItems,
        customer: {
          full_name: data.billing_address?.full_name || `${data.customer_data?.first_name || ''} ${data.customer_data?.last_name || ''}`.trim(),
          email: email,
          phone: data.billing_address?.phone || data.customer_data?.phone || '',
          company: data.customer_data?.company_name || null,
          zipCode: data.billing_address?.zip || 'N/A',
          placement_instructions: data.placement_instructions || null
        },
        payment_method: 'stripe_checkout'
      };

      return NextResponse.json({ success: true, order: transformedOrder });
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
