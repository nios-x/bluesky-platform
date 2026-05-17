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
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white via-[#f7faff] to-white relative overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0a1e63]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#efc73f]/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#efc73f]/10 px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4 text-[#efc73f]" />
            <span className="text-sm font-semibold text-[#efc73f]">Fast & Local</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0a1e63] mb-4">
            Serving Southeast Michigan
          </h2>
          <p className="text-[#0a1e63] text-lg max-w-2xl mx-auto">
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
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-[#0a1e63]/10">
              <Image
                src="/service-map.png"
                alt="Michigan Service Area"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e63]/20 to-transparent" />
            </div>

            {/* Stats Below Map */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-[#0a1e63]/5 to-[#efc73f]/10 rounded-2xl p-6 border border-[#0a1e63]/20"
              >
                <p className="text-sm text-[#0a1e63] mb-1">Cities Served</p>
                <p className="text-3xl font-bold text-[#0a1e63]">6+</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-[#efc73f]/10 to-white rounded-2xl p-6 border border-[#efc73f]/30"
              >
                <p className="text-sm text-[#efc73f] mb-1">Coverage Area</p>
                <p className="text-3xl font-bold text-[#efc73f]">500K+</p>
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
            <h3 className="text-2xl font-bold text-[#0a1e63] mb-6">Popular Cities</h3>
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
                    className="group p-4 md:p-5 rounded-2xl bg-gradient-to-r from-white to-[#f7faff] border-2 border-[#0a1e63]/10 hover:border-[#efc73f] hover:shadow-lg hover:from-[#f7faff] hover:to-[#efc73f]/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#0a1e63] group-hover:bg-[#efc73f] group-hover:scale-150 transition-transform" />
                        <span className="font-semibold text-[#0a1e63] group-hover:text-[#efc73f] transition-colors text-lg">
                          {city.name}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#0a1e63] group-hover:text-[#efc73f] group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Info Box */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#fff8e1] to-[#efc73f]/10 border-2 border-[#efc73f]/30"
            >
              <p className="text-sm md:text-base text-[#0a1e63]">
                <span className="font-bold text-[#efc73f]">Beyond the map?</span> We likely serve your area. Check availability when booking.
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0a1e63] to-[#efc73f] hover:from-[#0a1e63] hover:to-[#efc73f]/80 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <MapPin className="w-5 h-5 text-white" />
              Find Your Service Area
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
