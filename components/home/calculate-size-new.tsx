"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Check, AlertCircle, Lightbulb, ArrowRight, ChevronRight, MapPin, Phone, Info, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface FormStep {
  id: string;
  label: string;
  question: string;
  description?: string;
}

const formSteps: FormStep[] = [
  {
    id: "dumpsterType",
    label: "Type",
    question: "What type of dumpster do you need?",
    description: "Choose the dumpster type that suits your project"
  },
  {
    id: "material",
    label: "Material",
    question: "What material are you disposing?",
    description: "Select the primary material to calculate weight & price"
  },
  {
    id: "quantity",
    label: "Fullness",
    question: "How full is the dumpster?",
    description: "Estimate the fullness level to calculate overage fees"
  },
  {
    id: "timeline",
    label: "Timeline",
    question: "When do you need it?",
    description: "Choose your preferred rental duration"
  }
];

const materials = [
  { value: "household-debris", label: "Household Debris", baseWeight: 2000, pricePerTon: 50, icon: "♻️" },
  { value: "drywall", label: "Drywall/Plaster", baseWeight: 2500, pricePerTon: 60, icon: "🏗️" },
  { value: "wood", label: "Wood/Lumber", baseWeight: 3000, pricePerTon: 40, icon: "🪵" },
  { value: "metal", label: "Metal", baseWeight: 5000, pricePerTon: 100, icon: "⚙️" },
  { value: "carpet", label: "Carpet", baseWeight: 1500, pricePerTon: 35, icon: "🏠" },
  { value: "concrete", label: "Concrete/Rubble", baseWeight: 6000, pricePerTon: 120, icon: "🪨" }
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
    color: "from-[#0a1e63] to-[#FFD700]"
  },
  {
    name: "20-Yard",
    price: "$399",
    capacity: "6,000-8,000 lbs",
    best: "Medium projects",
    color: "from-[#0a1e63] to-[#FFD700]"
  },
  {
    name: "30-Yard",
    price: "$449",
    capacity: "9,000-12,000 lbs",
    best: "Large projects",
    color: "from-[#0a1e63] to-[#FFD700]"
  }
];

