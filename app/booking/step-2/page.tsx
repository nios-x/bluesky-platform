
"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useBooking } from "@/contexts/booking-context";
import { DUMPSTER_TYPES, DUMPSTER_SIZES, PRICING, HEAVY_MATERIALS, HEAVY_MATERIAL_SURCHARGE } from "@/lib/constants/booking";
import { ChevronRight, CheckCircle2, AlertCircle, Zap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import GPayButton from "@/components/payments/gpay";
export default function BookingStep2() {
  const router = useRouter();
  const { booking, updateBooking } = useBooking();
  const [selectedDumpsterType, setSelectedDumpsterType] = useState(booking.dumpsterType || DUMPSTER_TYPES.ROLL_OFF);
  const [selectedSize, setSelectedSize] = useState(booking.dumpsterSize || 20);

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

    // Update booking with selection and scroll to payment
    updateBooking({
      dumpsterType: selectedDumpsterType,
      dumpsterSize: selectedSize,
      basePrice,
      surcharges,
      totalPrice,
    });

    // Scroll to payment section
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [zipCity, setZipCity] = useState(booking.zipCode || "");
  const [deliveryDate, setDeliveryDate] = useState(booking.deliveryDate || "");
  const [weeklyPickup, setWeeklyPickup] = useState(1);
  const [usageType, setUsageType] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const handleCardInputChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearZip = () => {
    setZipCity("");
    setCouponMessage("");
    setCouponApplied(false);
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toLowerCase();
    if (code === "20off" || code === "$20off") {
      setCouponApplied(true);
      setCouponMessage("Coupon code applied successfully.");
    } else {
      setCouponApplied(false);
      setCouponMessage(`Coupon "${couponCode}" does not exist!`);
    }
  };

  const shippingFee = 125;
  const discountAmount = couponApplied ? 20 : 0;
  const totalPayable = basePrice + shippingFee - discountAmount;
  const nextMonthAmount = 136;

  const validatePayment = () => {
    if (paymentMethod === "credit-card") {
      if (!cardData.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
        setError("Valid 16-digit card number is required");
        return false;
      }
      if (!cardData.expiry.match(/^\d{2}\/\d{2}$/)) {
        setError("Expiry date must be in MM/YY format");
        return false;
      }
      if (!cardData.cvc.match(/^\d{3,4}$/)) {
        setError("Valid CVC is required");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleGooglePayPayment = async (paymentData: any) => {
    setLoading(true);
    setError("");

    try {
      // If the component simulated a success response in development mode,
      // it will already include a paymentIntentId and status.
      if (paymentData?.status === 'succeeded' && paymentData?.paymentIntentId) {
        updateBooking({
          paymentMethod: 'google-pay',
          paymentIntentId: paymentData.paymentIntentId,
          paymentStatus: 'completed',
        });
        router.push('/booking/confirmation');
        return;
      }

      const response = await fetch('/api/payments/google-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'USD',
          paymentData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateBooking({
          paymentMethod: 'google-pay',
          paymentIntentId: data.paymentIntentId,
          paymentStatus: 'completed',
        });

        router.push('/booking/confirmation');
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err: any) {
      setError('Payment processing failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {

    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'USD',
          paymentMethod: 'credit-card',
          cardData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateBooking({
          paymentMethod: 'credit-card',
          paymentIntentId: data.paymentIntentId,
          paymentStatus: 'completed',
        });

        router.push('/booking/confirmation');
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err: any) {
      setError('Payment processing failed: ' + err.message);
    } finally {
      setLoading(false);
    }
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
              What&apos;s Your <span className="text-[#C89B2B]">Project?</span>
            </h1>
            <p className="text-xl text-[#142A52]/70 max-w-2xl mx-auto">
              Choose your dumpster type and size based on your project needs. We&apos;ll calculate the perfect pricing for you.
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
                <div className="">
                  {/* Step Counter */}
                  <div className="text-center py-4 border-b border-white/20">
                    <div className="text-sm uppercase font-bold text-[#C89B2B] tracking-wider mb-1">Progress</div>
                    <div className="text-4xl font-bold">Step 2 of 2</div>
                  </div>
                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs text-white/70 uppercase tracking-wider mb-1">ZIP Code</p>
                      <p className="font-bold text-lg">{booking.zipCode || "—"}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Dumpster Type</p>
                      <p className="font-bold text-lg">{selectedDumpsterType.split("-").join(" ").toUpperCase() || "—"}</p>
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
                <div
                  className={`relative group p-6 rounded-2xl  transition-all duration-300 cursor-pointer bg-white`}
                >
                  {/* Image Container */}
                  <div className="w-full flex justify-center mb-5">
                    <div className="w-56 h-40 relative">
                      <Image
                        src="/images/roll-off-dumpster.png"
                        alt="Roll-Off Dumpster"
                        fill
                        className="object-contain transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-[#142A52] text-xl text-center mb-2">
                    Roll-Off Dumpster
                  </h3>

                  <p className="text-sm text-[#142A52]/70 text-center mb-4 leading-relaxed">
                    Perfect for construction, renovations, and large cleanouts
                  </p>

                  {/* Features */}
                  <div className="space-y-1 text-sm text-[#142A52]/80 text-center">
                    <p>✓ 10 - 40 yard options</p>
                    <p>✓ Heavy materials allowed</p>
                  </div>

                  {/* Selected Badge */}
                  {selectedDumpsterType === DUMPSTER_TYPES.ROLL_OFF && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      Selected
                    </div>
                  )}
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

           
                <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl shadow-lg p-8 mb-12"
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#C89B2B] mb-3">Permanent Dumpster Rental</p>
                  <h1 className="text-4xl font-bold text-[#142A52] mb-4">2 Yard Front Load Dumpster</h1>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Compact permanent front-load dumpster designed for regular pickup and reliable waste collection.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-slate-700">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Front-load design</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Weekly pickup ready</span>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="space-y-5">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.16em] mb-3">Unit Size</p>
                      <p className="text-xl font-semibold text-[#142A52]">
                        3&apos; (W) × 6&apos; (L) × 3&apos; (H)
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.16em] mb-3">Estimate your rental</p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Location</label>
                          <input
                            type="text"
                            value={zipCity}
                            onChange={(e) => setZipCity(e.target.value)}
                            placeholder="Enter zip code or city"
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-[#C89B2B] focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-slate-700">Delivery date</label>
                            <input
                              type="date"
                              value={deliveryDate}
                              onChange={(e) => setDeliveryDate(e.target.value)}
                              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-[#C89B2B] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700">Weekly pickup</label>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={weeklyPickup}
                              onChange={(e) => setWeeklyPickup(Number(e.target.value || 1))}
                              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-[#C89B2B] focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Usage type</label>
                          <select
                            value={usageType}
                            onChange={(e) => setUsageType(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-[#C89B2B] focus:outline-none"
                          >
                            <option value="">Choose an option</option>
                            <option value="office-trash">Office trash</option>
                            <option value="apartment-trash">Apt/condo-complex trash</option>
                            <option value="food-waste">Food waste</option>
                            <option value="cardboard">Cardboard</option>
                            <option value="recycling">Recycling</option>
                            <option value="industrial">Industrial</option>
                            <option value="other-waste">Other waste</option>
                          </select>
                        </div>
                      </div>
                      {zipCity && (
                        <p className="mt-4 text-sm font-semibold text-emerald-700">Available for above location</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-[#f4f9fd] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#003b5c]">Price details</p>
                      <h2 className="text-2xl font-semibold text-[#142A52]">Total price breakdown</h2>
                    </div>
                    <span className="rounded-full bg-[#d3ecff] px-3 py-1 text-sm font-semibold text-[#005f94]">Includes delivery fee</span>
                  </div>
                  <div className="space-y-4 text-sm text-slate-700">
                    <div className="flex items-center justify-between">
                      <span>Base price</span>
                      <span className="font-semibold">${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>One-time delivery fee</span>
                      <span className="font-semibold">${shippingFee.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex items-center justify-between text-emerald-700 font-semibold">
                        <span>Coupon discount</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-300 pt-4 flex items-center justify-between text-base font-semibold text-[#003b5c]">
                      <span>Total payable amount</span>
                      <span>${totalPayable.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#0088cc] bg-white p-5">
                    <p className="text-sm text-slate-700 mb-3">Have a coupon code? Enter it below.</p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:border-[#C89B2B] focus:outline-none"
                        placeholder="Coupon code"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="rounded-xl bg-[#0088cc] px-5 py-3 text-sm font-semibold text-white hover:bg-[#006ea1]"
                      >
                        Apply coupon
                      </button>
                    </div>
                    {couponMessage && (
                      <p className={`mt-3 text-sm ${couponApplied ? 'text-emerald-700' : 'text-red-600'}`}>{couponMessage}</p>
                    )}
                  </div>

                  <div className="mt-6 text-sm text-slate-500 space-y-2">
                    <p>** Base price is calculated on the basis of remaining days of the selected month only and pickup frequency.</p>
                    <p><span className="font-semibold text-slate-800">${nextMonthAmount}</span> to be paid from next month recurring basis.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSizeChange(sizeObj.size)}
                      className={`relative p-6 rounded-xl border-2 transition-all text-center group ${selectedSize === sizeObj.size
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

              <div id="payment-section" className="mb-8">
                <h2 className="text-2xl font-bold text-[#142A52] mb-6">Payment Method</h2>

                <div className="space-y-4 mb-6">
                  <motion.button
                    onClick={() => setPaymentMethod('google-pay')}
                    className={`w-full p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'google-pay'
                      ? "border-black bg-black/10"
                      : "border-[#142A52]/20 hover:border-black"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.5 2.5c-1.5 0-3 .5-4.2 1.3L9.8 6c.8-.5 1.8-.8 2.7-.8 2.5 0 4.5 2 4.5 4.5 0 1.8-1 3.3-2.5 4.1l1.5 2.6c2.5-1.3 4.2-4 4.2-7 0-4-3.2-7.2-7.2-7.2z" />
                        <path d="M12.5 7.5c-1.2 0-2.2.4-3 1.1L11.8 11c.4-.3.9-.5 1.7-.5 1.4 0 2.5 1.1 2.5 2.5 0 .9-.4 1.7-1 2.2l1.5 2.6c1.5-.9 2.5-2.5 2.5-4.3 0-2.8-2.2-5-5-5z" />
                        <path d="M7.5 12.5c0 1.4.6 2.6 1.5 3.5l2.5-4.3c-.4-.4-.6-1-.6-1.7 0-1.4 1.1-2.5 2.5-2.5.7 0 1.3.2 1.8.6l2.5-4.3c-1.3-.8-2.8-1.3-4.3-1.3-3.5 0-6.5 2.8-6.5 6.5 0 2.2.9 4.1 2.4 5.5l-2.4 4.1c-2.1-1.8-3.4-4.5-3.4-7.5 0-5 4-9 9-9 2.5 0 4.8.9 6.5 2.5L15 7.5c-1-.6-2.2-.8-3.5-.8-2.8 0-5 2.2-5 5z" />
                      </svg>
                      <span className="font-bold text-[#142A52]">Pay with Google Pay</span>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => setPaymentMethod('credit-card')}
                    className={`w-full p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'credit-card'
                      ? "border-[#C89B2B] bg-[#C89B2B]/10"
                      : "border-[#142A52]/20 hover:border-[#C89B2B]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💳</span>
                      <span className="font-bold text-[#142A52]">Credit/Debit Card</span>
                    </div>
                  </motion.button>
                </div>

                {paymentMethod === "google-pay" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <GPayButton
                      amount={totalPrice}
                      onPaymentSuccess={(paymentData) => {
                        handleGooglePayPayment(paymentData);
                      }}
                      onPaymentError={(error) => {
                        setError('Google Pay error: ' + error.message);
                      }}
                    />
                  </motion.div>
                )}

                {paymentMethod === "credit-card" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#142A52]/5 border-2 border-[#142A52]/20 rounded-lg p-6"
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-[#142A52] mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={cardData.cardName}
                        onChange={(e) => handleCardInputChange("cardName", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-bold text-[#142A52] mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) =>
                          handleCardInputChange(
                            "cardNumber",
                            e.target.value.replace(/\D/g, "").slice(0, 16)
                          )
                        }
                        className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#142A52] mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                            handleCardInputChange("expiry", val);
                          }}
                          className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#142A52] mb-2">
                          CVC *
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardData.cvc}
                          onChange={(e) =>
                            handleCardInputChange("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))
                          }
                          className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#142A52]/60 mt-4">
                      <Lock size={14} /> Secure payment processing
                    </div>
                  </motion.div>
                )}

                {error && <div className="text-red-500 mt-4 text-center font-bold">{error}</div>}

                {paymentMethod === "credit-card" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-[#142A52] to-[#C89B2B] hover:from-[#0f1f3a] hover:to-[#d4a835] text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Booking
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
              {/* Action Buttons */}

            </motion.div>
          </div>
        </div>

      </div>



      <Footer />

    </main>
  );
}