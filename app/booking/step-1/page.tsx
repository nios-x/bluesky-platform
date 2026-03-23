"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useBooking } from "@/contexts/booking-context";
import { DUMPSTER_TYPES, DUMPSTER_SIZES, PRICING, HEAVY_MATERIALS, HEAVY_MATERIAL_SURCHARGE } from "@/lib/constants/booking";
import { ChevronRight, CheckCircle2, AlertCircle, Zap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function BookingStep1() {
  const router = useRouter();
  const { booking, updateBooking } = useBooking();
  const [selectedDumpsterType, setSelectedDumpsterType] = useState(booking.dumpsterType || DUMPSTER_TYPES.ROLL_OFF);
  const [selectedSize, setSelectedSize] = useState(booking.dumpsterSize || 20);
  const [error, setError] = useState("");

  const sizes = DUMPSTER_SIZES[selectedDumpsterType as keyof typeof DUMPSTER_SIZES];
  const basePrice = PRICING[selectedDumpsterType as keyof typeof PRICING]?.[selectedSize as keyof typeof PRICING[string]] || 435;

  // Check if heavy material restrictions apply
  const isHeavyMaterial = booking.materialType && HEAVY_MATERIALS.includes(booking.materialType);
  const isHeavyMaterialWithRubberWheel = isHeavyMaterial && selectedDumpsterType === DUMPSTER_TYPES.RUBBER_WHEEL;

  // Heavy materials only allow 10 yd roll-off
  const allowedSizes = isHeavyMaterial && selectedDumpsterType === DUMPSTER_TYPES.ROLL_OFF 
    ? sizes.filter((s) => s.size === 10)
    : sizes;

  const handleDumpsterTypeChange = (type: string) => {
    setSelectedDumpsterType(type);
    
    // If heavy material and rubber wheel selected, show warning
    if (isHeavyMaterial && type === DUMPSTER_TYPES.RUBBER_WHEEL) {
      setError("⚠️ Rubber wheel dumpsters cannot be used for concrete, brick, dirt, or rock. Please select Roll-Off.");
      return;
    }
    setError("");

    // Reset size to first available
    if (allowedSizes.length > 0) {
      setSelectedSize(allowedSizes[0].size);
    }
  };

  const handleSizeChange = (size: number) => {
    setSelectedSize(size);
    setError("");
  };

  const calculateSurcharges = () => {
    let surcharge = 0;
    if (isHeavyMaterial && selectedDumpsterType === DUMPSTER_TYPES.ROLL_OFF) {
      surcharge += HEAVY_MATERIAL_SURCHARGE;
    }
    return surcharge;
  };

  const surcharges = calculateSurcharges();
  const totalPrice = basePrice + surcharges;

  const handleContinue = () => {
    if (isHeavyMaterialWithRubberWheel) {
      setError("Cannot use rubber wheel dumpster for this material type.");
      return;
    }

    updateBooking({
      dumpsterType: selectedDumpsterType,
      dumpsterSize: selectedSize,
      basePrice,
      surcharges,
      totalPrice,
    });

    router.push("/booking/step-2");
  };

  return (
    <main className="bg-gradient-to-b from-white via-[#142A52]/5 to-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#142A52] mb-4">
              What's Your <span className="text-[#C89B2B]">Project?</span>
            </h1>
            <p className="text-xl text-[#142A52]/70 max-w-2xl mx-auto">
              Choose your dumpster type and size based on your project needs. We'll calculate the perfect pricing for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Left Sidebar - Summary */}
            <motion.div
              className="lg:sticky lg:top-8 lg:col-span-1 h-fit"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-[#142A52] to-[#0a1838] rounded-2xl shadow-xl p-6 text-white space-y-6 border border-[#C89B2B]/20">
                {/* Step Counter */}
                <div className="text-center py-4 border-b border-white/20">
                  <div className="text-sm uppercase font-bold text-[#C89B2B] tracking-wider mb-1">Progress</div>
                  <div className="text-4xl font-bold">Step 1 of 2</div>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-xs text-white/70 uppercase tracking-wider mb-1">ZIP Code</p>
                    <p className="font-bold text-lg">{booking.zipCode || "—"}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Project</p>
                    <p className="font-bold text-lg">{booking.projectType || "—"}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Material</p>
                    <p className="font-bold text-lg">{booking.materialType || "—"}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Delivery</p>
                    <p className="font-bold text-lg">
                      {booking.deliveryDate 
                        ? new Date(booking.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Form */}
            <motion.div
              className="lg:col-span-3 space-y-10"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Dumpster Type Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#142A52] mb-2">Choose Your Dumpster Type</h2>
                  <p className="text-[#142A52]/70">Select the type that works best for your project</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Roll-Off */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDumpsterTypeChange(DUMPSTER_TYPES.ROLL_OFF)}
                    className={`relative group p-8 rounded-2xl border-3 transition-all ${
                      selectedDumpsterType === DUMPSTER_TYPES.ROLL_OFF
                        ? "border-[#C89B2B] bg-gradient-to-br from-[#C89B2B]/20 to-[#142A52]/10 shadow-xl"
                        : "border-[#142A52]/20 hover:border-[#C89B2B] bg-white hover:shadow-lg"
                    }`}
                  >
                    <div className="text-5xl mb-4">📦</div>
                    <h3 className="font-bold text-[#142A52] text-xl mb-2">Roll-Off Dumpster</h3>
                    <p className="text-sm text-[#142A52]/70 mb-4 leading-relaxed">Perfect for construction, renovations, and large cleanouts</p>
                    <div className="space-y-1 text-xs text-[#142A52]/60">
                      <p>✓ 10 - 40 yard options</p>
                      <p>✓ Heavy materials allowed</p>
                    </div>
                    {selectedDumpsterType === DUMPSTER_TYPES.ROLL_OFF && (
                      <motion.div className="absolute top-4 right-4 bg-[#C89B2B] rounded-full p-2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Rubber Wheel */}
                  <motion.button
                    whileHover={!isHeavyMaterial ? { scale: 1.02, y: -4 } : {}}
                    whileTap={!isHeavyMaterial ? { scale: 0.98 } : {}}
                    onClick={() => handleDumpsterTypeChange(DUMPSTER_TYPES.RUBBER_WHEEL)}
                    disabled={isHeavyMaterial}
                    className={`relative group p-8 rounded-2xl border-3 transition-all ${
                      selectedDumpsterType === DUMPSTER_TYPES.RUBBER_WHEEL && !isHeavyMaterial
                        ? "border-[#C89B2B] bg-gradient-to-br from-[#C89B2B]/20 to-[#142A52]/10 shadow-xl"
                        : isHeavyMaterial
                        ? "border-red-300 bg-red-50 opacity-60 cursor-not-allowed"
                        : "border-[#142A52]/20 hover:border-[#C89B2B] bg-white hover:shadow-lg"
                    }`}
                  >
                    <div className="text-5xl mb-4">🛞</div>
                    <h3 className="font-bold text-[#142A52] text-xl mb-2">Rubber Wheel Dumpster</h3>
                    <p className="text-sm text-[#142A52]/70 mb-4 leading-relaxed">Ideal for urban areas and tight spaces</p>
                    <div className="space-y-1 text-xs text-[#142A52]/60">
                      <p>✓ 10 - 30 yard options</p>
                      <p>✓ Small footprint</p>
                    </div>
                    {isHeavyMaterial && (
                      <motion.div className="absolute inset-0 flex items-center justify-center bg-red-50/80 rounded-2xl">
                        <div className="text-center">
                          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                          <p className="text-xs font-bold text-red-600">Not for heavy materials</p>
                        </div>
                      </motion.div>
                    )}
                    {selectedDumpsterType === DUMPSTER_TYPES.RUBBER_WHEEL && !isHeavyMaterial && (
                      <motion.div className="absolute top-4 right-4 bg-[#C89B2B] rounded-full p-2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Front Load */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDumpsterTypeChange(DUMPSTER_TYPES.FRONT_LOAD)}
                    className={`relative group p-8 rounded-2xl border-3 transition-all ${
                      selectedDumpsterType === DUMPSTER_TYPES.FRONT_LOAD
                        ? "border-[#C89B2B] bg-gradient-to-br from-[#C89B2B]/20 to-[#142A52]/10 shadow-xl"
                        : "border-[#142A52]/20 hover:border-[#C89B2B] bg-white hover:shadow-lg"
                    }`}
                  >
                    <div className="text-5xl mb-4">🏗️</div>
                    <h3 className="font-bold text-[#142A52] text-xl mb-2">Front Load Dumpster</h3>
                    <p className="text-sm text-[#142A52]/70 mb-4 leading-relaxed">Monthly service for businesses and apartments</p>
                    <div className="space-y-1 text-xs text-[#142A52]/60">
                      <p>✓ 2 - 8 yard options</p>
                      <p>✓ Recurring billing</p>
                    </div>
                    {selectedDumpsterType === DUMPSTER_TYPES.FRONT_LOAD && (
                      <motion.div className="absolute top-4 right-4 bg-[#C89B2B] rounded-full p-2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 font-bold"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Heavy Material Warning */}
              {isHeavyMaterial && selectedDumpsterType === DUMPSTER_TYPES.ROLL_OFF && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl"
                >
                  <Zap className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-yellow-800">Heavy Material Surcharge</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      A ${HEAVY_MATERIAL_SURCHARGE} surcharge applies for concrete, brick, dirt, or rock. Only 10 yd roll-off dumpsters are available for these materials.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Size Selection */}
              <div className="space-y-6 pt-8 border-t-2 border-[#142A52]/10">
                <div>
                  <h2 className="text-3xl font-bold text-[#142A52] mb-2">Select Size</h2>
                  <p className="text-[#142A52]/70">Choose the perfect size for your project</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allowedSizes.map((sizeObj, idx) => (
                    <motion.button
                      key={sizeObj.size}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSizeChange(sizeObj.size)}
                      className={`relative p-6 rounded-xl border-2 transition-all text-center group ${
                        selectedSize === sizeObj.size
                          ? "border-[#C89B2B] bg-gradient-to-br from-[#C89B2B]/20 to-[#142A52]/10 shadow-lg"
                          : "border-[#142A52]/20 hover:border-[#C89B2B] bg-white hover:shadow-lg"
                      }`}
                    >
                      <div className="text-4xl font-bold text-[#142A52] mb-1">{sizeObj.size}</div>
                      <p className="text-xs text-[#142A52]/60 mb-3">Yard</p>
                      <p className="text-xs text-[#142A52]/70 mb-3">{sizeObj.dimensions}</p>
                      <div className="pt-3 border-t border-[#142A52]/10">
                        <p className="font-bold text-[#C89B2B] text-lg">
                          ${PRICING[selectedDumpsterType as keyof typeof PRICING]?.[sizeObj.size as keyof typeof PRICING[string]] || 0}
                        </p>
                        <p className="text-xs text-[#142A52]/60 mt-1">Base price</p>
                      </div>
                      {selectedSize === sizeObj.size && (
                        <motion.div className="absolute -top-3 -right-3 bg-[#C89B2B] text-white rounded-full p-2 shadow-lg">
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {allowedSizes.length === 0 && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 font-bold">
                    <AlertCircle className="w-5 h-5" />
                    No sizes available for this combination
                  </div>
                )}
              </div>

              {/* Pricing Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#142A52] via-[#1a3a6f] to-[#0f1f3a] text-white rounded-2xl shadow-xl p-8 border border-[#C89B2B]/30"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Order Summary</h3>
                  <Zap className="w-6 h-6 text-[#C89B2B]" />
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">{selectedSize} yd {selectedDumpsterType}</span>
                    <span className="font-bold text-lg">${basePrice}</span>
                  </div>
                  {surcharges > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center text-yellow-300 font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Heavy Material Surcharge
                      </span>
                      <span>+${surcharges}</span>
                    </motion.div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between items-center"
                >
                  <span className="text-xl font-bold">Total (Base Price)</span>
                  <span className="text-3xl font-bold text-[#C89B2B]">${totalPrice}</span>
                </motion.div>
                <p className="text-xs text-white/60 mt-4">
                  💡 Rental period and special requests may adjust final price
                </p>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-4 border-2 border-[#142A52] text-[#142A52] font-bold rounded-xl hover:bg-[#142A52]/5 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-[#142A52] to-[#C89B2B] hover:from-[#0f1f3a] hover:to-[#d4a835] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Continue to Details
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
