import { getDumpsters } from "@/lib/models/pricing";
import { HEAVY_MATERIALS, HEAVY_MATERIAL_SURCHARGE, ACCOUNT_DISCOUNT, SHIPPING_PRICE } from "@/lib/constants/booking";

export async function calculateServerSideTotal(bookingsData: any[], contactInfo: any): Promise<number> {
  if (!bookingsData || !bookingsData.length) {
    return 0;
  }

  // Fetch db dumpsters to get authoritative prices
  // Note: Since pricing is partially hardcoded on frontend, we emulate the same exact logic
  // but strictly from the server.
  const dbDumpsters = await getDumpsters();
  
  let cartTotal = 0;

  for (const bData of bookingsData) {
    // Determine base price
    let basePrice = 435;
    
    // Find dumpster type
    const dData = dbDumpsters.find((d: any) => {
      const typeObj = Array.isArray(d.dumpster_types) ? d.dumpster_types[0] : d.dumpster_types;
      return typeObj?.id === bData.dumpsterType;
    });
    let sizeVal = parseInt(bData.dumpsterSize || 20);

    if (dData) {
      const typeObj = Array.isArray(dData.dumpster_types) ? dData.dumpster_types[0] : dData.dumpster_types;
      const name = typeObj?.name || "";
      if (name.includes("Roll Off") || name.includes("Roll-off")) {
        if (sizeVal === 10) basePrice = 435;
        if (sizeVal === 20) basePrice = 455;
        if (sizeVal === 30) basePrice = 475;
        if (sizeVal === 40) basePrice = 555;
      } else if (name.includes("Rubber")) {
         if (sizeVal === 10) basePrice = 445;
         if (sizeVal === 20) basePrice = 525;
         if (sizeVal === 30) basePrice = 655;
      } else {
         if (sizeVal === 2) basePrice = 250;
         if (sizeVal === 4) basePrice = 350;
         if (sizeVal === 6) basePrice = 450;
         if (sizeVal === 8) basePrice = 550;
      }
    }

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

    cartTotal += basePrice + surcharges + extraDaysCost + SHIPPING_PRICE;
  }

  let finalPrice = cartTotal;

  // Contact info discount (if they ticked 'create account', we emulate this if they passed it)
  if (contactInfo && contactInfo.accountDiscount) {
    finalPrice -= contactInfo.accountDiscount; // Validate this is max 20
  }

  return Math.max(finalPrice, 0);
}
