"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Package, Zap } from "lucide-react";

const dumpsterSizes = [
  {
    size: "10 Yard Dumpster",
    dimensions: "14' × 8ft × 3\"",
    price: "$299",
    features: [
      { icon: Package, label: "Included", detail: "Basic tarp & pickup" },
      { icon: Zap, label: "Weight Limit", detail: "2,500-3,000 lbs" },
      { icon: Check, label: "Best For", detail: "Basement cleanout, garage clearing" }
    ],
    color: "from-blue-50 to-blue-100",
    borderColor: "border-blue-300",
    buttonColor: "bg-blue-600 hover:bg-blue-700"
  },
  {
    size: "15 Yard Dumpster",
    dimensions: "16' × 8-4\"",
    price: "$349",
    features: [
      { icon: Package, label: "Included", detail: "Tarping & daily monitoring" },
      { icon: Zap, label: "Weight Limit", detail: "3,500-4,000 lbs" },
      { icon: Check, label: "Best For", detail: "Roofing shingles, small renovations" }
    ],
    color: "from-cyan-50 to-cyan-100",
    borderColor: "border-cyan-300",
    buttonColor: "bg-cyan-600 hover:bg-cyan-700",
    badge: "Popular"
  },
  {
    size: "20 Yard Dumpster",
    dimensions: "22' × 8-6\"",
    price: "$399",
    features: [
      { icon: Package, label: "Included", detail: "Full service with optional extension" },
      { icon: Zap, label: "Weight Limit", detail: "6,000-8,000 lbs" },
      { icon: Check, label: "Best For", detail: "Remodeling projects, deck removal" }
    ],
    color: "from-green-50 to-green-100",
    borderColor: "border-green-300",
    buttonColor: "bg-green-600 hover:bg-green-700"
  },
  {
    size: "30 Yard Dumpster",
    dimensions: "22' × 8-6\"",
    price: "$449",
    features: [
      { icon: Package, label: "Included", detail: "Premium service included" },
      { icon: Zap, label: "Weight Limit", detail: "9,000-12,000 lbs" },
      { icon: Check, label: "Best For", detail: "Large demolition, whole house cleanup" }
    ],
    color: "from-orange-50 to-orange-100",
    borderColor: "border-orange-300",
    buttonColor: "bg-orange-600 hover:bg-orange-700"
  }
];

export default function DumpsterTypeSelection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Dumpster Sizes to Fit Your Needs
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto">
            Choose from four convenient sizes. All rentals include delivery, pickup, and professional customer support.
          </p>
        </motion.div>

        {/* Grid of Dumpster Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dumpsterSizes.map((dumpster, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative bg-gradient-to-br ${dumpster.color} rounded-2xl md:rounded-3xl overflow-hidden border-2 ${dumpster.borderColor} shadow-lg hover:shadow-xl transition-all flex flex-col hover:scale-105`}
            >
              {/* Badge */}
              {dumpster.badge && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {dumpster.badge}
                </div>
              )}

              {/* Header Section */}
              <div className="p-6 md:p-8 pb-4 border-b-2" style={{ borderColor: 'currentColor' }}>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{dumpster.size}</h3>
                <p className="text-slate-700 font-semibold text-sm md:text-base mb-4">{dumpster.dimensions}</p>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                  <span className="text-2xl text-slate-600">Starts at </span>
                  {dumpster.price}
                </div>
                <p className="text-xs md:text-sm text-slate-600">All fees included</p>
              </div>

              {/* Features Section */}
              <div className="p-6 md:p-8 flex-1 flex flex-col space-y-4">
                {dumpster.features.map((feature, featureIdx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={featureIdx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm md:text-base">{feature.label}</p>
                        <p className="text-xs md:text-sm text-slate-600 leading-tight">{feature.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Button */}
              <div className="p-6 md:p-8 pt-0">
                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${dumpster.buttonColor} text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg text-sm md:text-base`}
                    >
                      Select & Book
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-blue-50 rounded-2xl p-8 md:p-12 border-2 border-blue-300 text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Can't Decide?</h3>
          <p className="text-slate-700 mb-6 text-base md:text-lg">
            Use our size calculator to get a personalized recommendation based on your project type and materials.
          </p>
          <Link href="/#calculator">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-base">
              Try Calculator
            </Button>
          </Link>
        </motion.div>

        {/* Mobile-Friendly Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 md:p-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-300"
        >
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span> Need Help Choosing?
          </h3>
          <ul className="space-y-3 text-slate-700 text-sm md:text-base">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Overfill?</strong> We charge per excess weight (usually $0.10/lb)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Underfull?</strong> No penalty—keep the dumpster as long as you need</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Upgrade?</strong> Switch sizes anytime during your rental without extra fees</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
