import { fetchAllOrders } from "@/lib/models/order";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateOrderStatusModel } from "@/lib/models/order";


export async function getAllOrders() {
  const supabase = await createSupabaseServerClient();

  const orders = await fetchAllOrders(supabase);

  return orders;
}

export async function updateOrderStatus(orderId, status) {
   const supabase = await createSupabaseServerClient();

  const order = await updateOrderStatusModel(supabase, orderId, status);

  return order;
}
