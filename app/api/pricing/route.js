import { NextResponse } from "next/server";
import { getPriceByZip } from "@/lib/controllers/pricing";

/**
 * GET /api/pricing?zip=12345&dumpster_size_id=<uuid>&dumpster_type_id=<uuid>
 *
 * Returns:
 * { base_price: 695, shipping_price: 0, extra_ton_price: 75 }
 *
 * Query params:
 *   zip              (required) – 5-digit ZIP code
 *   dumpster_size_id (optional) – filter by size UUID
 *   dumpster_type_id (optional) – filter by type UUID
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const zip = searchParams.get("zip");
    const dumpster_size_id = searchParams.get("dumpster_size_id");
    const dumpster_type_id = searchParams.get("dumpster_type_id");

    if (!zip) {
      return NextResponse.json(
        { error: "zip query parameter is required" },
        { status: 400 }
      );
    }

    const pricing = await getPriceByZip({ zip, dumpster_size_id, dumpster_type_id });

    return NextResponse.json(pricing);
  } catch (error) {
    const isNotFound =
      error.message.includes("not available") ||
      error.message.includes("not set");

    return NextResponse.json(
      { error: error.message },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
