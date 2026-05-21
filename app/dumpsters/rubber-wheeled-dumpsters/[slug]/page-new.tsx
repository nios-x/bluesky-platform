"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import {
  Check,
  ChevronRight,
  Truck,
  Weight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RubberWheeledProductPage({ params }: { params: { slug: string } }) {
  const productData: Record<string, any> = {
    "10-yard": {
      title: "10 Yard Rubber-Wheeled Dumpster",
      sku: "C-10-RUBBER",
      price: 310.00,
      rating: 4.8,
      reviews: 124,
      description: "Our 10 Yard Rubber-wheeled dumpsters are perfect for residential projects. The rubber wheels protect your driveway while being easy to move around your property.",
      capacity: "2 Tons / 4,000 LBS",
      dimensions: "14ft L x 7ft W x 4ft H",
      image: "/images/rubber-wheel-dumpster.png",
      included: ["Delivery and Pickup", "7 Days Rental Period", "Driveway Protection", "Wheel Locks"],
      idealFor: [
        "Home renovations",
        "Basement or attic cleanup",
        "Flooring removal for small houses",
        "100 sq ft of deck removal",
        "Yard debris cleanup",
        "Garage cleanouts"
      ],
      features: [
        "Rubber wheels protect driveways",
        "Easy to move and position",
        "Fits in residential driveways",
        "No property damage guaranteed"
      ]
    },
    "20-yard": {
      title: "20 Yard Rubber-Wheeled Dumpster",
      sku: "C-20-RUBBER",
      price: 412.00,
      rating: 4.8,
      reviews: 124,
      description: "Our 20 Yard Rubber-wheeled dumpsters are designed for larger residential and small commercial projects. The rubber wheels protect your property while handling substantial waste.",
      capacity: "2-3 Tons / 4,000 - 6,000 LBS",
      dimensions: "20ft L x 8ft W x 4.5ft H",
      image: "/images/rubber-wheel-dumpster.png",
      included: ["Delivery and Pickup", "7 Days Rental Period", "Driveway Protection", "Wheel Locks"],
      idealFor: [
        "Large home cleanouts",
        "Basement and attic cleanup",
        "Flooring and carpet removal for large house",
        "300 to 400 sq ft of deck removal",
        "2,500 to 3,000 sq ft of roof shingles",
        "Yard debris cleanup"
      ],
      features: [
        "Heavy-duty rubber wheels",
        "Driveway safe operation",
        "Large capacity for major projects",
        "Professional service included"
      ]
    },
    "30-yard": {
      title: "30 Yard Rubber-Wheeled Dumpster",
      sku: "C-30-RUBBER",
      price: 550.00,
      rating: 4.8,
      reviews: 124,
      description: "Our 30 Yard Rubber-wheeled dumpsters are ideal for major renovation projects and small commercial applications. Still features our signature driveway-safe wheels.",
      capacity: "3-4 Tons / 6,000 - 8,000 LBS",
      dimensions: "30ft L x 8ft W x 5ft H",
      image: "/images/rubber-wheel-dumpster.png",
      included: ["Delivery and Pickup", "7 Days Rental Period", "Driveway Protection", "Wheel Locks"],
      idealFor: [
        "Full house renovations",
        "Major commercial cleanouts",
        "Large demolition projects",
        "Multi-property cleanup",
        "Large commercial waste disposal",
        "Major construction debris"
      ],
      features: [
        "Maximum capacity rubber-wheeled option",
        "Heavy-duty construction",
        "Excellent for commercial use",
        "Professional delivery included"
      ]
    }
  };

  const product = productData[params.slug as string] || productData["20-yard"];

  return (
    <main className="bg-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/services" className="hover:text-blue-600">Services</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/services/dumpster-rental" className="hover:text-blue-600">Dumpster Rental</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/services/dumpster-rental/rubber-wheeled" className="hover:text-blue-600">Rubber-Wheeled</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{product.title}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Image */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-lg border-2 border-blue-100">
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                <span className="text-sm text-slate-600">/7 days</span>
              </div>
            </div>

            <p className="text-lg text-slate-700 leading-relaxed">
              {product.description}
            </p>

            {/* Key Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Weight className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-slate-900">Capacity</span>
                </div>
                <p className="text-sm text-slate-700">{product.capacity}</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-cyan-600" />
                  <span className="font-semibold text-slate-900">Dimensions</span>
                </div>
                <p className="text-sm text-slate-700">{product.dimensions}</p>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                What's Included
              </h3>
              <ul className="space-y-2">
                {product.included.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-lg text-lg">
              <Link href="/contact">
                Book Now - ${product.price}/week
              </Link>
            </Button>
          </div>
        </div>

        {/* Ideal For Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ideal For</h2>
            <ul className="space-y-3">
              {product.idealFor.map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Key Features</h2>
            <ul className="space-y-3">
              {product.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why Choose Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6">Why Blue Sky Disposal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🚀", title: "Quick Delivery", desc: "Same-day delivery available" },
              { icon: "👥", title: "Expert Team", desc: "Professional service always" },
              { icon: "💰", title: "Best Price", desc: "Competitive rates guaranteed" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Common Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "How long can I rent?", a: "Standard rental period is 7 days. Longer rentals available upon request." },
              { q: "What happens if I go over weight limit?", a: "Additional tonnage fees apply. Contact us for pricing on overage." },
              { q: "Will rubber wheels damage my driveway?", a: "No! Our rubber wheels are specially designed to protect driveways and other surfaces." },
              { q: "Can it fit in my driveway?", a: "Yes! Rubber-wheeled dumpsters are designed to fit standard residential driveways." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-700 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
