export async function getCustomerByUserId(supabase, userId) {
  return supabase
    .from("customers")
    .select("id, status")
    .eq("user_id", userId)
    .single();
}

export async function createOrderRecord(supabase, orderData) {
  return supabase.from("orders").insert(orderData).select().single();
}

export async function createOrderServiceRecord(supabase, serviceData) {
  return supabase.from("order_services").insert(serviceData);
}

export async function insertOrderStatusHistory(supabase, historyData) {
  return supabase.from("order_status_history").insert(historyData);
}

/* ================================
   GET ALL ORDERS FOR CUSTOMER
================================ */
export async function getCustomerOrders(supabase, customerId) {
  return supabase
    .from("orders")
    .select(
      `
      id,
      order_status,
      total_amount,
      created_at,
      order_services (
        delivery_date,
        pickup_date,
        dumpster_size,
        dumpster_type
      )
    `,
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
}

/* ================================
   GET SINGLE ORDER DETAILS
================================ */
export async function getOrderDetails(supabase, orderId, customerId) {
  return supabase
    .from("orders")
    .select(
      `
      id,
      order_status,
      total_amount,
      created_at,
      billing_addresses (
        id,
        full_name,
        email,
        phone,
        address,
        city,
        state,
        zip
      ),
      order_services (
        id,
        delivery_date,
        pickup_date,
        price,
        dumpster_size,
        dumpster_type,
        dumpsters (
          id,
          title,
          images
        ),
        customer_addresses (
          id,
          address_line1,
          city,
          state,
          zip
        )
      ),
      payments (
        id,
        amount,
        status,
        gateway,
        paid_at
      )
    `,
    )
    .eq("id", orderId)
    .eq("customer_id", customerId)
    .single();
}

export async function fetchAllOrders(supabase) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      total_amount,
      order_status,
      created_at,
      customers (
        first_name,
        last_name
      ),
      order_services (
        dumpster_size,
        dumpster_type,
        delivery_date
      ),
      payment_webhooks (
        gateway,
        payload
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateOrderStatusModel(supabase, orderId, status) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      order_status: status,
    })
    .eq("id", orderId)
    .select()
    .maybeSingle(); // FIX HERE

  if (error) {
    throw new Error(error.message);
  }

  return data;
}