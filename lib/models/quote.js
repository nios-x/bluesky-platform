import { supabaseAdmin } from "@/lib/supabase";
import { getZipDetails } from "./zip_code";

export async function calculateQuote({
  zip_code,
  dumpster_size_id,
  dumpster_type_id,
  rental_days,
  estimated_weight_tons,
}) {
  // 1️⃣ Get county from ZIP using getZipDetails
  const zipDetails = await getZipDetails(zip_code);
  if (!zipDetails || !zipDetails.counties) {
    throw new Error("Service not available in this ZIP code");
  }

  const countyId = zipDetails.counties.id;

  // 2️⃣ Get pricing rule
  let { data: rule, error: ruleError } = await supabaseAdmin
    .from("pricing_rules")
    .select("*")
    .eq("county_id", countyId)
    .eq("dumpster_size_id", dumpster_size_id)
    .eq("dumpster_type_id", dumpster_type_id)
    .maybeSingle();

  // If no pricing rule is found for this specific county, fall back to Washtenaw County (fef016a0-2ce8-4710-9925-ea699576cf21)
  if (ruleError || !rule) {
    const fallbackCountyId = "fef016a0-2ce8-4710-9925-ea699576cf21";
    const { data: fallbackRule, error: fallbackError } = await supabaseAdmin
      .from("pricing_rules")
      .select("*")
      .eq("county_id", fallbackCountyId)
      .eq("dumpster_size_id", dumpster_size_id)
      .eq("dumpster_type_id", dumpster_type_id)
      .maybeSingle();

    if (fallbackError || !fallbackRule) {
      throw new Error("Pricing not set for selected dumpster in this area");
    }
    rule = fallbackRule;
  }


  const basePrice = Number(rule.base_price);
  const shippingPrice = Number(rule.shipping_price || 0);
  const includedDays = rule.included_days || 0;
  const extraDayPrice = Number(rule.extra_day_price || 0);
  const includedTons = Number(rule.included_tons || 0);
  const extraTonPrice = Number(rule.extra_ton_price || 0);

  const extraDays = Math.max(0, rental_days - includedDays);
  const extraDaysCost = extraDays * extraDayPrice;

  const extraTons = Math.max(0, estimated_weight_tons - includedTons);
  const extraWeightCost = extraTons * extraTonPrice;

  const total = basePrice + shippingPrice + extraDaysCost + extraWeightCost;

  return {
    base_price: basePrice,
    shipping_fee: shippingPrice,
    included_days: includedDays,
    included_tons: includedTons,
    extra_days_fee: extraDaysCost,
    extra_weight_fee: extraWeightCost,
    total_price: total,
    currency: "USD",
  };
}
