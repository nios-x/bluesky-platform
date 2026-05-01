import { NextResponse } from "next/server";
import { fetchAllAdmins } from "@/lib/models/admin_users";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdmin } from "@/lib/admin/get-admin";

export async function GET() {
  try {
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional: Restrict to SUPER only
    // if (admin?.admin_role !== 'SUPER') {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const data = await fetchAllAdmins(supabaseAdmin);
    return NextResponse.json({ success: true, admins: data });
  } catch (error: any) {
    console.error("Fetch admins error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
