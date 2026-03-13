import {
  getCustomerByUserId,
  createOrderRecord,
  createOrderServiceRecord,
  insertOrderStatusHistory,
  getCustomerOrders,
  getOrderDetails,
} from "@/models/order";

export async function createOrderController(supabase, user, body) {
  const { data: customer, error: custError } = await getCustomerByUserId(
    supabase,
    user.id,
  );

  if (custError || !customer) throw new Error("Customer not found");
  if (customer.status !== "ACTIVE") throw new Error("Customer inactive");

  const {
    billing_address_id,
    dumpster_id,
    delivery_date,
    pickup_date,
    service_address_id,
    quoted_price,
    dumpster_size_label,
    dumpster_type_label,
  } = body;

  // 1️⃣ Create order FIRST (pending payment)
  const { data: order, error: orderError } = await createOrderRecord(supabase, {
    customer_id: customer.id,
    billing_address_id,
    total_amount: quoted_price,
    order_status: "PENDING_PAYMENT",
  });

  if (orderError) throw orderError;

  // 2️⃣ Create service snapshot
  const { error: serviceError } = await createOrderServiceRecord(supabase, {
    order_id: order.id,
    dumpster_id,
    dumpster_type: dumpster_type_label,
    dumpster_size: dumpster_size_label,
    delivery_date,
    pickup_date,
    service_address_id,
    price: quoted_price,
  });

  if (serviceError) throw serviceError;

  // 3️⃣ Status history
  await insertOrderStatusHistory(supabase, {
    order_id: order.id,
    old_status: "REQUESTED",
    new_status: "PENDING_PAYMENT",
  });

  return order;
}

