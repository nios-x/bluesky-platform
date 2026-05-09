import { getCustomerDetails } from "@/lib/controllers/admin";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const data = await getCustomerDetails(id);

    return Response.json({
      success: true,
      ...data,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
