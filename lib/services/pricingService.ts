import { getDumpsters } from "@/lib/models/pricing";
import { getPriceByZip } from "@/lib/controllers/pricing";
import { HEAVY_MATERIALS, HEAVY_MATERIAL_SURCHARGE, ACCOUNT_DISCOUNT } from "@/lib/constants/booking";

export async function calculateServerSideBreakdown(bookingsData: any[], contactInfo: any) {
  if (!bookingsData || !bookingsData.length) {
    return { total: 0, items: [] };
  }

  // Fetch db dumpsters to get authoritative types for free days computation
  const dbDumpsters = await getDumpsters();

  let cartTotal = 0;
  const items = [];

  for (const bData of bookingsData) {
    if (!bData.zipCode) {
      throw new Error("we are coming soon to you area");
    }

    // Find the specific dumpster to get the exact size ID and calculate free days
    const dData = dbDumpsters.find((d: any) => {
      const typeObj = Array.isArray(d.dumpster_types) ? d.dumpster_types[0] : d.dumpster_types;
      const sizeObj = Array.isArray(d.dumpster_sizes) ? d.dumpster_sizes[0] : d.dumpster_sizes;

      const matchType = typeObj?.id === bData.dumpsterType;
      const matchSize = bData.dumpsterSizeId
        ? sizeObj?.id === bData.dumpsterSizeId
        : (sizeObj?.label && sizeObj.label.startsWith(String(bData.dumpsterSize || 20)));

      return matchType && matchSize;
    });

    let actualDumpsterSizeId = bData.dumpsterSizeId;
    if (dData) {
      const sizeObj = Array.isArray(dData.dumpster_sizes) ? dData.dumpster_sizes[0] : dData.dumpster_sizes;
      if (sizeObj && sizeObj.id) {
        actualDumpsterSizeId = sizeObj.id;
      }
    }

    if (!actualDumpsterSizeId) {
      throw new Error("Invalid dumpster selection: size not found.");
    }

    let pricingRule;
    try {
      pricingRule = await getPriceByZip({
        zip: bData.zipCode,
        dumpster_size_id: actualDumpsterSizeId,
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

    const itemTotal = basePrice + surcharges + extraDaysCost + shippingPrice;
    cartTotal += itemTotal;
    items.push({ itemTotal, basePrice, surcharges, extraDaysCost, shippingPrice });
  }

  let finalPrice = cartTotal;

  // Contact info discount (if they ticked 'create account', we emulate this if they passed it)
  if (contactInfo && (contactInfo.accountDiscount || contactInfo.accountCreation)) {
    finalPrice -= ACCOUNT_DISCOUNT;
  }

  return { total: Math.max(finalPrice, 0), items };
}

export async function calculateServerSideTotal(bookingsData: any[], contactInfo: any): Promise<number> {
  const breakdown = await calculateServerSideBreakdown(bookingsData, contactInfo);
  return breakdown.total;
}
