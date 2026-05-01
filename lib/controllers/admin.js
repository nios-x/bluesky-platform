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
