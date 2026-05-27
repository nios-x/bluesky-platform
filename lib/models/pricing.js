import { supabaseAdmin } from "@/lib/supabase/admin";
import { getZipDetails } from "./zip_code";
import { date } from "zod";

export async function getDumpsters() {
  const { data, error } = await supabaseAdmin.from("dumpsters").select(`
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
  const { data, error } = await supabaseAdmin
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

/**
 * Look up the base_price for a specific dumpster in a specific county.
 * Flow: zip_code → county_id → pricing_rules
 */
export async function getPricingRule({ zip, dumpster_size_id, dumpster_type_id }) {
  // Step 1: Resolve ZIP details (database lookup only)
  const zipDetails = await getZipDetails(zip);
  if (!zipDetails || !zipDetails.counties) {
    throw new Error("Service is not currently available in your area");
  }
  const countyId = zipDetails.counties.id;

  // Step 2: Build pricing_rules query for the exact county
  let query = supabaseAdmin
    .from("pricing_rules")
    .select("base_price, shipping_price, extra_ton_price, county_id")
    .eq("county_id", countyId)
    .eq("is_active", true);

  console.log(query)
  if (dumpster_size_id) query = query.eq("dumpster_size_id", dumpster_size_id);
  if (dumpster_type_id) query = query.eq("dumpster_type_id", dumpster_type_id);

  const { data: rules, error: ruleError } = await query.limit(1).maybeSingle();

  if (ruleError || !rules) {
    throw new Error("Service is not currently available in your area");
  }

  return {
    base_price: Number(rules.base_price),
    shipping_price: Number(rules.shipping_price || 0),
    extra_ton_price: Number(rules.extra_ton_price || 0),
  };
}

