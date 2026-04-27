"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useBooking } from "@/contexts/booking-context";
import { ACCOUNT_DISCOUNT } from "@/lib/constants/booking";
import { ChevronLeft, CheckCircle2, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { HEAVY_MATERIALS, HEAVY_MATERIAL_SURCHARGE } from "@/lib/constants/booking";
import { ChevronRight, AlertCircle, Zap, ArrowLeft, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import GPayButton from "@/components/payments/gpay";
import ProductInfoSection from "@/components/whats-included";
import PayPalButton from "./paypal";
import ItemsAdder from "@/components/order/ItemsAdder";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCATIONS } from "@/lib/constants/locations";

export default function BookingStep1() {
  const router = useRouter();
  const { bookings, updateBooking, addBooking, removeBooking } = useBooking();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const booking = bookings[selectedIndex] || {};
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
  const [selectedDumpsterType, setSelectedDumpsterType] = useState(booking.dumpsterType || "47d87a5e-84c8-431e-b055-c996142352eb");
  const [selectedSize, setSelectedSize] = useState(booking.dumpsterSize || 20);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [dbDumpsterTypes, setDbDumpsterTypes] = useState<any[]>([]);

  useEffect(() => {
    const fetchFromDB = async () => {
      try {
        const response = await fetch('/api/pricing/dumpsters');
        const data = await response.json();
        
        const typesMap: Record<string, any> = {};
        
        data.dumpsters.forEach((d: any) => {
          const typeId = d.dumpster_types?.id;
          if (!typeId) return;
          const sizeValMatch = d.dumpster_sizes?.label?.match(/^(\d+)/);
          const sizeVal = sizeValMatch ? parseInt(sizeValMatch[1], 10) : 0;
          if (sizeVal === 0) return;

          
          if (!typesMap[typeId]) {
            typesMap[typeId] = {
              id: typeId,
              name: d.dumpster_types.name,
              description: d.dumpster_types.description,
              image: d.dumpster_types.name.includes("Rubber") ? "/images/rubber-wheel-dumpster.png" : d.dumpster_types.name.includes("Permanent") ? "/images/permanent-dumpster.png" : "/images/roll-off-dumpster.png",
              sizes: []
            };
          }
          
          let price = 435;
          if (d.dumpster_types.name.includes("Roll Off") || d.dumpster_types.name.includes("Roll-off")) {
            if (sizeVal === 10) price = 435;
            if (sizeVal === 20) price = 455;
            if (sizeVal === 30) price = 475;
            if (sizeVal === 40) price = 555;
          } else if (d.dumpster_types.name.includes("Rubber")) {
             if (sizeVal === 10) price = 445;
             if (sizeVal === 20) price = 525;
             if (sizeVal === 30) price = 655;
          } else {
             if (sizeVal === 2) price = 250;
             if (sizeVal === 4) price = 350;
             if (sizeVal === 6) price = 450;
             if (sizeVal === 8) price = 550;
          }

          typesMap[typeId].sizes.push({
            dumpster_id: d.id,
            size_id: d.dumpster_sizes?.id,
            value: sizeVal,
            label: `${sizeVal} Yard`,
            dimensions: d.dumpster_sizes ? `${d.dumpster_sizes.length_ft}' × ${d.dumpster_sizes.width_ft}' × ${d.dumpster_sizes.height_ft}'` : "",
            price: price
          });
        });
        
        Object.values(typesMap).forEach((type: any) => {
          type.sizes.sort((a: any, b: any) => a.value - b.value);
        });

        setDbDumpsterTypes(Object.values(typesMap));
      } catch (err) {
        console.error(err);
      }
    };
    fetchFromDB();
  }, []);

  const currentTypeObj = dbDumpsterTypes.find(t => t.id === selectedDumpsterType) || dbDumpsterTypes[0];
  const sizes = currentTypeObj?.sizes || [];
  const selectedSizeObj = sizes.find((s: any) => s.value === selectedSize) || sizes[0];
  const basePrice = selectedSizeObj?.price || 435;

  const locationInfo = LOCATIONS.find(loc => loc.zip === booking.zipCode);

  // Check if heavy material restrictions apply
  const isHeavyMaterial = booking.materialType && HEAVY_MATERIALS.includes(booking.materialType);
  const isHeavyMaterialWithRubberWheel = isHeavyMaterial && selectedDumpsterType === "b7f86e0a-0e2d-439c-95b3-434c6e97eefe";

  const calculateSurcharges = () => {
    let surcharge = 0;
    if (isHeavyMaterial && selectedDumpsterType === "47d87a5e-84c8-431e-b055-c996142352eb") {
      surcharge += HEAVY_MATERIAL_SURCHARGE;
    }
    return surcharge;
  };

  const surcharges = calculateSurcharges();
  const currentItemPrice = basePrice + surcharges;

  const calculateItemPrices = () => {
    if (!bookings || bookings.length === 0) return [];

    return bookings.map((b: any, index: number) => {
      let bBasePrice = 435;
      const bDumpsterType = index === selectedIndex ? selectedDumpsterType : b.dumpsterType;
      const bSize = parseInt((index === selectedIndex ? selectedSize : b.dumpsterSize) || 20);
      const bMaterialType = b.materialType;
      const bRentalPeriod = b.rentalPeriod;

      if (dbDumpsterTypes.length > 0) {
        const typeObj = dbDumpsterTypes.find((t: any) => t.id === bDumpsterType) || dbDumpsterTypes[0];
        if (typeObj && typeObj.sizes) {
          const sizeObj = typeObj.sizes.find((s: any) => s.value === bSize) || typeObj.sizes[0];
          if (sizeObj) bBasePrice = sizeObj.price;
        }
      }

      let bSurcharges = 0;
      const isHeavy = bMaterialType && HEAVY_MATERIALS.includes(bMaterialType);
      if (isHeavy && bDumpsterType === "47d87a5e-84c8-431e-b055-c996142352eb") {
        bSurcharges += HEAVY_MATERIAL_SURCHARGE;
      }

      let bExtraDays = 0;
      if (bRentalPeriod && bRentalPeriod > 14) {
        bExtraDays = (bRentalPeriod - 14) * 25;
      }

      return bBasePrice + bSurcharges + bExtraDays;
    });
  };

  const itemPrices = calculateItemPrices();

  const calculateCartTotal = () => {
    let total = itemPrices.reduce((sum, p) => sum + p, 0);

    if (accountCreation) {
      total -= ACCOUNT_DISCOUNT;
    }

    return Math.max(total, 0);
  };

  const cartTotal = calculateCartTotal();

  const handleRemoveItem = () => {
    if (bookings.length <= 1) {
      setError("Cannot remove the last item in your order.");
      return;
    }
    removeBooking(selectedIndex);
    setSelectedIndex(0);
  };

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

  const handleSubmit = async (methodOverride?: string | React.MouseEvent) => {
    const methodToUse = typeof methodOverride === 'string' ? methodOverride : paymentMethod;
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
        paymentMethod: methodToUse,
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (booking.dumpsterType) setSelectedDumpsterType(booking.dumpsterType);
    if (booking.dumpsterSize) setSelectedSize(booking.dumpsterSize);
  }, [selectedIndex, booking.dumpsterType, booking.dumpsterSize]);

  // Heavy materials only allow 10 yd roll-off
  const allowedSizes = isHeavyMaterial && selectedDumpsterType === "47d87a5e-84c8-431e-b055-c996142352eb"
    ? sizes.filter((s) => s.value === 10)
    : sizes;

  const handleDumpsterTypeChange = (type: string) => {
    setSelectedDumpsterType(type);

    // If heavy material and rubber wheel selected, show warning
    if (isHeavyMaterial && type === "b7f86e0a-0e2d-439c-95b3-434c6e97eefe") {
      setError("⚠️ Rubber wheel dumpsters cannot be used for concrete, brick, dirt, or rock. Please select Roll-Off.");
      return;
    }
    setError("");

    const typeObj = dbDumpsterTypes.find(t => t.id === type) || dbDumpsterTypes[0];
    const newAllowedSizes = isHeavyMaterial && type === "47d87a5e-84c8-431e-b055-c996142352eb"
      ? typeObj?.sizes.filter((s: any) => s.value === 10)
      : typeObj?.sizes;
      
    let newSize = selectedSize;
    if (newAllowedSizes && newAllowedSizes.length > 0 && !newAllowedSizes.find((s:any) => s.value === selectedSize)) {
      newSize = newAllowedSizes[0].value;
      setSelectedSize(newSize);
    }
    
    const sizeObj = typeObj?.sizes.find((s: any) => s.value === newSize) || typeObj?.sizes[0];
    const newPrice = sizeObj?.price || 435;
    
    let surcharge = 0;
    if (isHeavyMaterial && type === "47d87a5e-84c8-431e-b055-c996142352eb") {
      surcharge += HEAVY_MATERIAL_SURCHARGE;
    }

    updateBooking(selectedIndex, {
      ...booking,
      dumpsterType: type,
      dumpsterSize: newSize,
      basePrice: newPrice,
      surcharges: surcharge,
      totalPrice: newPrice + surcharge + (booking.rentalPeriod && booking.rentalPeriod > 14 ? (booking.rentalPeriod - 14) * 25 : 0),
    });
  };

  const handleSizeChange = (size: number) => {
    setSelectedSize(size);
    setError("");

    const sizeObj = sizes.find((s: any) => s.value === size) || sizes[0];
    const newPrice = sizeObj?.price || 435;
    
    updateBooking(selectedIndex, {
      ...booking,
      dumpsterSize: size,
      basePrice: newPrice,
      totalPrice: newPrice + surcharges,
    });
  };

  const handleContinue = () => {
    if (isHeavyMaterialWithRubberWheel) {
      setError("Cannot use rubber wheel dumpster for this material type.");
      return;
    }

    // Update booking with selection and scroll to payment
    updateBooking(selectedIndex, {
      dumpsterType: selectedDumpsterType,
      dumpsterSize: selectedSize,
      basePrice,
      surcharges,
      totalPrice: currentItemPrice + (booking.rentalPeriod && booking.rentalPeriod > 14 ? (booking.rentalPeriod - 14) * 25 : 0),
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
      // We now strictly rely on the backend API to handle development simulation and order saving.

      const response = await fetch('/api/payments/google-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartTotal,
          currency: 'USD',
          paymentData,
          bookingsData: bookings,
          contactInfo: formData,
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

  const handleStripePayment = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please fill out your contact details (Full Name, Email, and Phone) before proceeding.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartTotal,
          bookingsData: bookings,
          contactInfo: formData,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err: any) {
      setError('Payment processing failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit2 = async (methodOverride?: string) => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please fill out your contact details (Full Name, Email, and Phone) before proceeding.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const methodToUse = typeof methodOverride === 'string' ? methodOverride : paymentMethod;

    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartTotal,
          currency: 'USD',
          paymentMethod: methodToUse,
          cardData: methodToUse === 'credit-card' ? cardData : undefined,
          bookingsData: bookings,
          contactInfo: formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateBooking(0, {
          paymentMethod: methodToUse,
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

  const getDumpsterInfo = (type: string) => {
    if (type === "8fb25f2b-d593-42b6-8066-a62f59e2ca12") {
      return {
        title: "Permanent Dumpsters",
        description: "Long-term waste management solutions for businesses and multi-unit properties",
        features: ["Commercial-grade durability", "Regular pickup schedules", "Lockable lids available"],
        image: "/images/permanent-dumpster.png"
      };
    } else if (type === "b7f86e0a-0e2d-439c-95b3-434c6e97eefe") {
      return {
        title: "Rubber-wheeled Dumpsters",
        description: "Ideal for residential driveways and areas where surface protection is essential",
        features: ["Surface-friendly rubber wheels", "Driveway protection", "Easy placement"],
        image: "/images/rubber-wheel-dumpster.png"
      };
    }
    return {
      title: "Roll-off Dumpsters",
      description: "Perfect for large construction projects, home renovations, and commercial waste disposal",
      image: "/images/roll-off-dumpster.png"
    };
  };

  const dumpsterInfo = getDumpsterInfo(selectedDumpsterType);
  const sliderImages = Array(4).fill(dumpsterInfo.image);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="py-8 mt-6 ">
        <div className="flex justify-center">
          <div className="w-[25%] px-12">
            <div className="sticky top-24 mt-5 bg-gradient-to-b from-[#142A52] to-[#142A52]/80 text-white rounded-lg p-4 shadow-lg">
              <h3 className="text-xl font-bold  pb-2 border-b border-white/20">Shipping Address</h3>

              <div className="space-y-2 mb-6 pt-2">
                <div>
                  <p className="text-white/70 text-[12px]">State</p>
                  <p className="font-bold capitalize">{booking.state || locationInfo?.state?.toLowerCase() || "MI"}</p>
                </div>
                <div>
                  <p className="text-white/70 text-[12px]">City</p>
                  <p className="font-bold capitalize">{booking.city || locationInfo?.city?.toLowerCase() || "N/A"}</p>
                </div>
                <div>
                  <p className="text-white/70 text-[12px]">Zip Code</p>
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

          
            </div></div>
          <div className="w-[40%] mx-auto">
            {/* Progress */}

            <motion.div className="bg-white  border-slate-200 rounded-sm  mb-12">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-[15px] uppercase tracking-[0.2em] text-[#C89B2B] mb-2">
                      {dumpsterInfo.title}
                    </p>
                    <h1 className="text-[24px] font-bold text-[#142A52] mb-2">
                      {dumpsterInfo.title}
                    </h1>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      {dumpsterInfo.description}
                    </p>
                  </div>
                
                </div>

                {/* Content */}
                <div className="flex w-full relative ">

                  {/* Left Big Image */}
                  <div className="rounded-l-sm relative outline outline-slate-200 bg-white w-[75%] p-6 overflow-hidden">
                    <div 
                      className="relative w-full h-[220px] flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentImageIdx * 100}%)` }}
                    >
                      {sliderImages.map((src, idx) => (
                        <div key={idx} className="relative w-full h-full flex-shrink-0">
                          <Image
                            src={src}
                            alt={`${dumpsterInfo.title} View ${idx + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Slider Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {sliderImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIdx(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-[#142A52]' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg  border border-[#142A52]/10 z-10 text-right">
                      <p className="text-[10px] uppercase tracking-wider text-[#142A52]/60 font-bold mb-0.5">Dimensions</p>
                      <p className="text-[13px] font-bold text-[#142A52]">
                        {selectedSizeObj?.dimensions || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Images */}
                  <div className="w-[25%] flex flex-col relative">
                    <div className="absolute -top-5 text-[11px] right-0 text-gray-500">
                      Available Views
                    </div>
                    {sliderImages.slice(0, 4).map((src, i) => (
                      <div
                        key={i}
                        onClick={() => setCurrentImageIdx(i)}
                        className={`flex items-center justify-between outline outline-slate-200 bg-white flex-1 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          i === 0 ? "rounded-tr-sm" : i === 3 ? "rounded-br-sm" : ""
                        } ${currentImageIdx === i ? "ring-2 ring-inset ring-[#C89B2B]" : ""}`}
                      >
                        {/* Image */}
                        <div className="relative w-[60%] h-[50px]">
                          <Image
                            src={src}
                            alt={`Dumpster View ${i + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="w-[40%] text-right">
                          <p className="text-[9px] text-[#142A52]/60">View</p>
                          <p className="text-[10px] font-bold">
                            0{i + 1}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>

                </div>
              </div>
            </motion.div>

            {/* Dimension and Capacity Selectors */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 mt-6">
              <div className="w-full md:w-1/2">
                <label className="block text-[12px] font-bold text-[#142A52] mb-2">Dumpster Dimension</label>
                <Select value={selectedSize?.toString()} onValueChange={(val) => handleSizeChange(parseInt(val))}>
                  <SelectTrigger className="w-full border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:outline-none h-[42px] bg-white">
                    <SelectValue placeholder="Select Dimension" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((s: any) => (
                      <SelectItem key={s.value} value={s.value.toString()}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-[12px] font-bold text-[#142A52] mb-2">Dumpster Capacity</label>
                <Select value={booking.dumpsterCapacity?.toString() || ""} onValueChange={(val) => updateBooking(selectedIndex, { ...booking, dumpsterCapacity: parseInt(val) })}>
                  <SelectTrigger className="w-full border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:outline-none h-[42px] bg-white">
                    <SelectValue placeholder="Select Capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Ton</SelectItem>
                    <SelectItem value="2">2 Tons</SelectItem>
                    <SelectItem value="3">3 Tons</SelectItem>
                    <SelectItem value="4">4 Tons</SelectItem>
                    <SelectItem value="5">5 Tons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ProductInfoSection product={product} />
            <div className=" mt-10 gap-8">
              {/* Main Form */}

              <div className="">
                {/* Contact Information */}
                <div id="billing-section" className="mb-8 p-3">
                  <h2 className="text-2xl font-bold text-[#142A52] mb-6"> Billing Information</h2>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </motion.div>
                  )}

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
              {isHeavyMaterial && selectedDumpsterType === "47d87a5e-84c8-431e-b055-c996142352eb" && (
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
                  <h3 className="text-2xl font-bold">Shipping Address</h3>
                  <Zap className="w-6 h-6 text-[#C89B2B]" />
                </div>

                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between items-center"
                >
                  <span className="text-xl pl-2 font-bold">Total (Base Price)</span>
                  <span className="text-3xl font-bold text-[#C89B2B]">${cartTotal.toFixed(2)}</span>
                </motion.div>
                <p className="text-xs text-white/60 mt-4">
                  💡 Rental period and special requests may adjust final price
                </p>
              </motion.div>

              <div id="payment-section" className="mb-8">
                <h2 className="text-2xl font-bold text-[#142A52] mb-6">Payment Method</h2>

                {/* Direct Payment Buttons */}
                <div className="space-y-4 mb-8">
                <div className="">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                  >
                    <button
                      type="button"
                      onClick={handleStripePayment}
                      className="w-full p-3 bg-[#635BFF] text-white font-bold rounded flex items-center justify-center gap-2 h-[42px] hover:bg-[#4B45FF] transition-colors"
                    >
                      Pay with Stripe
                    </button>
                  </motion.div>

                 <motion.button
                    onClick={() => handleSubmit2('apple-pay')}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full p-3 bg-black text-white font-bold rounded  flex items-center justify-center gap-2 h-[42px] hover:bg-gray-900 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                    Pay with Apple Pay
                  </motion.button>
                  </div>
                  <motion.div
                    className="mb-2 w-full flex pb-1  [&>div]:w-full pr-2 [&_.google-pay-button-container]:w-full [&_button]:!w-full"
                  >
                    <GPayButton
                      amount={cartTotal}
                      // @ts-ignore - Safely pass buttonSizeMode if GPayButton passes props down
                      buttonSizeMode="fill"
                      onPaymentSuccess={(paymentData) => {
                        handleGooglePayPayment(paymentData);
                      }}
                      onPaymentError={(error) => {
                        setError('Google Pay error: ' + error.message);
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                  >
                    <PayPalButton
                      amount={cartTotal}
                      onSuccess={(details) => handlePayPalPayment(details)}
                      onError={(error) => setError('PayPal error: ' + error.message)}
                    />
                  </motion.div>


                 
                </div>

              </div>
              {/* Action Buttons */}

            </motion.div>

          </div>
          <div className="w-[35%] px-10">

            <div className="scale-[0.9] mt-5 bg-gradient-to-b from-[#142A52] to-[#142A52]/80 text-white rounded-2xl p-2 ">
              <ItemsAdder
                dumpsterTypes={dbDumpsterTypes.map(t => ({ id: t.id, name: t.name, sizes: t.sizes.map((s: any) => s.value) }))}
                sizes={Array.from(new Set(dbDumpsterTypes.flatMap(t => t.sizes.map((s: any) => s.value))))}
                selectedIndex={selectedIndex}
                onSelect={(idx) => setSelectedIndex(idx)}
                cartTotal={cartTotal}
                itemPrices={itemPrices}
                onAddMore={(newItem) => {
                  const addedTypeObj = dbDumpsterTypes.find((t: any) => t.id === newItem.type) || dbDumpsterTypes[0];
                  const addedSizeObj = addedTypeObj?.sizes.find((s: any) => s.value === newItem.size) || addedTypeObj?.sizes[0];
                  const itemBasePrice = addedSizeObj?.price || 435;
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
