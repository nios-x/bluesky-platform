// lib/models/invoice.js

export async function fetchAllInvoices(supabase) {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      subtotal,
      tax,
      total,
      status,
      orders (
        id,
        created_at,
        customers (
          first_name,
          last_name
        )
      )
    `)
    .order("invoice_number", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateInvoiceStatus(supabase, invoiceId, newStatus) {
  const { data, error } = await supabase
    .from("invoices")
    .update({ status: newStatus })
    .eq("id", invoiceId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
