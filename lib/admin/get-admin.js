// lib/admin/get-admin.js
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { admin: null };
  }

  const role = user.app_metadata?.admin_role;

  if (!role) {
    return { admin: null };
  }

  return {
    admin: { admin_role: role },
    user,
  };
}