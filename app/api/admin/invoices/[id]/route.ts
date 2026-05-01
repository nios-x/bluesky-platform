import { NextResponse } from "next/server";
import { updateInvoiceStatus } from "@/lib/models/invoice";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdmin } from "@/lib/admin/get-admin";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const data = await updateInvoiceStatus(supabaseAdmin, params.id, status);
    return NextResponse.json({ success: true, invoice: data });
  } catch (error: any) {
    console.error("Update invoice error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
