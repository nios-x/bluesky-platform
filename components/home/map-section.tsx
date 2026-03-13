"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Zap } from "lucide-react";

const cities = [
  { name: "Detroit", slug: "detroit" },
  { name: "Warren", slug: "warren" },
  { name: "Sterling Heights", slug: "sterling-heights" },
  { name: "Livonia", slug: "livonia" },
  { name: "Troy", slug: "troy" },
  { name: "Dearborn", slug: "dearborn" }
];

export default function MapSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white relative overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Fast & Local</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Serving Southeast Michigan
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Click on your city to see local permits, rules, and available services
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Map and Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Map Image */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/service-map.png"
                alt="Michigan Service Area"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Stats Below Map */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
              >
                <p className="text-sm text-slate-600 mb-1">Cities Served</p>
                <p className="text-3xl font-bold text-blue-600">6+</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 border border-cyan-200"
              >
                <p className="text-sm text-slate-600 mb-1">Coverage Area</p>
                <p className="text-3xl font-bold text-cyan-600">500K+</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: City List */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Popular Cities</h3>
            <div className="space-y-3">
              {cities.map((city, idx) => (
                <Link
                  key={city.slug}
                  href={`/cities/${city.slug}`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 10 }}
                    className="group p-4 md:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-600 group-hover:scale-150 transition-transform" />
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-lg">
                          {city.name}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Info Box */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200"
            >
              <p className="text-sm md:text-base text-slate-800">
                <span className="font-bold text-orange-600">Beyond the map?</span> We likely serve your area. Check availability when booking.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <MapPin className="w-5 h-5" />
              Find Your Service Area
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
