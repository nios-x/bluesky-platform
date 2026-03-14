"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { Search, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Hero() {
  const [zipCode, setZipCode] = useState("");
  const [dumpsterSize, setDumpsterSize] = useState("");
  const [projectType, setProjectType] = useState("");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [searchError, setSearchError] = useState("");
  const router = useRouter();

  const subheadingText = "Instantly Compare Sizes, Get an Estimate, & Schedule Delivery.";
  const words = useMemo(() => subheadingText.split(" "), [subheadingText]);

  // Word-by-word animation with loop
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

  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('calculator-section');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const projectTypes = [
    { icon: "🏗️", label: "Construction" },
    { icon: "🏠", label: "Home Clean-Out" },
    { icon: "🌳", label: "Landscape" },
    { icon: "⚠️", label: "Roofing" }
  ];

  const dumpsterSizes = [
    "10 Yard",
    "15 Yard",
    "20 Yard",
    "30 Yard"
  ];

  const handleSearch = () => {
    // Clear previous error
    setSearchError("");
    
    // Validate zipcode format (basic validation for 5 digit US zip)
    if (!zipCode.trim()) {
      setSearchError("Please enter a zip code or address");
      return;
    }

    // If it's a 5-digit zip, validate it
    if (/^\d+$/.test(zipCode.trim()) && zipCode.trim().length !== 5) {
      setSearchError("Please enter a valid 5-digit zip code");
      return;
    }

    // Navigate to services page with search parameters
    const params = new URLSearchParams();
    params.append("zipcode", zipCode);
    if (dumpsterSize) params.append("size", dumpsterSize);
    if (projectType) params.append("type", projectType);
    
    router.push(`/services/dumpster-rental?${params.toString()}`);
  };

  const handleBookNow = () => {
    // Clear previous error
    setSearchError("");
    
    // Validate zipcode format
    if (!zipCode.trim()) {
      setSearchError("Please enter a zip code or address");
      return;
    }

    // If it's a 5-digit zip, validate it
    if (/^\d+$/.test(zipCode.trim()) && zipCode.trim().length !== 5) {
      setSearchError("Please enter a valid 5-digit zip code");
      return;
    }

    // Require size selection for booking
    if (!dumpsterSize) {
      setSearchError("Please select a dumpster size");
      return;
    }

    // Navigate directly to checkout with pre-filled info (2-3 step process)
    const bookingParams = new URLSearchParams();
    bookingParams.append("zipcode", zipCode);
    bookingParams.append("size", dumpsterSize);
    if (projectType) bookingParams.append("type", projectType);
    
    // Go to checkout page (simplified 2-3 step process)
    router.push(`/checkout?${bookingParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-[800px] lg:min-h-[900px] flex items-center overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/Home_page_main.png"
          alt="Blue Sky Disposal Services"
          className="w-full h-full object-cover object-[center_75%]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a4d9e]/70 via-[#1a4d9e]/55 to-[#1a4d9e]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
        >
          Book Dumpster Rentals in Michigan
        </motion.h1>

        {/* Description - Word by Word Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/95 mb-12 drop-shadow-lg min-h-[32px] flex flex-wrap justify-center gap-2"
        >
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
        </motion.div>

        {/* Search & Booking Box */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileHover={{ y: -5 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-left overflow-hidden border-2 border-white">
            {/* Animated top gradient bar */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a4d9e] via-[#ff8c42] to-[#1a4d9e]"
              animate={{ backgroundPosition: ["0% center", "100% center"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Search Input with Icon */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative z-10 mb-6"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    setSearchError("");
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter zip code or address"
                  className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-slate-300 focus:border-[#1a4d9e] focus:ring-2 focus:ring-[#1a4d9e]/20 focus:outline-none text-slate-900 text-base transition-all font-medium hover:border-slate-400"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 bg-[#1a4d9e] hover:bg-[#0f3366] text-white p-2 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              {searchError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2 font-medium"
                >
                  {searchError}
                </motion.p>
              )}
            </motion.div>

            {/* Dumpster Size Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative z-10 mb-6"
            >
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                <Package className="w-5 h-5 text-[#1a4d9e]" />
                <span className="font-bold text-[#1a4d9e] text-sm">Select Dumpster</span>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {dumpsterSizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setDumpsterSize(size)}
                    whileHover={{ scale: 1.05 }}
                    className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                      dumpsterSize === size
                        ? "bg-[#1a4d9e] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Project Type Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="relative z-10 mb-6"
            >
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border-2 border-blue-200 mb-3">
                <span className="font-bold text-[#1a4d9e] text-sm">Type of Project</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {projectTypes.map((type) => (
                  <motion.button
                    key={type.label}
                    onClick={() => setProjectType(type.label)}
                    whileHover={{ scale: 1.05 }}
                    className={`py-3 px-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 transition-all ${
                      projectType === type.label
                        ? "bg-[#1a4d9e] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="hidden sm:inline">{type.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Book Now Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="bg-gradient-to-r from-[#ff9f1c] via-[#ff8c42] to-[#ff7a24] hover:from-[#e08a0a] hover:via-[#e67a2d] hover:to-[#e66a15] text-white font-bold py-3 rounded-xl transition-all shadow-lg text-lg"
              >
                Book Now
              </motion.button>

              {/* Help Me Choose Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.button
                  onClick={scrollToCalculator}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white border-2 border-[#1a4d9e] text-[#1a4d9e] font-bold py-3 rounded-xl transition-all shadow-lg text-lg hover:bg-blue-50"
                >
                  Help Me Choose
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


