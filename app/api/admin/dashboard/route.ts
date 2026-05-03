import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/models/admin_dashboard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdmin } from "@/lib/admin/get-admin";

export async function GET() {
  try {
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getDashboardMetrics(supabaseAdmin);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
