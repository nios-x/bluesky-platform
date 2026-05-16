import { NextRequest, NextResponse } from "next/server";

// Server-side only — API key never exposed to browser
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId")?.trim();

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: "Google API key not configured" }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      place_id: placeId,
      key: GOOGLE_API_KEY,
      fields: "address_component",
    });

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Google API request failed" }, { status: 502 });
    }

    const data = await res.json();

    if (data.status !== "OK" || !data.result?.address_components) {
      return NextResponse.json({
        street: "",
        city: "",
        state: "",
        zip: "",
      });
    }

    const components = data.result.address_components;

    const getComponent = (type: string) =>
      components.find((c: any) => c.types.includes(type))?.long_name || "";

    const streetNumber = getComponent("street_number");
    const route = getComponent("route");
    const city =
      getComponent("locality") ||
      getComponent("sublocality_level_1") ||
      getComponent("administrative_area_level_2");
    const state = getComponent("administrative_area_level_1");
    const zip = getComponent("postal_code");

    const street = [streetNumber, route].filter(Boolean).join(" ");

    return NextResponse.json({
      street,
      city,
      state,
      zip,
      fullAddress: data.result.formatted_address || "",
    });
  } catch (err) {
    console.error("Google Place Details error:", err);
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 });
  }
}
