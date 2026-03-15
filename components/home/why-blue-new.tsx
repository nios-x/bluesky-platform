"use client";

import { motion } from "framer-motion";
import { Award, Clock, MapPin, Users, Heart, Zap, Shield, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    emoji: "👩‍💼",
    title: "Woman-Owned",
    description: "Proudly woman-owned and operated, supporting diversity in business.",
    bgLight: "from-white to-blue-50",
    border: "border-blue-300"
  },
  {
    emoji: "⚡",
    title: "Fast & Reliable",
    description: "Quick response and dependable service, every time.",
    bgLight: "from-white to-[#ffebc1]",
    border: "border-[#FFD700]"
  },
  {
    emoji: "💲",
    title: "Transparent Pricing",
    description: "No hidden fees—clear, upfront pricing for all rentals.",
    bgLight: "from-white to-[#fff8e1]",
    border: "border-[#FFD700]"
  },
  {
    emoji: "⏰",
    title: "On-Time Service",
    description: "We value your time and guarantee punctual delivery and pickup.",
    bgLight: "from-white to-blue-100",
    border: "border-blue-300"
  },
  {
    emoji: "📍",
    title: "Local & Trusted",
    description: "Serving Southeast Michigan with a reputation you can trust.",
    bgLight: "from-white to-[#ffebc1]",
    border: "border-[#FFD700]"
  }
];

const values = [
  {
    icon: Heart,
    title: "Customer Care",
    description: "Your satisfaction is our priority"
  },
  {
    icon: Zap,
    title: "Fast Service",
    description: "Same-day delivery in most areas"
  },
  {
    icon: Shield,
    title: "Reliable",
    description: "Always on-time, always professional"
  },
  {
    icon: Trophy,
    title: "Quality",
    description: "Michigan's best dumpster service"
  }
];

export default function WhyBlueSky() {
  return (
    <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-white via-blue-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 flex flex-wrap items-center justify-center gap-1">
            <span className="text-[#0a1e63]">Why</span>
            <span className="text-[#0a1e63]">Blue</span>
            <span className="text-[#efc73f]">Sky</span>
            <span className="text-[#0a1e63]">Disposal?</span>
          </h2>
          <p className="text-blue-800 text-lg max-w-2xl mx-auto">
            We're Michigan's trusted dumpster rental partner—backed by years of experience and committed to exceptional service.
          </p>
          {/* Removed ratings row as requested */}
        </motion.div>

        {/* Main Features Grid - Custom 5 Boxes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className={`group bg-gradient-to-br ${feature.bgLight} rounded-2xl p-8 border-2 ${feature.border} hover:shadow-xl transition-all flex flex-col items-center`}
            >
              <div className="w-16 h-16 flex items-center justify-center text-4xl mb-6 bg-white/70 rounded-full shadow">
                {feature.emoji}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>



        {/* Removed broad blue color box with sparkles as requested */}

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by Thousands of Michigan Residents
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "4.9★", label: "Customer Rating" },
              { number: "1000+", label: "5-Star Reviews" },
              { number: "24/7", label: "Customer Support" },
              { number: "100%", label: "Women Owned Company" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
