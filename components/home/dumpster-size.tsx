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

import { Star } from "lucide-react";

const dumpsterTypes = [
  {
    type: "roll-off",
    title: "Roll-off Dumpsters",
    color: "blue",
    image: "/images/roll-off-dumpster.png",
    border: "border-blue-300",
    text: "text-blue-900",
    price: "$295",
    priceBg: "bg-blue-600",
    priceText: "text-white",
    sizes: [
      { label: "10 Yard", slug: "10-yard" },
      { label: "15 Yard", slug: "15-yard" },
      { label: "20 Yard", slug: "20-yard" },
      { label: "30 Yard", slug: "30-yard" },
      { label: "40 Yard", slug: "40-yard" }
    ],
    features: [
      "Heavy-duty construction",
      "Easy loading from ground level",
      "Ideal for construction debris"
    ],
    detailsUrl: "/services/dumpster-rental/roll-off"
  },
  {
    type: "rubber-wheeled",
    title: "Rubber-wheeled Dumpsters",
    color: "cyan",
    image: "/images/rubber-wheel-dumpster.png",
    border: "border-cyan-300",
    text: "text-cyan-900",
    price: "$350",
    priceBg: "bg-cyan-600",
    priceText: "text-white",
    sizes: [
      { label: "10 Yard", slug: "10-yard" },
      { label: "15 Yard", slug: "15-yard" },
      { label: "20 Yard", slug: "20-yard" }
    ],
    features: [
      "Surface-friendly rubber wheels",
      "Perfect for asphalt & concrete",
      "Residential-friendly design"
    ],
    detailsUrl: "/services/dumpster-rental/rubber-wheeled"
  },
  {
    type: "permanent",
    title: "Permanent Dumpsters",
    color: "purple",
    image: "/images/permanent-dumpster.png",
    border: "border-purple-300",
    text: "text-purple-900",
    price: "$125/month",
    priceBg: "bg-purple-600",
    priceText: "text-white",
    sizes: [
      { label: "2 Yard", slug: "2-yard" },
      { label: "4 Yard", slug: "4-yard" },
      { label: "6 Yard", slug: "6-yard" },
      { label: "8 Yard", slug: "8-yard" }
    ],
    features: [
      "Commercial-grade durability",
      "Regular pickup schedules",
      "Lockable lids available"
    ],
    detailsUrl: "/services/dumpster-rental/permanent"
  }
];

export default function DumpsterTypeSelection() {
  return (
    <section id="dumpster-services" className="py-16 md:py-20 px-4 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Dumpster Type
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto">
            Select the perfect dumpster for your project needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dumpsterTypes.map((type, idx) => (
            <div
              key={type.title}
              className={`rounded-2xl border-2 ${type.border} bg-white shadow-lg flex flex-col overflow-hidden relative p-6`}
              style={{ minHeight: 520 }}
            >
              {/* Image */}
              <div className="flex justify-center mb-4">
                <img src={type.image} alt={type.title} className="h-28 object-contain" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${type.text}`}>{type.title}</h3>
              <p className="text-gray-700 mb-2">
                {idx === 0 && "Perfect for large construction projects, home renovations, and commercial waste disposal"}
                {idx === 1 && "Ideal for residential driveways and areas where surface protection is essential"}
                {idx === 2 && "Long-term waste management solutions for businesses and multi-unit properties"}
              </p>
              <div className="mb-2">
                <span className={`font-semibold ${type.text}`}>Available Sizes:</span>
                <div className="flex gap-2 flex-wrap mt-2">
                  {type.sizes.map((size) => (
                    <a
                      key={size.slug}
                      href={`/services/dumpster-rental/${type.type}/${size.slug}`}
                      className={`px-4 py-1 rounded-full font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
                        ${type.color === "blue" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                        ${type.color === "cyan" ? "bg-cyan-100 text-cyan-800 hover:bg-cyan-200" : ""}
                        ${type.color === "purple" ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
                        hover:scale-105 shadow-sm border border-transparent hover:border-gray-200`
                      }
                    >
                      {size.label}
                    </a>
                  ))}
                </div>
              </div>
              <ul className="my-4 space-y-2">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center text-base text-gray-800">
                    <Star className={`w-5 h-5 mr-2 ${type.color === "blue" ? "text-blue-400" : type.color === "cyan" ? "text-cyan-400" : "text-purple-400"}`} fill="currentColor" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4">
                <a
                  href={type.detailsUrl}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg font-bold py-3 text-base transition-colors
                    ${type.color === "blue" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                    ${type.color === "cyan" ? "bg-cyan-600 hover:bg-cyan-700 text-white" : ""}
                    ${type.color === "purple" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                  `}
                >
                  View Details <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


