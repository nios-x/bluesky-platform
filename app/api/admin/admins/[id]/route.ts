import { NextResponse } from "next/server";
import { updateAdminRecord } from "@/lib/models/admin_users";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdmin } from "@/lib/admin/get-admin";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional: Restrict to SUPER only
    // if (admin?.admin_role !== 'SUPER') {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const payload = await req.json();

    // Ensure we only update allowed fields
    const allowedPayload: any = {};
    if (payload.admin_role) allowedPayload.admin_role = payload.admin_role;
    if (payload.status) allowedPayload.status = payload.status;

    if (Object.keys(allowedPayload).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const data = await updateAdminRecord(supabaseAdmin, params.id, allowedPayload);
    return NextResponse.json({ success: true, admin: data });
  } catch (error: any) {
    console.error("Update admin error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
