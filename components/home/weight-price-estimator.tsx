"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Zap } from "lucide-react";

export function WeightPriceEstimator() {
  const [material, setMaterial] = useState("household-debris");
  const [fullness, setFullness] = useState(50);
  const [showBooking, setShowBooking] = useState(false);

  const materials: Record<string, { name: string; baseWeight: number; pricePerTon: number }> = {
    "household-debris": { name: "Household Debris", baseWeight: 2000, pricePerTon: 50 },
    "construction": { name: "Construction", baseWeight: 4000, pricePerTon: 75 },
    "metal": { name: "Metal", baseWeight: 5000, pricePerTon: 100 },
    "wood": { name: "Wood", baseWeight: 3000, pricePerTon: 40 },
    "concrete": { name: "Concrete", baseWeight: 6000, pricePerTon: 120 },
    "drywall": { name: "Drywall", baseWeight: 2500, pricePerTon: 60 }
  };

  const currentMaterial = materials[material];
  const fullnessPercent = fullness / 100;
  
  // Calculate weights
  const includedWeight = currentMaterial.baseWeight;
  const estimatedWeight = Math.round(includedWeight * fullnessPercent);
  const overage = Math.max(0, estimatedWeight - includedWeight);
  
  // Calculate price
  const basePrice = 429; // Base dumpster rental price
  const overagePrice = (overage / 2000) * currentMaterial.pricePerTon;
  const totalPrice = Math.round(basePrice + overagePrice);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Estimator Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-3xl shadow-xl p-6 md:p-10 border-2 border-blue-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Weight & Price Estimator
            </h2>
            <p className="text-slate-600 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Get instant pricing based on your waste type
            </p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-2">
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Material Selection */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-900 mb-3">
            Material Type <span className="text-red-500">*</span>
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-base font-medium transition-all"
          >
            {Object.entries(materials).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fullness Slider */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-bold text-slate-900">
              How full is the dumpster?
            </label>
            <span className="text-2xl font-bold text-blue-600">{fullness}%</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-600">1/4</span>
            <input
              type="range"
              min="0"
              max="100"
              value={fullness}
              onChange={(e) => setFullness(parseInt(e.target.value))}
              className="flex-1 h-3 bg-gradient-to-r from-slate-300 to-blue-300 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs font-semibold text-slate-600">Full</span>
          </div>

          {/* Visual Labels */}
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-500">1/4 Full</span>
            <span className="text-xs text-slate-500">1/2 Full</span>
            <span className="text-xs text-slate-500">3/4 Full</span>
            <span className="text-xs text-slate-500">Full</span>
          </div>
        </motion.div>

        {/* Weight Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-8 border-2 border-slate-200"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Included Weight:</span>
              <span className="text-lg font-bold text-slate-900">{(includedWeight / 2000).toFixed(1)} Tons</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Estimated Weight:</span>
              <motion.span
                key={estimatedWeight}
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-lg font-bold text-blue-600"
              >
                {(estimatedWeight / 2000).toFixed(1)} Tons
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`font-medium ${overage > 0 ? "text-orange-600" : "text-green-600"}`}>
                Overage:
              </span>
              <motion.span
                key={overage}
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-lg font-bold ${overage > 0 ? "text-orange-600" : "text-green-600"}`}
              >
                {overage > 0 ? `+${(overage / 2000).toFixed(1)} Tons` : "None"}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Price Estimation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#FFD700] rounded-2xl p-6 mb-8 text-[#0A1628] shadow-lg"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0A1628]/80 mb-1">Estimated Total:</p>
              <p className="text-xs text-[#0A1628]/80">Based on {material.replace("-", " ")}</p>
            </div>
            <motion.div
              key={totalPrice}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-right"
            >
              <span className="text-5xl font-black">${totalPrice}</span>
              <p className="text-xs text-[#0A1628]/80 mt-1">*Varies by location</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBooking(!showBooking)}
            className="px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all"
          >
            Ask a Question
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBooking(!showBooking)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
          >
            Book a Dumpster
          </motion.button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 text-center mt-6">
          *Final pricing may vary based on location, demand, and actual waste type.
        </p>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { title: "💡 Tip 1", desc: "Account for heavy items like concrete or metal" },
          { title: "📦 Tip 2", desc: "Mix materials? Select the heaviest type" },
          { title: "⏰ Tip 3", desc: "Prices may increase during peak seasons" }
        ].map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-md"
          >
            <p className="font-bold text-slate-900 text-sm mb-1">{tip.title}</p>
            <p className="text-xs text-slate-600">{tip.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
