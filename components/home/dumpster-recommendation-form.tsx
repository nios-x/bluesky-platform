"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useState } from "react";
import { X, CheckCircle, MessageCircle, Send } from "lucide-react";

interface RecommendationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const dumpsterRecommendations = {
  small: { name: "10-Yard", description: "Perfect for small projects", price: "$299-$349" },
  medium: { name: "15-Yard", description: "Great for medium projects", price: "$349-$399" },
  large: { name: "20-Yard", description: "Ideal for large projects", price: "$399-$449" },
  xlarge: { name: "30-Yard", description: "For major demolition", price: "$449+" },
};

export function DumpsterRecommendationForm({ isOpen, onClose }: RecommendationFormProps) {
  const [step, setStep] = useState<"form" | "recommendation">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    wasteType: "",
    projectSize: "",
    timeline: "",
    zipCode: "",
  });
  const [recommendation, setRecommendation] = useState<keyof typeof dumpsterRecommendations | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic to determine dumpster recommendation based on inputs
    let dumpsterSize: keyof typeof dumpsterRecommendations = "medium";
    
    if (formData.projectSize === "small" || formData.projectType === "cleanup") {
      dumpsterSize = "small";
    } else if (formData.projectSize === "large" || formData.projectType === "demolition") {
      dumpsterSize = "xlarge";
    } else if (formData.projectSize === "medium" || formData.projectType === "renovation") {
      dumpsterSize = "large";
    }

    setRecommendation(dumpsterSize);
    setStep("recommendation");
  };

  const handleSubmitRecommendation = () => {
    // Handle form submission to backend
    alert(`Thank you! We recommend the ${dumpsterRecommendations[recommendation || "medium"].name} Dumpster for your project.\n\nWe'll contact you at ${formData.phone} with more details.`);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      projectType: "",
      wasteType: "",
      projectSize: "",
      timeline: "",
      zipCode: "",
    });
    setRecommendation(null);
    setStep("form");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Get Your Dumpster Recommendation
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {step === "form" ? "Tell us about your project" : "Your personalized recommendation"}
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === "form" ? (
            // Form Step
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-11 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-11 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-11 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="12345"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    className="h-11 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Project Type <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.projectType} onValueChange={(val) => handleInputChange("projectType", val)}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleanup">Cleanup/Junk Removal</SelectItem>
                      <SelectItem value="renovation">Home Renovation</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="demolition">Demolition</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Type of Waste <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.wasteType} onValueChange={(val) => handleInputChange("wasteType", val)}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed Debris</SelectItem>
                      <SelectItem value="wood">Wood/Lumber</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="concrete">Concrete</SelectItem>
                      <SelectItem value="yard">Yard Waste</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Project Size <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.projectSize} onValueChange={(val) => handleInputChange("projectSize", val)}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="Select project size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-2 rooms)</SelectItem>
                      <SelectItem value="medium">Medium (3-5 rooms)</SelectItem>
                      <SelectItem value="large">Large (6+ rooms)</SelectItem>
                      <SelectItem value="extra-large">Extra Large (Commercial)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Timeline <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.timeline} onValueChange={(val) => handleInputChange("timeline", val)}>
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Within 24 hours</SelectItem>
                      <SelectItem value="soon">This week</SelectItem>
                      <SelectItem value="flexible">Next few weeks</SelectItem>
                      <SelectItem value="planning">Still planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p>✓ By submitting this form, you'll receive a personalized dumpster recommendation and a call from our team within 24 hours.</p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="flex-1 h-12 rounded-lg border-2 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.wasteType || !formData.projectSize || !formData.timeline || !formData.zipCode}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  Get Recommendation
                </Button>
              </div>
            </form>
          ) : (
            // Recommendation Step
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-2xl p-8 border-2 border-green-300 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  We Recommend the
                </h3>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {recommendation && dumpsterRecommendations[recommendation].name}
                </div>
                <p className="text-gray-600 mb-4">
                  {recommendation && dumpsterRecommendations[recommendation].description}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {recommendation && dumpsterRecommendations[recommendation].price}
                </p>
              </motion.div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 space-y-3">
                <h4 className="font-bold text-gray-900 mb-3">Your Details</h4>
                <div className="text-sm space-y-2">
                  <p><span className="text-gray-600">Name:</span> <span className="font-semibold text-gray-900">{formData.name}</span></p>
                  <p><span className="text-gray-600">Email:</span> <span className="font-semibold text-gray-900">{formData.email}</span></p>
                  <p><span className="text-gray-600">Phone:</span> <span className="font-semibold text-gray-900">{formData.phone}</span></p>
                  <p><span className="text-gray-600">Zip Code:</span> <span className="font-semibold text-gray-900">{formData.zipCode}</span></p>
                  <p><span className="text-gray-600">Project:</span> <span className="font-semibold text-gray-900">{formData.projectType}</span></p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 flex items-start gap-3">
                <div className="text-2xl">📞</div>
                <div className="text-sm">
                  <p className="font-semibold text-yellow-900">What's Next?</p>
                  <p className="text-yellow-800">Our team will call you within 24 hours to confirm your order and discuss delivery details.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("form")}
                  variant="outline"
                  className="flex-1 h-12 rounded-lg border-2 border-gray-300"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitRecommendation}
                  className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit & Get Called
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
