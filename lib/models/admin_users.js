export async function fetchAllAdmins(supabase) {
  const { data, error } = await supabase
    .from("admins")
    .select("id, user_id, name, admin_role, status, created_at")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateAdminRecord(supabase, adminId, payload) {
  // payload can contain { admin_role, status }
  const { data, error } = await supabase
    .from("admins")
    .update(payload)
    .eq("id", adminId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
