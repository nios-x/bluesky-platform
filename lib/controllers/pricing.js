import { getDumpsters, getStartingFromPrice, getPricingRule } from "../models/pricing";
import { getZipDetails } from "../models/zip_code";

export async function listDumpsters() {
  return await getDumpsters();
}

export async function getZipPricingContext(zip) {
  const zipData = await getZipDetails(zip);

  if (!zipData) {
    throw new Error("Service is not currently available in your area");
  }

  return {
    zip: zipData.zip,
    city: zipData.city,
    county: {
      id: zipData.counties.id,
      name: zipData.counties.name,
      state: zipData.counties.state,
    },
    coordinates: {
      lat: zipData.lat,
      lng: zipData.lng,
    },
  };
}

export async function getStartingFromPricing() {
  const startingFrom = await getStartingFromPrice();

  return {
    starting_from: startingFrom,
  };
}

/**
 * Fetch price for a dumpster by ZIP + size + type IDs.
 * Returns: { base_price, shipping_price, extra_ton_price }
 */
export async function getPriceByZip({ zip, dumpster_size_id, dumpster_type_id }) {
  if (!zip) throw new Error("zip is required");

  return await getPricingRule({ zip, dumpster_size_id, dumpster_type_id });
}
