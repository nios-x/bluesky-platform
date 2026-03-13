import { supabaseAdmin } from "@/lib/supabase/client";

export async function createUserRow({ id, email }) {
  const { error } = await supabaseAdmin.from("users").upsert(
    {
      id,
      email,
      role: "CUSTOMER",
      status: "ACTIVE",
      created_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw error;
}

export async function getUserById(id) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