export default function CalculateSizeNew() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    dumpsterType: "",
    material: "",
    quantity: "", // Now fullness percentage (0-100)
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

  // Weight & Price Calculation Logic
  const getMaterialData = (materialValue: string) => {
    return materials.find(m => m.value === materialValue);
  };

  const calculateWeightAndPrice = () => {
    if (!formData.material) return null;
    
    const materialData = getMaterialData(formData.material);
    if (!materialData) return null;

    const fullnessPercent = (parseInt(formData.quantity) || 50) / 100;
    const includedWeight = materialData.baseWeight;
    const estimatedWeight = Math.round(includedWeight * fullnessPercent);
    const overage = Math.max(0, estimatedWeight - includedWeight);
    
    const basePrice = 399;
    const overagePrice = (overage / 2000) * materialData.pricePerTon;
    const totalPrice = Math.round(basePrice + overagePrice);

    return {
      includedWeight,
      estimatedWeight,
      overage,
      basePrice,
      overagePrice,
      totalPrice,
      materialName: materialData.label,
      pricePerTon: materialData.pricePerTon
    };
  };

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
    <section id="calculator-section" className="py-24 md:py-32 px-4 bg-gradient-to-b from-[#0A1628]/5 via-white to-[#DAA520]/5 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-[#DAA520]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A1628]/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#DAA520]/30 to-[#0A1628]/30 px-6 py-3 rounded-full mb-8 border border-[#DAA520]/40 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Lightbulb className="w-6 h-6 text-[#DAA520]" />
            <span className="text-sm font-bold text-[#142A52] uppercase tracking-wider">Get Your Perfect Match</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-[#0A1628] mb-6">
            Smart <span className="text-[#DAA520] relative inline-block">
              Dumpster
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#DAA520] to-transparent rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </span>
          </h2>
          
          <p className="text-[#142A52]/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-6">
            Answer 4 quick questions and get an instant recommendation with personalized pricing for your project
          </p>
        </motion.div>

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Left Column - Progress Sidebar */}
            <motion.div
              className="lg:sticky lg:top-8 lg:col-span-1 h-fit"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-[#0A1628] to-[#1B3A6B] rounded-2xl shadow-xl p-8 text-white space-y-8 border border-[#DAA520]/20">
                {/* Progress Circle */}
                <motion.div
                  className="flex flex-col items-center justify-center py-6"
                  animate={{ scale: progressPercentage === 100 ? [1, 1.05, 1] : 1 }}
                  transition={{ repeat: progressPercentage === 100 ? Infinity : 0, duration: 0.6 }}
                >
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 130 130" style={{ overflow: "visible" }}>
                      <circle cx="65" cy="65" r="60" fill="none" stroke="white" strokeWidth="8" opacity="0.1" />
                      <motion.circle
                        cx="65"
                        cy="65"
                        r="60"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "377, 377" }}
                        animate={{ strokeDasharray: `${(progressPercentage / 100) * 377}, 377` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#DAA520" />
                          <stop offset="100%" stopColor="#FFD700" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <motion.div className="text-center z-10">
                      <motion.div className="text-5xl font-bold text-[#DAA520]" key={progressPercentage}">
                        {progressPercentage}<span className="text-2xl">%</span>
                      </motion.div>
                      <div className="text-xs text-white/70 mt-1 uppercase font-bold tracking-widest">Complete</div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Step List */}
                <div className="space-y-3">
                  {formSteps.map((step, idx) => (
                    <motion.button
                      key={step.id}
                      onClick={() => idx < currentStep && setCurrentStep(idx)}
                      className={`w-full text-left p-4 rounded-xl transition-all font-bold text-sm uppercase tracking-wider ${
                        idx <= currentStep
                          ? idx === currentStep
                            ? "bg-[#DAA520] text-[#0A1628] shadow-lg scale-105"
                            : "bg-white/20 text-white hover:bg-white/30"
                          : "bg-white/10 text-white/50 cursor-not-allowed"
                      }`}
                      disabled={idx > currentStep}
                      whileHover={idx < currentStep ? { scale: 1.02 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-3">
                          <motion.div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx < currentStep
                                ? "bg-green-400 text-[#142A52]"
                                : "bg-white/30"
                            }`}
                          >
                            {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                          </motion.div>
                          {step.label}
                        </span>
                        {idx === currentStep && (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Zap className="w-4 h-4" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Remaining Steps */}
                <motion.div className="text-center py-4 border-t border-white/20">
                  <div className="text-3xl font-bold text-[#DAA520]">{formSteps.length - currentStep}</div>
                  <div className="text-xs text-white/70 uppercase tracking-widest">Step{formSteps.length - currentStep !== 1 ? 's' : ''} Left</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Form Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#DAA520]/20 overflow-hidden backdrop-blur-sm">
                {/* Form Header Bar */}
                <div className="bg-gradient-to-r from-[#142A52] to-[#1a3a6f] px-8 py-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm uppercase font-bold text-[#DAA520] tracking-wider">Step {currentStep + 1} of {formSteps.length}</h3>
                    <p className="text-white text-lg font-bold mt-1">{currentFormStep.question}</p>
                  </div>
                  <motion.div className="hidden md:block">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
                      <Zap className="w-6 h-6 text-[#DAA520]" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Form Content */}
                <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFormStep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Dumpster Type Selection */}
                  {currentStep === 0 && (
                    <div className="space-y-7">
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {currentFormStep.description}
                      </p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Select Dumpster Type</label>
                        <div className="relative">
                          <select
                            value={formData.dumpsterType}
                            onChange={(e) => handleDumpsterTypeSelect(e.target.value)}
                            className="w-full px-5 py-5 border-2 border-gray-300 rounded-xl focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 outline-none bg-white text-gray-900 font-bold text-base md:text-lg appearance-none cursor-pointer transition-all hover:border-gray-400 shadow-sm"
                          >
                            <option value="">🔽 Choose a dumpster type...</option>
                            {dumpsterTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.icon} {type.label} - {type.description}
                              </option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#DAA520] w-6 h-6" />
                        </div>

                        {formData.dumpsterType && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-center gap-3 text-green-700 font-bold"
                          >
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                              <Check className="w-6 h-6" />
                            </motion.div>
                            <span>{dumpsterTypes.find(t => t.value === formData.dumpsterType)?.label} selected</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* Material Selection */}
                  {currentStep === 1 && (
                    <div className="space-y-7">
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {currentFormStep.description}
                      </p>

                      {/* Weight indicator hint */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl flex gap-3 text-sm text-blue-800"
                      >
                        <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                        <span>💡 Heavy materials need larger dumpsters. We'll automatically recommend the perfect fit!</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Select Material Type</label>
                        <div className="relative">
                          <select
                            value={formData.material}
                            onChange={(e) => handleMaterialSelect(e.target.value)}
                            className="w-full px-5 py-5 border-2 border-gray-300 rounded-xl focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/30 outline-none bg-white text-gray-900 font-bold text-base md:text-lg appearance-none cursor-pointer transition-all hover:border-gray-400 shadow-sm"
                          >
                            <option value="">🔽 Choose material type...</option>
                            {materials.map((material) => (
                              <option key={material.value} value={material.value}>
                                {material.icon} {material.label}
                              </option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#DAA520] w-6 h-6" />
                        </div>

                        {formData.material && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-center gap-3 text-green-700 font-bold"
                          >
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                              <Check className="w-6 h-6" />
                            </motion.div>
                            <span>{materials.find(m => m.value === formData.material)?.label} selected</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* Fullness Slider & Weight Calculator */}
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

                      {formData.material && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          {/* Fullness Slider */}
                          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 space-y-6">
                            <div className="flex items-center justify-between">
                              <label className="text-lg font-bold text-gray-900">How full is the dumpster?</label>
                              <span className="text-3xl font-bold text-blue-600">{formData.quantity || 50}%</span>
                            </div>

                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={formData.quantity || 50}
                              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                              className="w-full h-4 bg-gradient-to-r from-slate-300 to-blue-300 rounded-full appearance-none cursor-pointer accent-blue-600"
                            />

                            <div className="flex justify-between text-xs font-semibold text-gray-600">
                              <span>1/4 Full</span>
                              <span>1/2 Full</span>
                              <span>3/4 Full</span>
                              <span>Full</span>
                            </div>
                          </div>

                          {/* Weight & Price Breakdown */}
                          {(() => {
                            const calc = calculateWeightAndPrice();
                            return calc ? (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4"
                              >
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                  <Zap className="w-5 h-5 text-yellow-500" />
                                  Real-Time Estimate
                                </h4>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">Included Weight</p>
                                    <p className="text-xl font-bold text-gray-900">{(calc.includedWeight / 2000).toFixed(1)} tons</p>
                                  </div>
                                  <div className="bg-blue-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">Estimated Weight</p>
                                    <p className="text-xl font-bold text-blue-600">{(calc.estimatedWeight / 2000).toFixed(1)} tons</p>
                                  </div>
                                </div>

                                <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 mb-1">Overage</p>
                                  <p className={`text-lg font-bold ${calc.overage > 0 ? "text-orange-600" : "text-green-600"}`}>
                                    {calc.overage > 0 ? `+${(calc.overage / 2000).toFixed(1)} tons` : "None"}
                                  </p>
                                </div>

                                <div className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-[#0A1628] rounded-2xl p-6">
                                  <p className="text-sm text-[#0A1628]/80 mb-2">Estimated Total for {calc.materialName}</p>
                                  <div className="flex items-end justify-between">
                                    <div>
                                      <p className="text-xs text-[#0A1628]/80">Base rental</p>
                                      <p className="text-lg font-bold">${calc.basePrice}</p>
                                    </div>
                                    {calc.overage > 0 && (
                                      <div className="text-right">
                                        <p className="text-xs text-[#0A1628]/80">Overage fee</p>
                                        <p className="text-lg font-bold">+${Math.round(calc.overagePrice)}</p>
                                      </div>
                                    )}
                                    <div className="text-right">
                                      <p className="text-5xl font-black">${calc.totalPrice}</p>
                                      <p className="text-xs text-orange-100 mt-1">*Varies by location</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ) : null;
                          })()}
                        </motion.div>
                      )}
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
              <div className="mt-12 flex gap-4 flex-col sm:flex-row pt-8 border-t border-gray-200">
                {currentStep > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 py-4 border-2 border-[#142A52] text-[#142A52] font-bold rounded-xl hover:bg-[#142A52]/10 transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    ← Previous Step
                  </motion.button>
                )}
                {currentStep < formSteps.length - 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      (currentStep === 0 && !formData.dumpsterType) ||
                      (currentStep === 1 && !formData.material) ||
                      (currentStep === 2 && !formData.quantity)
                    }
                    className="flex-1 py-4 bg-gradient-to-r from-[#142A52] to-[#1a3a6f] hover:from-[#0f1f3a] hover:to-[#142A52] disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    Next Step <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
                {currentStep === formSteps.length - 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCalculate}
                    disabled={!isFormComplete}
                    className="flex-1 py-5 bg-gradient-to-r from-[#142A52] via-[#C89B2B] to-[#142A52] hover:from-[#0f1f3a] hover:via-[#d4a835] hover:to-[#0f1f3a] disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-xl hover:shadow-2xl disabled:shadow-none"
                  >
                    <motion.span
                      animate={isFormComplete ? { rotate: 360 } : {}}
                      transition={{ repeat: isFormComplete ? Infinity : 0, duration: 2 }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.span>
                    Get Recommendation
                    <motion.span
                      animate={isFormComplete ? { x: [0, 4, 0] } : {}}
                      transition={{ repeat: isFormComplete ? Infinity : 0, duration: 0.8 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </motion.button>
                )}
              </div>
                </div>
              </div>
            </motion.div>
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
