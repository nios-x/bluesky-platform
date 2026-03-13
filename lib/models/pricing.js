import { supabaseAnon } from "@/lib/supabase/client";

export async function getDumpsters() {
  const { data, error } = await supabaseAnon.from("dumpsters").select(`
      id,
      title,
      images,
      allowed_items,
      not_allowed_items,
      dumpster_types (
        id,
        name,
        description
      ),
      dumpster_sizes (
        id,
        label,
        width_ft,
        height_ft,
        length_ft
      )
    `);

  if (error) throw error;
  return data;
}
export async function getStartingFromPrice() {
  const { data, error } = await supabaseAnon
    .from("pricing_rules")
    .select("base_price")
    .order("base_price", { ascending: true })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) {
    return null;
  }

  return data[0].base_price;
}
