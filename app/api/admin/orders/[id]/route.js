// app/api/admin/orders/[id]/route.js 
import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateOrderStatusModel } from "@/lib/models/order";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const order = await updateOrderStatusModel(supabaseAdmin, id, body.status);

    return Response.json({
      success: true,
      order,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
