"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBooking } from "@/contexts/booking-context";
import { PROJECT_TYPES, MATERIAL_TYPES } from "@/lib/constants/booking";
import { LOCATIONS } from "@/lib/constants/locations";


export function Hero() {
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
          
          if (!typesMap[typeId]) {
            typesMap[typeId] = {
              id: typeId,
              name: d.dumpster_types.name,
              description: d.dumpster_types.description,
              image: d.dumpster_types.name.includes("Rubber") ? "/images/rubber-wheel-dumpster.png" : d.dumpster_types.name.includes("Permanent") ? "/images/permanent-dumpster.png" : "/images/roll-off-dumpster.png",
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
        console.error(err);
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
  const [deliveryDateObj, setDeliveryDateObj] = useState<Date | undefined>(new Date());
  const [removalDateObj, setRemovalDateObj] = useState<Date | undefined>(undefined);
  const [projectType, setProjectType] = useState("");

  const [locationQuery, setLocationQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getMichiganZipCodesByCity = (query: string) => {
    if (!query) return [];
    return LOCATIONS.filter((loc: any) =>
      (loc.city && loc.city.toLowerCase().includes(query.toLowerCase())) ||
      (loc.zip && loc.zip.toLowerCase().includes(query.toLowerCase())) ||
      (loc.state && loc.state.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 10);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocationQuery(query);
    setZipCode(""); // Reset actual zip code until a valid location is explicitly selected
    if (query.trim().length > 0) {
      setFilteredLocations(getMichiganZipCodesByCity(query));
      setIsDropdownOpen(true);
    } else {
      setFilteredLocations([]);
      setIsDropdownOpen(false);
    }
  };

  const handleLocationSelect = (loc: any) => {
    const displayValue = `${loc.zip}, ${loc.city}, ${loc.state || 'MI'}`;
    setLocationQuery(displayValue);
    setZipCode(loc.zip);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isDropdownOpen && filteredLocations.length > 0) {
      e.preventDefault();
      handleLocationSelect(filteredLocations[0]);
    }
  };

  // Find selected dumpster type and size
  const selectedDumpsterType = dbDumpsterTypes.find(type => type.id === dumpsterType);
  const selectedSize = selectedDumpsterType?.sizes.find(size => size.value === dumpsterSize);

  // Price calculations
  const SHIPPING_PRICE = 200;
  const basePrice = selectedSize?.price || 0;
  const totalPrice = basePrice + SHIPPING_PRICE;

  // Set default removal date when delivery date changes
  useEffect(() => {
    if (deliveryDate && !removalDateObj) {
      const delivery = new Date(deliveryDate);
      const defaultRemoval = new Date(delivery);
      defaultRemoval.setDate(defaultRemoval.getDate() + 7);

      // Skip weekends for removal date
      if (defaultRemoval.getDay() === 0) { // Sunday
        defaultRemoval.setDate(defaultRemoval.getDate() + 1);
      } else if (defaultRemoval.getDay() === 6) { // Saturday
        defaultRemoval.setDate(defaultRemoval.getDate() + 2);
      }

      setRemovalDateObj(defaultRemoval);
      setRemovalDate(defaultRemoval.toISOString().split("T")[0]);
    }
  }, [deliveryDate, removalDateObj]);

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

    // Update booking context
    updateBooking(0, {
      zipCode,
      dumpsterType,
      dumpsterSize: dumpsterSize!,
      deliveryDate,
      rentalPeriod: 7,
      projectType,
      basePrice: selectedSize?.price || 0,
      totalPrice: totalPrice,
    });
    
    // Navigate to booking page
    router.push("/booking/step-1");
  };

  const handleHelpMeChoose = () => {
    setSearchError("");

    if (!zipCode.trim()) {
      setSearchError("Please enter a zip code");
      return;
    }

    // Navigate to calculator section
    const calculatorElement = document.getElementById('smart-assessment');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[700px] lg:min-h-[900px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/Home_page_main.png"
          alt="Blue Sky Disposal Services"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#142A52]/80 via-[#142A52]/50 to-[#C89B2B]/10" />
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
            <h2 className="text-2xl font-bold text-[#142A52] mb-6">Book a Dumpster in 60 Seconds</h2>

            {/* Zip Code */}
            <div className="mb-6 relative">
              <label className="block text-sm font-bold text-[#142A52] mb-2">1. Select Location</label>
              <input
                type="text"
                value={locationQuery}
                onChange={handleLocationChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (locationQuery.length > 0) setIsDropdownOpen(true);
                }}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                placeholder="Type city or zip code"
                className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none transition h-auto text-base"
              />
              {isDropdownOpen && filteredLocations.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border-2 border-[#142A52]/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredLocations.map((loc: any, index: number) => (
                    <li
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input from losing focus
                        handleLocationSelect(loc);
                      }}
                      className="px-4 py-3 hover:bg-[#C89B2B]/10 cursor-pointer text-sm text-[#142A52] border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <span className="font-bold">{loc.zip}</span>, {loc.city}, {loc.state || 'MI'}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dumpster Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#142A52] mb-3">2. Type of Dumpster</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dbDumpsterTypes.map((type) => (
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
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <h3 className="font-bold text-[#142A52] text-sm">{type.name}</h3>
                    <p className="text-xs text-[#142A52]/70">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between flex-wrap gap-6">
              {/* Dumpster Size Selection */}

              <div className="mb-6 w-[48%]">
                <label className="block text-sm font-bold text-[#142A52] mb-2">3. Size of Dumpster</label>
                <Select value={dumpsterSize?.toString()} onValueChange={(value) => setDumpsterSize(parseInt(value))}>
                  <SelectTrigger className="w-full border-2 border-[#142A52]/30 focus:border-[#C89B2B]">
                    <SelectValue placeholder="Select dumpster size" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDumpsterType?.sizes.map((size) => (
                      <SelectItem key={size.value} value={size.value.toString()}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6 w-[48%]">
                <label className="block text-sm font-bold text-[#142A52] mb-2">4. Project Type</label>
                <Select value={projectType} onValueChange={setProjectType}>
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
            <div className="flex justify-between flex-wrap gap-6">
              {/* Delivery Date */}
              <div className="mb-6 w-[48%]">

                <label className="block text-sm font-bold text-[#142A52] mb-2">4. Delivery Date</label>
                <Popover open={showDeliveryCalendar} onOpenChange={setShowDeliveryCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-2 border-[#142A52]/30 hover:border-[#C89B2B] h-10"
                    >
                      {deliveryDate ? new Date(deliveryDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      }) : "Select delivery date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDateObj}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setDeliveryDateObj(selectedDate);
                          setDeliveryDate(selectedDate.toISOString().split("T")[0]);
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
              <div className="mb-6 w-[48%]">
                <label className="block text-sm font-bold text-[#142A52] mb-2">5. Removal Date (7 days free, $25/day after)</label>
                <Popover open={showRemovalCalendar} onOpenChange={setShowRemovalCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-2 border-[#142A52]/30 hover:border-[#C89B2B] h-10"
                    >
                      {removalDate ? new Date(removalDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      }) : "Select removal date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={removalDateObj}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setRemovalDateObj(selectedDate);
                          setRemovalDate(selectedDate.toISOString().split("T")[0]);
                          setShowRemovalCalendar(false);
                        }
                      }}
                      className="rounded-lg border"
                      disabled={(date) => {
                        const dayOfWeek = date.getDay();
                        // Disable weekends
                        if (dayOfWeek === 0 || dayOfWeek === 6) return true;
                        // Disable dates before delivery date
                        if (deliveryDate && date < new Date(deliveryDate)) return true;
                        // Disable dates more than 30 days from delivery
                        if (deliveryDate) {
                          const deliveryDateObj = new Date(deliveryDate);
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
                  7 days free rental included. Additional days: $25 per day.
                </p>
              </div>

            </div>

            {/* Price Breakdown */}
            {selectedSize && (
              <div className="mb-6 p-5 bg-[#fdfbf4] border border-[#142A52]/20 rounded-lg">
                <h5 className="mb-4 font-bold text-lg text-[#142A52]">Total Price Breakdown</h5>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#142A52]">Base Price</span>
                    <span className="font-bold text-[#142A52]">${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#142A52]">Shipping</span>
                    <span className="font-bold text-[#142A52]">${SHIPPING_PRICE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#ccc] pt-3 mt-3">
                    <span className="font-bold text-lg text-[#142A52]">Total Payable Amount</span>
                    <span className="font-bold text-lg text-[#cc7e00]">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {searchError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                {searchError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleHelpMeChoose}
                className="w-full bg-white border-2 border-[#142A52] text-[#142A52] font-bold py-4 rounded-lg transition-all shadow-md hover:bg-[#142A52]/5 text-lg flex items-center justify-center gap-2"
              >
                💡 Help Me Choose
              </button>
              <button
                onClick={handleStartBooking}
                className="w-full bg-gradient-to-r from-[#142A52] to-[#C89B2B] hover:from-[#1a3a6e] hover:to-[#d4a835] text-white font-bold py-4 rounded-lg transition-all shadow-lg text-lg flex items-center justify-center gap-2"
              >
                📅 Book Now →
              </button>
            </div>

            <p className="text-xs text-[#142A52]/60 text-center mt-4">
              💰 Create an account and get $20 OFF your first order
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
