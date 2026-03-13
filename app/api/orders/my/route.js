import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getMyOrdersController } from "@/controllers/order";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error: fetchError } = await getMyOrdersController(
      supabase,
      user,
    );

    if (fetchError) throw fetchError;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
