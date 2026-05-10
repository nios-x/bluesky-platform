import { fetchAllOrders } from "@/lib/models/order";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateOrderStatusModel } from "@/lib/models/order";


export async function getAllOrders() {
  const orders = await fetchAllOrders(supabaseAdmin);
  return orders;
}

export async function updateOrderStatus(orderId, status) {
  const order = await updateOrderStatusModel(supabaseAdmin, orderId, status);
  return order;
}

export async function getCustomerDetails(customerId) {
  // 1. Fetch customer basic info
  const { data: customer, error: customerError } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  if (customerError) throw new Error(customerError.message);

  // 2. Fetch billing addresses separately
  const { data: billingAddresses } = await supabaseAdmin
    .from("billing_addresses")
    .select("*")
    .eq("customer_id", customerId);

  // 3. Fetch customer addresses separately
  const { data: customerAddresses } = await supabaseAdmin
    .from("customer_addresses")
    .select("*")
    .eq("customer_id", customerId);

  // 4. Attach them to the customer object for the UI
  customer.billing_addresses = billingAddresses || [];
  customer.customer_addresses = customerAddresses || [];

  // 5. Fetch customer orders
  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select(`
      *,
      order_services (*),
      payment_webhooks (*)
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (ordersError) throw new Error(ordersError.message);

  return {
    customer,
    orders
  };
}
