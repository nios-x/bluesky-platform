"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, Check, AlertCircle, Info, X, ChevronRight, Truck, MapPin, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DumpsterRecommendationForm } from "./dumpster-recommendation-form";

const dumpsterOptions = [
  {
    name: "10-Yard",
    type: "roll-off",
    capacity: "2500-3500 sq ft carpet / ~13 cubic yards",
    price: "$425 - $475",
    weightCapacity: "3000-4000 lbs",
    image: "/images/roll-off-dumpster.png",
    bestFor: ["Small remodels", "Roof repairs", "General cleanouts"]
  },
  {
    name: "20-Yard",
    type: "roll-off",
    capacity: "5000-7000 sq ft carpet / ~26 cubic yards",
    price: "$525 - $600",
    weightCapacity: "6000-8000 lbs",
    image: "/images/roll-off-dumpster.png",
    bestFor: ["Medium projects", "Multiple roofs", "Drywall removal"]
  },
  {
    name: "30-Yard",
    type: "roll-off",
    capacity: "7500-10000 sq ft carpet / ~40 cubic yards",
    price: "$625 - $750",
    weightCapacity: "9000-12000 lbs",
    image: "/images/roll-off-dumpster.png",
    bestFor: ["Large construction", "Complete renovations", "Heavy debris"]
  }
];

