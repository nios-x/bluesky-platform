"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Hero() {
  const [zipCode, setZipCode] = useState("");
  const [dumpsterSize, setDumpsterSize] = useState("");
  const [projectType, setProjectType] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [removalDate, setRemovalDate] = useState("");
  const [natureOfWork, setNatureOfWork] = useState("");
  // Removed word-by-word animation state
  const [searchError, setSearchError] = useState("");
  const router = useRouter();

  // Removed word-by-word animation logic

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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1e63]/70 via-[#0a1e63]/40 to-[#efc73f]/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
          Book a Dumpster in Seconds
        </h1>

        <div className="text-xl text-white mb-12 drop-shadow-lg min-h-[32px] flex flex-wrap justify-center gap-2">
          Instantly compare dumpster types and sizes, get an estimate, and schedule delivery.
        </div>

        {/* Booking Box with Type and Size Selectors */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative bg-gradient-to-br from-white via-blue-50 to-[#FFD700]/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-left overflow-hidden border-2 border-blue-200">
            {/* Zip Code and Project Type Side by Side */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Delivery Address</label>
                <Select value={zipCode} onValueChange={setZipCode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zip code" />
                  </SelectTrigger>
                  <SelectContent>
                    {["48001", "48002", "48003", "48004", "48005"].map((zip) => (
                      <SelectItem key={zip} value={zip}>{zip}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Project Type</label>
                <Select value={natureOfWork} onValueChange={setNatureOfWork}>
                  <SelectTrigger className="border-blue-300 focus:border-[#FFD700] focus:ring-[#FFD700]/20">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      '🏠 Home Cleanout',
                      '🏗️ Construction',
                      '🧱 Roofing',
                      '🌿 Landscaping',
                      '🚧 Concrete',
                      '🚜 Dirt Removal'
                    ].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Delivery/Removal Date Pickers */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1a4d9e] mb-2">Delivery Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full rounded-lg border-2 border-blue-300 px-3 py-2 text-sm focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20"
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-[#FFD700] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Removal Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={removalDate}
                    onChange={e => setRemovalDate(e.target.value)}
                    className="w-full rounded-lg border-2 border-blue-300 px-3 py-2 text-sm focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20"
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-[#FFD700] pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Type and Size of Dumpster Dropdowns Side by Side */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1a4d9e] mb-2">Type of Dumpster</label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger className="border-blue-300 focus:border-[#FFD700] focus:ring-[#FFD700]/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Roll-off', 'Rubber-wheeled', 'Permanent'].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1a4d9e] mb-2">Size of Dumpster</label>
                <Select value={dumpsterSize} onValueChange={setDumpsterSize}>
                  <SelectTrigger className="border-blue-300 focus:border-[#FFD700] focus:ring-[#FFD700]/20">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {dumpsterSizes.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleBookNow}
                className="bg-gradient-to-r from-blue-900 via-[#FFD700] to-blue-700 hover:from-blue-800 hover:via-[#FFD700] hover:to-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-lg"
              >
                Book Now
              </button>
              <button
                onClick={scrollToCalculator}
                className="w-full bg-white border-2 border-[#1a4d9e] text-[#1a4d9e] font-bold py-3 rounded-xl transition-all shadow-lg text-lg hover:bg-blue-50"
              >
                Help Me Choose
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


