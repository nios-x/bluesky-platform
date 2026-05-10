import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: customers, error } = await supabaseAdmin
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return Response.json({
      success: true,
      customers,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
