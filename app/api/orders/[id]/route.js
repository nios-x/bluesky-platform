import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getOrderByIdController } from "@/controllers/order";

export async function GET(req, { params }) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const order = await getOrderByIdController(supabase, user, params.id);

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}
