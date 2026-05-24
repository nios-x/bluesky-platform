"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useBooking } from "@/contexts/booking-context";
import { useAuth } from "@/contexts/auth-context";
import { ACCOUNT_DISCOUNT } from "@/lib/constants/booking";
import { ChevronLeft, CheckCircle2, Mail, Phone, Share2, Copy, Check, ShieldCheck, Eye, EyeOff, CreditCard, History, MapPin, CalendarClock } from "lucide-react";
import Image from "next/image";
import { HEAVY_MATERIALS, HEAVY_MATERIAL_SURCHARGE, SHIPPING_PRICE } from "@/lib/constants/booking";
import { ChevronRight, AlertCircle, Zap, ArrowLeft, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import GPayButton from "@/components/payments/gpay";
import ProductInfoSection from "@/components/whats-included";
import { DumpsterDetailSection } from "@/components/booking/dumpster-detail-section";
import PayPalButton from "./paypal";
import ItemsAdder from "@/components/order/ItemsAdder";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCATIONS } from "@/lib/constants/locations";
import { TermsModal, PrivacyModal } from "@/components/order/LegalModals";

// Session Storage Keys
const SESSION_STORAGE_KEYS = {
  FORM_DATA: "booking_order_formData",
  SELECTED_INDEX: "booking_order_selectedIndex",
  SELECTED_DUMPSTER_TYPE: "booking_order_selectedDumpsterType",
  SELECTED_SIZE: "booking_order_selectedSize",
  ACCOUNT_CREATION: "booking_order_accountCreation",
  ACCOUNT_PASSWORD: "booking_order_accountPassword",
  BOOKINGS: "booking_order_bookings",
};

