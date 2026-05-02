import { NextResponse } from "next/server";
import { updateDumpster, deleteDumpster } from "@/lib/models/dumpster";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdmin } from "@/lib/admin/get-admin";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = await updateDumpster(supabaseAdmin, id, body);
    return NextResponse.json({ success: true, dumpster: data });
  } catch (error: any) {
    console.error("Update dumpster error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteDumpster(supabaseAdmin, id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete dumpster error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
