import { getAllOrders } from "@/lib/controllers/admin";

export async function GET() {
  try {
    const orders = await getAllOrders();

    return Response.json({
      success: true,
      orders,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
