"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/contexts/booking-context";
import { PROJECT_TYPES, MATERIAL_TYPES } from "@/lib/constants/booking";

export function Hero() {
  const [zipCode, setZipCode] = useState("");
  const [projectType, setProjectType] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [rentalPeriod, setRentalPeriod] = useState("7");
  const [searchError, setSearchError] = useState("");
  const [showMaterialOptions, setShowMaterialOptions] = useState(false);
  const router = useRouter();
  const { updateBooking } = useBooking();

  const rentalOptions = [
    { value: "7", label: "7 Days" },
    { value: "14", label: "14 Days" },
    { value: "30", label: "30 Days" },
  ];

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

    if (!projectType) {
      setSearchError("Please select a project type");
      return;
    }

    if (!materialType) {
      setSearchError("Please select a material type");
      return;
    }

    if (!deliveryDate) {
      setSearchError("Please select a delivery date");
      return;
    }

    // Update booking context
    updateBooking({
      zipCode,
      projectType,
      materialType,
      deliveryDate,
      rentalPeriod: parseInt(rentalPeriod),
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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
          Book a Dumpster in Seconds — Anywhere in Michigan
        </h1>

        <p className="text-lg text-white/95 mb-12 drop-shadow-lg">
          Instantly compare dumpster types and sizes, get an estimate, and schedule delivery.
        </p>

        {/* Booking Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-left border-4 border-[#C89B2B]">
            <h2 className="text-2xl font-bold text-[#142A52] mb-6">Get a Quote in 60 Seconds</h2>

            {/* Zip Code & Project Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-[#142A52] mb-2">ZIP Code or Address</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="e.g., 48001 or full address"
                  className="w-full px-4 py-3 border-2 border-[#142A52]/30 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none transition"
                />
              </div>
              <div>
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

            {/* Material Type & Delivery Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-[#142A52] mb-2">Material Type</label>
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger className="w-full border-2 border-[#142A52]/30 focus:border-[#C89B2B]">
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#142A52] mb-2">Delivery Date</label>
                <Select value={deliveryDate} onValueChange={setDeliveryDate}>
                  <SelectTrigger className="w-full border-2 border-[#142A52]/30 focus:border-[#C89B2B]">
                    <SelectValue placeholder="Select delivery date" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDates().map((date) => (
                      <SelectItem key={date} value={date}>
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rental Period */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#142A52] mb-3">How Long Do You Need It?</label>
              <div className="grid grid-cols-3 gap-3">
                {rentalOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRentalPeriod(option.value)}
                    className={`py-3 rounded-lg font-bold transition ${
                      rentalPeriod === option.value
                        ? "bg-[#C89B2B] text-white"
                        : "bg-[#142A52]/10 text-[#142A52] border-2 border-[#142A52]/30 hover:border-[#C89B2B]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
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


