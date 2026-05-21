//app/services/dumpster-rental/roll-off/[slug]/page.tsx
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
  Check,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Truck,
  X,
  MapPin,
  Phone,
  Ban,
  Droplet,
  AlertTriangle,
  AlertOctagon,
  Flame,
  Battery
} from "lucide-react";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function RollOffProductPage({ params }: { params: { slug: string } }) {
  const product = {
    title: "20 Yard Roll-Off Dumpster",
    sku: "C-20-ROLLOFF",
    price: 380.00,
    rating: 4.8,
    reviews: 95,
    description: "Our 20 Yard Roll-Off dumpsters are perfect for mid-sized projects. Ideal for major home cleanouts, roofing jobs, and driveway replacements.",
    capacity: "3-4 Tons / 6,000 - 8,000 LBS",
    included: ["Delivery and Pickup", "7 Days Rental Period", "Up to 3 Ton Weight Limit"],
    idealFor: [
      "Large home cleanouts",
      "Roofing debris (up to 40 sq.)",
      "Kitchen/Bath renovations",
      "Deck demolition",
      "Carpet removal for large house"
    ]
  };

  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [zipCode, setZipCode] = useState("");
  const [rentalDate, setRentalDate] = useState("");
  const [usageType, setUsageType] = useState("construction");
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    rentalDays: "7"
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
    <main className="bg-gradient-to-b from-white via-blue-50 to-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 mb-8 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/services/dumpster-rental" className="hover:text-blue-600 transition-colors">Services</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.title}</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column - Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl overflow-hidden border-2 border-blue-200 mb-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full z-10 shadow-lg">
                🔥 On Sale
              </div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000"
                alt={product.title}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500", label: "View 1" },
                { src: "https://images.unsplash.com/photo-1558731991-cb3430a08bb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500", label: "View 2" },
                { src: "https://images.unsplash.com/photo-1633213476838-1c1af8e1b4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500", label: "View 3" },
                { src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500", label: "View 4" }
              ].map((view, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200 hover:border-blue-400'}`}
                >
                  <ImageWithFallback
                    src={view.src}
                    alt={view.label}
                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">{product.title}</h1>
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
                <span className="font-bold text-gray-900">3 Ton</span>
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
                      <SelectValue placeholder="Construction Debris" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construction Debris</SelectItem>
                      <SelectItem value="household">Household Junk</SelectItem>
                      <SelectItem value="roofing">Roofing Shingles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-300">
                <div className="mb-6">
                  <p className="text-sm text-green-600 font-semibold mb-2">✓ Price includes delivery & pickup</p>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">${product.price.toFixed(2)}</div>
                  <p className="text-sm text-gray-600 mt-1">for 7-day rental period</p>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="w-32 flex items-center border-2 border-gray-300 rounded-lg bg-white h-12">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center font-bold text-gray-900">{quantity}</div>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 flex-col sm:flex-row">
                  <Button 
                    onClick={handleBuyNow}
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-lg"
                  >
                    Buy Now
                  </Button>
                  <Button className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-lg">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
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
              Heavy materials such as dirt, concrete, and brick cannot be mixed with other debris in roll-off dumpsters. Please contact us for specialized disposal options.
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
              { name: "30 Yard Roll-Off Dumpster", price: 450.00, size: "30 Yard" },
              { name: "10 Yard Roll-Off Dumpster", price: 320.00, size: "10 Yard" }
            ].map((d, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <ImageWithFallback
                    src={i === 0 ? "/images/roll-off-30-yard-product.jpg" : "/images/roll-off-10-yard-product.jpg"}
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

      {/* Quick Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Quick Checkout</h2>
                <p className="text-blue-100 text-sm mt-1">Step {checkoutStep} of 3</p>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300"
                style={{ width: `${(checkoutStep / 3) * 100}%` }}
              ></div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Step 1: Contact Info */}
              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block">Full Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={checkoutData.fullName}
                      onChange={(e) => handleCheckoutDataChange("fullName", e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={checkoutData.email}
                      onChange={(e) => handleCheckoutDataChange("email", e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={checkoutData.phone}
                      onChange={(e) => handleCheckoutDataChange("phone", e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Address */}
              {checkoutStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Street Address
                    </label>
                    <Input
                      type="text"
                      placeholder="123 Main Street"
                      value={checkoutData.address}
                      onChange={(e) => handleCheckoutDataChange("address", e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-800 mb-2 block">City</label>
                      <Input
                        type="text"
                        placeholder="New York"
                        value={checkoutData.city}
                        onChange={(e) => handleCheckoutDataChange("city", e.target.value)}
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-800 mb-2 block">Zip Code</label>
                      <Input
                        type="text"
                        placeholder="10001"
                        value={checkoutData.zipCode}
                        onChange={(e) => handleCheckoutDataChange("zipCode", e.target.value)}
                        className="h-11 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      Rental Duration
                    </label>
                    <Select value={checkoutData.rentalDays} onValueChange={(val) => handleCheckoutDataChange("rentalDays", val)}>
                      <SelectTrigger className="h-11 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Days - $50 discount</SelectItem>
                        <SelectItem value="7">7 Days - Standard</SelectItem>
                        <SelectItem value="14">14 Days - Save more</SelectItem>
                        <SelectItem value="30">30 Days - Best value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Order Summary */}
              {checkoutStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product</span>
                        <span className="font-semibold text-gray-900">{product.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-semibold text-gray-900">{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rental Period</span>
                        <span className="font-semibold text-gray-900">{checkoutData.rentalDays} Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Location</span>
                        <span className="font-semibold text-gray-900">{checkoutData.city}, {checkoutData.zipCode}</span>
                      </div>
                      <div className="border-t border-blue-300 pt-3 flex justify-between">
                        <span className="text-gray-900 font-bold">Total Price</span>
                        <span className="text-2xl font-bold text-blue-600">${(product.price * quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900">Confirmation</p>
                      <p className="text-green-700">We'll send a confirmation email to <span className="font-semibold">{checkoutData.email}</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="bg-gray-50 px-8 py-6 flex gap-3 border-t">
              {checkoutStep > 1 && (
                <Button
                  onClick={() => setCheckoutStep(checkoutStep - 1)}
                  variant="outline"
                  className="flex-1 h-12 rounded-lg border-2 border-gray-300"
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteCheckout}
                  className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white h-12 rounded-lg font-bold"
                >
                  Complete Order
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </main>
  );
}
