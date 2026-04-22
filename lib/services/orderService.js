import { supabaseAdmin } from "../supabase/admin";

export async function processOrderAndSaveToDB(bookingData, contactInfo, paymentDetails) {
  if (!contactInfo || !contactInfo.email) {
    throw new Error("Missing contact email");
  }

  // 1. Check if user exists or create an anonymous user
  let user = null;
  const { data: existingUsers, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (!searchError && existingUsers && existingUsers.users) {
    user = existingUsers.users.find(u => u.email === contactInfo.email);
  }

  if (!user) {
    // Create an auth user for the guest
    const randomPassword = Math.random().toString(36).slice(-12) + "A1!";
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: contactInfo.email,
      password: randomPassword,
      email_confirm: true,
    });
    
    if (createError) {
      console.error("Auth user creation error:", createError);
      throw new Error("Failed to create user account for order");
    }
    user = newUser.user;
  }

  // 2. Create or find customer
  let { data: customer } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!customer) {
    const { data: newCustomer, error: customerError } = await supabaseAdmin
      .from("customers")
      .insert({
        user_id: user.id,
        first_name: contactInfo.fullName.split(' ')[0] || "Guest",
        last_name: contactInfo.fullName.split(' ').slice(1).join(' ') || "User",
        phone: contactInfo.phone || "0000000000",
        customer_type: "INDIVIDUAL",
        company_name: contactInfo.company || null,
        status: "ACTIVE"
      })
      .select()
      .single();

    if (customerError) throw customerError;
    customer = newCustomer;
  }

  // 3. Create billing address
  const { data: billingAddress, error: billingError } = await supabaseAdmin
    .from("billing_addresses")
    .insert({
      customer_id: customer.id,
      full_name: contactInfo.fullName,
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: bookingData.address || "Pending Address",
      city: bookingData.city || "Pending City",
      state: bookingData.state || "MI",
      zip: bookingData.zipCode || "00000"
    })
    .select()
    .single();

  if (billingError) throw billingError;

  // 4. Create customer address (service address)
  const { data: serviceAddress, error: serviceAddressError } = await supabaseAdmin
    .from("customer_addresses")
    .insert({
      customer_id: customer.id,
      address_line1: bookingData.address || "Pending Address",
      city: bookingData.city || "Pending City",
      state: bookingData.state || "MI",
      zip: bookingData.zipCode || "00000",
      is_default: true
    })
    .select()
    .single();

  if (serviceAddressError) throw serviceAddressError;

  // 5. Create Order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_id: customer.id,
      billing_address_id: billingAddress.id,
      total_amount: paymentDetails.amount,
      order_status: "PAID" // Or 'REQUESTED' then updated to 'PAID'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Look up dumpster id
  let finalDumpsterId = bookingData.dumpsterType;
  let finalDumpsterTypeLabel = "ROLL_OFF";
  try {
    const { data: sizes } = await supabaseAdmin
      .from("dumpster_sizes")
      .select("id, label")
      .ilike("label", `${bookingData.dumpsterSize || 20}%`);

    const sizeId = sizes && sizes.length > 0 ? sizes[0].id : null;

    if (sizeId) {
      const { data: dData } = await supabaseAdmin
        .from("dumpsters")
        .select("id, dumpster_types(name)")
        .eq("dumpster_type_id", bookingData.dumpsterType)
        .eq("dumpster_size_id", sizeId)
        .single();
      
      if (dData) {
        finalDumpsterId = dData.id;
        if (dData.dumpster_types) finalDumpsterTypeLabel = dData.dumpster_types.name;
      }
    }
  } catch (e) {
    console.error("Dumpster lookup error:", e);
  }

  // 6. Create Order Services
  const { error: serviceError } = await supabaseAdmin
    .from("order_services")
    .insert({
      order_id: order.id,
      dumpster_id: finalDumpsterId,
      dumpster_type: finalDumpsterTypeLabel,
      dumpster_size: bookingData.dumpsterSize ? bookingData.dumpsterSize.toString() + " Yard" : "20 Yard",
      delivery_date: bookingData.deliveryDate || new Date().toISOString().split('T')[0],
      pickup_date: new Date(new Date().setDate(new Date().getDate() + (bookingData.rentalPeriod || 7))).toISOString().split('T')[0],
      service_address_id: serviceAddress.id,
      price: paymentDetails.amount
    });

  // Ignoring service error to not fail the whole payment if dumpster ID is misaligned, but log it
  if (serviceError) console.error("Order service creation error:", serviceError);

  // 7. Create Invoice
  const invoiceNumber = `INV-${Date.now()}`;
  const { data: invoice, error: invoiceError } = await supabaseAdmin
    .from("invoices")
    .insert({
      order_id: order.id,
      invoice_number: invoiceNumber,
      subtotal: paymentDetails.amount,
      tax: 0,
      total: paymentDetails.amount,
      status: "PAID"
    })
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // 8. Create Payment Record
  const { error: paymentRecordError } = await supabaseAdmin
    .from("payments")
    .insert({
      order_id: order.id,
      invoice_id: invoice.id,
      gateway: paymentDetails.method === 'google-pay' ? 'GPAY' : 'STRIPE',
      transaction_id: paymentDetails.paymentIntentId || "pending",
      amount: paymentDetails.amount,
      status: "COMPLETED",
      paid_at: new Date().toISOString()
    });

  if (paymentRecordError) throw paymentRecordError;

  return order;
}
