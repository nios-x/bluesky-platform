"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertOctagon,
  AlertTriangle,
  Ban,
  Battery,
  Check,
  ChevronRight,
  Droplet,
  Flame,
  Minus,
  Plus,
  Star,
  Truck
} from "lucide-react";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useState } from "react";

export default function DumpsterProductPage({ params }: { params: { slug: string } }) {
  // Mock data - in a real app this would fetch based on 'params.slug'
  const product = {
    title: "20 Yard Rubber-wheeled Dumpster",
    sku: "C-20-RUBBER-WHEELED",
    price: 412.00,
    rating: 4.8,
    reviews: 124,
    description: "Our 20 Yard Rubber Wheel dumpsters are designed to handle various types of waste, from household debris to construction materials. The rubber wheels protect your driveway/property.",
    capacity: "2-3 Tons / 4,000 - 6,000 LBS",
    included: ["Delivery and Pickup", "7 Days Rental Period", "Driveway protection"],
    idealFor: [
      "Large home cleanouts",
      "Basement, attic, or garage cleanup",
      "Flooring and carpet removal for a large house",
      "300 to 400 square feet of deck removal",
      "2,500 to 3,000 sq. ft. of roof shingles (single layer)",
      "Yard debris cleanup"
    ]
  };

  const [quantity, setQuantity] = useState(1);
  const [zipCode, setZipCode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  return (
    <main className="bg-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb - Optional but good for UX */}
        <div className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/services/dumpster-rental" className="hover:text-blue-600">Services</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column - Images */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-6">
              <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                Sale
              </div>
              <ImageWithFallback
                src="/images/rubber-wheel-dumpster.png"
                alt={product.title}
                className="object-cover w-full h-full"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden border cursor-pointer ${i === 1 ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-100 hover:border-blue-300'}`}>
                  <ImageWithFallback
                    src="/images/rubber-wheel-dumpster.png"
                    alt={`View ${i}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-[#008CBA] mb-2">{product.title}</h1>
            <div className="text-sm text-gray-500 mb-6">SKU: <span className="font-mono text-gray-700">{product.sku}</span></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                {product.reviews} Reviews
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-blue-100 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors cursor-pointer">
                <span className="text-xs text-blue-600 font-bold uppercase mb-1">Weight Limit</span>
                <span className="font-bold text-gray-900">2 Ton</span>
              </div>
              <div className="border border-blue-100 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors cursor-pointer">
                <span className="text-xs text-blue-600 font-bold uppercase mb-1">Rental Period</span>
                <span className="font-bold text-gray-900">7 Days</span>
              </div>
            </div>

            {/* Configurator */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Zip Code</label>
                  <input
                    type="text"
                    placeholder="Enter Zip Code"
                    className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Rental Dates</label>
                  <input
                    type="date"
                    className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Usage Type</label>
                  <Select>
                    <SelectTrigger className="w-full bg-white h-10">
                      <SelectValue placeholder="Home Renovation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Renovation</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="cleanout">Cleanout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-red-500 font-medium mb-1">Price includes delivery & pickup</p>
                    <div className="text-3xl font-bold text-[#008CBA]">${product.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-32 flex items-center border border-gray-300 rounded-lg bg-white h-12">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center font-bold text-gray-900">{quantity}</div>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <Button className="flex-1 h-12 bg-[#008CBA] hover:bg-[#007ba3] text-white font-bold text-lg shadow-lg">
                    Add to Cart
                  </Button>
                </div>
                <div className="text-center mt-3">
                  <span className="text-xs text-gray-500">Please note: 24h notice required for delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Sections (Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

          {/* Ideal For */}
          <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#008CBA] mb-6 border-b border-blue-50 pb-4">Ideal For</h3>
            <ul className="space-y-3">
              {product.idealFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-blue-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Weight Capacity */}
          <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#008CBA] mb-6 border-b border-blue-50 pb-4">Weight Capacity</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{product.capacity}</p>
                <p className="text-sm text-gray-500">Maximum legal road weight</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
              Exceeding the weight limit may result in additional charges of $75 per ton pro-rated. Please ensure heavy materials like dirt or concrete are discussed beforehand.
            </p>
          </div>

          {/* What's Included */}
          <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#008CBA] mb-6 border-b border-blue-50 pb-4">What's Included</h3>
            <ul className="space-y-4">
              {product.included.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Excluded Materials */}
          <div className="bg-white border border-red-100 rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-red-600 mb-6 border-b border-red-50 pb-4">Excluded Material</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Ban, name: "Tires" },
                { icon: Droplet, name: "Liquid" },
                { icon: AlertTriangle, name: "Hazardous" },
                { icon: AlertOctagon, name: "Drums" },
                { icon: Flame, name: "Chemical" },
                { icon: Battery, name: "Batteries" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:bg-red-100 transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Related Dumpsters */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Related Dumpsters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "30 Yard Rubber-wheeled Dumpster", price: 550.00, size: "30 Yard" },
              { name: "10 Yard Rubber-wheeled Dumpster", price: 380.00, size: "10 Yard" }
            ].map((d, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <ImageWithFallback
                    src="/images/rubber-wheel-dumpster.png"
                    alt={d.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{d.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Starting at</p>
                    <p className="text-xl font-bold text-[#008CBA]">${d.price.toFixed(2)}</p>
                  </div>
                  <Button size="sm" className="bg-[#008CBA] hover:bg-[#007ba3]">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
