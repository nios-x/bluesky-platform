import { NextRequest, NextResponse } from "next/server";
import { LOCATIONS } from "@/lib/constants/locations";

// Server-side only — API key never exposed to browser
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// === Local LOCATIONS search ===
interface LocalMatch {
  type: "local";
  zip: string;
  city: string;
  state: string;
}

function getLocalMatches(query: string): LocalMatch[] {
  if (!query || query.length < 1) return [];

  const q = query.trim().toLowerCase();

  // Extract zip portion from mixed queries like "COMINS, MI 48612"
  const zipMatch = q.match(/\b(\d{2,5})\b/);
  const textPart = q.replace(/\d+/g, "").replace(/[,]/g, " ").trim();

  const matches = (LOCATIONS as any[]).filter((loc) => {
    if (zipMatch && loc.zip && loc.zip.startsWith(zipMatch[1])) return true;
    if (textPart.length >= 2 && loc.city && loc.city.toLowerCase().includes(textPart)) return true;
    return false;
  });

  // Deduplicate by zip+city
  const seen = new Set<string>();
  const unique: LocalMatch[] = [];
  for (const loc of matches) {
    const key = `${loc.zip}-${loc.city}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({ type: "local", zip: loc.zip, city: loc.city, state: loc.state });
    }
  }
  return unique.slice(0, 20);
}

// === Google Places Autocomplete (HTTP API) ===
interface GooglePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

async function fetchGoogleAutocomplete(input: string): Promise<GooglePrediction[]> {
  if (!GOOGLE_API_KEY) return [];

  try {
    const params = new URLSearchParams({
      input,
      key: GOOGLE_API_KEY,
      components: "country:us",
      // No type restriction — returns streets, areas, cities, postal codes
    });

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`,
      { next: { revalidate: 60 } } // Cache for 60s to reduce API calls
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (data.status === "OK" && data.predictions) {
      return data.predictions;
    }
    return [];
  } catch (err) {
    console.error("Google Places Autocomplete error:", err);
    return [];
  }
}

// === API Route Handler ===
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 1) {
    return NextResponse.json({ localResults: [], googleResults: [] });
  }

  // 1. Get local matches instantly
  const localMatches = getLocalMatches(query);

  // 2. Build Google search queries
  //    - Always include the raw query
  //    - For each local match, also search "<city>, MI <zip>" for enriched results
  const searchQueries: string[] = [query];

  if (localMatches.length > 0) {
    const enrichedCount = Math.min(localMatches.length, 5);
    for (let i = 0; i < enrichedCount; i++) {
      const loc = localMatches[i];
      const enriched = `${loc.city}, MI ${loc.zip}`;
      if (!searchQueries.includes(enriched)) {
        searchQueries.push(enriched);
      }
    }
  }

  // 3. Fire all Google searches in parallel
  const allPredictionArrays = await Promise.all(
    searchQueries.map((sq) => fetchGoogleAutocomplete(sq))
  );

  // 4. Merge and deduplicate by place_id, filter to Michigan only
  const seenPlaceIds = new Set<string>();
  const googleResults: { type: "google"; place_id: string; description: string }[] = [];

  for (const predictions of allPredictionArrays) {
    for (const p of predictions) {
      if (!seenPlaceIds.has(p.place_id)) {
        seenPlaceIds.add(p.place_id);
        const desc = p.description.toLowerCase();
        const inMichigan = desc.includes(", mi") || desc.includes("michigan");
        if (inMichigan) {
          googleResults.push({
            type: "google",
            place_id: p.place_id,
            description: p.description,
          });
        }
      }
    }
  }

  return NextResponse.json({
    localResults: localMatches,
    googleResults: googleResults.slice(0, 25),
  });
}
