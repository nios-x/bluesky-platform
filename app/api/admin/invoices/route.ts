import { NextResponse } from "next/server";
import { fetchAllInvoices } from "@/lib/models/invoice";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdmin } from "@/lib/admin/get-admin";

export async function GET() {
  try {
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await fetchAllInvoices(supabaseAdmin);
    return NextResponse.json({ success: true, invoices: data });
  } catch (error: any) {
    console.error("Fetch invoices error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
