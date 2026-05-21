import { supabaseAdmin } from "@/lib/supabase/admin";

// Dynamic resolver that calls Google Geocoding API if ZIP not found in DB
async function resolveAndInsertZip(zip) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn("Google Maps API key not configured for dynamic zip resolution.");
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(zip)}&key=${apiKey}`
    );
    if (!response.ok) {
      console.error("Geocoding request failed:", response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      console.warn(`Geocoding status was ${data.status} for zip ${zip}`);
      return null;
    }

    const result = data.results[0];
    const components = result.address_components;

    // Get coordinates
    const lat = result.geometry?.location?.lat || null;
    const lng = result.geometry?.location?.lng || null;

    // Find county name
    let countyComponent = components.find(c =>
      c.types.includes("administrative_area_level_2")
    );

    // Fallback: reverse-geocode coordinates to find county if not directly provided
    if (!countyComponent && lat && lng) {
      try {
        const reverseResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        if (reverseResponse.ok) {
          const reverseData = await reverseResponse.json();
          if (reverseData.status === "OK" && reverseData.results && reverseData.results.length > 0) {
            for (const r of reverseData.results) {
              const comp = r.address_components.find(c =>
                c.types.includes("administrative_area_level_2")
              );
              if (comp) {
                countyComponent = comp;
                break;
              }
            }
          }
        }
      } catch (revErr) {
        console.error("Reverse geocoding fallback failed for county resolution:", revErr);
      }
    }

    if (!countyComponent) {
      console.warn(`Could not find county component for zip ${zip}`);
      return null;
    }

    const countyName = countyComponent.long_name; // e.g. "St. Clair County"
    const normalizedCountyName = countyName.replace(/\./g, ''); // "St Clair County"

    // Find state
    const stateComponent = components.find(c =>
      c.types.includes("administrative_area_level_1")
    );
    const stateName = stateComponent ? stateComponent.long_name : "Michigan";

    // Find city
    const cityComponent = components.find(c =>
      c.types.includes("locality") ||
      c.types.includes("sublocality_level_1") ||
      c.types.includes("neighborhood")
    );
    const city = cityComponent ? cityComponent.long_name : "Unknown";

    // Find county in DB
    const { data: county, error: countyError } = await supabaseAdmin
      .from("counties")
      .select("id")
      .ilike("name", normalizedCountyName)
      .maybeSingle();

    let targetCountyId;
    if (county) {
      targetCountyId = county.id;
    } else {
      console.warn(`County ${countyName} not found in DB. Auto-adding to support all postal codes.`);
      const { data: newCounty, error: insertCountyError } = await supabaseAdmin
        .from("counties")
        .insert({ name: normalizedCountyName, state: stateName })
        .select("id")
        .single();
      
      if (insertCountyError || !newCounty) {
        console.error("Failed to insert new county into DB:", insertCountyError);
        // Fall back to Washtenaw County's ID directly so the ZIP code is still cached
        targetCountyId = "fef016a0-2ce8-4710-9925-ea699576cf21";
      } else {
        targetCountyId = newCounty.id;
      }
    }

    // Insert into DB using admin client (which bypasses RLS) so next time it is cached
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("zip_codes")
      .insert({
        zip_code: zip,
        county_id: targetCountyId,
        city,
        lat,
        lng
      })
      .select()
      .maybeSingle();

    if (insertError) {
      console.error("Error inserting zip_code into database:", insertError);
      return null;
    }

    return inserted;
  } catch (err) {
    console.error("Dynamic zip code resolution failed:", err);
    return null;
  }
}

export async function getZipDetails(zip) {
  if (!zip) return null;

  // Step 1: Query database (use admin connection for server-side safety)
  let { data, error } = await supabaseAdmin
    .from("zip_codes")
    .select(
      `
      id,
      zip_code,
      city,
      lat,
      lng,
      counties (
        id,
        name,
        state
      )
    `
    )
    .eq("zip_code", zip)
    .maybeSingle();

  // Step 2: If not found, resolve it dynamically
  if (!data) {
    const insertedRecord = await resolveAndInsertZip(zip);
    if (insertedRecord) {
      // Re-query with counties join
      const { data: refetched } = await supabaseAdmin
        .from("zip_codes")
        .select(
          `
          id,
          zip_code,
          city,
          lat,
          lng,
          counties (
            id,
            name,
            state
          )
        `
        )
        .eq("zip_code", zip)
        .maybeSingle();
      
      if (refetched) {
        data = refetched;
      }
    }
  }

  if (!data) {
    return null; // ZIP not found/not serviced
  }

  // Map zip_code to zip for backward compatibility (in case frontend / code expects .zip)
  return {
    ...data,
    zip: data.zip_code
  };
}
