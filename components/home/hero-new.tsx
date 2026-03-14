"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { Search, Package, MapPin, Phone, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroNew() {
  const [zipCode, setZipCode] = useState("");
  const [selectedSize, setSelectedSize] = useState("20 Yard");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const router = useRouter();

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

  const dumpsterOptions = [
    { size: "10 Yard", price: "$299", capacity: "2,500-3,500 lbs", best: "Small projects" },
    { size: "15 Yard", price: "$349", capacity: "3,500-4,500 lbs", best: "Medium cleanups" },
    { size: "20 Yard", price: "$399", capacity: "6,000-8,000 lbs", best: "Renovations" },
    { size: "30 Yard", price: "$449", capacity: "9,000-12,000 lbs", best: "Large projects" }
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

    // Go to simplified checkout (Address → Payment)
    const params = new URLSearchParams();
    params.append("zipcode", zipCode);
    params.append("size", selectedSize);
    
    router.push(`/checkout?${params.toString()}`);
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
          src="/images/Home_page_main.png"
          alt="Blue Sky Disposal"
          className="w-full h-full object-cover object-[center_75%]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08054C]/70 via-[#0a0660]/55 to-[#0d0780]/80" />
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
                  onClick={() => setSelectedSize(option.size)}
                  className={`rounded-2xl p-5 transition-all transform text-left ${
                    selectedSize === option.size
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-2xl ring-4 ring-yellow-300"
                      : "bg-white/95 text-slate-900 hover:shadow-xl hover:bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{option.size}</h3>
                      <p className="text-sm opacity-75 font-medium">{option.best}</p>
                    </div>
                    {selectedSize === option.size && (
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
                <p className="text-sm text-slate-600">Enter your zip code</p>
              </motion.div>

              {/* Zip Code Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <div className="relative flex items-center">
                  <MapPin className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value);
                      setBookingError("");
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter zip code"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-[#08054C] focus:ring-2 focus:ring-[#08054C]/20 outline-none text-slate-900 font-medium transition-all"
                  />
                </div>
                {bookingError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm font-medium"
                  >
                    {bookingError}
                  </motion.p>
                )}
              </motion.div>

              {/* Selected Size Display */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
              >
                <p className="text-xs text-blue-600 font-bold mb-1">SELECTED</p>
                <p className="text-2xl font-bold text-blue-900">{selectedSize}</p>
                <p className="text-sm text-blue-700 mt-2">
                  {dumpsterOptions.find(o => o.size === selectedSize)?.price}
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
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
