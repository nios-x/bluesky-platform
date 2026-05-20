"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBooking } from "@/contexts/booking-context";
import { PROJECT_TYPES, MATERIAL_TYPES } from "@/lib/constants/booking";

import { SmartRecommendationModal } from "@/components/ai/SmartRecommendationModal";
import { useSmartRecommendationModal } from "@/hooks/use-smart-recommendation-modal";
import { Zap } from "lucide-react";


const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export function Hero() {
  const [dbDumpsterTypes, setDbDumpsterTypes] = useState<any[]>([]);

  useEffect(() => {
    const fetchFromDB = async () => {
      try {
        const response = await fetch('/api/pricing/dumpsters');
        const data = await response.json();

        if (!data.dumpsters || !Array.isArray(data.dumpsters)) {
          console.error('Invalid dumpster data:', data);
          return;
        }

        const typesMap: Record<string, any> = {};

        data.dumpsters.forEach((d: any) => {
          const typeId = d.dumpster_types?.id;
          if (!typeId) return;

          if (!typesMap[typeId]) {
            typesMap[typeId] = {
              id: typeId,
              name: d.dumpster_types.name,
              description: d.dumpster_types.description,
              image: d.dumpster_types.name.includes("Rubber") ? "/Dumpster/Rubber-wheeled Dumpsters/20 Yard Rubber tire trailor (4)@1.5x.jpg" : d.dumpster_types.name.includes("Permanent") ? "/Dumpster/Permanent Dumpsters/2 yard front load dumpster (3)@1.5x.jpg" : "/Dumpster/Roll-off Dumpsters/10 yard roll off 1@1.5x.jpg",
              sizes: []
            };
          }

          const sizeValMatch = d.dumpster_sizes?.label?.match(/^(\d+)/);
          const sizeVal = sizeValMatch ? parseInt(sizeValMatch[1], 10) : 0;
          if (sizeVal === 0) return;

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
        console.error('Failed to fetch dumpster types:', err);
      }
    };
    fetchFromDB();
  }, []);
  const [zipCode, setZipCode] = useState("");
  const [dumpsterType, setDumpsterType] = useState("");
  const [dumpsterSize, setDumpsterSize] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [removalDate, setRemovalDate] = useState("");
  const [searchError, setSearchError] = useState("");
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const [showRemovalCalendar, setShowRemovalCalendar] = useState(false);
  const router = useRouter();
  const { updateBooking } = useBooking();
  const { isOpen, openModal, closeModal } = useSmartRecommendationModal();
  const [deliveryDateObj, setDeliveryDateObj] = useState<Date | undefined>(undefined);
  const [removalDateObj, setRemovalDateObj] = useState<Date | undefined>(undefined);
  const [projectType, setProjectType] = useState("");
  const [describeProject, setDescribeProject] = useState("");

  // Business logic: heavy material / masonry restrictions
  const isHeavyProjectType = (pt: string) => {
    if (!pt) return false;
    const s = pt.toLowerCase();
    return s.includes("mason") || s.includes("masonry") || s.includes("concrete") || s.includes("brick") || s.includes("rock") || s.includes("dirt");
  };

  const isDirtOnlyProject = (pt: string) => {
    if (!pt) return false;
    const s = pt.toLowerCase();
    return s === "dirt" || s.includes("dirt");
  };

  const [locationQuery, setLocationQuery] = useState("");
  // Combined results: local LOCATIONS matches + Google Places predictions
  type LocalLocationResult = { type: "local"; zip: string; city: string; state: string };
  type GoogleLocationResult = { type: "google"; place_id: string; description: string };
  type LocationResult = LocalLocationResult | GoogleLocationResult;

  const [combinedResults, setCombinedResults] = useState<LocationResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce timer & race condition guard
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestId = useRef(0);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Stored parsed address parts from selected location (to pass to step-1)
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  // === Server-side search via /api/locations/search ===
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocationQuery(query);

    // Reset zip and address state when user edits
    setZipCode("");
    setSelectedCity("");
    setSelectedState("");
    setSelectedStreet("");
    setSelectedAddress("");

    // Clear previous debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!query.trim()) {
      setCombinedResults([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    // Debounce API call (300ms)
    setIsSearching(true);
    setIsDropdownOpen(true);

    debounceTimer.current = setTimeout(async () => {
      const currentRequestId = ++searchRequestId.current;

      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search API failed");

        // Race condition guard: discard if a newer search was triggered
        if (currentRequestId !== searchRequestId.current) return;

        const data = await res.json();

        const localResults: LocalLocationResult[] = (data.localResults || []).map((r: any) => ({
          type: "local" as const,
          zip: r.zip,
          city: r.city,
          state: r.state,
        }));

        const googleResults: GoogleLocationResult[] = (data.googleResults || []).map((r: any) => ({
          type: "google" as const,
          place_id: r.place_id,
          description: r.description,
        }));

        const combined: LocationResult[] = [...localResults, ...googleResults];
        setCombinedResults(combined);
        setIsDropdownOpen(combined.length > 0);
      } catch (err) {
        console.error("Location search error:", err);
      } finally {
        if (currentRequestId === searchRequestId.current) {
          setIsSearching(false);
        }
      }
    }, 300);
  };

  // === Local area selection (city/state/zip quick-pick) ===
  const handleLocalSelect = (loc: LocalLocationResult) => {
    const display = `${loc.city}, ${loc.state} ${loc.zip}`;
    setLocationQuery(display);
    setZipCode(loc.zip);
    setSelectedCity(loc.city);
    setSelectedState(loc.state);
    setSelectedStreet("");
    setSelectedAddress(display);
    setIsDropdownOpen(false);
  };

  // === Google Place selection — fetch details from server-side API ===
  const handleGoogleSelect = async (result: GoogleLocationResult) => {
    setLocationQuery(result.description);
    setSelectedAddress(result.description);
    setIsDropdownOpen(false);

    try {
      const res = await fetch(`/api/locations/details?placeId=${encodeURIComponent(result.place_id)}`);
      if (!res.ok) return;

      const details = await res.json();

      if (details.zip) setZipCode(details.zip);
      if (details.city) setSelectedCity(details.city);
      if (details.state) setSelectedState(details.state);
      if (details.street) setSelectedStreet(details.street);
    } catch (err) {
      console.error("Place details error:", err);
    }
  };

  const handleLocationResultSelect = (result: LocationResult) => {
    if (result.type === "local") {
      handleLocalSelect(result);
    } else {
      handleGoogleSelect(result);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isDropdownOpen && combinedResults.length > 0) {
      e.preventDefault();
      handleLocationResultSelect(combinedResults[0]);
    }
  };

  // Find selected dumpster type and size
  const selectedDumpsterType = dbDumpsterTypes.find(type => type.id === dumpsterType);
  const selectedSize = selectedDumpsterType?.sizes.find(size => size.value === dumpsterSize);
  const isRubber = selectedDumpsterType?.name?.includes("Rubber") || false;
  const freeDays = isRubber ? 14 : 7;

  // Enforce restrictions when project type changes
  useEffect(() => {
    const heavy = isHeavyProjectType(projectType);
    if (!heavy) return;

    // Prefer roll-off dumpster type
    const rollType = dbDumpsterTypes.find(t => /roll/i.test(t.name));
    if (rollType && dumpsterType !== rollType.id) {
      setDumpsterType(rollType.id);
      setDumpsterSize(10);
    }
    // If current selected size isn't 10, enforce 10yd
    if (selectedSize && selectedSize.value !== 10) {
      setDumpsterSize(10);
    }
  }, [projectType, dbDumpsterTypes]);

  // Price calculations
  const SHIPPING_PRICE = 200;
  // Special-case: Dirt-only 10yd price override
  const basePrice = ((): number => {
    if (isDirtOnlyProject(projectType) && selectedSize && selectedSize.value === 10 && selectedDumpsterType?.name?.toLowerCase().includes("roll")) {
      return 625; // Dirt-only flat price for 10yd
    }
    return selectedSize?.price || 0;
  })();

  let totalDays = 0;
  if (deliveryDate && removalDate) {
    const timeDiff = parseLocalDate(removalDate).getTime() - parseLocalDate(deliveryDate).getTime();
    totalDays = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }

  const extraDays = Math.max(0, totalDays - freeDays);
  const extraRentalCharges = extraDays * 25;
  const totalPrice = basePrice + SHIPPING_PRICE + extraRentalCharges;

  // Set default removal date when delivery date changes
  useEffect(() => {
    if (deliveryDate && !removalDateObj) {
      const delivery = parseLocalDate(deliveryDate);
      const defaultRemoval = new Date(delivery);
      const daysToAdd = isRubber ? 7 : 14; // Roll-Off: 14d free, Rubber: 7d free
      defaultRemoval.setDate(defaultRemoval.getDate() + daysToAdd);

      // Skip weekends for removal date
      if (defaultRemoval.getDay() === 0) { // Sunday
        defaultRemoval.setDate(defaultRemoval.getDate() + 1);
      } else if (defaultRemoval.getDay() === 6) { // Saturday
        defaultRemoval.setDate(defaultRemoval.getDate() + 2);
      }

      setRemovalDateObj(defaultRemoval);
      setRemovalDate(formatLocalDate(defaultRemoval));
    }
  }, [deliveryDate, removalDateObj, isRubber]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Exclude weekends
        dates.push(date.toISOString().split("T")[0]);
      }
    }
    return dates;
  };

  // ===== PROGRESSIVE REVEAL COMPLETION STATES =====
  const isStep1Done = !!zipCode;
  const isStep2Done = !!dumpsterType;
  const isStep3Done = !!dumpsterSize;
  const isStep4Done = !!projectType;
  const isStep5Done = !!deliveryDate;
  const isStep6Done = !!removalDate;

  // Determine what steps should be visible
  const showStep2 = isStep1Done;
  const showStep34 = isStep2Done;
  const showStep56 = isStep3Done && isStep4Done;

  // Dynamic button text based on completion
  const getButtonText = () => {
    if (!isStep1Done) return "Enter Location →";
    if (!isStep2Done) return "Select Dumpster Type →";
    if (!isStep3Done || !isStep4Done) return "Continue →";
    if (!isStep5Done || !isStep6Done) return "Pick Dates →";
    return "📅 Book Now →";
  };

  const handleStartBooking = () => {
    setSearchError("");

    if (!zipCode.trim()) {
      setSearchError("Please enter a zip code");
      return;
    }

    if (!dumpsterType) {
      setSearchError("Please select a dumpster type");
      return;
    }

    if (!dumpsterSize) {
      setSearchError("Please select a dumpster size");
      return;
    }

    if (!deliveryDate) {
      setSearchError("Please select a delivery date");
      return;
    }

    // Update booking context with address + booking details
    updateBooking(0, {
      zipCode,
      address: selectedAddress || locationQuery,
      city: selectedCity,
      state: selectedState,
      shippingStreet: selectedStreet,
      dumpsterType,
      dumpsterSize: dumpsterSize!,
      deliveryDate,
      rentalPeriod: totalDays,
      projectType,
      projectDescription: describeProject,
      basePrice: selectedSize?.price || 0,
      surcharges: extraRentalCharges,
      totalPrice: totalPrice,
    });

    // Navigate to booking page
    router.push("/booking/step-1");
  };

  const handleHelpMeChoose = () => {
    setSearchError("");
    // Open AI recommendation modal without requiring ZIP code
    // User can enter ZIP code inside the modal if needed
    openModal();
  };

  return (
    <section className="relative min-h-[700px] lg:min-h-[900px] flex items-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute justify-center inset-0 w-full h-full">
        <img
          src="/Dumpster/hero.png"
          alt="Blue Sky Disposal Services"
          className="w-full h-full object-cover brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#142A52]/70 via-[#142A52]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
          Book a Dumpster in Seconds - Anywhere in Michigan
        </h1>

        <p className="text-lg text-white/95 mb-12 drop-shadow-lg">
          Instantly compare dumpster types and sizes, get an estimate, and schedule delivery.
        </p>

        {/* Booking Box */}
        <div className="max-w-4xl scale-[0.95] mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-left border-4 border-[#C89B2B]">

            <div className=" p-6 sm:p-8 bg-white text-center">
              <h1 className="text-2xl sm:text-3xl md:text-xl font-bold text-gray-900">
                Get Instant Pricing and Availability
              </h1>
            </div>
            {/* Zip Code */}
            <div className="mb-6 relative">
              <label className="block text-sm font-bold text-[#142A52] mb-2">1. Enter Delivery Address</label>
              <input
                type="text"
                value={locationQuery}
                onChange={handleLocationChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (locationQuery.length > 0 && combinedResults.length > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                placeholder="Type city or zip code"
                className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none transition h-auto text-base"
              />
              {isDropdownOpen && (combinedResults.length > 0 || isSearching) && (() => {
                const localResults = combinedResults.filter((r): r is LocalLocationResult => r.type === "local");
                const googleResults = combinedResults.filter((r): r is GoogleLocationResult => r.type === "google");
                return (
                  <ul className="absolute z-50 w-full mt-1 bg-white border-2 border-[#142A52]/10 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                    {/* Full Google address suggestions */}
                    {googleResults.length > 0 && (
                      <>
                        <li className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-[#142A52]/40 font-bold bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
                          Address suggestions
                        </li>
                        {googleResults.map((result, index) => (
                          <li
                            key={`google-${result.place_id}-${index}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleLocationResultSelect(result);
                            }}
                            className="px-4 py-2.5 hover:bg-[#C89B2B]/10 cursor-pointer text-sm text-[#142A52] border-b border-gray-50 last:border-0 transition-colors flex items-center gap-2"
                          >
                            <span className="text-[#142A52]/40 text-xs flex-shrink-0">🔍</span>
                            <span className="truncate">{result.description}</span>
                          </li>
                        ))}
                      </>
                    )}
                    {/* Local area quick-picks */}

                    {localResults.length > 0 && (
                      <>
                        <li className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-[#142A52]/40 font-bold bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
                          Areas matching your search
                        </li>
                        {localResults.map((result) => (
                          <li
                            key={`local-${result.zip}-${result.city}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleLocationResultSelect(result);
                            }}
                            className="px-4 py-2.5 hover:bg-[#C89B2B]/10 cursor-pointer text-sm text-[#142A52] border-b border-gray-50 transition-colors flex items-center gap-2"
                          >
                            <span className="text-[#C89B2B] text-xs flex-shrink-0">📍</span>
                            <span>
                              <span className="font-semibold">{result.city}</span>
                              <span className="text-[#142A52]/60">, {result.state}</span>
                              <span className="ml-2 text-xs bg-[#142A52]/10 px-1.5 py-0.5 rounded font-mono">{result.zip}</span>
                            </span>
                          </li>
                        ))}
                      </>
                    )}



                    {/* Loading indicator while Google results are being fetched */}
                    {isSearching && (
                      <li className="px-4 py-2.5 text-xs text-[#142A52]/50 flex items-center gap-2 border-t border-gray-100">
                        <span className="inline-block w-3 h-3 border-2 border-[#C89B2B]/40 border-t-[#C89B2B] rounded-full animate-spin" />
                        Loading more suggestions…
                      </li>
                    )}

                    {/* No results message */}
                    {!isSearching && localResults.length === 0 && googleResults.length === 0 && (
                      <li className="px-4 py-3 text-sm text-[#142A52]/50 text-center">
                        No locations found. Try a different zip code or city name.
                      </li>
                    )}
                  </ul>
                );
              })()}
            </div>

            {/* Dumpster Type Selection - Shows only after location is set */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${showStep2
                ? "max-h-[500px] opacity-100 mb-6"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#142A52] mb-3">2. Type of Dumpster</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(() => {
                    const heavy = isHeavyProjectType(projectType);
                    const visibleTypes = heavy
                      ? dbDumpsterTypes.filter(t => /roll/i.test(t.name))
                      : dbDumpsterTypes;
                    return visibleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setDumpsterType(type.id);
                          setDumpsterSize(null); // Reset size when type changes
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${dumpsterType === type.id
                          ? "border-[#C89B2B] bg-[#C89B2B]/10"
                          : "border-[#142A52]/30 hover:border-[#C89B2B]/50"
                          }`}
                      >
                        <div className="flex justify-center items-center w-full h-20 overflow-hidden rounded-xl mb-2">
                          <img
                            src={type.image}
                            alt={type.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="font-bold text-[#142A52] text-sm">{type.name}</h3>
                        <p className="text-xs text-[#142A52]/70">{type.description || type.name}</p>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </div>
            {/* Step 3 & 4: Size & Project Type - Shows only after dumpster type is selected */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${showStep34
                ? "max-h-[300px] opacity-100 mb-6"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="flex justify-between flex-wrap gap-6">
                {/* Dumpster Size Selection */}
                <div className="mb-6 w-full md:w-[48%]">
                  <label className="block text-sm font-bold text-[#142A52] mb-2">
                    3. Size of Dumpster
                  </label>
                  <Select
                    value={dumpsterSize?.toString()}
                    onValueChange={(value) => setDumpsterSize(parseInt(value))}
                  >
                    <SelectTrigger className="w-full border-2 border-[#142A52]/30 focus:border-[#C89B2B]">
                      <SelectValue placeholder="Select dumpster size" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const heavy = isHeavyProjectType(projectType);
                        const availableSizes = heavy
                          ? selectedDumpsterType?.sizes.filter((s: any) => s.value === 10) || []
                          : selectedDumpsterType?.sizes || [];
                        return availableSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value.toString()}>
                            {size.label}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Type Selection */}
                <div className="mb-6 w-full md:w-[48%]">
                  <label className="block text-sm font-bold text-[#142A52] mb-2">
                    4. Project Type
                  </label>
                  <Select value={projectType} onValueChange={(val) => {
                    setProjectType(val);
                    setDescribeProject(""); // Reset description when type changes
                  }}>
                    <SelectTrigger className="w-full border-2 border-[#142A52]/30 focus:border-[#C89B2B]">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Free-text description for 'Not Sure Yet' or 'Other Project' */}
              {(projectType === "Not Sure Yet" || projectType === "Other Project") && (
                <div className="mb-6 w-full">
                  <label className="block text-sm font-bold text-[#142A52] mb-2">
                    Describe what you are throwing away
                  </label>
                  <textarea
                    value={describeProject}
                    onChange={(e) => setDescribeProject(e.target.value)}
                    placeholder="E.g., mix of old furniture, boxes, and household items"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none transition"
                  />
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={handleHelpMeChoose}
                      className="text-sm text-[#C89B2B] font-semibold hover:underline"
                    >
                      Or chat with our AI Dumpster Expert →
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Heavy material explanatory message */}
            {isHeavyProjectType(projectType) && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                <strong>Due to weight restrictions</strong>: only 10yd Roll-Off dumpsters are available for heavy materials such as dirt, concrete, brick, and masonry.
                {isDirtOnlyProject(projectType) && (
                  <div className="mt-2 text-sm text-yellow-900">
                    Special pricing: 10yd dirt-only option available at $625.
                  </div>
                )}
              </div>
            )}

            {/* Step 5 & 6: Delivery & Removal Dates - Shows only after size and project type are selected */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${showStep56
                ? "max-h-[600px] opacity-100 mb-6"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="flex justify-between flex-wrap gap-6">
                {/* Delivery Date */}
                <div className="mb-6 w-full md:w-[48%]">
                  <label className="block text-sm font-bold text-[#142A52] mb-2">
                    5. Delivery Date
                  </label>
                  <Popover
                    open={showDeliveryCalendar}
                    onOpenChange={setShowDeliveryCalendar}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-2 border-[#142A52]/30 hover:border-[#C89B2B] h-10"
                      >
                        {deliveryDate
                          ? parseLocalDate(deliveryDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                          : "Select delivery date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deliveryDateObj}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            setDeliveryDateObj(selectedDate);
                            setDeliveryDate(formatLocalDate(selectedDate));
                            setShowDeliveryCalendar(false);
                            // Reset removal date when delivery date changes
                            setRemovalDateObj(undefined);
                            setRemovalDate("");
                          }
                        }}
                        className="rounded-lg border"
                        disabled={(date) => {
                          // Disable dates before today
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          if (date < today) return true;

                          const dayOfWeek = date.getDay();
                          return dayOfWeek === 0 || dayOfWeek === 6; // Disable weekends
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Removal Date */}
                <div className="mb-6 w-full md:w-[48%]">
                  <label className="block text-sm font-bold text-[#142A52] mb-2">
                    6. Removal Date ({isRubber ? "7" : "14"} days free, $25/day after)
                  </label>
                  <Popover
                    open={showRemovalCalendar}
                    onOpenChange={setShowRemovalCalendar}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-2 border-[#142A52]/30 hover:border-[#C89B2B] h-10"
                      >
                        {removalDate
                          ? parseLocalDate(removalDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                          : "Select removal date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={removalDateObj}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            setRemovalDateObj(selectedDate);
                            setRemovalDate(formatLocalDate(selectedDate));
                            setShowRemovalCalendar(false);
                          }
                        }}
                        className="rounded-lg border"
                        disabled={(date) => {
                          const dayOfWeek = date.getDay();
                          // Disable weekends
                          if (dayOfWeek === 0 || dayOfWeek === 6) return true;
                          // Disable dates before delivery date
                          if (deliveryDate && date < parseLocalDate(deliveryDate))
                            return true;
                          // Disable dates more than 30 days from delivery
                          if (deliveryDate) {
                            const deliveryDateObj = parseLocalDate(deliveryDate);
                            const maxDate = new Date(deliveryDateObj);
                            maxDate.setDate(maxDate.getDate() + 30);
                            if (date > maxDate) return true;
                          }
                          return false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-[#142A52]/60 mt-1">
                    {isRubber ? "7" : "14"} days free rental included. Additional days: $25 per day.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Summary Card */}
            {selectedSize && removalDate && (
              <div className="mb-8 bg-gradient-to-br from-[#142A52] via-[#1a3a6f] to-[#0f1f3a] text-white rounded-2xl shadow-xl p-6 border border-[#C89B2B]/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Order Summary</h3>
                  <Zap className="w-5 h-5 text-[#C89B2B]" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/80">Base Price</span>
                    <span className="font-bold text-white">${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/80">Shipping & Delivery</span>
                    <span className="font-bold text-white">${SHIPPING_PRICE.toFixed(2)}</span>
                  </div>
                  {extraDays > 0 && (
                    <div className="flex justify-between items-center text-sm text-[#C89B2B]">
                      <span>Extra Rental Charges ({extraDays} days)</span>
                      <span className="font-bold">${extraRentalCharges.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/20">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#C89B2B]">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-white/60 mt-3">
                  💡 Includes dumpster base price, shipping, and extra rental periods.
                </p>
              </div>
            )}

            {searchError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                {searchError}
              </div>
            )}

            {/* Action Buttons - Always visible, with dynamic text */}
            <div className="mb-3">
              <button
                onClick={handleStartBooking}
                disabled={!isStep1Done || !isStep2Done || !isStep3Done || !isStep4Done || !isStep5Done || !isStep6Done}
                className={`w-full font-bold py-4 rounded-lg transition-all shadow-lg text-lg flex items-center justify-center gap-2 ${isStep1Done && isStep2Done && isStep3Done && isStep4Done && isStep5Done && isStep6Done
                  ? "bg-gradient-to-r from-[#142A52] to-[#C89B2B] hover:from-[#1a3a6e] hover:to-[#d4a835] text-white"
                  : "bg-gradient-to-r from-[#142A52]/60 to-[#C89B2B]/60 text-white/80 cursor-not-allowed"
                  }`}
              >
                Get My Price →
              </button>
            </div>
            <div className="text-center text-xs text-[#142A52]/70">
              Need help choosing? <button onClick={handleHelpMeChoose} className="font-semibold text-[#C89B2B] hover:underline">Meet Our Dumpster Expert</button>
            </div>

            <p className="text-xs text-[#142A52]/60 text-center mt-4">
              💰 Create an account and get $20 OFF your first order
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendation Modal */}
      <SmartRecommendationModal isOpen={isOpen} onClose={closeModal} initialZipCode={zipCode} />
    </section>
  );
}