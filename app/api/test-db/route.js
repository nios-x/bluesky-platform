import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: types } = await supabaseAdmin.from("dumpster_types").select("*");
    const { data: rules } = await supabaseAdmin.from("pricing_rules").select("*");
    const { data: sizes } = await supabaseAdmin.from("dumpster_sizes").select("*");

    return NextResponse.json({ types, rules, sizes });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
