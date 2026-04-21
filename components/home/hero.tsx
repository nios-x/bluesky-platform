"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBooking } from "@/contexts/booking-context";
import { PROJECT_TYPES, MATERIAL_TYPES } from "@/lib/constants/booking";

const dumpsterTypes = [
  {
    id: "roll-off",
    name: "Roll-off Dumpsters",
    description: "Perfect for large construction projects, home renovations",
    image: "/images/roll-off-dumpster.png",
    sizes: [
      { value: 10, label: "10 Yard", price: 435 },
      { value: 20, label: "20 Yard", price: 455 },
      { value: 30, label: "30 Yard", price: 475 },
      { value: 40, label: "40 Yard", price: 555 }
    ]
  },
  {
    id: "rubber-wheel",
    name: "Rubber-wheeled Dumpsters",
    description: "Ideal for residential driveways and surface protection",
    image: "/images/rubber-wheel-dumpster.png",
    sizes: [
      { value: 10, label: "10 Yard", price: 445 },
      { value: 20, label: "20 Yard", price: 525 },
      { value: 30, label: "30 Yard", price: 655 }
    ]
  },
  {
    id: "front-load",
    name: "Front Load Dumpsters",
    description: "Commercial-grade for businesses and multi-unit properties",
    image: "/images/permanent-dumpster.png",
    sizes: [
      { value: 2, label: "2 Yard", price: 250 },
      { value: 4, label: "4 Yard", price: 350 },
      { value: 6, label: "6 Yard", price: 450 },
      { value: 8, label: "8 Yard", price: 550 }
    ]
  }
];

export function Hero() {
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

  // Find selected dumpster type and size
  const selectedDumpsterType = dumpsterTypes.find(type => type.id === dumpsterType);
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
    updateBooking({
      zipCode,
      dumpsterType,
      dumpsterSize,
      deliveryDate,
      rentalPeriod: 7, // Default 7 days
      basePrice: selectedSize?.price || 0,
      totalPrice: selectedSize?.price || 0,
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
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#142A52] mb-2">1. ZIP Code or Address</label>
              <input
                type="number"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="e.g., 48001 or full address"
                style={{"scrollbarColor":"transparent"}}
                className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none transition"
              />
            </div>

            {/* Dumpster Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#142A52] mb-3">2. Type of Dumpster</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dumpsterTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setDumpsterType(type.id);
                      setDumpsterSize(null); // Reset size when type changes
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      dumpsterType === type.id
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
                      
            {/* Delivery Date */}
            <div className="mb-6 w-[48%]">
              <label className="block text-sm font-bold text-[#142A52] mb-2">{dumpsterType?"4":"3"}. Delivery Date</label>
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
          </div>
            <div className="flex justify-between flex-wrap gap-6">
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
              <div className="mb-6 w-[48%]">
                <label className="block text-sm font-bold text-[#142A52] mb-2">Project Type</label>
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


