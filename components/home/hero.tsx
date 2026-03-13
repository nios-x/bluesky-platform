"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { MapPin, Calendar, MessageCircle } from "lucide-react";
import Link from "next/link";
export function Hero() {
  const [zipCode, setZipCode] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [removalDate, setRemovalDate] = useState("");
  const [dumpsterSize, setDumpsterSize] = useState("");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);

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
          Book a Dumpster in Seconds
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

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileHover={{ y: -5 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl p-5 sm:p-7 text-left overflow-hidden border-2 border-white">
            {/* Animated top gradient bar */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a4d9e] via-[#ff8c42] to-[#1a4d9e]"
              animate={{ backgroundPosition: ["0% center", "100% center"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1a4d9e]/8 rounded-full -mr-24 -mt-24" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ff8c42]/8 rounded-full -ml-16 -mb-16" />
            
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg sm:text-xl font-bold text-[#1a4d9e] relative z-10"
            >
              Get Your Dumpster Rental Quote
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-slate-600 text-xs mt-1 relative z-10"
            >
              Enter your details for instant pricing and availability
            </motion.p>

            <div className="space-y-3 mt-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label className="text-xs font-bold text-[#1a4d9e] uppercase tracking-wide">Delivery Address</label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a4d9e] z-10" size={18} />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter the zip code"
                    className="w-full pl-11 pr-4 py-2 rounded-lg border-2 border-slate-300 focus:border-[#1a4d9e] focus:ring-2 focus:ring-[#1a4d9e]/20 focus:outline-none text-slate-900 text-sm transition-all font-medium hover:border-slate-400"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div>
                  <label className="text-xs font-bold text-[#1a4d9e] uppercase tracking-wide">Delivery Date</label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a4d9e] z-10" size={18} />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-2 rounded-lg border-2 border-slate-300 focus:border-[#1a4d9e] focus:ring-2 focus:ring-[#1a4d9e]/20 focus:outline-none text-slate-900 text-sm transition-all font-medium hover:border-slate-400 min-h-[40px] md:min-h-[44px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1a4d9e] uppercase tracking-wide">Removal Date</label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a4d9e] z-10" size={18} />
                    <input
                      type="date"
                      value={removalDate}
                      onChange={(e) => setRemovalDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-2 rounded-lg border-2 border-slate-300 focus:border-[#1a4d9e] focus:ring-2 focus:ring-[#1a4d9e]/20 focus:outline-none text-slate-900 text-sm transition-all font-medium hover:border-slate-400 min-h-[40px] md:min-h-[44px]"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label className="text-xs font-bold text-[#1a4d9e] uppercase tracking-wide">Dumpster Size</label>
                <div className="mt-2">
                  <Select value={dumpsterSize} onValueChange={setDumpsterSize}>
                    <SelectTrigger className="h-auto md:h-auto py-3 md:py-4 rounded-lg border-2 border-slate-300 focus:border-[#1a4d9e] focus:ring-2 focus:ring-[#1a4d9e]/20 transition-all font-medium text-slate-900 hover:border-slate-400 min-h-[44px] md:min-h-[48px]">
                      <SelectValue placeholder="Select dumpster size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 Yard</SelectItem>
                      <SelectItem value="15">15 Yard</SelectItem>
                      <SelectItem value="20">20 Yard</SelectItem>
                      <SelectItem value="30">30 Yard</SelectItem>
                      <SelectItem value="40">40 Yard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div 
            className="mt-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Link href="/checkout">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full bg-gradient-to-r from-[#ff8c42] to-[#ff7a2d] hover:from-[#ff9555] hover:to-[#ff8d40] text-white py-4 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[48px] md:min-h-[56px]">
                  Check Availability
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Two-Path Buttons */}
          <motion.div 
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <Link href="/services/dumpster-rental">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button 
                  className="w-full border-2 border-[#1a4d9e] bg-white text-[#1a4d9e] hover:bg-[#1a4d9e] hover:text-white py-3 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg min-h-[44px] md:min-h-[48px] text-sm md:text-base"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-current"
                  >
                    ✓
                  </motion.span>
                  I Know My Size
                </Button>
              </motion.div>
            </Link>
            <Link href="/size-guide">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button 
                  className="w-full border-2 border-[#1a4d9e] bg-white text-[#1a4d9e] hover:bg-[#1a4d9e] hover:text-white py-3 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg min-h-[44px] md:min-h-[48px] text-sm md:text-base"
                >
                  <MessageCircle size={18} className="flex-shrink-0" />
                  Help Me Choose
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Trusted Badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/90 text-base drop-shadow-lg"
        >
          Trusted Dumpster Service Near Detroit • Warren • Sterling Heights • Livonia & More
        </motion.p>
      </div>
    </section>
  );
}
