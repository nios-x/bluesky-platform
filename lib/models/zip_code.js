import { supabaseAnon } from "@/lib/supabase/client";

export async function getZipDetails(zip) {
  const { data, error } = await supabaseAnon
    .from("zip_codes")
    .select(
      `
      id,
      zip,
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
    .eq("zip", zip)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // zip not found
    }
    throw error;
  }

  return data;
}
