import { getDumpsters } from "@/lib/models/pricing";
import { getPriceByZip } from "@/lib/controllers/pricing";
import { HEAVY_MATERIALS, HEAVY_MATERIAL_SURCHARGE, ACCOUNT_DISCOUNT } from "@/lib/constants/booking";

export async function calculateServerSideTotal(bookingsData: any[], contactInfo: any): Promise<number> {
  if (!bookingsData || !bookingsData.length) {
    return 0;
  }

  // Fetch db dumpsters to get authoritative types for free days computation
  const dbDumpsters = await getDumpsters();
  
  let cartTotal = 0;

  for (const bData of bookingsData) {
    if (!bData.zipCode) {
      throw new Error("we are coming soon to you area");
    }

    let pricingRule;
    try {
      pricingRule = await getPriceByZip({
        zip: bData.zipCode,
        dumpster_size_id: bData.dumpsterSizeId,
        dumpster_type_id: bData.dumpsterType
      });
    } catch (err: any) {
      // Throw the exact error message the user requested when DB lookup fails
      throw new Error("we are coming soon to you area");
    }

    const basePrice = pricingRule.base_price;
    const shippingPrice = pricingRule.shipping_price || 0;

    let surcharges = 0;
    const isHeavyMaterial = bData.materialType && HEAVY_MATERIALS.includes(bData.materialType);
    if (isHeavyMaterial && bData.dumpsterType === "47d87a5e-84c8-431e-b055-c996142352eb") {
      surcharges += HEAVY_MATERIAL_SURCHARGE;
    }

    // Find dumpster type to calculate free days
    const dData = dbDumpsters.find((d: any) => {
      const typeObj = Array.isArray(d.dumpster_types) ? d.dumpster_types[0] : d.dumpster_types;
      return typeObj?.id === bData.dumpsterType;
    });

    let extraDaysCost = 0;
    let freeDays = 7;
    if (dData) {
      const typeObj = Array.isArray(dData.dumpster_types) ? dData.dumpster_types[0] : dData.dumpster_types;
      if (typeObj?.name?.includes("Rubber")) {
        freeDays = 14;
      }
    }

    if (bData.rentalPeriod && bData.rentalPeriod > freeDays) {
      extraDaysCost = (bData.rentalPeriod - freeDays) * 25;
    }

    cartTotal += basePrice + surcharges + extraDaysCost + shippingPrice;
  }

  let finalPrice = cartTotal;

  // Contact info discount (if they ticked 'create account', we emulate this if they passed it)
  if (contactInfo && (contactInfo.accountDiscount || contactInfo.accountCreation)) {
    finalPrice -= ACCOUNT_DISCOUNT;
  }

  return Math.max(finalPrice, 0);
}
