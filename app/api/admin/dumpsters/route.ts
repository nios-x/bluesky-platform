import { NextResponse } from "next/server";
import { getDumpsters, createDumpster } from "@/lib/models/dumpster";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdmin } from "@/lib/admin/get-admin";

export async function GET() {
  try {
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getDumpsters(supabaseAdmin);
    return NextResponse.json({ success: true, dumpsters: data });
  } catch (error: any) {
    console.error("Fetch dumpsters error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { admin } = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = await createDumpster(supabaseAdmin, body);
    return NextResponse.json({ success: true, dumpster: data });
  } catch (error: any) {
    console.error("Create dumpster error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
