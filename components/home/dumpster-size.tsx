"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const dumpsterSizes = [
  {
    size: "10 Yard Dumpster",
    dimensions: "14' ⬚ 8ft ⬚ 3\"",
    bestFor: "Best for\nBasement Cleanout",
    price: "$299",
    action: "SELECT"
  },
  {
    size: "15 Yard Dumpster",
    dimensions: "16' ⬚ 8 - 4\"",
    bestFor: "Perfect for\nRoofing Shingles",
    price: "$349",
    action: "SELECT"
  },
  {
    size: "20 Yard Dumpster",
    dimensions: "22' ⬚ 8 - 6\"",
    bestFor: "Ideal for\nRemodeling Projects",
    price: "$399",
    action: "SELECT"
  },
  {
    size: "30 Yard Dumpster",
    dimensions: "22' ⬚ 8 - 6\"",
    bestFor: "Great for\nLarge Demolition",
    price: "$449",
    action: "SELECT"
  }
];

export default function DumpsterTypeSelection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Grid of Dumpster Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dumpsterSizes.map((dumpster, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              {/* Dumpster Image Placeholder */}
              <div className="relative w-full h-48 bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center border-b-2 border-slate-200">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-900 mb-2">📦</div>
                  <p className="text-slate-600 text-sm">Dumpster Image</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Size Name */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{dumpster.size}</h3>

                {/* Dimensions */}
                <p className="text-slate-700 text-sm font-semibold mb-4">{dumpster.dimensions}</p>

                {/* Best For */}
                <p className="text-slate-900 font-semibold mb-4 text-sm leading-relaxed whitespace-pre-line">
                  {dumpster.bestFor}
                </p>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Price */}
                <div className="mb-4 pt-4 border-t-2 border-slate-200">
                  <p className="text-slate-600 text-sm mb-1">Starts at</p>
                  <p className="text-2xl font-bold text-slate-900">{dumpster.price}</p>
                </div>

                {/* SELECT Button */}
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg">
                  {dumpster.action}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
