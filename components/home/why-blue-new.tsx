"use client";

import { motion } from "framer-motion";
import { Award, Clock, MapPin, Users, Heart, Zap, Shield, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Award,
    title: "Women-Owned Company",
    description: "Founded and led by strong women entrepreneurs committed to excellence",
    gradient: "from-pink-500 to-rose-500",
    bgLight: "from-pink-50 to-rose-50",
    border: "border-pink-200"
  },
  {
    icon: Clock,
    title: "15+ Years Experience",
    description: "Over a decade of trusted service and expertise in waste management",
    gradient: "from-blue-500 to-indigo-500",
    bgLight: "from-blue-50 to-indigo-50",
    border: "border-blue-200"
  },
  {
    icon: MapPin,
    title: "6+ Cities Served",
    description: "Comprehensive coverage across Southeast Michigan",
    gradient: "from-cyan-500 to-blue-500",
    bgLight: "from-cyan-50 to-blue-50",
    border: "border-cyan-200"
  },
  {
    icon: Users,
    title: "1,000+ Happy Customers",
    description: "Trusted by homeowners and businesses for reliable service",
    gradient: "from-teal-500 to-emerald-500",
    bgLight: "from-teal-50 to-emerald-50",
    border: "border-teal-200"
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
    <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-full mb-4">
            <Trophy className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-semibold text-pink-600">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Why <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Blue Sky</span> Disposal?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're Michigan's trusted dumpster rental partner—founded by women entrepreneurs, backed by years of experience, and committed to exceptional service.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className={`group bg-gradient-to-br ${feature.bgLight} rounded-2xl p-8 border-2 ${feature.border} hover:shadow-xl transition-all`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </motion.div>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600 group-hover:bg-clip-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Core Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-200 p-8 md:p-16 mb-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Core Values
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-blue-100"
                  >
                    <Icon className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                  </motion.div>
                  <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Woman-Led Highlight with Sparkle Magic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative"
        >
          {/* Sparkle animations in background */}
          <motion.div
            className="absolute top-10 right-20 text-4xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 1, 0.3],
              rotate: [0, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-10 text-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            💫
          </motion.div>
          <motion.div
            className="absolute top-1/2 right-10 text-2xl"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.7, 0.2]
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          >
            ⭐
          </motion.div>

          <div className="absolute top-0 right-0 w-80 h-80 bg-white/8 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl -z-10" />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Our Story</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Founded by Women Entrepreneurs
              </h3>
              <p className="text-white/95 text-lg leading-relaxed mb-8">
                Blue Sky Disposal was built by Migena, Annie, and Elvana—three entrepreneurial women determined to revolutionize Michigan's waste management industry. We bring passion, integrity, and excellence to every customer interaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button className="bg-white text-blue-600 hover:bg-cyan-50 font-bold px-6 py-3 rounded-xl">
                    Our Story
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl border-2 border-white">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="hidden md:flex items-center justify-center relative"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  filter: ["drop-shadow(0 0 0px rgba(255,255,255,0))", "drop-shadow(0 0 20px rgba(255,255,255,0.8))", "drop-shadow(0 0 0px rgba(255,255,255,0))"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl"
              >
                👩‍💼👩‍💼👩‍💼
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

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
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "4.9★", label: "Customer Rating" },
              { number: "1000+", label: "5-Star Reviews" },
              { number: "24/7", label: "Customer Support" }
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
