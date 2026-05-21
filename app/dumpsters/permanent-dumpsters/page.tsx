"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Check, ChevronRight, Clock, Truck, X, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PermanentPage() {
  const dumpsters = [
    {
      size: "2 Yard",
      title: "2 Yard Permanent Dumpster",
      image: "/images/permanent-dumpster.png",
      slug: "2-yard",
      price: "$150",
      capacity: "2 tons",
      popular: false,
      useCases: [
        "Small office buildings",
        "Medical clinics",
        "Professional services",
        "Light commercial waste"
      ]
    },
    {
      size: "4 Yard",
      title: "4 Yard Permanent Dumpster",
      image: "/images/permanent-dumpster.png",
      slug: "4-yard",
      price: "$250",
      capacity: "4 tons",
      popular: true,
      useCases: [
        "Restaurants & cafes",
        "Retail stores",
        "Small warehouses",
        "Regular business waste"
      ]
    },
    {
      size: "6 Yard",
      title: "6 Yard Permanent Dumpster",
      image: "/images/permanent-dumpster.png",
      slug: "6-yard",
      price: "$350",
      capacity: "6 tons",
      popular: false,
      useCases: [
        "Large commercial operations",
        "Manufacturing facilities",
        "Distribution centers",
        "High-volume waste needs"
      ]
    }
  ];

  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedDumpster, setSelectedDumpster] = useState<typeof dumpsters[0] | null>(null);
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

  const handleBuyNow = (dumpster: typeof dumpsters[0]) => {
    setSelectedDumpster(dumpster);
    setCheckoutStep(1);
    setShowCheckout(true);
  };

  const handleNextStep = () => {
    if (checkoutStep < 3) {
      setCheckoutStep(checkoutStep + 1);
    }
  };

  const handleCompleteCheckout = () => {
    alert(`Order confirmed for ${selectedDumpster?.title}!\n\nA confirmation will be sent to ${checkoutData.email}`);
    setShowCheckout(false);
    setCheckoutStep(1);
    setSelectedDumpster(null);
  };

  return (
    <main className="bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-violet-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/15 to-indigo-400/15 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="w-full md:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Permanent Dumpsters
            </h1>
            <p className="text-lg text-indigo-100 mb-6 leading-relaxed">
              Ideal for businesses with ongoing waste needs. Our permanent dumpsters offer a reliable, long-term solution for commercial waste management.
            </p>
            <div className="bg-indigo-900/50 p-6 rounded-xl border border-indigo-400 mb-8 backdrop-blur-sm">
              <p className="text-indigo-100 leading-relaxed">
                These <strong>front-load dumpsters</strong> are perfect for consistent waste generation. We offer flexible pickup schedules (weekly, bi-weekly, etc.) to ensure your business remains clean and compliant.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/permanent-dumpster.png"
                alt="Permanent Dumpster"
                className="object-contain w-full h-full bg-gray-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Available Dumpsters Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Available Dumpsters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dumpsters.map((dumpster, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-2xl p-8 border ${dumpster.popular ? 'border-indigo-400 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400' : 'border-gray-100 shadow-sm hover:shadow-xl'} transition-all duration-300 flex flex-col`}
              >
                {dumpster.popular && (
                  <div className="mb-4 inline-block bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-1 rounded-full text-sm font-semibold w-fit">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {dumpster.title}
                </h3>
                <p className="text-3xl font-bold text-indigo-600 mb-2">{dumpster.price}</p>
                <p className="text-gray-600 text-sm mb-4">
                  Capacity: {dumpster.capacity}
                </p>

                {/* Use Cases */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Ideal for:</p>
                  <ul className="space-y-2">
                    {dumpster.useCases.map((useCase, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative w-full h-40 mb-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={dumpster.image}
                    alt={dumpster.title}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="mt-auto flex gap-3">
                  <Button 
                    onClick={() => handleBuyNow(dumpster)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold h-11 rounded-lg"
                  >
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleBuyNow(dumpster)}
                    className="flex-1 border-indigo-400 text-indigo-600 hover:bg-indigo-50 font-bold h-11 rounded-lg"
                  >
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-bold mb-6">
              Why Blue Sky Disposal for your Commercial Needs?
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              We understand business operations. That is why we provide reliable, timed pickups that don't interfere with your workday. Our clean, well-maintained dumpsters present a professional image for your business.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-blue-400">
              <img
                src="/images/permanent-dumpster.png"
                alt="Blue Sky Disposal Truck"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="relative aspect-square max-w-md mx-auto bg-gray-100 rounded-2xl">
              <img
                src="/images/permanent-dumpster.png"
                alt="Dumpster Size Guide"
                className="object-contain w-full h-full drop-shadow-2xl"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Find the right fit for your business
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Not sure if you need a 2 yard or a 6 yard bin? We can assess your waste volume and recommend the most cost-effective solution.
            </p>
            <Button asChild variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 h-12 px-8 rounded-full border-2 font-bold">
              <Link href="/size-guide">
                Check Size Guide
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Icons */}
      <section className="py-16 px-6 bg-indigo-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {[
            { icon: Clock, title: "Same Day Service" },
            { icon: Truck, title: "Best customer service in the industry" },
            { icon: Calendar, title: "Customer Service available - Day & Night" },
            { icon: Check, title: "Woman-owned company" },
            { icon: Calendar, title: "Flexible Scheduling Options" },
            { icon: Truck, title: "Reliable & Safe Transportation" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <item.icon className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-gray-800">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-indigo-600 mb-12">FAQs for your ease!</h2>

          <div className="space-y-4 text-left">
            <div className="bg-indigo-50 p-6 rounded-lg text-sm text-gray-700 leading-relaxed border border-indigo-100">
              For permanent dumpsters, contracts are typically required. Please contact our sales team for detailed agreement terms and service level agreements.
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg flex justify-between items-center cursor-pointer hover:from-indigo-600 hover:to-indigo-700 transition-colors">
              <span className="font-bold">What if I need to change the delivery date for my Dumpster Delivery order?</span>
              <ChevronRight className="w-5 h-5" />
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg flex justify-between items-center cursor-pointer hover:from-indigo-600 hover:to-indigo-700 transition-colors mt-1">
              <span className="font-bold">What do I call if I need an emergency delivery of a Dumpster?</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-12">
            <Button variant="outline" className="rounded-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8">
              All FAQs
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Checkout Modal */}
      {showCheckout && selectedDumpster && (
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
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Product</p>
                <p className="text-lg font-bold text-gray-900">{selectedDumpster.title}</p>
                <p className="text-2xl font-bold text-indigo-600 mt-2">{selectedDumpster.price}</p>
              </div>

              {/* Step Indicator */}
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      step <= checkoutStep ? "bg-indigo-500" : "bg-gray-200"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental Duration</label>
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
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Total Price:</span>
                      <span className="text-3xl font-bold text-indigo-600">{selectedDumpster.price}</span>
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
                    className={`flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-lg ${checkoutStep === 1 ? "w-full" : ""}`}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleCompleteCheckout}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-lg"
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
