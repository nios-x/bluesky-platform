"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useBooking } from "@/contexts/booking-context";
import { ACCOUNT_DISCOUNT } from "@/lib/constants/booking";
import { ChevronLeft, CheckCircle2, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { DUMPSTER_TYPES, DUMPSTER_SIZES, PRICING, HEAVY_MATERIALS, HEAVY_MATERIAL_SURCHARGE } from "@/lib/constants/booking";
import { ChevronRight, AlertCircle, Zap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import GPayButton from "@/components/payments/gpay";
import ProductInfoSection from "@/components/whats-included";
import PayPalButton from "./paypal";
import ItemsAdder from "@/components/order/ItemsAdder";

export default function BookingStep1() {
  const router = useRouter();
  const { bookings, updateBooking, addBooking } = useBooking();
  const booking = bookings[0] || {};
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    placementInstructions: "",
    agreeToTerms: false,
  });
  const product = {
    idealFor: [
      "Home renovation",
      "Construction sites",
      "Office cleanouts",
    ],
    capacity: "5 Tons",
    included: [
      "Delivery",
      "Pickup",
      "7-day rental",
    ],
  };
  const [accountCreation, setAccountCreation] = useState(false);
  const [selectedDumpsterType, setSelectedDumpsterType] = useState(booking.dumpsterType || DUMPSTER_TYPES.ROLL_OFF);
  const [selectedSize, setSelectedSize] = useState(booking.dumpsterSize || 20);

  const sizes = DUMPSTER_SIZES[selectedDumpsterType as keyof typeof DUMPSTER_SIZES];
  const basePrice = PRICING[selectedDumpsterType as keyof typeof PRICING]?.[selectedSize as keyof typeof PRICING[string]] || 435;

  // Check if heavy material restrictions apply
  const isHeavyMaterial = booking.materialType && HEAVY_MATERIALS.includes(booking.materialType);
  const isHeavyMaterialWithRubberWheel = isHeavyMaterial && selectedDumpsterType === DUMPSTER_TYPES.RUBBER_WHEEL;

  const calculateFinalPrice = () => {
    let finalPrice = booking.totalPrice || 0;

    // Add rental period cost (7 days is base, 14 days might have different pricing)
    if (booking.rentalPeriod && booking.rentalPeriod > 14) {
      const extraDays = booking.rentalPeriod - 14;
      finalPrice += extraDays * 25; // $25 per extra day
    }

    // Apply account discount if creating account
    if (accountCreation) {
      finalPrice -= ACCOUNT_DISCOUNT;
    }

    return Math.max(finalPrice, 0);
  };

  const finalPrice = calculateFinalPrice();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (!formData.phone.replace(/\D/g, "").match(/^\d{10}$/)) {
      setError("Valid 10-digit phone number is required");
      return false;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to Terms & Conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Update booking with contact info
      updateBooking(0, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        placementInstructions: formData.placementInstructions,
        accountDiscount: accountCreation ? ACCOUNT_DISCOUNT : 0,
        paymentMethod: paymentMethod,
      });

      // Navigate to payment step
      router.push("/booking/step-2");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePayError = (error: any) => {
    console.error("Google Pay error:", error);
    setError("Google Pay payment failed. Please try again or use a different payment method.");
  };

  useEffect(() => {
    // Google Pay is now handled by the GPayButton component
  }, []);

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
    updateBooking(0, {
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
        updateBooking(0, {
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
        updateBooking(0, {
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

  const handlePayPalPayment = async (details: any) => {
    setLoading(true);
    setError("");

    try {
      updateBooking(0, {
        paymentMethod: 'paypal',
        paymentIntentId: details.id,
        paymentStatus: 'completed',
      });

      // Since PayPal handled the transaction directly, skip intermediate steps
      router.push('/booking/confirmation');
    } catch (err: any) {
      setError('Payment processing failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit2 = async () => {

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
          paymentMethod: paymentMethod,
          cardData: paymentMethod === 'credit-card' ? cardData : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateBooking(0, {
          paymentMethod: paymentMethod,
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

  const selectedSizeObj = sizes.find(s => s.size === selectedSize);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="py-8 mt-6 ">
        <div className="flex justify-center">
          <div className="w-[25%] px-12">
            <div className="sticky top-24 mt-5 bg-gradient-to-b from-[#142A52] to-[#142A52]/80 text-white rounded-lg p-4 shadow-lg">
              <h3 className="text-xl font-bold  pb-2 border-b border-white/20">Order Summary</h3>

              <div className="space-y-2 mb-6 pt-2">
                <div>
                  <p className="text-white/70 text-[12px]">Dumpster Type</p>
                  <p className="font-bold">{booking.dumpsterSize} yd {booking.dumpsterType}</p>
                </div>
                <div>
                  <p className="text-white/70 text-[12px]">Rental Period</p>
                  <p className="font-bold">{booking.rentalPeriod} days</p>
                </div>
                <div>
                  <p className="text-white/70 text-[12px]">Location</p>
                  <p className="font-bold">{booking.zipCode}</p>
                </div>
                <div>
                  <p className="text-white/70 text-[12px]">Delivery</p>
                  <p className="font-bold">
                    {booking.deliveryDate &&
                      new Date(booking.deliveryDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/20 pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Base Price</span>
                  <span>${booking.basePrice}</span>
                </div>
                {booking.surcharges > 0 && (
                  <div className="flex justify-between text-yellow-300">
                    <span>Surcharges</span>
                    <span>${booking.surcharges}</span>
                  </div>
                )}
                {booking.rentalPeriod && booking.rentalPeriod > 14 && (
                  <div className="flex justify-between text-yellow-300">
                    <span>Extra Days ({booking.rentalPeriod - 14})</span>
                    <span>${(booking.rentalPeriod - 14) * 25}</span>
                  </div>
                )}
                {accountCreation && (
                  <div className="flex justify-between text-green-300">
                    <span>Account Discount</span>
                    <span>-${ACCOUNT_DISCOUNT}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#C89B2B] border-t border-white/20 pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div></div>
          <div className="w-[40%] mx-auto">
            {/* Progress */}

            <motion.div className="bg-white  border-slate-200 rounded-sm  mb-12">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-[15px] uppercase tracking-[0.2em] text-[#C89B2B] mb-2">
                      Permanent Dumpster Rental
                    </p>
                    <h1 className="text-[24px] font-bold text-[#142A52] mb-2">
                        
                    </h1>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      Compact permanent front-load dumpster designed for regular pickup and reliable waste collection.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-700">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                      Front-load design
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                      Weekly pickup ready
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex w-full relative ">

                  {/* Left Big Image */}
                  <div className="rounded-l-sm relative outline outline-slate-200 bg-white w-[70%] p-6">
                    <div className="relative w-full h-[250px]">
                      <Image
                        src="/images/roll-off-dumpster.png"
                        alt="Dumpster"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="w-[95%] absolute bottom-3 right-3 text-right">
                      <p className="text-[12px] text-[#142A52]/60">Dimensions</p>
                      <p className="text-[13px] ">
                        {selectedSizeObj?.dimensions || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Images */}
                  <div className="w-[30%] flex flex-col">
                    <div className="absolute -top-5 text-[11px] translate-x-[70%]">
                      Other sizes available
                    </div>
                    {[selectedSizeObj, selectedSizeObj, selectedSizeObj].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between outline outline-slate-200 bg-white flex-1 p-4 ${i === 0 ? "rounded-tr-sm" : i === 2 ? "rounded-br-sm" : ""
                          }`}
                      >
                        {/* Image */}
                        <div className="relative w-[60%] h-[70px]">
                          <Image
                            src="/images/roll-off-dumpster.png"
                            alt="Dumpster"
                            fill
                            className="object-contain"
                          />
                        </div>

                        {/* Dimensions */}
                        <div className="w-[40%] text-right">
                          <p className="text-[9px] text-[#142A52]/60">Dimensions</p>
                          <p className="text-[10px] ">
                            {item?.dimensions || "—"}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>

                </div>
              </div>
            </motion.div>
            <ProductInfoSection product={product} />
            <div className=" mt-10 gap-8">
              {/* Main Form */}

              <div className="">
                {/* Contact Information */}
                <div className="mb-8 p-3">
                  <h2 className="text-2xl font-bold text-[#142A52] mb-6"> Billing Information</h2>

                  <div className="mb-6">
                    <label className="block text-[12px] font-bold text-[#142A52] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-[12px] font-bold text-[#142A52] mb-2 flex items-center gap-2">
                        <Mail size={16} /> Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#142A52] mb-2 flex items-center gap-2">
                        <Phone size={16} /> Phone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                        placeholder="(586) 412-3762"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-[12px] font-bold text-[#142A52] mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-[12px] font-bold text-[#142A52] mb-2">Placement Instructions (Optional)</label>
                    <textarea
                      value={formData.placementInstructions}
                      onChange={(e) => handleInputChange("placementInstructions", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                      placeholder="e.g., Driveway, back yard, side entrance..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Account Creation Option */}
                <div className="bg-[#C89B2B]/10 border-2 border-[#C89B2B] rounded-lg p-6 mb-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accountCreation}
                      onChange={(e) => handleInputChange("accountCreation", e.target.checked)}
                      className="w-5 h-5 accent-[#C89B2B]"
                    />
                    <span className="font-bold text-[#142A52]">
                      Create an account & save ${ACCOUNT_DISCOUNT} on this order
                    </span>
                  </label>
                  <p className="text-[12px] text-[#142A52]/70 mt-2 ml-8">
                    Save cards, track orders, and get exclusive deals
                  </p>
                </div>


              </div>


            </div>
            <motion.div
              className="lg:col-span-3 space-y-10 mt-14"
            >

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
                    <p className="text-[12px] text-yellow-700 mt-1">
                      A ${HEAVY_MATERIAL_SURCHARGE} surcharge applies for concrete, brick, dirt, or rock. Only 10 yd roll-off dumpsters are available for these materials.
                    </p>
                  </div>
                </motion.div>
              )}



              {/* Pricing Summary Card */}
              <motion.div
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

                <motion.button
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`w-full p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'apple-pay'
                    ? "border-black bg-black/10"
                    : "border-[#142A52]/20 hover:border-black"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                    <span className="font-bold text-[#142A52]">Pay with Apple Pay</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'paypal'
                    ? "border-[#003087] bg-[#003087]/10"
                    : "border-[#142A52]/20 hover:border-[#003087]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 384 512" fill="#003087">
                       <path d="M111.4 295.9l-35.4 0c-5.8 0-10.5-4.7-10.5-10.5L34.1 48.5c0-5.8 4.7-10.5 10.5-10.5l147.8 0c48.1 0 78.4 23.3 78.4 62.4 0 43.1-33 73.1-78.4 73.1l-40.8 0c-5.8 0-10.5 4.7-10.5 10.5l-29.7 111.9zm13.1-131.6l32.1 0c26.2 0 43.3-13.8 43.3-36.9 0-21-14.8-31.9-43.3-31.9l-45.7 0c-2.4 0-4.5 1.7-4.9 4l-15.6 60.8c-.4 2.3 1.3 4.4 3.7 4.4z"/>
                    </svg>
                    <span className="font-bold text-[#142A52]">Pay with PayPal</span>
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
                      <label className="block text-[12px] font-bold text-[#142A52] mb-2">
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
                      <label className="block text-[12px] font-bold text-[#142A52] mb-2">
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
                        <label className="block text-[12px] font-bold text-[#142A52] mb-2">
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
                        <label className="block text-[12px] font-bold text-[#142A52] mb-2">
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

              {paymentMethod === "apple-pay" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/5 border-2 border-black/20 rounded-lg p-6 mb-4 text-center"
                >
                  <p className="font-bold text-[#142A52]">You will complete your payment using Apple Pay.</p>
                </motion.div>
              )}

              {paymentMethod === "paypal" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <PayPalButton
                    amount={totalPrice}
                    onSuccess={(details) => handlePayPalPayment(details)}
                    onError={(error) => setError('PayPal error: ' + error.message)}
                  />
                </motion.div>
              )}

                {error && <div className="text-red-500 mt-4 text-center font-bold">{error}</div>}

              {(paymentMethod === "credit-card" || paymentMethod === "apple-pay") && (
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
          <div className="w-[35%] px-25">

            <div className="scale-[0.9] mt-5 bg-gradient-to-b from-[#142A52] to-[#142A52]/80 text-white rounded-2xl p-2 ">
              <ItemsAdder
                dumpsterTypes={[
                  { id: "roll-off", name: "Roll-off" },
                  { id: "rubber-wheel", name: "Rubber Wheel" },
                  { id: "front-load", name: "Front Load" },
                ]}
                sizes={[10, 20, 30, 40]}
                onAddMore={(newItem) => {
                  const itemBasePrice = PRICING[newItem.type as keyof typeof PRICING]?.[newItem.size as keyof typeof PRICING[string]] || 435;
                  let extraDaysCost = 0;
                  if (newItem.rentalPeriod > 14) {
                    extraDaysCost = (newItem.rentalPeriod - 14) * 25;
                  }
                  addBooking({
                    ...booking,
                    dumpsterType: newItem.type,
                    dumpsterSize: newItem.size,
                    deliveryDate: newItem.deliveryDate,
                    rentalPeriod: newItem.rentalPeriod,
                    basePrice: itemBasePrice,
                    surcharges: extraDaysCost,
                    totalPrice: itemBasePrice + extraDaysCost
                  });
                }}
              />

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