// Utility functions for session storage
const saveToSessionStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed to save to sessionStorage: ${key}`, err);
    }
  }
};

const getFromSessionStorage = (key: string, defaultValue: any = null) => {
  if (typeof window !== "undefined") {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error(`Failed to read from sessionStorage: ${key}`, err);
      return defaultValue;
    }
  }
  return defaultValue;
};

export default function BookingStep1() {
  const router = useRouter();
  const { bookings, updateBooking, addBooking, removeBooking } = useBooking();
  const { user, isLoggedIn } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const booking = bookings[selectedIndex] || {};
  const [formData, setFormData] = useState({
    // Name
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    company: "",
    // Shipping address
    shippingStreet: "",
    shippingApartment: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "US",
    // Billing address
    billingSameAsShipping: true,
    billingStreet: "",
    billingApartment: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "US",
    // Other
    placementInstructions: "",
    subscribeNewsletter: false,
  });

  const [accountCreation, setAccountCreation] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [quoteCopied, setQuoteCopied] = useState(false);
  const [selectedDumpsterType, setSelectedDumpsterType] = useState(booking.dumpsterType || "47d87a5e-84c8-431e-b055-c996142352eb");
  const [selectedSize, setSelectedSize] = useState(booking.dumpsterSize || 20);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [dbDumpsterTypes, setDbDumpsterTypes] = useState<any[]>([]);
  // priceMap: key = `${dumpster_size_id}:${dumpster_type_id}`, value = { basePrice, shippingPrice } from DB
  const [priceMap, setPriceMap] = useState<Record<string, { basePrice: number; shippingPrice: number }>>({});
  const [priceLoading, setPriceLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // ── Initialize from Session Storage on mount ────────────────────────────────
  useEffect(() => {
    const savedFormData = getFromSessionStorage(SESSION_STORAGE_KEYS.FORM_DATA);
    if (savedFormData) {
      setFormData(savedFormData);
    }

    const savedSelectedIndex = getFromSessionStorage(SESSION_STORAGE_KEYS.SELECTED_INDEX, 0);
    setSelectedIndex(savedSelectedIndex);

    const savedDumpsterType = getFromSessionStorage(SESSION_STORAGE_KEYS.SELECTED_DUMPSTER_TYPE);
    if (savedDumpsterType) {
      setSelectedDumpsterType(savedDumpsterType);
    }

    const savedSize = getFromSessionStorage(SESSION_STORAGE_KEYS.SELECTED_SIZE);
    if (savedSize) {
      setSelectedSize(savedSize);
    }

    const savedAccountCreation = getFromSessionStorage(SESSION_STORAGE_KEYS.ACCOUNT_CREATION, false);
    setAccountCreation(savedAccountCreation);

    const savedAccountPassword = getFromSessionStorage(SESSION_STORAGE_KEYS.ACCOUNT_PASSWORD, "");
    setAccountPassword(savedAccountPassword);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setFormData(prev => prev.email === user.email ? prev : { ...prev, email: user.email });
    }
  }, [isLoggedIn, user?.email]);

  useEffect(() => {
    // Pre-fill shipping address from booking context (set on hero page)
    setFormData(prev => {
      const updates: any = {};
      if (booking.zipCode && !prev.shippingZip) {
        updates.shippingZip = booking.zipCode;
      }
      if (booking.city && !prev.shippingCity) {
        updates.shippingCity = booking.city;
      }
      if (booking.state && !prev.shippingState) {
        updates.shippingState = booking.state;
      }
      // Prefer explicit shippingStreet, fallback to booking.address (full address string) if available
      if (booking.shippingStreet && !prev.shippingStreet) {
        updates.shippingStreet = booking.shippingStreet;
      } else if (booking.address && !prev.shippingStreet) {
        updates.shippingStreet = booking.address;
      }
      if (Object.keys(updates).length > 0) {
        return { ...prev, ...updates };
      }
      return prev;
    });
  }, [booking.zipCode, booking.city, booking.state, booking.shippingStreet, booking.address]);

  // ── Step 1: Load dumpster catalog (NO pricing) ─────────────────────────────
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
              image: d.dumpster_types.name.includes("Rubber")
                ? "/images/rubber-wheel-dumpster.png"
                : d.dumpster_types.name.includes("Permanent")
                  ? "/images/permanent-dumpster.png"
                  : "/images/roll-off-dumpster.png",
              sizes: [],
            };
          }

          // Price is NOT set here — fetched from DB per ZIP in Step 3
          typesMap[typeId].sizes.push({
            dumpster_id: d.id,
            size_id: d.dumpster_sizes?.id,
            type_id: typeId,
            value: sizeVal,
            label: `${sizeVal} Yard`,
            dimensions: d.dumpster_sizes
              ? `${d.dumpster_sizes.length_ft}' × ${d.dumpster_sizes.width_ft}' × ${d.dumpster_sizes.height_ft}'`
              : "",
            price: null, // populated after ZIP pricing fetch
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

  // ── Step 2: Fetch price from DB when ZIP + selection changes ────────────────
  useEffect(() => {
    const zip = booking.zipCode || formData.shippingZip;
    if (!zip || !currentTypeObj) return;

    const fetchPrices = async () => {
      setPriceLoading(true);
      try {
        const newPriceMap: Record<string, { basePrice: number; shippingPrice: number }> = {};

        // Fetch price for every size in the current dumpster type
        await Promise.all(
          currentTypeObj.sizes.map(async (s: any) => {
            const params = new URLSearchParams({ zip });
            if (s.size_id) params.set("dumpster_size_id", s.size_id);
            if (s.type_id) params.set("dumpster_type_id", s.type_id);

            try {
              const res = await fetch(`/api/pricing?${params.toString()}`);
              if (res.ok) {
                const data = await res.json();
                const key = `${s.size_id}:${s.type_id}`;
                newPriceMap[key] = {
                  basePrice: data.base_price,
                  shippingPrice: data.shipping_price ?? 0
                };
              }
            } catch {
              // individual size fetch failed — leave null, UI shows "—"
            }
          })
        );

        setPriceMap((prev) => ({ ...prev, ...newPriceMap }));
      } catch (err) {
        console.error("Price fetch error:", err);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.zipCode, formData.shippingZip, selectedDumpsterType, dbDumpsterTypes.length]);

  const currentTypeObj = dbDumpsterTypes.find(t => t.id === selectedDumpsterType) || dbDumpsterTypes[0];
  const isRubber = currentTypeObj?.name?.includes("Rubber") || false;
  const currentFreeDays = isRubber ? 7 : 14;
  const sizes = currentTypeObj?.sizes || [];
  const selectedSizeObj = sizes.find((s: any) => s.value === selectedSize) || sizes[0];
  // ── Step 3: Read price from priceMap (DB-driven) ─────────────────────────
  const selectedPriceKey = selectedSizeObj ? `${selectedSizeObj.size_id}:${selectedSizeObj.type_id}` : null;
  const priceData = selectedPriceKey ? priceMap[selectedPriceKey] : null;
  const basePrice = priceData?.basePrice ?? selectedSizeObj?.price ?? null;
  const currentShippingPrice = priceData?.shippingPrice ?? SHIPPING_PRICE;

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
      `${currentFreeDays}-day rental`,
    ],
  };

  // Get all locations matching the zip code (multiple places can share a pincode)
  const locationInfoAll = LOCATIONS.filter(loc => loc.zip === booking.zipCode);
  const locationInfo = locationInfoAll.length > 0 ? locationInfoAll[0] : undefined;

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
  const currentItemPrice = (basePrice ?? 0) + surcharges;

  const calculateItemPrices = () => {
    if (!bookings || bookings.length === 0) return [];

    return bookings.map((b: any, index: number) => {
      let bBasePrice = 0;
      let bShippingPrice = SHIPPING_PRICE;
      const bDumpsterType = index === selectedIndex ? selectedDumpsterType : b.dumpsterType;
      const bSize = parseInt((index === selectedIndex ? selectedSize : b.dumpsterSize) || 20);
      const bMaterialType = b.materialType;
      const bRentalPeriod = b.rentalPeriod;

      if (dbDumpsterTypes.length > 0) {
        const typeObj = dbDumpsterTypes.find((t: any) => t.id === bDumpsterType) || dbDumpsterTypes[0];
        if (typeObj && typeObj.sizes) {
          const sizeObj = typeObj.sizes.find((s: any) => s.value === bSize) || typeObj.sizes[0];
          if (sizeObj) {
            // Read from priceMap (DB) first, fall back to sizeObj.price if not yet loaded
            const key = `${sizeObj.size_id}:${sizeObj.type_id}`;
            const pData = priceMap[key];
            bBasePrice = pData?.basePrice ?? sizeObj.price ?? 0;
            if (pData?.shippingPrice !== undefined) {
              bShippingPrice = pData.shippingPrice;
            }
          }
        }
      }

      let bSurcharges = 0;
      const isHeavy = bMaterialType && HEAVY_MATERIALS.includes(bMaterialType);
      if (isHeavy && bDumpsterType === "47d87a5e-84c8-431e-b055-c996142352eb") {
        bSurcharges += HEAVY_MATERIAL_SURCHARGE;
      }

      const isBRubber = dbDumpsterTypes.find((t: any) => t.id === bDumpsterType)?.name?.includes("Rubber") || false;
      const bFreeDays = isBRubber ? 7 : 14;
      let bExtraDays = 0;
      if (bRentalPeriod && bRentalPeriod > bFreeDays) {
        bExtraDays = (bRentalPeriod - bFreeDays) * 25;
      }

      return bBasePrice + bSurcharges + bExtraDays + bShippingPrice;
    });
  };

  const itemPrices = calculateItemPrices();

  const calculateCartBreakdown = () => {
    let breakdown = {
      basePrice: 0,
      surcharges: 0,
      extraDays: 0,
      shipping: 0
    };

    if (!bookings || bookings.length === 0) return breakdown;

    bookings.forEach((b: any, index: number) => {
      let bBasePrice = 0;
      let bShippingPrice = SHIPPING_PRICE;
      const bDumpsterType = index === selectedIndex ? selectedDumpsterType : b.dumpsterType;
      const bSize = parseInt((index === selectedIndex ? selectedSize : b.dumpsterSize) || 20);
      const bMaterialType = b.materialType;
      const bRentalPeriod = b.rentalPeriod;

      if (dbDumpsterTypes.length > 0) {
        const typeObj = dbDumpsterTypes.find((t: any) => t.id === bDumpsterType) || dbDumpsterTypes[0];
        if (typeObj && typeObj.sizes) {
          const sizeObj = typeObj.sizes.find((s: any) => s.value === bSize) || typeObj.sizes[0];
          if (sizeObj) {
            // Read from priceMap (DB) first, fall back to sizeObj.price if not yet loaded
            const key = `${sizeObj.size_id}:${sizeObj.type_id}`;
            const pData = priceMap[key];
            bBasePrice = pData?.basePrice ?? sizeObj.price ?? 0;
            if (pData?.shippingPrice !== undefined) {
              bShippingPrice = pData.shippingPrice;
            }
          }
        }
      }

      let bSurcharges = 0;
      const isHeavy = bMaterialType && HEAVY_MATERIALS.includes(bMaterialType);
      if (isHeavy && bDumpsterType === "47d87a5e-84c8-431e-b055-c996142352eb") {
        bSurcharges += HEAVY_MATERIAL_SURCHARGE;
      }

      const isBRubber = dbDumpsterTypes.find((t: any) => t.id === bDumpsterType)?.name?.includes("Rubber") || false;
      const bFreeDays = isBRubber ? 7 : 14;
      let bExtraDays = 0;
      if (bRentalPeriod && bRentalPeriod > bFreeDays) {
        bExtraDays = (bRentalPeriod - bFreeDays) * 25;
      }

      breakdown.basePrice += bBasePrice;
      breakdown.surcharges += bSurcharges;
      breakdown.extraDays += bExtraDays;
      breakdown.shipping += bShippingPrice;
    });

    return breakdown;
  };

  const cartBreakdown = calculateCartBreakdown();

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
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-sync fullName from first + last
      if (field === 'firstName' || field === 'lastName') {
        updated.fullName = `${field === 'firstName' ? value : prev.firstName} ${field === 'lastName' ? value : prev.lastName}`.trim();
      }
      // Sync to session storage
      saveToSessionStorage(SESSION_STORAGE_KEYS.FORM_DATA, updated);
      return updated;
    });
    setError("");
  };

  // ── Sync state changes to session storage ──────────────────────────────────
  useEffect(() => {
    saveToSessionStorage(SESSION_STORAGE_KEYS.SELECTED_INDEX, selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    saveToSessionStorage(SESSION_STORAGE_KEYS.SELECTED_DUMPSTER_TYPE, selectedDumpsterType);
  }, [selectedDumpsterType]);

  useEffect(() => {
    saveToSessionStorage(SESSION_STORAGE_KEYS.SELECTED_SIZE, selectedSize);
  }, [selectedSize]);

  useEffect(() => {
    saveToSessionStorage(SESSION_STORAGE_KEYS.ACCOUNT_CREATION, accountCreation);
  }, [accountCreation]);

  const validateForm = useCallback(() => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First and Last name are required");
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
    // Shipping Address
    if (!formData.shippingStreet.trim()) {
      setError("Shipping street address is required");
      return false;
    }
    if (!formData.shippingCity.trim()) {
      setError("Shipping city is required");
      return false;
    }
    if (!formData.shippingState.trim()) {
      setError("Shipping state is required");
      return false;
    }
    if (!formData.shippingZip.trim()) {
      setError("Shipping ZIP code is required");
      return false;
    }

    // Billing Address (if different)
    if (!formData.billingSameAsShipping) {
      if (!formData.billingStreet.trim() || !formData.billingCity.trim() || !formData.billingState.trim() || !formData.billingZip.trim()) {
        setError("Please complete all billing address fields or check 'Same as shipping'");
        return false;
      }
    }

    // Terms & Conditions
    if (!termsAccepted) {
      setError("You must agree to the Terms & Conditions before proceeding.");
      return false;
    }

    // Account password validation
    if (accountCreation && accountPassword.length < 6) {
      setError("Account password must be at least 6 characters.");
      return false;
    }

    return true;
  }, [formData, termsAccepted, accountCreation, accountPassword]);

  const handleSubmit = async (methodOverride?: string | React.MouseEvent) => {
    const methodToUse = typeof methodOverride === 'string' ? methodOverride : paymentMethod;
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Update booking with contact and address info
      updateBooking(0, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        shippingAddress: {
          street: formData.shippingStreet,
          apartment: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        },
        billingAddress: formData.billingSameAsShipping ? {
          street: formData.shippingStreet,
          apartment: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        } : {
          street: formData.billingStreet,
          apartment: formData.billingApartment,
          city: formData.billingCity,
          state: formData.billingState,
          zip: formData.billingZip,
          country: formData.billingCountry,
        },
        placementInstructions: formData.placementInstructions,
        accountDiscount: accountCreation ? ACCOUNT_DISCOUNT : 0,
        paymentMethod: methodToUse,
        subscribeNewsletter: formData.subscribeNewsletter,
      });

      // Clear session storage and navigate to payment step
      Object.values(SESSION_STORAGE_KEYS).forEach(key => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(key);
        }
      });
      router.push("/booking/step-2");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear all booking session storage (for starting fresh)
  const clearBookingSessionStorage = () => {
    Object.values(SESSION_STORAGE_KEYS).forEach(key => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(key);
      }
    });
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
    setCurrentImageIdx(0);
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
    if (newAllowedSizes && newAllowedSizes.length > 0 && !newAllowedSizes.find((s: any) => s.value === selectedSize)) {
      newSize = newAllowedSizes[0].value;
      setSelectedSize(newSize);
    }

    const sizeObj = typeObj?.sizes.find((s: any) => s.value === newSize) || typeObj?.sizes[0];
    const newPrice = sizeObj?.price || 435;

    let surcharge = 0;
    if (isHeavyMaterial && type === "47d87a5e-84c8-431e-b055-c996142352eb") {
      surcharge += HEAVY_MATERIAL_SURCHARGE;
    }

    const isTypeRubber = typeObj?.name?.includes("Rubber") || false;
    const typeFreeDays = isTypeRubber ? 14 : 7;

    updateBooking(selectedIndex, {
      ...booking,
      dumpsterType: type,
      dumpsterSize: newSize,
      basePrice: newPrice,
      surcharges: surcharge,
      totalPrice: newPrice + surcharge + (booking.rentalPeriod && booking.rentalPeriod > typeFreeDays ? (booking.rentalPeriod - typeFreeDays) * 25 : 0),
    });
  };

  const handleSizeChange = (size: number) => {
    setSelectedSize(size);
    setError("");

    const sizeObj = sizes.find((s: any) => s.value === size) || sizes[0];
    const newPrice = sizeObj?.price || 435;

    const sizeExtraCharge = (booking.rentalPeriod && booking.rentalPeriod > currentFreeDays) ? (booking.rentalPeriod - currentFreeDays) * 25 : 0;

    updateBooking(selectedIndex, {
      ...booking,
      dumpsterSize: size,
      basePrice: newPrice,
      totalPrice: newPrice + surcharges + sizeExtraCharge,
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
      totalPrice: currentItemPrice + (booking.rentalPeriod && booking.rentalPeriod > currentFreeDays ? (booking.rentalPeriod - currentFreeDays) * 25 : 0),
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
  const [weeklyPickup, setWeeklyPickup] = useState("Once a week x1");
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

  const discountAmount = couponApplied ? 20 : 0;
  const totalPayable = calculateCartTotal() - discountAmount;
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
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Sync address to context first
      const contactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        shippingAddress: {
          street: formData.shippingStreet,
          apartment: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        },
        billingAddress: formData.billingSameAsShipping ? {
          street: formData.shippingStreet,
          apartment: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        } : {
          street: formData.billingStreet,
          apartment: formData.billingApartment,
          city: formData.billingCity,
          state: formData.billingState,
          zip: formData.billingZip,
          country: formData.billingCountry,
        },
        placementInstructions: formData.placementInstructions,
        serviceFrequency: selectedDumpsterType === "8fb25f2b-d593-42b6-8066-a62f59e2ca12" ? weeklyPickup : null,
      };

      updateBooking(0, contactData);

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
          contactInfo: { ...formData, accountCreation, accountPassword: accountCreation ? accountPassword : undefined },
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateBooking(0, {
          paymentMethod: 'google-pay',
          paymentIntentId: data.paymentIntentId,
          paymentStatus: 'completed',
        });

        router.push(`/booking/confirmation?session_id=${data.paymentIntentId}`);
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err: any) {
      setError('Payment processing failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = useCallback(async (details: any) => {
    if (!validateForm()) return;
    setLoading(true);
    setError("");

    try {
      // Sync address to context
      updateBooking(0, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        shippingAddress: {
          street: formData.shippingStreet,
          apartment: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        },
        billingAddress: formData.billingSameAsShipping ? {
          street: formData.shippingStreet,
          apartment: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        } : {
          street: formData.billingStreet,
          apartment: formData.billingApartment,
          city: formData.billingCity,
          state: formData.billingState,
          zip: formData.billingZip,
          country: formData.billingCountry,
        },
        placementInstructions: formData.placementInstructions,
        serviceFrequency: selectedDumpsterType === "8fb25f2b-d593-42b6-8066-a62f59e2ca12" ? weeklyPickup : null,
        paymentMethod: 'paypal',
        paymentIntentId: details.id,
        paymentStatus: 'completed',
      });

      router.push(`/booking/confirmation?session_id=${details.id}`);
    } catch (err: any) {
      setError('Payment processing failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, updateBooking, router]);

  const handlePayPalError = useCallback((error: any) => {
    setError('PayPal error: ' + error.message);
  }, []);

  const handleStripePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Sync address to context
      updateBooking(0, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        shippingAddress: {
          street: formData.shippingStreet,
          apartment: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        },
        billingAddress: formData.billingSameAsShipping ? {
          street: formData.shippingStreet,
          apartment: formData.shippingApartment,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        } : {
          street: formData.billingStreet,
          apartment: formData.billingApartment,
          city: formData.billingCity,
          state: formData.billingState,
          zip: formData.billingZip,
          country: formData.billingCountry,
        },
        placementInstructions: formData.placementInstructions,
        serviceFrequency: selectedDumpsterType === "8fb25f2b-d593-42b6-8066-a62f59e2ca12" ? weeklyPickup : null,
      });

      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartTotal,
          bookingsData: bookings,
          contactInfo: { ...formData, accountCreation, accountPassword: accountCreation ? accountPassword : undefined },
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

  const getDumpsterSliderImages = (type: string, size: number): string[] => {
    // Permanent Dumpsters (Front Load) — sizes: 2, 4, 6, 8
    if (type === "8fb25f2b-d593-42b6-8066-a62f59e2ca12") {
      const base = "/Dumpster/Permanent Dumpsters";
      if (size === 2) return [
        `${base}/2 yard front load dumpster (1)@1.5x.jpg`,
        `${base}/2 yard front load dumpster (2)_@1.5x.jpg`,
        `${base}/2 yard front load dumpster (3)@1.5x.jpg`,
        `${base}/2 yard front load dumpster (4)@1.5x.jpg`,
      ];
      if (size === 4) return [
        `${base}/4 yard front load 1@1.5x.jpg`,
        `${base}/4 yard front load 2@1.5x.jpg`,
        `${base}/4 yard front load 3@1.5x.jpg`,
        `${base}/4 yard front load 4@1.5x.jpg`,
      ];
      if (size === 6) return [
        `${base}/6 yard front load 1@1.5x.jpg`,
        `${base}/6 yard front load 2@1.5x.jpg`,
        `${base}/6 yard front load 3@1.5x.jpg`,
        `${base}/6 yard front load 4@1.5x.jpg`,
        `${base}/6 yard front load 5@1.5x.jpg`,
      ];
      if (size === 8) return [
        `${base}/8 yard front load 1@1.5x.jpg`,
        `${base}/8 yard front load 2@1.5x.jpg`,
        `${base}/8 yard front load 3@1.5x.jpg`,
        `${base}/8 yard front load 4@1.5x.jpg`,
      ];
      // fallback: all permanent images
      return [
        `${base}/2 yard front load dumpster (1)@1.5x.jpg`,
        `${base}/4 yard front load 1@1.5x.jpg`,
        `${base}/6 yard front load 1@1.5x.jpg`,
        `${base}/8 yard front load 1@1.5x.jpg`,
      ];
    }

    // Rubber-wheeled Dumpsters — sizes: 10, 20, 30
    if (type === "b7f86e0a-0e2d-439c-95b3-434c6e97eefe") {
      const base = "/Dumpster/Rubber-wheeled Dumpsters";
      if (size === 10) return [
        `${base}/10 Yard Rubber tire trailor (1)@1.5x.jpg`,
        `${base}/10 Yard Rubber tire trailor (2)@1.5x.jpg`,
        `${base}/10 Yard Rubber tire trailor (3)@1.5x.jpg`,
        `${base}/10 Yard Rubber tire trailor (4)@1.5x.jpg`,
        `${base}/10 Yard Rubber tire trailor (1)(1)@1.5x.jpg`,
        `${base}/10 Yard Rubber tire trailor (2)(1)@1.5x.jpg`,
        `${base}/10 Yard Rubber tire trailor (3)(1)@1.5x.jpg`,
        `${base}/10 Yard Rubber tire trailor (4)(1)@1.5x.jpg`,
      ];
      if (size === 20) return [
        `${base}/20 Yard Rubber tire trailor (1)@1.5x.jpg`,
        `${base}/20 Yard Rubber tire trailor (2)@1.5x.jpg`,
        `${base}/20 Yard Rubber tire trailor (3)@1.5x.jpg`,
        `${base}/20 Yard Rubber tire trailor (4)@1.5x.jpg`,
        `${base}/20 Yard Rubber tire trailor (1)(1)@1.5x.jpg`,
        `${base}/20 Yard Rubber tire trailor (2)(1)@1.5x.jpg`,
        `${base}/20 Yard Rubber tire trailor (3)(1)@1.5x.jpg`,
        `${base}/20 Yard Rubber tire trailor (4)(1)@1.5x.jpg`,
      ];
      if (size === 30) return [
        `${base}/30 Yard Rubber tire trailor (1)@1.5x.jpg`,
        `${base}/30 Yard Rubber tire trailor (2)@1.5x.jpg`,
        `${base}/30 Yard Rubber tire trailor (3)@1.5x.jpg`,
        `${base}/30 Yard Rubber tire trailor (4)@1.5x.jpg`,
        `${base}/30 Yard Rubber tire trailor (1)(1)@1.5x.jpg`,
        `${base}/30 Yard Rubber tire trailor (2)(1)@1.5x.jpg`,
        `${base}/30 Yard Rubber tire trailor (3)(1)@1.5x.jpg`,
        `${base}/30 Yard Rubber Wheeled - 4@1.5x.jpg`,
      ];
      // fallback
      return [
        `${base}/10 Yard Rubber tire trailor (1)@1.5x.jpg`,
        `${base}/20 Yard Rubber tire trailor (1)@1.5x.jpg`,
        `${base}/30 Yard Rubber tire trailor (1)@1.5x.jpg`,
      ];
    }

    // Roll-off Dumpsters (default) — sizes: 10, 20, 30, 40
    const base = "/Dumpster/Roll-off Dumpsters";
    if (size === 10) return [
      `${base}/10 yard roll off 1@1.5x.jpg`,
      `${base}/10 yard roll off 2@1.5x.jpg`,
      `${base}/10 yard roll off 3@1.5x.jpg`,
      `${base}/10 yard roll off 4@1.5x.jpg`,
    ];
    if (size === 20) return [
      `${base}/20 yard roll off 2@1.5x.jpg`,
      `${base}/20 yard roll off 3@1.5x.jpg`,
      `${base}/20 yard roll off 4@1.5x.jpg`,
    ];
    if (size === 30) return [
      `${base}/30 yard roll off 1@1.5x.jpg`,
      `${base}/30 yard roll off 2@1.5x.jpg`,
      `${base}/30 yard roll off 3@1.5x.jpg`,
      `${base}/30 yard roll off 4@1.5x.jpg`,
    ];
    if (size === 40) return [
      `${base}/40 yard roll off1@1.5x.jpg`,
      `${base}/40 yard roll off3@1.5x.jpg`,
    ];
    // fallback: one image per size
    return [
      `${base}/10 yard roll off 1@1.5x.jpg`,
      `${base}/20 yard roll off 2@1.5x.jpg`,
      `${base}/30 yard roll off 1@1.5x.jpg`,
      `${base}/40 yard roll off1@1.5x.jpg`,
    ];
  };

  const dumpsterInfo = getDumpsterInfo(selectedDumpsterType);
  const sliderImages = getDumpsterSliderImages(selectedDumpsterType, selectedSize);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="py-4 md:py-8 mt-4 md:mt-6">
        <div className="flex flex-col lg:flex-row justify-center gap-8 px-4 md:px-8 max-w-7xl mx-auto">

          <div className="w-full lg:w-[65%]">
            {/* Progress */}

            <motion.div className="bg-white  border-slate-200 rounded-sm  mb-12">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-[15px] uppercase tracking-[0.2em] text-[#DAA520] mb-2">
                      {dumpsterInfo.title}
                    </p>
                    <h1 className="text-[24px] font-bold text-[#0A1628] mb-2">
                      {dumpsterInfo.title}
                    </h1>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      {dumpsterInfo.description}
                    </p>
                  </div>

                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row w-full relative gap-2 md:gap-0">

                  {/* Left Big Image */}
                  <div className="rounded-l-sm md:rounded-l-sm relative outline outline-slate-200 bg-white w-full md:w-[75%] p-4 md:p-6 overflow-hidden">
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
                            sizes="(max-width: 768px) 100vw, 50vw"
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
                          className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-[#0A1628]' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg  border border-[#0A1628]/10 z-10 text-right">
                      <p className="text-[10px] uppercase tracking-wider text-[#0A1628]/60 font-bold mb-0.5">Dimensions</p>
                      <p className="text-[13px] font-bold text-[#0A1628]">
                        {selectedSizeObj?.dimensions || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Images */}
                  <div className="w-full md:w-[25%] flex flex-col relative overflow-hidden">
                    <div className="hidden md:block absolute -top-5 text-[11px] right-0 text-gray-500">
                      Available Views
                    </div>
                    <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto h-full" style={{ maxHeight: '340px' }}>
                      {sliderImages.map((src, i) => (
                        <div
                          key={i}
                          onClick={() => setCurrentImageIdx(i)}
                          className={`flex items-center justify-between outline outline-slate-200 bg-white shrink-0 p-2 md:p-3 cursor-pointer hover:bg-gray-50 transition-colors ${i === 0 ? "rounded-tr-sm" : i === sliderImages.length - 1 ? "rounded-br-sm" : ""
                            } ${currentImageIdx === i ? "ring-2 ring-inset ring-[#DAA520]" : ""} min-w-[80px] md:min-w-0`}
                        >
                          {/* Image */}
                          <div className="relative w-[50px] md:w-[60%] h-[40px] md:h-[50px]">
                            <Image
                              src={src}
                              alt={`Dumpster View ${i + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-contain"
                            />
                          </div>

                          <div className="hidden md:block w-[40%] text-right">
                            <p className="text-[9px] text-[#0A1628]/60">View</p>
                            <p className="text-[10px] font-bold">
                              {String(i + 1).padStart(2, '0')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Mobile-only ItemsAdder (below images) */}
            <div className="lg:hidden mb-10 bg-zinc-100 text-black rounded-2xl p-4">
              <ItemsAdder
                dumpsterTypes={dbDumpsterTypes.map(t => ({ id: t.id, name: t.name, sizes: t.sizes.map((s: any) => ({ value: s.value, id: s.id })) }))}
                sizes={Array.from(new Map(dbDumpsterTypes.flatMap(t => t.sizes).map((s: any) => [s.value, { value: s.value, id: s.id }])).values())}
                selectedIndex={selectedIndex}
                onSelect={(idx) => setSelectedIndex(idx)}
                cartTotal={cartTotal}
                itemPrices={itemPrices}
                cartBreakdown={cartBreakdown}
                accountCreation={accountCreation}
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
                    dumpsterSizeId: addedSizeObj?.id,
                    deliveryDate: newItem.deliveryDate,
                    rentalPeriod: newItem.rentalPeriod,
                    basePrice: itemBasePrice,
                    surcharges: extraDaysCost,
                    totalPrice: itemBasePrice + extraDaysCost
                  });
                }}
              />
            </div>

            <ProductInfoSection product={product} />

            {/* Dumpster Detail Section - Size Switcher, What's Included, Restrictions, Instructions */}
            <DumpsterDetailSection
              dumpsterType={currentTypeObj?.name || ""}
              selectedSize={selectedSize}
              sizes={sizes}
              onSizeChange={handleSizeChange}
              weeklyPickup={weeklyPickup}
              onWeeklyPickupChange={setWeeklyPickup}
            />

            <div className=" mt-10 gap-8">
              {/* Main Form */}

              <div className="">
                {/* Contact Information */}
                <div id="billing-section" className="mb-8">

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

                  {/* ── Shipping Details ── */}
                  <h2 className="text-xl font-bold text-[#0A1628] mb-5 pb-2 border-b border-[#0A1628]/10">Shipping Details</h2>

                  {/* First / Last name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0A1628] mb-1">First name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Last name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Company name <span className="font-normal text-gray-400">(optional)</span></label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                      placeholder="Your company name"
                    />
                  </div>

                  {/* Country */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Country / Region *</label>
                    <div className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg bg-gray-50 text-gray-500 select-none">
                      United States (US)
                    </div>
                  </div>

                  {/* Street address */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Street address *</label>
                    <input
                      type="text"
                      value={formData.shippingStreet}
                      onChange={(e) => handleInputChange("shippingStreet", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all mb-2"
                      placeholder="House number and street name"
                    />
                    <input
                      type="text"
                      value={formData.shippingApartment}
                      onChange={(e) => handleInputChange("shippingApartment", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                  </div>

                  {/* City / State / ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Town / City *</label>
                      <input
                        type="text"
                        value={formData.shippingCity}
                        onChange={(e) => handleInputChange("shippingCity", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                        placeholder="ALMONT"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0A1628] mb-1">State *</label>
                      <input
                        type="text"
                        value={formData.shippingState}
                        onChange={(e) => handleInputChange("shippingState", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                        placeholder="Michigan"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Postcode / ZIP *</label>
                      <input
                        type="text"
                        value={formData.shippingZip}
                        onChange={(e) => handleInputChange("shippingZip", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                        placeholder="48003"
                      />
                    </div>
                  </div>

                  {/* Phone / Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                        placeholder="(586) 412-3762"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Email address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Placement Instructions */}
                  <div className="mb-6">
                    <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Placement Instructions *</label>
                    <textarea
                      value={formData.placementInstructions}
                      onChange={(e) => handleInputChange("placementInstructions", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      rows={3}
                    />
                  </div>

                  {/* ── Billing Address ── */}
                  <h2 className="text-xl font-bold text-[#0A1628] mb-4 pb-2 border-b border-[#0A1628]/10">Billing Address</h2>

                  <label className="flex items-center gap-3 cursor-pointer mb-5">
                    <input
                      type="checkbox"
                      checked={formData.billingSameAsShipping}
                      onChange={(e) => handleInputChange("billingSameAsShipping", e.target.checked)}
                      className="w-4 h-4 accent-[#0A1628] rounded"
                    />
                    <span className="text-sm text-gray-700">My billing address is the same as my shipping address</span>
                  </label>

                  {!formData.billingSameAsShipping && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="mb-4">
                        <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Street address *</label>
                        <input
                          type="text"
                          value={formData.billingStreet}
                          onChange={(e) => handleInputChange("billingStreet", e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all mb-2"
                          placeholder="House number and street name"
                        />
                        <input
                          type="text"
                          value={formData.billingApartment}
                          onChange={(e) => handleInputChange("billingApartment", e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                          placeholder="Apartment, suite, unit, etc. (optional)"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Town / City *</label>
                          <input type="text" value={formData.billingCity} onChange={(e) => handleInputChange("billingCity", e.target.value)} className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] outline-none" placeholder="ALMONT" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#0A1628] mb-1">State *</label>
                          <input type="text" value={formData.billingState} onChange={(e) => handleInputChange("billingState", e.target.value)} className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] outline-none" placeholder="Michigan" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Postcode / ZIP *</label>
                          <input type="text" value={formData.billingZip} onChange={(e) => handleInputChange("billingZip", e.target.value)} className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] outline-none" placeholder="48003" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Newsletter */}
                  <div className="mt-6 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.subscribeNewsletter}
                        onChange={(e) => handleInputChange("subscribeNewsletter", e.target.checked)}
                        className="w-4 h-4 accent-[#0A1628] rounded"
                      />
                      <span className="text-sm text-gray-700">Subscribe to our newsletter</span>
                    </label>
                  </div>

                  {/* Terms & Conditions */}
                  <div className={`mt-4 p-4 rounded-xl border-2 transition-colors ${termsAccepted ? 'border-green-400 bg-green-50/50' : 'border-[#0A1628]/20 bg-white'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => { setTermsAccepted(e.target.checked); setError(""); }}
                        className="w-5 h-5 accent-[#0A1628] rounded mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                          className="text-[#DAA520] font-bold underline underline-offset-2 hover:text-[#0A1628] transition-colors"
                        >
                          Terms &amp; Conditions
                        </button>
                        {" "}and{" "}
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}
                          className="text-[#DAA520] font-bold underline underline-offset-2 hover:text-[#0A1628] transition-colors"
                        >
                          Privacy Policy
                        </button>
                        <span className="text-red-500"> *</span>
                      </span>
                    </label>
                    {!termsAccepted && error?.includes("Terms") && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-2 ml-8 font-medium"
                      >
                        You must accept the Terms and Conditions to proceed with payment.
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Account Creation Option */}
                {!isLoggedIn && (
                  <div className={`rounded-2xl p-6 mb-8 border-2 transition-all ${accountCreation ? 'border-[#DAA520] bg-gradient-to-br from-[#DAA520]/10 to-[#DAA520]/5 shadow-md' : 'border-[#0A1628]/15 bg-[#f9fafb]'}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accountCreation}
                      onChange={(e) => { setAccountCreation(e.target.checked); if (!e.target.checked) setAccountPassword(""); }}
                      className="w-5 h-5 accent-[#DAA520]"
                    />
                    <div>
                      <span className="font-bold text-[#0A1628] text-[15px]">
                        Save your order details &mdash; create an account
                      </span>
                      <span className="ml-2 inline-block bg-[#DAA520] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Save ${ACCOUNT_DISCOUNT}
                      </span>
                    </div>
                  </label>

                  <AnimatePresence>
                    {accountCreation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-3 mt-5 ml-8">
                          {[
                            { icon: <History className="w-4 h-4" />, text: "Order history" },
                            { icon: <MapPin className="w-4 h-4" />, text: "Saved addresses" },
                            { icon: <CreditCard className="w-4 h-4" />, text: "Payment on file" },
                            { icon: <CalendarClock className="w-4 h-4" />, text: "Rental extensions" },
                          ].map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-[12px] text-[#0A1628]/80">
                              <span className="text-[#DAA520]">{b.icon}</span>
                              {b.text}
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 ml-8">
                          <label className="block text-[11px] font-bold text-[#0A1628] mb-1">Create a password *</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              className="w-full px-3 py-2.5 text-sm border-2 border-[#0A1628]/20 rounded-lg focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all pr-10"
                              placeholder="Min 6 characters"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {accountPassword.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${accountPassword.length >= 10 ? 'w-full bg-green-500' : accountPassword.length >= 6 ? 'w-2/3 bg-[#DAA520]' : 'w-1/3 bg-red-400'}`} />
                              </div>
                              <span className={`text-[10px] font-bold ${accountPassword.length >= 10 ? 'text-green-600' : accountPassword.length >= 6 ? 'text-[#DAA520]' : 'text-red-500'}`}>
                                {accountPassword.length >= 10 ? 'Strong' : accountPassword.length >= 6 ? 'Good' : 'Weak'}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                )}

              </div>


            </div>
            <motion.div
              className="w-full space-y-10 mt-10 lg:mt-14"
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
                className="hidden bg-gradient-to-br from-[#0A1628] via-[#1a3a6f] to-[#0f1f3a] text-white rounded-2xl shadow-xl p-8 border border-[#DAA520]/30 lg:hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Order Summary</h3>
                  <Zap className="w-6 h-6 text-[#DAA520]" />
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Base Price</span>
                    <span className="font-bold text-white">${cartBreakdown.basePrice.toFixed(2)}</span>
                  </div>
                  {cartBreakdown.surcharges > 0 && (
                    <div className="flex justify-between items-center text-[#DAA520]">
                      <span>Heavy Material Surcharges</span>
                      <span className="font-bold">${cartBreakdown.surcharges.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Shipping & Delivery</span>
                    <span className="font-bold text-white">${cartBreakdown.shipping.toFixed(2)}</span>
                  </div>
                  {cartBreakdown.extraDays > 0 && (
                    <div className="flex justify-between items-center text-[#DAA520]">
                      <span>Extra Rental Charges</span>
                      <span className="font-bold">${cartBreakdown.extraDays.toFixed(2)}</span>
                    </div>
                  )}
                  {accountCreation && (
                    <div className="flex justify-between items-center text-green-400">
                      <span>Account Discount</span>
                      <span className="font-bold">-${ACCOUNT_DISCOUNT.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between items-center pt-4 border-t border-white/20"
                >
                  <span className="text-xl pl-2 font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-[#DAA520]">${cartTotal.toFixed(2)}</span>
                </motion.div>
                <p className="text-xs text-white/60 mt-4">
                  💡 Includes all selected dumpsters, shipping, and extra rental periods.
                </p>
              </motion.div>

              {formData.firstName && formData.lastName && formData.email && formData.phone && formData.shippingStreet && formData.shippingCity ? (
                <div id="payment-section" className="mb-8">
                  {/* Price Summary Before Payment */}
                  <div className="bg-gradient-to-br from-[#142A52] via-[#1a3a6f] to-[#0f1f3a] text-white rounded-2xl shadow-lg p-6 border border-[#DAA520]/30 mb-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#DAA520]" />
                      Order Summary
                    </h3>

                    {/* Products/Items Details */}
                    <div className="mb-6 pb-6 border-b border-white/20">
                      <h4 className="text-sm font-bold text-[#DAA520] mb-3">Items Selected ({bookings.length})</h4>
                      <div className="space-y-2">
                        {bookings.map((b: any, idx: number) => {
                          const dumpsterTypeName = dbDumpsterTypes.find(t => t.id === b.dumpsterType)?.name || b.dumpsterType || 'Dumpster';
                          const itemPrice = itemPrices[idx] || 0;
                          return (
                            <div key={idx} className="flex justify-between items-start text-xs bg-white/5 rounded-lg p-3">
                              <div className="flex-1">
                                <p className="font-semibold text-white">{b.dumpsterSize}yd {dumpsterTypeName}</p>
                                <p className="text-white/70 text-[11px]">
                                  {b.rentalPeriod ? `${b.rentalPeriod} days rental` : 'Standard rental'}
                                  {b.deliveryDate && ` • From ${new Date(b.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                </p>
                              </div>
                              <span className="font-bold text-[#DAA520] ml-4">${itemPrice.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/80">Base Price</span>
                        <span className="font-semibold text-white">${cartBreakdown.basePrice.toFixed(2)}</span>
                      </div>
                      {cartBreakdown.surcharges > 0 && (
                        <div className="flex justify-between items-center text-sm text-[#DAA520]">
                          <span>Heavy Material Surcharges</span>
                          <span className="font-semibold">${cartBreakdown.surcharges.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/80">Shipping & Delivery</span>
                        <span className="font-semibold text-white">${cartBreakdown.shipping.toFixed(2)}</span>
                      </div>
                      {cartBreakdown.extraDays > 0 && (
                        <div className="flex justify-between items-center text-sm text-[#DAA520]">
                          <span>Extra Rental Charges</span>
                          <span className="font-semibold">${cartBreakdown.extraDays.toFixed(2)}</span>
                        </div>
                      )}
                      {accountCreation && (
                        <div className="flex justify-between items-center text-sm text-green-400">
                          <span>Account Discount</span>
                          <span className="font-semibold">-${ACCOUNT_DISCOUNT.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/20">
                      <span className="font-bold text-white">Total to Pay</span>
                      <span className="text-3xl font-bold text-[#DAA520]">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-[#0A1628]">Payment Method</h2>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Secured by Stripe</span>
                    </div>
                  </div>

                  {/* T&C warning if not accepted */}
                  {!termsAccepted && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-center gap-2 text-sm text-amber-800">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Please accept the <strong>Terms &amp; Conditions</strong> above to unlock payment.</span>
                    </div>
                  )}

                  {/* Credit / Debit Card via Stripe */}
                  <div className={`rounded-xl border-2 p-4 mb-4 transition-all ${!termsAccepted ? 'opacity-50 pointer-events-none' : 'border-[#0A1628]/15 hover:border-[#635BFF]/40'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-[#0A1628]">Credit / Debit Card</span>
                      <div className="flex items-center gap-1.5">
                        {/* Visa */}
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-white border border-gray-200 rounded text-[9px] font-bold text-[#1A1F71]">VISA</span>
                        {/* MC */}
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-white border border-gray-200 rounded">
                          <span className="flex"><span className="w-3 h-3 rounded-full bg-red-500 -mr-1"></span><span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></span></span>
                        </span>
                        {/* Amex */}
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-[#006FCF] border border-gray-200 rounded text-[8px] font-bold text-white">AMEX</span>
                        {/* Discover */}
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-white border border-gray-200 rounded text-[7px] font-bold text-[#FF6600]">DISC</span>
                      </div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <button
                        type="button"
                        onClick={handleStripePayment}
                        disabled={!termsAccepted || loading}
                        className="w-full p-3 bg-[#635BFF] text-white font-bold rounded-lg flex items-center justify-center gap-2 h-[44px] hover:bg-[#4B45FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CreditCard className="w-4 h-4" />
                        {loading ? 'Processing...' : 'Pay with Stripe'}
                      </button>
                    </motion.div>
                  </div>

                  {/* Digital Wallets Row */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 transition-all ${!termsAccepted ? 'opacity-50 pointer-events-none' : ''}`}>
                    {/* Google Pay */}
                    <div className="rounded-xl border-2 border-[#0A1628]/15 p-4 hover:border-[#4285F4]/40 transition-all">
                      <span className="text-[11px] font-bold text-gray-500 mb-2 block">Google Pay</span>
                      <motion.div
                        className="w-full flex [&>div]:w-full [&_.google-pay-button-container]:w-full [&_button]:!w-full"
                        onClickCapture={(e) => {
                          if (!validateForm()) {
                            e.preventDefault();
                            e.stopPropagation();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                      >
                        <GPayButton
                          amount={cartTotal}
                          // @ts-ignore
                          buttonSizeMode="fill"
                          onClick={(e: any) => {
                            if (!validateForm()) {
                              if (e && e.preventDefault) e.preventDefault();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              throw new Error("Form incomplete");
                            }
                          }}
                          onPaymentSuccess={(paymentData) => {
                            handleGooglePayPayment(paymentData);
                          }}
                          onPaymentError={(error) => {
                            setError('Google Pay error: ' + error.message);
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Apple Pay */}
                    <div className="rounded-xl border-2 border-[#0A1628]/15 p-4 hover:border-black/30 transition-all">
                      <span className="text-[11px] font-bold text-gray-500 mb-2 block">Apple Pay</span>
                      <motion.button
                        onClick={() => handleSubmit('apple-pay')}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        disabled={!termsAccepted || loading}
                        className="w-full p-3 bg-black text-white font-bold rounded-lg flex items-center justify-center gap-2 h-[42px] hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>
                        Pay with Apple Pay
                      </motion.button>
                    </div>
                  </div>

                  {/* PayPal */}
                  <div className={`rounded-xl border-2 border-[#0A1628]/15 p-4 mb-6 hover:border-[#003087]/30 transition-all ${!termsAccepted ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="text-[11px] font-bold text-gray-500 mb-2 block">PayPal</span>
                    {termsAccepted && cartTotal > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClickCapture={(e) => {
                          if (!validateForm()) {
                            e.preventDefault();
                            e.stopPropagation();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                      >
                        <PayPalButton
                          key={`paypal-${cartTotal}`}
                          amount={cartTotal}
                          onSuccess={handlePayPalPayment}
                          onError={handlePayPalError}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Share / Save Quote */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const params = new URLSearchParams({
                          zip: formData.shippingZip || '',
                          type: selectedDumpsterType || '',
                          size: String(selectedSize || ''),
                          days: String(booking.rentalPeriod || 7),
                        });
                        const url = `${window.location.origin}/booking/order?${params.toString()}`;
                        navigator.clipboard.writeText(url).then(() => {
                          setQuoteCopied(true);
                          setTimeout(() => setQuoteCopied(false), 2500);
                        });
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#0A1628] border-2 border-[#0A1628]/20 rounded-xl hover:border-[#DAA520] hover:text-[#DAA520] transition-all"
                    >
                      {quoteCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                      {quoteCopied ? 'Quote link copied!' : 'Share / Save My Quote'}
                    </button>
                  </div>

                </div>
              ) : (
                <div className="mb-8 p-6 bg-[#f9fafb] border-2 border-dashed border-[#0A1628]/20 rounded-xl text-center">
                  <h3 className="text-lg font-bold text-[#0A1628] mb-2">Complete Billing Information</h3>
                  <p className="text-sm text-[#0A1628]/70">Please provide your Full Name, Email, and Phone number above to unlock payment options.</p>
                </div>
              )}
              {/* Action Buttons */}

            </motion.div>

          </div>
          <div className="w-full lg:w-[35%] hidden lg:block">

            <div className="mt-5 bg-zinc-100 text-black rounded-2xl p-4 md:p-6 ">
              <ItemsAdder
                dumpsterTypes={dbDumpsterTypes.map(t => ({ id: t.id, name: t.name, sizes: t.sizes.map((s: any) => ({ value: s.value, id: s.id })) }))}
                sizes={Array.from(new Map(dbDumpsterTypes.flatMap(t => t.sizes).map((s: any) => [s.value, { value: s.value, id: s.id }])).values())}
                selectedIndex={selectedIndex}
                onSelect={(idx) => setSelectedIndex(idx)}
                cartTotal={cartTotal}
                itemPrices={itemPrices}
                cartBreakdown={cartBreakdown}
                accountCreation={accountCreation}
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
                    dumpsterSizeId: addedSizeObj?.id,
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

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </main >
  );
}
