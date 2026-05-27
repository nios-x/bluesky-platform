import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getZipDetails(zip) {
  if (!zip) return null;
  // Query database only — no dynamic resolution or auto-insertion
  const { data, error } = await supabaseAdmin
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

  if (error) {
    console.error("Error querying zip_codes:", error);
    return null;
  }

  if (!data) {
    return null; // ZIP not found — service not available in this area
  }


  // Map zip_code to zip for backward compatibility (in case frontend / code expects .zip)
  return {
    ...data,
    zip: data.zip_code
  };
}

