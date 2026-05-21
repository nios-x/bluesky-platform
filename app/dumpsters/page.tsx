"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { WeightPriceEstimator } from "@/components/home/weight-price-estimator";

export default function ServicesPage() {
  const dumpsterTypes = [
    {
      type: "roll-off",
      slug: "roll-off",
      name: "Roll-off Dumpsters",
      description:
        "Perfect for large construction projects, home renovations, and commercial waste disposal",
      image: "/images/roll-off-dumpster.png",
      sizes: ["10 Yard", "15 Yard", "20 Yard", "30 Yard", "40 Yard"],
      features: [
        "Heavy-duty construction",
        "Easy loading from ground level",
        "Ideal for construction debris",
        "Available in multiple sizes"
      ],
      priceRange: "Starting at $295",
      borderColor: "border-blue-400",
      accentGradient: "from-blue-500 to-blue-600"
    },
    {
      type: "rubber-wheeled",
      slug: "rubber-wheeled",
      name: "Rubber-wheeled Dumpsters",
      description:
        "Ideal for residential driveways and areas where surface protection is essential",
      image: "/images/rubber-wheel-dumpster.png",
      sizes: ["10 Yard", "15 Yard", "20 Yard"],
      features: [
        "Surface-friendly rubber wheels",
        "Perfect for asphalt & concrete",
        "Residential-friendly design",
        "Easy maneuverability"
      ],
      priceRange: "Starting at $350",
      borderColor: "border-cyan-400",
      accentGradient: "from-cyan-500 to-cyan-600"
    },
    {
      type: "permanent",
      slug: "permanent",
      name: "Permanent Dumpsters",
      description:
        "Long-term waste management solutions for businesses and multi-unit properties",
      image: "/images/permanent-dumpster.png",
      sizes: ["2 Yard", "4 Yard", "6 Yard", "8 Yard"],
      features: [
        "Commercial-grade durability",
        "Regular pickup schedules",
        "Lockable lids available",
        "Custom branding options"
      ],
      priceRange: "Starting at $125/month",
      borderColor: "border-purple-400",
      accentGradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Dumpster Rental Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl text-blue-50 max-w-3xl mx-auto"
            >
              Professional waste management solutions for every project size and type
            </motion.p>
          </div>
        </section>

        {/* Dumpster Types Grid - Enhanced with colors */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Choose Your Dumpster Type
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Select the perfect dumpster for your project needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dumpsterTypes.map((dumpster, index) => (
                <motion.div
                  key={dumpster.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`bg-white rounded-2xl border-3 ${dumpster.borderColor} overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group h-full flex flex-col`}>
                    {/* Image with gradient overlay */}
                    <div className="relative w-full h-64 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                      <img
                        src={dumpster.image}
                        alt={dumpster.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      <div className={`absolute top-4 right-4 bg-gradient-to-r ${dumpster.accentGradient} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                        {dumpster.priceRange}
                      </div>
                    </div>

                    {/* Content with color accents */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-1 h-8 bg-gradient-to-b ${dumpster.accentGradient} rounded-full`}></div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {dumpster.name}
                        </h3>
                      </div>
                      <p className="text-slate-600 mb-4 flex-1">
                        {dumpster.description}
                      </p>

                      {/* Sizes with gradient background */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-900 mb-2">
                          Available Sizes:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {dumpster.sizes.map((size) => (
                            <span
                              key={size}
                              className={`px-3 py-1 bg-gradient-to-r ${dumpster.accentGradient} text-white rounded-full text-sm font-medium shadow-sm`}
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Features with icons */}
                      <div className="mb-6">
                        <ul className="space-y-2">
                          {dumpster.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button with gradient */}
                      <Link href={`/services/dumpster-rental/${dumpster.slug}`}>
                        <Button className={`w-full bg-gradient-to-r ${dumpster.accentGradient} hover:shadow-xl text-white transition-all font-semibold`}>
                          View Details
                          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Weight & Price Estimator Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Get Your Price Instantly
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Use our weight & price estimator to get an accurate quote based on your waste type and dumpster fullness
              </p>
            </motion.div>

            <WeightPriceEstimator />
          </div>
        </section>

        {/* CTA Section - Fixed Size Guide button */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Need Help Choosing?
            </h2>
            <p className="text-xl text-blue-50 mb-8">
              Our team is here to help you select the perfect dumpster for your project
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 h-12 shadow-lg"
                >
                  Contact Us
                </Button>
              </Link>
              <Link href="/size-guide" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold px-8 h-12 shadow-lg"
                >
                  Size Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
