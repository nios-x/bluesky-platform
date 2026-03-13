"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calculator, Check, AlertCircle, Lightbulb, ArrowRight, ChevronRight, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface FormStep {
  id: string;
  label: string;
  question: string;
  description?: string;
}

const formSteps: FormStep[] = [
  {    id: "dumpsterType",
    label: "Type",
    question: "What type of dumpster do you need?",
    description: "Choose the dumpster type that suits your project"
  },
  {    id: "material",
    label: "Material Type",
    question: "What are you disposing?",
    description: "Select the primary material to calculate weight"
  },
  {
    id: "quantity",
    label: "Amount",
    question: "How much do you have?",
    description: "Estimate the quantity or dimensions"
  },
  {
    id: "timeline",
    label: "Timeline",
    question: "When do you need it?",
    description: "Choose your preferred rental duration"
  }
];

const materials = [
  { value: "drywall", label: "Drywall/Plaster", weight: "Heavy", icon: "🏗️" },
  { value: "wood", label: "Wood/Lumber", weight: "Medium", icon: "🪵" },
  { value: "metal", label: "Metal", weight: "Very Heavy", icon: "⚙️" },
  { value: "carpet", label: "Carpet", weight: "Light", icon: "🏠" },
  { value: "concrete", label: "Concrete/Rubble", weight: "Very Heavy", icon: "🪨" },
  { value: "general", label: "General Waste", weight: "Mixed", icon: "♻️" }
];

const dumpsterTypes = [
  { value: "rolloff", label: "Roll-Off Dumpster", description: "Best for construction & large projects", icon: "🚚" },
  { value: "permanent", label: "Permanent Dumpster", description: "Long-term solutions for businesses", icon: "🏢" },
  { value: "rubberwheel", label: "Rubber-Wheeled", description: "Flexible for residential & commercial", icon: "🛞" }
];

const dumpsters = [
  {
    name: "10-Yard",
    price: "$299",
    capacity: "2,500-3,500 lbs",
    best: "Small projects",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "20-Yard",
    price: "$399",
    capacity: "6,000-8,000 lbs",
    best: "Medium projects",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "30-Yard",
    price: "$449",
    capacity: "9,000-12,000 lbs",
    best: "Large projects",
    color: "from-orange-500 to-red-500"
  }
];