export default function CalculateSize() {
  const [showResults, setShowResults] = useState(false);
  const [materialType, setMaterialType] = useState("");
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [measurements, setMeasurements] = useState({
    length: "",
    width: "",
    thickness: "",
    quantity: ""
  });
  const [calculatedWeight, setCalculatedWeight] = useState(0);
  const [recommendation, setRecommendation] = useState<typeof dumpsterOptions[0] | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = details, 2 = address, 3 = confirm
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    rentalDays: "7"
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [animationStage, setAnimationStage] = useState<"idle" | "removing" | "calculating" | "adding">("idle");
  const [textIndex, setTextIndex] = useState(33); // Full text length
  
  const buttonText = "Calculate & Get Recommendation →";
  const displayedText = buttonText.substring(0, textIndex);

  // Animation effect
  useEffect(() => {
    if (animationStage === "idle" || animationStage === "calculating") return;

    let interval: NodeJS.Timeout;

    if (animationStage === "removing") {
      interval = setInterval(() => {
        setTextIndex(prev => {
          if (prev <= 0) {
            setTimeout(() => setAnimationStage("calculating"), 300);
            return 0;
          }
          return prev - 1;
        });
      }, 40);
    } else if (animationStage === "adding") {
      interval = setInterval(() => {
        setTextIndex(prev => {
          if (prev >= buttonText.length) {
            setAnimationStage("idle");
            setIsCalculating(false);
            return buttonText.length;
          }
          return prev + 1;
        });
      }, 25);
    }

    return () => clearInterval(interval);
  }, [animationStage, buttonText.length]);

  const calculateWeight = async () => {
    setIsCalculating(true);
    setAnimationStage("removing");

    // Wait for removal animation to complete
    await new Promise(resolve => setTimeout(resolve, 1400));

    let weight = 0;

    switch (materialType) {
      case "concrete":
        // Weight = Length x Width x Thickness x Density (145 lbs/ft³)
        const length = parseFloat(measurements.length) || 0;
        const width = parseFloat(measurements.width) || 0;
        const thicknessFt = (parseFloat(measurements.thickness) || 0) / 12; // Convert inches to feet
        const density = 145;
        weight = length * width * thicknessFt * density;
        break;

      case "shingles-asphalt":
        // 230-250 lbs per square (100 sq ft)
        const roofSqFt = parseFloat(measurements.quantity) || 0;
        const roofSquares = roofSqFt / 100;
        weight = roofSquares * 240; // Average 240 lbs per square
        break;

      case "shingles-slate":
        // 800-1500 lbs per square, use 1000 as average
        const slateSqFt = parseFloat(measurements.quantity) || 0;
        const slateSquares = slateSqFt / 100;
        weight = slateSquares * 1000;
        break;

      case "drywall":
        // Based on thickness
        const drywallSqFt = parseFloat(measurements.quantity) || 0;
        let weightPerSqFt = 1.8; // Default 1/2" standard
        
        if (measurements.thickness === "0.25") weightPerSqFt = 1.2;
        else if (measurements.thickness === "0.375") weightPerSqFt = 1.5;
        else if (measurements.thickness === "0.5") weightPerSqFt = 1.8;
        else if (measurements.thickness === "0.5-light") weightPerSqFt = 1.4;
        else if (measurements.thickness === "0.625") weightPerSqFt = 2.2;
        else if (measurements.thickness === "0.625-light") weightPerSqFt = 1.65;
        
        weight = drywallSqFt * weightPerSqFt;
        break;

      case "carpet":
        // Convert to square yards then calculate
        const carpetSqFt = parseFloat(measurements.quantity) || 0;
        const carpetSqYards = carpetSqFt / 9;
        let carpetWeight = 0;
        
        if (measurements.thickness === "nylon") carpetWeight = carpetSqYards * 5; // 4-6 lbs avg
        else if (measurements.thickness === "wool") carpetWeight = carpetSqYards * 6; // 5-7 lbs avg
        else if (measurements.thickness === "polyester") carpetWeight = carpetSqYards * 5; // 4.5-5.5 lbs avg
        
        // Add padding weight (0.5 lbs/sq ft)
        weight = carpetWeight + (carpetSqFt * 0.5);
        break;
    }

    setCalculatedWeight(Math.round(weight));

    // Recommend dumpster based on weight
    let recommended = dumpsterOptions[0];
    if (weight > 8000) {
      recommended = dumpsterOptions[2]; // 30-yard
    } else if (weight > 4000) {
      recommended = dumpsterOptions[1]; // 20-yard
    }

    setRecommendation(recommended);

    // Trigger text re-appearing animation
    setTextIndex(0);
    setAnimationStage("adding");
    setShowResults(true);
  };

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckoutDataChange = (field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBuyNow = () => {
    setCheckoutStep(1);
    setShowCheckout(true);
  };

  const handleNextStep = () => {
    if (checkoutStep < 3) {
      setCheckoutStep(checkoutStep + 1);
    }
  };

  const handleCompleteCheckout = () => {
    // Here you would typically send data to your backend
    alert(`Order confirmed for ${recommendation?.name} Dumpster!\n\nA confirmation will be sent to ${checkoutData.email}`);
    setShowCheckout(false);
    setShowResults(false);
    setMaterialType("");
    setMeasurements({ length: "", width: "", thickness: "", quantity: "" });
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white via-blue-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-200 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"></div>

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Calculator className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              {showResults ? "Perfect Dumpsters for You" : <>Get Your <span className="text-blue-600">Perfect</span> Dumpster</>}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {showResults
                ? "Based on your needs, we recommend these perfect-fit solutions for your project."
                : "Tell us what you're disposing and your project size. We'll add up the weight and recommend the ideal dumpster for your needs."}
            </p>
          </div>

          {!showResults ? (
            <div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 mb-8">
                <div className="mb-8">
                  <label className="text-sm font-bold text-gray-800 ml-1 flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-blue-600" />
                    What are you disposing?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {[
                      { id: "concrete", label: "🏗️ Concrete", icon: "🏗️" },
                      { id: "shingles-asphalt", label: "🏠 Asphalt Shingles", icon: "🏠" },
                      { id: "shingles-slate", label: "🔷 Slate Shingles", icon: "🔷" },
                      { id: "drywall", label: "📦 Drywall", icon: "📦" },
                      { id: "carpet", label: "🧵 Carpet", icon: "🧵" }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setMaterialType(item.id)}
                        className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 text-center font-semibold ${
                          materialType === item.id
                            ? "border-blue-600 bg-blue-50 text-blue-900 shadow-lg"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
                        }`}
                      >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-xs line-clamp-2">{item.label.split(" ").slice(1).join(" ")}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {materialType === "concrete" && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">Concrete Slab Dimensions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Length (feet)</label>
                        <Input type="number" placeholder="e.g., 10" value={measurements.length} onChange={(e) => handleMeasurementChange("length", e.target.value)} className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Width (feet)</label>
                        <Input type="number" placeholder="e.g., 8" value={measurements.width} onChange={(e) => handleMeasurementChange("width", e.target.value)} className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Thickness (inches)</label>
                        <Input type="number" placeholder="e.g., 4" value={measurements.thickness} onChange={(e) => handleMeasurementChange("thickness", e.target.value)} className="bg-white" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">Uses standard concrete density of 145 lbs/ft³</p>
                  </div>
                )}

                {materialType === "shingles-asphalt" && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">Roof Size</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Roof Area (square feet)</label>
                      <Input type="number" placeholder="e.g., 2000" value={measurements.quantity} onChange={(e) => handleMeasurementChange("quantity", e.target.value)} className="bg-white" />
                    </div>
                    <p className="text-xs text-gray-600 mt-3">Asphalt shingles: ~240 lbs per roofing square (100 sq ft)</p>
                  </div>
                )}

                {materialType === "shingles-slate" && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">Roof Size</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Roof Area (square feet)</label>
                      <Input type="number" placeholder="e.g., 2000" value={measurements.quantity} onChange={(e) => handleMeasurementChange("quantity", e.target.value)} className="bg-white" />
                    </div>
                    <p className="text-xs text-gray-600 mt-3">Slate shingles: ~1000 lbs per roofing square (100 sq ft) - significantly heavier!</p>
                  </div>
                )}

                {materialType === "drywall" && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">Drywall Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Area to Cover (sq ft)</label>
                        <Input type="number" placeholder="e.g., 500" value={measurements.quantity} onChange={(e) => handleMeasurementChange("quantity", e.target.value)} className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Thickness</label>
                        <Select value={measurements.thickness} onValueChange={(val) => handleMeasurementChange("thickness", val)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.25">1/4" - 1.2 lbs/sq ft</SelectItem>
                            <SelectItem value="0.375">3/8" - 1.5 lbs/sq ft</SelectItem>
                            <SelectItem value="0.5">1/2" Standard - 1.8 lbs/sq ft</SelectItem>
                            <SelectItem value="0.5-light">1/2" Lightweight - 1.4 lbs/sq ft</SelectItem>
                            <SelectItem value="0.625">5/8" Standard - 2.2 lbs/sq ft</SelectItem>
                            <SelectItem value="0.625-light">5/8" Lightweight - 1.65 lbs/sq ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {materialType === "carpet" && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">Carpet Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Area (square feet)</label>
                        <Input type="number" placeholder="e.g., 500" value={measurements.quantity} onChange={(e) => handleMeasurementChange("quantity", e.target.value)} className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Material Type</label>
                        <Select value={measurements.thickness} onValueChange={(val) => handleMeasurementChange("thickness", val)}>
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nylon">Nylon - 5 lbs/sq yd</SelectItem>
                            <SelectItem value="polyester">Polyester - 5 lbs/sq yd</SelectItem>
                            <SelectItem value="wool">Wool - 6 lbs/sq yd</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">Includes standard padding weight. ⚠️ Wet carpet weighs significantly more!</p>
                  </div>
                )}

                <Button
                  onClick={calculateWeight}
                  disabled={!materialType || isCalculating}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="inline-block min-h-[1.5rem]">
                    {displayedText || <span>&nbsp;</span>}
                  </span>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {/* Weight Calculation Result */}
              <div className="mb-10 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  Estimated Waste Weight
                </h3>
                <div className="text-5xl font-bold text-blue-600 mb-2">{calculatedWeight.toLocaleString()} lbs</div>
                <p className="text-gray-600">Based on your material measurements</p>
              </div>

              {/* Recommendation */}
              {recommendation && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Recommendation</h3>
                  <div className="bg-white rounded-2xl border-2 border-green-300 overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Perfect Fit ✓
                    </div>

                    <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-cyan-100 relative overflow-hidden">
                      <Image
                        src={recommendation.image}
                        alt={recommendation.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    <div className="p-8">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">{recommendation.name} Dumpster</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <p className="text-xs text-gray-600 mb-1">Weight Capacity</p>
                          <p className="text-2xl font-bold text-blue-600">{recommendation.weightCapacity}</p>
                        </div>
                        <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                          <p className="text-xs text-gray-600 mb-1">Capacity</p>
                          <p className="text-lg font-bold text-cyan-600">{recommendation.capacity}</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 mb-8 border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{recommendation.price}</div>
                        <p className="text-sm text-gray-600">Rental price</p>
                      </div>

                      <div className="mb-8">
                        <h4 className="font-bold text-gray-900 mb-3">Perfect For:</h4>
                        <div className="space-y-2">
                          {recommendation.bestFor.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-md">
                                <Check className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="text-gray-700 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={handleBuyNow} className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all h-12">
                          Buy Now
                        </Button>
                        <Button variant="outline" className="flex-1 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg font-bold transition-all h-12">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Options */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Alternative Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dumpsterOptions.filter(opt => opt.name !== recommendation?.name).map((option, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg p-6 transition-all">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{option.name}</h4>
                      <p className="text-sm text-blue-600 font-semibold mb-3">{option.weightCapacity}</p>
                      <p className="text-gray-600 text-sm mb-4">{option.bestFor.join(" • ")}</p>
                      <p className="text-2xl font-bold text-blue-600 mb-4">{option.price}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => {
                          setRecommendation(option);
                          handleBuyNow();
                        }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm h-10 rounded-lg font-semibold">
                          Buy Now
                        </Button>
                        <Button variant="outline" className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 text-sm h-10 rounded-lg font-semibold">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200 space-y-4">
                <p className="text-gray-700">Want to adjust your measurements or try a different material?</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setMaterialType("");
                      setMeasurements({ length: "", width: "", thickness: "", quantity: "" });
                      setCalculatedWeight(0);
                    }}
                    className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 font-semibold transition-colors group px-4 py-2 rounded-lg hover:bg-blue-100"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Recalculate
                  </button>
                  <button
                    onClick={() => setShowRecommendationForm(true)}
                    className="inline-flex items-center justify-center text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 font-semibold transition-all px-4 py-2 rounded-lg gap-2 shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Can't Order? Get Help
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Quick Checkout Modal */}
      {showCheckout && recommendation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Quick Checkout</h2>
                <p className="text-blue-100 text-sm mt-1">Step {checkoutStep} of 3</p>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300"
                style={{ width: `${(checkoutStep / 3) * 100}%` }}
              ></div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Step 1: Contact Info */}
              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block">Full Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={checkoutData.fullName}
                      onChange={(e) => handleCheckoutDataChange("fullName", e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={checkoutData.email}
                      onChange={(e) => handleCheckoutDataChange("email", e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={checkoutData.phone}
                      onChange={(e) => handleCheckoutDataChange("phone", e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Address */}
              {checkoutStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Street Address
                    </label>
                    <Input
                      type="text"
                      placeholder="123 Main Street"
                      value={checkoutData.address}
                      onChange={(e) => handleCheckoutDataChange("address", e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-800 mb-2 block">City</label>
                      <Input
                        type="text"
                        placeholder="New York"
                        value={checkoutData.city}
                        onChange={(e) => handleCheckoutDataChange("city", e.target.value)}
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-800 mb-2 block">Zip Code</label>
                      <Input
                        type="text"
                        placeholder="10001"
                        value={checkoutData.zipCode}
                        onChange={(e) => handleCheckoutDataChange("zipCode", e.target.value)}
                        className="h-11 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      Rental Duration
                    </label>
                    <Select value={checkoutData.rentalDays} onValueChange={(val) => handleCheckoutDataChange("rentalDays", val)}>
                      <SelectTrigger className="h-11 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Days - $50 discount</SelectItem>
                        <SelectItem value="7">7 Days - Standard</SelectItem>
                        <SelectItem value="14">14 Days - Save more</SelectItem>
                        <SelectItem value="30">30 Days - Best value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Order Summary */}
              {checkoutStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dumpster Size</span>
                        <span className="font-semibold text-gray-900">{recommendation.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rental Period</span>
                        <span className="font-semibold text-gray-900">{checkoutData.rentalDays} Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Location</span>
                        <span className="font-semibold text-gray-900">{checkoutData.city}, {checkoutData.zipCode}</span>
                      </div>
                      <div className="border-t border-blue-300 pt-3 flex justify-between">
                        <span className="text-gray-900 font-bold">Total Price</span>
                        <span className="text-2xl font-bold text-blue-600">{recommendation.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900">Confirmation</p>
                      <p className="text-green-700">We'll send a confirmation email to <span className="font-semibold">{checkoutData.email}</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="bg-gray-50 px-8 py-6 flex gap-3 border-t">
              {checkoutStep > 1 && (
                <Button
                  onClick={() => setCheckoutStep(checkoutStep - 1)}
                  variant="outline"
                  className="flex-1 h-12 rounded-lg border-2 border-gray-300"
                >
                  Back
                </Button>
              )}
              {checkoutStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={
                    (checkoutStep === 1 && (!checkoutData.fullName || !checkoutData.email || !checkoutData.phone)) ||
                    (checkoutStep === 2 && (!checkoutData.address || !checkoutData.city || !checkoutData.zipCode))
                  }
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteCheckout}
                  className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white h-12 rounded-lg font-bold"
                >
                  Complete Order
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Recommendation Form Modal */}
      <DumpsterRecommendationForm
        isOpen={showRecommendationForm}
        onClose={() => setShowRecommendationForm(false)}
      />
    </section>
  );
}


