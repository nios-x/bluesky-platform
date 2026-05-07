"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SmartRecommendationModal } from "@/components/ai/SmartRecommendationModal";
import { useSmartRecommendationModal } from "@/hooks/use-smart-recommendation-modal";

interface SizeRecommendation {
  size: number;
  type: string;
  reason: string;
  estimatedWeight: number;
  price: number;
}

export function SmartAssessment() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);
  const { isOpen, openModal, closeModal } = useSmartRecommendationModal();

  const projectTypes = [
    "Home Cleanout",
    "Construction",
    "Roofing",
    "Landscaping",
    "Concrete Removal",
    "Kitchen Remodel",
    "Basement Cleanout",
  ];

  const materials: Record<string, string[]> = {
    "Home Cleanout": ["Mixed Household Trash", "Furniture", "Appliances"],
    "Construction": ["Construction Debris", "Drywall", "Wood", "Mixed Materials"],
    "Roofing": ["Asphalt Shingles", "Wood Shingles", "Metal", "Slate"],
    "Landscaping": ["Yard or Organic Material", "Branches", "Soil"],
    "Concrete Removal": ["Concrete, Brick, Block, or Asphalt"],
    "Kitchen Remodel": ["Construction Debris", "Cabinets", "Flooring"],
    "Basement Cleanout": ["Mixed Household Trash", "Flooring", "Insulation"],
  };

  const calculateRecommendation = () => {
    if (!projectType || !materialType) {
      alert("Please select project type and material");
      return;
    }

    let suggestedSize = 20;
    let dumpsterType = "roll-off";
    let estimatedWeight = 0;
    let reason = "";

    // Rough weight estimation based on material type
    const materialWeights: Record<string, number> = {
      "Mixed Household Trash": 2000,
      "Construction Debris": 3500,
      "Yard or Organic Material": 1500,
      "Roofing Material": 4000,
      "Siding Material": 3000,
      "Wood Deck Material": 2500,
      "Concrete, Brick, Block, or Asphalt": 8000,
      "Dirt, Gravel, or Rock": 7000,
      "Furniture": 1800,
      "Appliances": 2500,
      "Drywall": 2000,
      "Wood": 3000,
      "Asphalt Shingles": 3500,
      "Wood Shingles": 2500,
      "Metal": 2000,
      "Slate": 5000,
      "Branches": 1200,
      "Soil": 6000,
      "Cabinets": 1500,
      "Flooring": 2000,
      "Insulation": 800,
    };

    estimatedWeight = materialWeights[materialType] || 2000;

    // Determine size based on weight and project type
    if (projectType === "Roofing") {
      suggestedSize = 20;
      reason = "Roofing materials are heavy - 20 yd recommended for typical roofs";
    } else if (projectType === "Concrete Removal" || materialType === "Concrete, Brick, Block, or Asphalt") {
      suggestedSize = 10;
      dumpsterType = "roll-off";
      reason = "Heavy material - 10 yd roll-off required (no rubber wheel)";
    } else if (projectType === "Landscaping") {
      suggestedSize = 15;
      reason = "Yard waste - 15 yd (or 20 yd if large lot)";
    } else if (projectType === "Construction") {
      suggestedSize = 30;
      reason = "Construction debris requires larger capacity";
    } else if (projectType === "Home Cleanout") {
      suggestedSize = 20;
      reason = "Standard home cleanout - 20 yd covers most projects";
    } else if (projectType === "Kitchen Remodel") {
      suggestedSize = 20;
      reason = "Remodeling debris - 20 yd recommended";
    } else {
      suggestedSize = 20;
      reason = "Standard recommendation for your project";
    }

    // Adjust based on dimensions if provided
    if (dimensions.length && dimensions.width && dimensions.height) {
      const volume = parseInt(dimensions.length) * parseInt(dimensions.width) * parseInt(dimensions.height);
      if (volume > 1000) suggestedSize = 30;
      if (volume > 1500) suggestedSize = 40;
    }

    const prices: Record<number, number> = {
      10: 435,
      15: 445,
      20: 455,
      30: 475,
      40: 555,
    };

    setRecommendation({
      size: suggestedSize,
      type: dumpsterType,
      reason,
      estimatedWeight,
      price: prices[suggestedSize] || 455,
    });

    setStep(3);
  };

  return (
    <section id="smart-assessment" className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#142A52] mb-4">
            Smart Dumpster Assessment
          </h2>
          <p className="text-lg text-[#142A52]/70">
            Not sure which size you need? Answer a few questions and we'll recommend the perfect dumpster.
          </p>
        </div>

        {step === 1 && (
          <Card className="p-8 border-2 border-[#C89B2B]">
            <h3 className="text-2xl font-bold text-[#142A52] mb-6">Step 1: What's Your Project?</h3>
            <div className="space-y-3 mb-8">
              {projectTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setProjectType(type);
                    setStep(2);
                  }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition font-bold ${
                    projectType === type
                      ? "border-[#C89B2B] bg-[#C89B2B]/10 text-[#142A52]"
                      : "border-[#142A52]/20 hover:border-[#C89B2B] text-[#142A52]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* AI Recommendation Alternative */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-bold">OR</span>
              </div>
            </div>

            <Button
              onClick={openModal}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              🤖 Get AI Recommendation (with chat & image upload)
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8 border-2 border-[#C89B2B]">
            <button
              onClick={() => setStep(1)}
              className="text-[#C89B2B] font-bold mb-4 hover:underline"
            >
              ← Back
            </button>

            <h3 className="text-2xl font-bold text-[#142A52] mb-6">
              Step 2: What Materials Are You Disposing?
            </h3>

            <div className="mb-8">
              <label className="block text-sm font-bold text-[#142A52] mb-3">Material Type</label>
              <Select value={materialType} onValueChange={setMaterialType}>
                <SelectTrigger className="border-2 border-[#142A52]/30">
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  {materials[projectType]?.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-[#142A52] mb-3">Approximate Dimensions (Optional)</label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Length (ft)"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                  className="px-3 py-2 border-2 border-[#142A52]/30 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Width (ft)"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                  className="px-3 py-2 border-2 border-[#142A52]/30 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Height (ft)"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                  className="px-3 py-2 border-2 border-[#142A52]/30 rounded-lg"
                />
              </div>
            </div>

            <Button
              onClick={calculateRecommendation}
              className="w-full bg-gradient-to-r from-[#142A52] to-[#C89B2B] text-white font-bold py-3 rounded-lg"
            >
              Get My Recommendation →
            </Button>
          </Card>
        )}

        {step === 3 && recommendation && (
          <Card className="p-8 border-3 border-green-500 bg-green-50">
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle2 size={32} className="text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">We Recommend</h3>
                <p className="text-green-700">{recommendation.reason}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 border-2 border-green-200">
              <div className="grid grid-cols-2 gap-6 md:gap-12">
                <div>
                  <p className="text-sm text-[#142A52]/60 font-bold mb-1">RECOMMENDED SIZE</p>
                  <p className="text-4xl font-bold text-[#142A52]">{recommendation.size} yd</p>
                  <p className="text-sm text-[#142A52]/60 mt-1">{recommendation.type}</p>
                </div>
                <div>
                  <p className="text-sm text-[#142A52]/60 font-bold mb-1">ESTIMATED PRICE</p>
                  <p className="text-4xl font-bold text-[#C89B2B]">${recommendation.price}</p>
                  <p className="text-sm text-[#142A52]/60 mt-1">Base rental (7 days)</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-[#142A52]/10">
                <p className="text-sm text-[#142A52]/70">
                  <strong>Estimated Weight:</strong> ~{(recommendation.estimatedWeight / 1000).toFixed(1)} tons
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  setStep(1);
                  setProjectType("");
                  setMaterialType("");
                  setRecommendation(null);
                }}
                className="border-2 border-[#142A52] text-[#142A52] font-bold py-3 bg-white hover:bg-[#142A52]/5"
              >
                Start Over
              </Button>
              <Button className="bg-gradient-to-r from-[#142A52] to-[#C89B2B] text-white font-bold py-3 rounded-lg">
                Book This Size →
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* AI Recommendation Modal */}
      <SmartRecommendationModal isOpen={isOpen} onClose={closeModal} />
    </section>
  );
}