export default function CalculateSizeNew() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    dumpsterType: "",
    material: "",
    quantity: "",
    timeline: ""
  });
  const [showResults, setShowResults] = useState(false);
  const [recommendation, setRecommendation] = useState<typeof dumpsters[0] | null>(null);
  const [bookingData, setBookingData] = useState({
    address: "",
    dumpsterSize: "",
    phone: ""
  });
  const [showBookingForm, setShowBookingForm] = useState(false);

  const progressPercentage = Math.round(((currentStep + 1) / formSteps.length) * 100);
  const completedFields = Object.values(formData).filter(v => v).length;
  const totalFields = Object.keys(formData).length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const handleMaterialSelect = (value: string) => {
    setFormData(prev => ({ ...prev, material: value }));
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleDumpsterTypeSelect = (value: string) => {
    setFormData(prev => ({ ...prev, dumpsterType: value }));
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleQuantityChange = (value: string) => {
    setFormData(prev => ({ ...prev, quantity: value }));
  };

  const handleTimelineSelect = (value: string) => {
    setFormData(prev => ({ ...prev, timeline: value }));
  };

  const handleCalculate = () => {
    // Simple recommendation logic
    let recommended = dumpsters[0];
    
    if (formData.quantity && parseInt(formData.quantity) > 50) {
      recommended = dumpsters[2]; // 30-yard
    } else if (formData.quantity && parseInt(formData.quantity) > 25) {
      recommended = dumpsters[1]; // 20-yard
    }

    // Adjust based on material type
    if (["metal", "concrete"].includes(formData.material)) {
      recommended = dumpsters[Math.min(2, dumpsters.indexOf(recommended) + 1)];
    }

    setRecommendation(recommended);
    setShowResults(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData({ dumpsterType: "", material: "", quantity: "", timeline: "" });
    setShowResults(false);
    setRecommendation(null);
  };

  const currentFormStep = formSteps[currentStep];
  const isFormComplete = formData.dumpsterType && formData.material && formData.quantity && formData.timeline;

  return (
    <section id="calculator-section" className="py-20 md:py-28 px-4 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Smart Calculator</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Dumpster
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Answer a few quick questions and get a personalized recommendation tailored to your project.
          </p>
        </motion.div>

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 md:p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Smart Assessment</h3>
                <div className="text-right">
                  <div className="text-3xl font-bold">{completionPercentage}%</div>
                  <div className="text-sm text-blue-100">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full"
                />
              </div>

              {/* Step Indicator */}
              <div className="mt-6 flex gap-2">
                {formSteps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                      idx <= currentStep
                        ? "bg-white/30 text-white"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>
                        {idx < currentStep ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFormStep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Dumpster Type Selection */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {currentFormStep.question}
                        </h3>
                        <p className="text-gray-600">
                          {currentFormStep.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dumpsterTypes.map(type => (
                          <motion.button
                            key={type.value}
                            onClick={() => handleDumpsterTypeSelect(type.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-2xl border-2 transition-all text-left ${
                              formData.dumpsterType === type.value
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="text-4xl mb-3">{type.icon}</div>
                            <h4 className="font-bold text-gray-900 text-lg">{type.label}</h4>
                            <p className="text-sm text-gray-600 mt-2">
                              {type.description}
                            </p>
                            {formData.dumpsterType === type.value && (
                              <div className="mt-3 flex items-center gap-2 text-blue-600 text-sm font-semibold">
                                <Check className="w-4 h-4" />
                                Selected
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Material Selection */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {currentFormStep.question}
                        </h3>
                        <p className="text-gray-600">
                          {currentFormStep.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {materials.map(material => (
                          <motion.button
                            key={material.value}
                            onClick={() => handleMaterialSelect(material.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-2xl border-2 transition-all text-left ${
                              formData.material === material.value
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="text-3xl mb-2">{material.icon}</div>
                            <h4 className="font-bold text-gray-900">{material.label}</h4>
                            <p className="text-xs text-gray-600 mt-1">
                              <span className="font-semibold">{material.weight}</span> material
                            </p>
                            {formData.material === material.value && (
                              <div className="mt-2 flex items-center gap-2 text-blue-600 text-sm font-semibold">
                                <Check className="w-4 h-4" />
                                Selected
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Input */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {currentFormStep.question}
                        </h3>
                        <p className="text-gray-600">
                          {currentFormStep.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-3">
                            Estimate in square feet or cubic yards
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={formData.quantity}
                              onChange={(e) => handleQuantityChange(e.target.value)}
                              placeholder="Enter amount..."
                              className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-lg font-semibold transition-all"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                              sq ft
                            </span>
                          </div>
                        </div>

                        {/* Quick suggestions */}
                        <div className="grid grid-cols-3 gap-2">
                          {[10, 25, 50].map(val => (
                            <button
                              key={val}
                              onClick={() => handleQuantityChange(val.toString())}
                              className={`py-2 rounded-lg font-semibold transition-all border ${
                                formData.quantity === val.toString()
                                  ? "border-blue-600 bg-blue-50 text-blue-600"
                                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                              }`}
                            >
                              ~{val} sq ft
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!formData.quantity}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Timeline Selection */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {currentFormStep.question}
                        </h3>
                        <p className="text-gray-600">
                          {currentFormStep.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { value: "immediate", label: "This Week", desc: "Need it ASAP" },
                          { value: "flexible", label: "Within 2 Weeks", desc: "Some flexibility" },
                          { value: "planned", label: "Next Month", desc: "Planned ahead" }
                        ].map(option => (
                          <motion.button
                            key={option.value}
                            onClick={() => handleTimelineSelect(option.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-2xl border-2 transition-all text-center ${
                              formData.timeline === option.value
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <h4 className="font-bold text-gray-900 text-lg">{option.label}</h4>
                            <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                            {formData.timeline === option.value && (
                              <div className="mt-3 flex items-center justify-center">
                                <Check className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="mt-12 flex gap-4 flex-col sm:flex-row">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                )}
                {currentStep < formSteps.length - 1 && currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      (currentStep === 1 && !formData.material) ||
                      (currentStep === 2 && !formData.quantity)
                    }
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
                {currentStep === formSteps.length - 1 && (
                  <button
                    onClick={handleCalculate}
                    disabled={!isFormComplete}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    Get Recommendation
                    <Lightbulb className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Results Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Success Message */}
            <motion.div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Perfect Match Found!
              </h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Based on your project details, we recommend the{" "}
                <span className="font-bold text-blue-600">{recommendation?.name}</span> dumpster.
              </p>
            </motion.div>

            {/* Recommendation Card */}
            {recommendation && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`bg-gradient-to-br ${recommendation.color} rounded-3xl text-white p-8 md:p-12 shadow-2xl`}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-5xl font-bold mb-4">{recommendation.name}</h2>
                    <p className="text-white/90 text-lg mb-6">Perfect for {recommendation.best}</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/80 text-sm">Weight Capacity</p>
                        <p className="text-2xl font-bold">{recommendation.capacity}</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Starting Price</p>
                        <p className="text-3xl font-bold">{recommendation.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Why This Size */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Why This Size?
                    </h4>
                    <ul className="space-y-3 text-sm">
                      {formData.material && (
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 flex-shrink-0" />
                          Ideal for {formData.material} disposal
                        </li>
                      )}
                      {formData.quantity && (
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 flex-shrink-0" />
                          Handles ~{formData.quantity} sq ft projects
                        </li>
                      )}
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        Delivery available {formData.timeline === "immediate" ? "this week" : "as planned"}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        Professional service included
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* All Options */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Or explore all options:</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {dumpsters.map((dumpster, idx) => (
                  <motion.div
                    key={dumpster.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      dumpster.name === recommendation?.name
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 text-lg mb-2">{dumpster.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{dumpster.best}</p>
                    <div className="text-2xl font-bold text-gray-900 mb-4">{dumpster.price}</div>
                    <Link href="/checkout">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
                        Book Now
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            {!showBookingForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 border-2 border-blue-300 text-center"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Ready to Book?
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                  Check availability and confirm your booking with your address and contact information.
                </p>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg mb-4"
                >
                  Check Availability & Book
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 md:p-12 border-2 border-gray-200 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Complete Your Booking
                </h3>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Booking submitted! We'll contact you soon."); }}>
                  {/* Address Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Your Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your delivery address"
                      value={bookingData.address}
                      onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base"
                    />
                  </div>

                  {/* Dumpster Size Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      Dumpster Size
                    </label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {dumpsters.map((dumpster) => (
                        <button
                          key={dumpster.name}
                          type="button"
                          onClick={() => setBookingData(prev => ({ ...prev, dumpsterSize: dumpster.name }))}
                          className={`p-4 rounded-xl border-2 transition-all font-bold ${
                            bookingData.dumpsterSize === dumpster.name
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          <div>{dumpster.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{dumpster.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dumpster Type:</span>
                        <span className="font-bold capitalize">{formData.dumpsterType ? dumpsterTypes.find(t => t.value === formData.dumpsterType)?.label : "Not Selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dumpster Size:</span>
                        <span className="font-bold">{bookingData.dumpsterSize || "Not Selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material Type:</span>
                        <span className="font-bold capitalize">{formData.material || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Timeline:</span>
                        <span className="font-bold">{formData.timeline === "immediate" ? "This Week" : formData.timeline === "flexible" ? "2 Weeks" : "Next Month"}</span>
                      </div>
                      {recommendation && (
                        <div className="flex justify-between pt-2 border-t-2 border-blue-200 text-base font-bold text-blue-600">
                          <span>Starting Price:</span>
                          <span>{recommendation.price}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!bookingData.address || !bookingData.phone || !bookingData.dumpsterSize}
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all"
                    >
                      Complete Booking
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="py-3 px-8 border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// AnimatePresence component (needed for the conditional animations)
function AnimatePresence({ children, mode }: any) {
  return <>{children}</>;
}
