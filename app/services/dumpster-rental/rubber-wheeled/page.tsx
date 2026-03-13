"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Calendar, Check, ChevronRight, Clock, Truck, Star, Shield, Award, Sparkles, Home } from "lucide-react";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import Link from "next/link";

export default function RubberWheeledPage() {
  const dumpsters = [
    {
      size: "10 Yard",
      title: "10 Yard Rubber-Wheeled Dumpster",
      image: "/images/rubber-wheel-dumpster.png",
      slug: "10-yard",
      price: "$295",
      popular: false,
      useCases: [
        "Residential properties",
        "Apartment complexes",
        "Landscaping projects",
        "Surface protection needed"
      ]
    },
    {
      size: "20 Yard",
      title: "20 Yard Rubber-Wheeled Dumpster",
      image: "/images/rubber-wheel-dumpster.png",
      slug: "20-yard",
      price: "$365",
      popular: true,
      useCases: [
        "Property renovations",
        "Multi-unit buildings",
        "Retail store cleanout",
        "Sensitive surfaces"
      ]
    },
    {
      size: "30 Yard",
      title: "30 Yard Rubber-Wheeled Dumpster",
      image: "/images/rubber-wheel-dumpster.png",
      slug: "30-yard",
      price: "$435",
      popular: false,
      useCases: [
        "Large property cleanout",
        "Commercial renovation",
        "Parking lot protection",
        "Bulk debris removal"
      ]
    }
  ];

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section - Premium Design */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-500/10 to-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-100/20 to-transparent rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="w-full lg:w-1/2">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-emerald-500/25">
              <Home className="w-4 h-4" />
              Driveway Safe
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-900 to-gray-900 mb-6 leading-[1.1] tracking-tight">
              Rubber-Wheeled Dumpsters
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
              Protect your driveway and property with our innovative rubber-wheeled dumpsters. Smooth movement, zero damage, professional service.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {["Driveway Safe", "No Surface Damage", "Easy Maneuvering"].map((feature, i) => (
                <span key={i} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-14 px-8 rounded-xl shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30">
                <Link href="#dumpsters">
                  View Options
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 font-bold h-14 px-8 rounded-xl transition-all duration-300">
                <Link href="/contact">
                  Get a Quote
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            {/* Decorative Ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur-2xl opacity-20 scale-105" />
            
            <div className="relative bg-gradient-to-br from-white to-emerald-50 rounded-[2rem] p-4 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                <ImageWithFallback
                  src="/images/rubber-wheel-dumpster.png"
                  alt="Rubber Wheeled Dumpster"
                  className="object-contain w-full h-full transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">100%</p>
                    <p className="text-xs text-gray-500 font-medium">Surface Safe</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Rating Card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">4.9</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Dumpsters Grid - Premium Cards */}
      <section id="dumpsters" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-emerald-500 font-semibold text-sm tracking-wider uppercase mb-4">Our Fleet</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Choose Your Size</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">All our rubber-wheeled dumpsters are designed to protect your property while providing maximum capacity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dumpsters.map((dumpster, idx) => (
              <div key={idx} className={`group relative bg-white rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${dumpster.popular ? 'ring-2 ring-emerald-500 shadow-2xl shadow-emerald-500/10' : 'border border-gray-200 hover:shadow-2xl hover:border-transparent'}`}>
                {/* Popular Badge */}
                {dumpster.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                )}

                {/* Size Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-6">
                  <span className="text-2xl font-black text-emerald-600">{dumpster.size.split(' ')[0]}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {dumpster.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4">Driveway-safe rubber wheels</p>

                {/* Use Cases */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Ideal for:</p>
                  <ul className="space-y-2">
                    {dumpster.useCases.map((useCase, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-black text-gray-900">{dumpster.price}</span>
                  <span className="text-gray-500 text-sm">/rental</span>
                </div>

                {/* Image */}
                <div className="relative h-44 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors duration-500">
                  <img
                    src={dumpster.image}
                    alt={dumpster.title}
                    className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {["Protects driveways", "7-day rental included", "Easy loading access"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button asChild className={`w-full font-bold h-14 rounded-xl transition-all duration-300 ${dumpster.popular ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
                  <Link href={`/services/dumpster-rental/rubber-wheeled/${dumpster.slug}`}>
                    Book Now
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section - Premium Gradient */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="w-full lg:w-1/2">
            <span className="inline-block text-emerald-200 font-semibold text-sm tracking-wider uppercase mb-4">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Why Blue Sky Disposal for your Rubber-Wheeled Dumpsters?
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed mb-10">
              The rubber wheels on our dumpsters are designed to glide smoothly across any surface, which means they won't scrape, drag or leave gouges unlike traditional steel wheel dumpsters. This minimizes potential damage to your property and ensures easy maneuvering in tight spaces.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Surface Protection", desc: "Zero damage" },
                { icon: Clock, title: "Same Day Delivery", desc: "When you need it" },
                { icon: Award, title: "Top Rated", desc: "5-star service" },
                { icon: Truck, title: "Easy Placement", desc: "Smooth rolling" },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
                  <item.icon className="w-8 h-8 text-emerald-200 mb-2" />
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-emerald-200 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl" />
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 bg-gradient-to-br from-emerald-100 to-teal-100">
                <ImageWithFallback
                  src="/images/rubber-wheel-dumpster.png"
                  alt="Blue Sky Disposal Truck"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section - Elegant Design */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl opacity-50" />
              <div className="relative bg-gradient-to-br from-slate-50 to-emerald-50 rounded-3xl p-8 shadow-xl">
                <ImageWithFallback
                  src="/images/rubber-wheel-dumpster.png"
                  alt="Dumpster Size Guide"
                  className="object-contain w-full h-full drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <span className="inline-block text-emerald-500 font-semibold text-sm tracking-wider uppercase mb-4">Size Guide</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              How to choose the right dumpster?
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              One of the most common questions we get from customers is 'What Size Dumpster Do I Need for my project?' Let us help you find the perfect fit.
            </p>
            
            {/* Size Comparison */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { size: "10 Yard", use: "Home cleanout" },
                  { size: "20 Yard", use: "Renovation" },
                  { size: "30 Yard", use: "Large project" },
                ].map((item, i) => (
                  <div key={i} className="p-4">
                    <p className="text-2xl font-black text-emerald-600">{item.size}</p>
                    <p className="text-sm text-gray-500">{item.use}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-14 px-8 rounded-xl shadow-xl shadow-emerald-500/25">
              <Link href="/size-guide">
                Check Size Guide
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Icons - Modern Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900">Why Homeowners Trust Us</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Clock, title: "Same Day Service" },
              { icon: Award, title: "Best Customer Service" },
              { icon: Calendar, title: "24/7 Support" },
              { icon: Shield, title: "Woman-Owned" },
              { icon: Calendar, title: "Flexible Scheduling" },
              { icon: Truck, title: "Reliable Transport" },
            ].map((item, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-emerald-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-sm font-semibold text-gray-700">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Premium Accordion Style */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-emerald-500 font-semibold text-sm tracking-wider uppercase mb-4">FAQ</span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about our rubber-wheeled dumpster services</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
              <p className="text-gray-700 leading-relaxed text-sm">
                If you have purchased your Dumpster via credit card and would like to cancel your order, Blue Sky Disposal reserves the right to retain 10% of your total paid amount to cover the transaction processing fees. Cancellations can be processed within 10 business days.
              </p>
            </div>

            {[
              "What if I need to change the delivery date for my Dumpster Delivery order?",
              "What do I call if I need an emergency delivery of a Dumpster?",
            ].map((question, i) => (
              <div key={i} className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-2xl flex justify-between items-center cursor-pointer hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5">
                <span className="font-semibold">{question}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 px-8 font-bold">
              <Link href="/faq">
                View All FAQs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
