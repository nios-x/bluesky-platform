"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { MapPin, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBooking } from "@/contexts/booking-context";
import { PROJECT_TYPES } from "@/lib/constants/booking";

const dumpsterTypes = [
  {
    id: "roll-off",
    name: "Roll-off",
    sizes: [
      { value: 10, label: "10 Yard", price: 435 },
      { value: 20, label: "20 Yard", price: 455 },
      { value: 30, label: "30 Yard", price: 475 },
      { value: 40, label: "40 Yard", price: 555 }
    ]
  },
  {
    id: "rubber-wheel",
    name: "Rubber-wheeled",
    sizes: [
      { value: 10, label: "10 Yard", price: 445 },
      { value: 20, label: "20 Yard", price: 525 },
      { value: 30, label: "30 Yard", price: 655 }
    ]
  },
  {
    id: "front-load",
    name: "Front Load",
    sizes: [
      { value: 2, label: "2 Yard", price: 250 },
      { value: 4, label: "4 Yard", price: 350 },
      { value: 6, label: "6 Yard", price: 450 },
      { value: 8, label: "8 Yard", price: 550 }
    ]
  }
];

export function HeroNew() {
  const [zipCode, setZipCode] = useState("");
  const [dumpsterType, setDumpsterType] = useState("roll-off");
  const [dumpsterSize, setDumpsterSize] = useState<number | null>(20);
  const [projectType, setProjectType] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [removalDate, setRemovalDate] = useState("");
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const [showRemovalCalendar, setShowRemovalCalendar] = useState(false);
  const [deliveryDateObj, setDeliveryDateObj] = useState<Date | undefined>(new Date());
  const [removalDateObj, setRemovalDateObj] = useState<Date | undefined>(undefined);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const router = useRouter();
  const { updateBooking } = useBooking();

  const subheadingText = "Instantly Compare Sizes, Get an Estimate, & Schedule Delivery.";
  const words = useMemo(() => subheadingText.split(" "), [subheadingText]);

  // Word-by-word animation
  useEffect(() => {
    if (isResetting) return;

    if (displayedWords.length < words.length) {
      const timer = setTimeout(() => {
        setDisplayedWords((prev) => [...prev, words[prev.length]]);
      }, 200);
      return () => clearTimeout(timer);
    }

    const pauseTimer = setTimeout(() => {
      setIsResetting(true);
      setDisplayedWords([]);
      setTimeout(() => setIsResetting(false), 300);
    }, 1200);

    return () => clearTimeout(pauseTimer);
  }, [displayedWords.length, isResetting, words]);

  // Set default removal date when delivery date changes
  useEffect(() => {
    if (deliveryDate && !removalDateObj) {
      const delivery = new Date(deliveryDate);
      const defaultRemoval = new Date(delivery);
      defaultRemoval.setDate(defaultRemoval.getDate() + 7);

      if (defaultRemoval.getDay() === 0) {
        defaultRemoval.setDate(defaultRemoval.getDate() + 1);
      } else if (defaultRemoval.getDay() === 6) {
        defaultRemoval.setDate(defaultRemoval.getDate() + 2);
      }

      setRemovalDateObj(defaultRemoval);
      setRemovalDate(defaultRemoval.toISOString().split("T")[0]);
    }
  }, [deliveryDate, removalDateObj]);

  const SHIPPING_PRICE = 200;
  const selectedDumpsterType = dumpsterTypes.find(type => type.id === dumpsterType);
  const selectedSizeObj = selectedDumpsterType?.sizes.find(size => size.value === dumpsterSize);
  const basePrice = selectedSizeObj?.price || 0;
  const totalPrice = basePrice > 0 ? basePrice + SHIPPING_PRICE : 0;

  const dumpsterOptions = [
    { size: 10, label: "10 Yard", price: "$435", capacity: "2,500-3,500 lbs", best: "Small projects" },
    { size: 20, label: "20 Yard", price: "$455", capacity: "6,000-8,000 lbs", best: "Renovations" },
    { size: 30, label: "30 Yard", price: "$475", capacity: "9,000-12,000 lbs", best: "Large projects" },
    { size: 40, label: "40 Yard", price: "$555", capacity: "12,000-16,000 lbs", best: "Major construction" }
  ];

  const handleBooking = () => {
    setBookingError("");

    if (!zipCode.trim()) {
      setBookingError("Please enter a zip code");
      return;
    }

    if (/^\d+$/.test(zipCode.trim()) && zipCode.trim().length !== 5) {
      setBookingError("Please enter a valid 5-digit zip code");
      return;
    }

    if (!dumpsterType) {
      setBookingError("Please select a dumpster type");
      return;
    }

    if (!dumpsterSize) {
      setBookingError("Please select a dumpster size");
      return;
    }

    if (!deliveryDate) {
      setBookingError("Please select a delivery date");
      return;
    }

    updateBooking(0, {
      zipCode,
      dumpsterType,
      dumpsterSize: dumpsterSize!,
      deliveryDate,
      rentalPeriod: 7,
      projectType,
      basePrice,
      totalPrice,
    });

    router.push("/booking/order");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBooking();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/Dumpster/hero.png"
          alt="Blue Sky Disposal"
          className="w-full h-full object-cover object-[center_75%]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 via-[#1B3A6B]/55 to-[#0A1628]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Book a Dumpster in Seconds
          </h1>
          <div className="text-xl text-white/95 drop-shadow-lg min-h-[32px] flex flex-wrap justify-center gap-2">
            {displayedWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Main Layout: Sizes + Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Dumpster Sizes */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Select Your Dumpster Size</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dumpsterOptions.map((option) => (
                <motion.button
                  key={option.size}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setDumpsterType("roll-off");
                    setDumpsterSize(option.size);
                  }}
                  className={`rounded-2xl p-5 transition-all transform text-left ${dumpsterType === "roll-off" && dumpsterSize === option.size
                      ? "bg-gradient-to-br from-[#B8860B] to-[#DAA520] text-[#0A1628] shadow-2xl ring-4 ring-[#FFD700]"
                      : "bg-white/95 text-slate-900 hover:shadow-xl hover:bg-white"
                    }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{option.label}</h3>
                      <p className="text-sm opacity-75 font-medium">{option.best}</p>
                    </div>
                    {dumpsterType === "roll-off" && dumpsterSize === option.size && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-2xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                  <div className="border-t border-opacity-20 border-current pt-3">
                    <p className="text-2xl font-black mb-1">{option.price}</p>
                    <p className="text-xs opacity-75">{option.capacity}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Quick Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 sticky top-24 space-y-5 border-2 border-white">
              {/* Header */}
              <motion.div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Quick Booking</h3>
              </motion.div>

              {/* Zip Code Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                {/* Zip & Project Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Zip Code</label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => {
                          setZipCode(e.target.value);
                          setBookingError("");
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Zip code"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-slate-300 focus:border-[#0A1628] focus:ring-2 focus:ring-[#0A1628]/20 outline-none text-slate-900 font-medium transition-all text-sm h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Project Type</label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger className="w-full border-2 border-slate-300 rounded-xl h-[44px] focus:ring-[#0A1628]/20 focus:border-[#0A1628]">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Type & Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Dumpster Type</label>
                    <Select value={dumpsterType} onValueChange={(val) => { setDumpsterType(val); setDumpsterSize(null); }}>
                      <SelectTrigger className="w-full border-2 border-slate-300 rounded-xl h-[44px] focus:ring-[#0A1628]/20 focus:border-[#0A1628] text-sm truncate">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {dumpsterTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Size</label>
                    <Select value={dumpsterSize?.toString() || ""} onValueChange={(val) => setDumpsterSize(parseInt(val))}>
                      <SelectTrigger className="w-full border-2 border-slate-300 rounded-xl h-[44px] focus:ring-[#0A1628]/20 focus:border-[#0A1628]">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDumpsterType?.sizes.map((size) => (
                          <SelectItem key={size.value} value={size.value.toString()}>{size.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Delivery & Removal Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Delivery Date</label>
                    <Popover open={showDeliveryCalendar} onOpenChange={setShowDeliveryCalendar}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal border-2 border-slate-300 rounded-xl h-[44px] px-3 focus:ring-[#0A1628]/20 focus:border-[#0A1628] text-xs">
                          {deliveryDate ? new Date(deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select date"}
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
                              setRemovalDateObj(undefined);
                              setRemovalDate("");
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            if (date < today) return true;
                            const dayOfWeek = date.getDay();
                            return dayOfWeek === 0 || dayOfWeek === 6;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Removal Date</label>
                    <Popover open={showRemovalCalendar} onOpenChange={setShowRemovalCalendar}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal border-2 border-slate-300 rounded-xl h-[44px] px-3 focus:ring-[#0A1628]/20 focus:border-[#0A1628] text-xs">
                          {removalDate ? new Date(removalDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select date"}
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
                          disabled={(date) => {
                            const dayOfWeek = date.getDay();
                            if (dayOfWeek === 0 || dayOfWeek === 6) return true;
                            if (deliveryDate && date < new Date(deliveryDate)) return true;
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
                  </div>
                </div>

                {dumpsterSize && (
                  <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-100 flex justify-between items-center mt-2">
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Price</p>
                      <p className="text-[10px] text-blue-500">Includes shipping & base rental</p>
                    </div>
                    <p className="text-xl font-bold text-blue-900">${totalPrice}</p>
                  </div>
                )}

                {bookingError && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm font-medium mt-2">
                    {bookingError}
                  </motion.p>
                )}
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#DAA520] hover:from-[#D4A835] hover:via-[#FFF000] hover:to-[#E5B835] text-[#0A1628] font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
              >
                <Zap className="w-5 h-5" />
                Confirm Booking
              </motion.button>

              {/* Info */}
              <p className="text-xs text-slate-500 text-center">
                ✓ Fast & Secure  ✓ No Hidden Fees
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

