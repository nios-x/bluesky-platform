"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ban,
  Battery,
  Check,
  ChevronRight,
  Star,
  Truck,
  X,
  MapPin,
  Phone
} from "lucide-react";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function PermanentProductPage({ params }: { params: { slug: string } }) {
  const product = {
    title: "6 Yard Permanent Dumpster",
    sku: "C-6-PERMANENT",
    price: "$165",
    rating: 4.8,
    reviews: 78,
    description: "Our 6 Yard commercial dumpsters are perfect for businesses with moderate waste generation. Flexible pickup schedules available.",
    capacity: "800-1,000 LBS / 24-32 Bags",
    included: ["Weekly Pickup", "Professional Service", "Flexible Schedule Options"],
    idealFor: [
      "Small commercial businesses",
      "Restaurants & cafes",
      "Retail shops",
      "Medical offices",
      "Regular waste management"
    ]
  };

  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    rentalDays: "30"
  });

  const handleCheckoutDataChange = (field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBuyNow = () => {
    setCheckoutStep(1);
    setShowCheckout(true);
  };

  const handleNextStep = () => {
    if (checkoutStep < 3) {
      setCheckoutStep(checkoutStep + 1);
    }
  };

  const handleCompleteCheckout = () => {
    alert(`Order confirmed for ${product.title}!\n\nA confirmation will be sent to ${checkoutData.email}`);
    setShowCheckout(false);
    setCheckoutStep(1);
  };

  return (
    <main className="bg-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
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
              <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                Sale
              </div>
              <ImageWithFallback
                src="Dumpster/Permanent Dumpsters/8 yard front load 1@1.5x.jpg"
                alt={product.title}
                className="object-cover w-full h-full"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden border cursor-pointer ${i === 1 ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-gray-100 hover:border-indigo-300'}`}>
                  <ImageWithFallback
                    src="/images/permanent-dumpster.png"
                    alt={`View ${i}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{product.title}</h1>
            <div className="text-sm text-gray-500 mb-6">SKU: <span className="font-mono text-gray-700">{product.sku}</span></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-indigo-600 font-medium hover:underline cursor-pointer">
                {product.reviews} Reviews
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-indigo-100 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-indigo-50 transition-colors cursor-pointer">
                <span className="text-xs text-indigo-600 font-bold uppercase mb-1">Capacity</span>
                <span className="font-bold text-gray-900">6 Yard</span>
              </div>
              <div className="border border-indigo-100 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-indigo-50 transition-colors cursor-pointer">
                <span className="text-xs text-indigo-600 font-bold uppercase mb-1">Pickup</span>
                <span className="font-bold text-gray-900">Weekly</span>
              </div>
            </div>

            {/* Configurator */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Business Location</label>
                  <input
                    type="text"
                    placeholder="Enter your business address"
                    className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Pickup Frequency</label>
                  <Select>
                    <SelectTrigger className="w-full bg-white h-10">
                      <SelectValue placeholder="Weekly" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Business Type</label>
                  <Select>
                    <SelectTrigger className="w-full bg-white h-10">
                      <SelectValue placeholder="Restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="medical">Medical Office</SelectItem>
                      <SelectItem value="office">Office Building</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-xs text-gray-500 uppercase font-bold">Starting at</span>
                <span className="text-4xl font-bold text-green-600">{product.price}</span>
                <span className="text-gray-600 text-lg">/week</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">{product.description}</p>
              <div className="flex gap-3">
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg"
                >
                  Buy Now
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="flex-1 h-12 border-green-500 text-green-600 hover:bg-green-50 font-bold text-lg rounded-lg"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Ideal For */}
          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Check className="w-5 h-5 text-green-500" />
              Ideal For
            </h3>
            <ul className="space-y-2">
              {product.idealFor.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">✓ {item}</li>
              ))}
            </ul>
          </div>

          {/* Weight Capacity */}
          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Battery className="w-5 h-5 text-blue-500" />
              Waste Capacity
            </h3>
            <p className="text-2xl font-bold text-[#008CBA] mb-2">{product.capacity}</p>
            <p className="text-sm text-gray-600">Safe operating limit for regular pickup</p>
          </div>

          {/* What's Included */}
          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Truck className="w-5 h-5 text-orange-500" />
              What's Included
            </h3>
            <ul className="space-y-2">
              {product.included.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">✓ {item}</li>
              ))}
            </ul>
          </div>

          {/* Excluded Materials */}
          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Ban className="w-5 h-5 text-red-500" />
              Excluded Materials
            </h3>
            <ul className="space-y-2">
              {[
                "Hazardous waste",
                "Electronics",
                "Asbestos",
                "Liquid waste"
              ].map((item, i) => (
                <li key={i} className="text-sm text-gray-700">✗ {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related Dumpsters */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Other Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "4 Yard Permanent Dumpster", price: 120.00, size: "4 Yard" },
              { name: "8 Yard Permanent Dumpster", price: 210.00, size: "8 Yard" }
            ].map((d, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <ImageWithFallback
                    src="/images/permanent-dumpster.png"
                    alt={d.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{d.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Starting at</p>
                    <p className="text-xl font-bold text-[#008CBA]">${d.price.toFixed(2)}/week</p>
                  </div>
                  <Button size="sm" className="bg-[#008CBA] hover:bg-[#007ba3]">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Checkout Modal */}
      {showCheckout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCheckout(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Checkout</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Product Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Product</p>
                <p className="text-lg font-bold text-gray-900">{product.title}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{product.price}</p>
              </div>

              {/* Step Indicator */}
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-1 rounded-full transition-all ${step <= checkoutStep ? "bg-green-500" : "bg-gray-200"
                      }`}
                  />
                ))}
              </div>

              {/* Step 1: Contact Info */}
              {checkoutStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={checkoutData.fullName}
                      onChange={(e) => handleCheckoutDataChange("fullName", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={checkoutData.email}
                      onChange={(e) => handleCheckoutDataChange("email", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={checkoutData.phone}
                      onChange={(e) => handleCheckoutDataChange("phone", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Address & Duration */}
              {checkoutStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                    <Input
                      type="text"
                      placeholder="123 Main Street"
                      value={checkoutData.address}
                      onChange={(e) => handleCheckoutDataChange("address", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <Input
                        type="text"
                        placeholder="Los Angeles"
                        value={checkoutData.city}
                        onChange={(e) => handleCheckoutDataChange("city", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <Input
                        type="text"
                        placeholder="90001"
                        value={checkoutData.zipCode}
                        onChange={(e) => handleCheckoutDataChange("zipCode", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Duration</label>
                    <Select value={checkoutData.rentalDays} onValueChange={(value) => handleCheckoutDataChange("rentalDays", value)}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {checkoutStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-900">{checkoutData.fullName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold text-gray-900">{checkoutData.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-semibold text-gray-900">{checkoutData.address}, {checkoutData.city} {checkoutData.zipCode}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-3 border-t">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-gray-900">{checkoutData.rentalDays} Days</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Total Price:</span>
                      <span className="text-3xl font-bold text-green-600">{product.price}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                {checkoutStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCheckoutStep(checkoutStep - 1)}
                    className="flex-1 rounded-lg"
                  >
                    Back
                  </Button>
                )}
                {checkoutStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (checkoutStep === 1 && (!checkoutData.fullName || !checkoutData.email || !checkoutData.phone)) ||
                      (checkoutStep === 2 && (!checkoutData.address || !checkoutData.city || !checkoutData.zipCode))
                    }
                    className={`flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg ${checkoutStep === 1 ? "w-full" : ""}`}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleCompleteCheckout}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    Complete Order
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </main>
  );
}
