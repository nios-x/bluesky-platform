"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useBooking } from "@/contexts/booking-context";
import { ACCOUNT_DISCOUNT } from "@/lib/constants/booking";
import { ChevronLeft, CheckCircle2, Lock, Mail, Phone } from "lucide-react";

export default function BookingStep2() {
  const router = useRouter();
  const { booking, updateBooking } = useBooking();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    placementInstructions: "",
    agreeToTerms: false,
  });
  const [accountCreation, setAccountCreation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleCardInputChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
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
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Update booking with contact info
      updateBooking({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        placementInstructions: formData.placementInstructions,
        accountDiscount: accountCreation ? ACCOUNT_DISCOUNT : 0,
        totalPrice: finalPrice,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show confirmation
      alert("✅ Booking confirmed! A confirmation email has been sent to " + formData.email);
      router.push("/booking/confirmation");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {[1, 2].map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step <= 2 ? "bg-[#142A52] text-white" : "bg-[#142A52]/20 text-[#142A52]"
                  }`}>
                    {step < 2 ? <CheckCircle2 size={20} /> : step}
                  </div>
                  {idx < 1 && <div className="flex-1 h-1 bg-[#142A52] mx-2"></div>}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-[#142A52]/60">Step 1: Select Dumpster</span>
              <span className="font-bold text-[#142A52]">Step 2: Contact & Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#142A52] mb-6">Your Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#142A52] mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#142A52] mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#142A52] mb-2 flex items-center gap-2">
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
                    <label className="block text-sm font-bold text-[#142A52] mb-2 flex items-center gap-2">
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
                  <label className="block text-sm font-bold text-[#142A52] mb-2">Company (Optional)</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                    placeholder="Your company name"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#142A52] mb-2">Placement Instructions (Optional)</label>
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
                <p className="text-sm text-[#142A52]/70 mt-2 ml-8">
                  Save cards, track orders, and get exclusive deals
                </p>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#142A52] mb-6">Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {[
                    { id: "credit-card", label: "💳 Credit/Debit Card", icon: "🏦" },
                    { id: "paypal", label: "PayPal", icon: "🅿️" },
                    { id: "google-pay", label: "Google Pay", icon: "🔵" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === method.id
                          ? "border-[#C89B2B] bg-[#C89B2B]/10"
                          : "border-[#142A52]/20 hover:border-[#C89B2B]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 accent-[#C89B2B]"
                      />
                      <span className="font-bold text-[#142A52]">{method.label}</span>
                    </label>
                  ))}
                </div>

                {/* Credit Card Fields */}
                {paymentMethod === "credit-card" && (
                  <div className="bg-[#142A52]/5 border-2 border-[#142A52]/20 rounded-lg p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-[#142A52] mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        value={cardData.cardName}
                        onChange={(e) => handleCardInputChange("cardName", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-bold text-[#142A52] mb-2">Card Number *</label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) =>
                          handleCardInputChange("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))
                        }
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#142A52] mb-2">Expiry (MM/YY) *</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                            handleCardInputChange("expiry", val);
                          }}
                          placeholder="12/25"
                          className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#142A52] mb-2">CVC *</label>
                        <input
                          type="text"
                          value={cardData.cvc}
                          onChange={(e) => handleCardInputChange("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#142A52]/60 mt-4">
                      <Lock size={14} /> Your payment is secure and encrypted
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Acceptance */}
              <div className="mb-8">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                    className="w-5 h-5 accent-[#C89B2B] mt-1"
                  />
                  <span className="text-sm text-[#142A52]">
                    I agree to the <button className="text-[#C89B2B] hover:underline font-bold">Terms & Conditions</button> and <button className="text-[#C89B2B] hover:underline font-bold">Privacy Policy</button>
                  </span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 font-bold">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 border-2 border-[#142A52] text-[#142A52] font-bold rounded-lg hover:bg-[#142A52]/5 transition flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-3 bg-gradient-to-r from-[#142A52] to-[#C89B2B] text-white font-bold rounded-lg transition flex items-center justify-center gap-2 ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:from-[#1a3a6e] hover:to-[#d4a835]"
                  }`}
                >
                  {loading ? "Processing..." : "Complete Booking"}
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-b from-[#142A52] to-[#142A52]/80 text-white rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b border-white/20">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-white/70 text-sm">Dumpster Type</p>
                    <p className="font-bold">{booking.dumpsterSize} yd {booking.dumpsterType}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Rental Period</p>
                    <p className="font-bold">{booking.rentalPeriod} days</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Location</p>
                    <p className="font-bold">{booking.zipCode}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Delivery</p>
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

                <div className="border-t border-white/20 pt-6 space-y-2">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
