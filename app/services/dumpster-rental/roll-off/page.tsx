"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Calendar, Check, ChevronRight, Clock, Truck, Star, Shield, Award, Sparkles, HardHat } from "lucide-react";
import Link from "next/link";

export default function RollOffPage() {
  const dumpsters = [
    {
      size: "10 Yard",
      title: "10 Yard Roll-Off Dumpster",
      image: "/images/roll-off-dumpster.png",
      slug: "10-yard",
      price: "$320",
      capacity: "4 tons",
      popular: false,
      useCases: [
        "Small home renovations",
        "Yard cleanup projects",
        "Minor remodeling",
        "Debris removal"
      ]
    },
    {
      size: "20 Yard",
      title: "20 Yard Roll-Off Dumpster",
      image: "/images/roll-off-dumpster.png",
      slug: "20-yard",
      price: "$380",
      capacity: "6 tons",
      popular: true,
      useCases: [
        "Kitchen & bathroom remodels",
        "Roofing projects",
        "Deck removal",
        "General construction debris"
      ]
    },
    {
      size: "30 Yard",
      title: "30 Yard Roll-Off Dumpster",
      image: "/images/roll-off-dumpster.png",
      slug: "30-yard",
      price: "$450",
      capacity: "8 tons",
      popular: false,
      useCases: [
        "Large home demolition",
        "Commercial renovation",
        "Major construction projects",
        "Full property cleanout"
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
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/25 to-violet-300/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/15 to-indigo-300/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-100/30 to-transparent rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="w-full lg:w-1/2">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-indigo-500/30">
              <HardHat className="w-4 h-4" />
              Construction & Renovation
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 mb-6 leading-[1.1] tracking-tight">
              Roll-Off Dumpsters
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
              Heavy-duty containers perfect for construction sites, major renovations, and large-scale cleanouts. Built to handle the toughest jobs.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {["Up to 8 Tons", "Same Day Delivery", "Easy Loading"].map((feature, i) => (
                <span key={i} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  <Check className="w-4 h-4 text-indigo-500" />
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold h-14 px-8 rounded-xl shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40">
                <Link href="#dumpsters">
                  View Options
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 font-bold h-14 px-8 rounded-xl transition-all duration-300">
                <Link href="/contact">
                  Get a Quote
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            {/* Decorative Ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2rem] blur-2xl opacity-20 scale-105" />
            
            <div className="relative bg-gradient-to-br from-white to-indigo-50 rounded-[2rem] p-4 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-indigo-50">
                <ImageWithFallback
                  src="/images/roll-off-dumpster.png"
                  alt="Roll Off Dumpster"
                  className="object-contain w-full h-full transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">1000+</p>
                    <p className="text-xs text-gray-500 font-medium">Projects Completed</p>
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
            <span className="inline-block text-indigo-500 font-semibold text-sm tracking-wider uppercase mb-4">Our Fleet</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Choose Your Size</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">From small renovations to major construction projects. Find the perfect roll-off dumpster for your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dumpsters.map((dumpster, idx) => (
              <div key={idx} className={`group relative bg-white rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${dumpster.popular ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/15' : 'border border-gray-200 hover:shadow-2xl hover:border-transparent'}`}>
                {/* Popular Badge */}
                {dumpster.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/30">
                    Most Popular
                  </div>
                )}

                {/* Size Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl mb-6">
                  <span className="text-2xl font-black text-indigo-600">{dumpster.size.split(' ')[0]}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {dumpster.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4">Capacity: {dumpster.capacity}</p>

                {/* Use Cases */}
                <div className="mb-6 pb-4 border-b border-gray-200">
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

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-black text-gray-900">{dumpster.price}</span>
                  <span className="text-gray-500 text-sm">/rental</span>
                </div>

                {/* Image */}
                <div className="relative h-44 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-indigo-50 group-hover:from-indigo-50 group-hover:to-violet-50 transition-colors duration-500">
                  <ImageWithFallback
                    src={dumpster.image}
                    alt={dumpster.title}
                    className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {["7-day rental included", "Delivery & pickup", "Heavy debris friendly"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-indigo-600" />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button asChild className={`w-full font-bold h-14 rounded-xl transition-all duration-300 ${dumpster.popular ? 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
                  <Link href={`/services/dumpster-rental/roll-off/${dumpster.slug}`}>
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
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="w-full lg:w-1/2">
            <span className="inline-block text-indigo-200 font-semibold text-sm tracking-wider uppercase mb-4">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Why Blue Sky Disposal for your Roll-Off Dumpsters?
            </h2>
            <p className="text-indigo-100 text-lg leading-relaxed mb-10">
              Our roll-off dumpsters are the industry standard for efficiency and reliability. We provide timely delivery and pickup to keep your project moving. With various sizes available, we ensure you have the right capacity for your specific needs.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, title: "Same Day Delivery", desc: "When you need it" },
                { icon: Shield, title: "Fully Insured", desc: "Complete coverage" },
                { icon: Award, title: "Top Rated", desc: "5-star service" },
                { icon: Truck, title: "Modern Fleet", desc: "Reliable equipment" },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
                  <item.icon className="w-8 h-8 text-indigo-200 mb-2" />
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-indigo-200 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl" />
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/25 bg-gradient-to-br from-indigo-100 to-violet-100">
                <ImageWithFallback
                  src="/images/roll-off-dumpster.png"
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
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-3xl opacity-60" />
              <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-8 shadow-xl">
                <ImageWithFallback
                  src="/images/roll-off-dumpster.png"
                  alt="Dumpster Size Guide"
                  className="object-contain w-full h-full drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <span className="inline-block text-indigo-500 font-semibold text-sm tracking-wider uppercase mb-4">Size Guide</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              How to choose the right dumpster?
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Unsure about the size? Our team can help you select the perfect roll-off dumpster for your project requirements.
            </p>
            
            {/* Size Comparison */}
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { size: "10 Yard", use: "Small projects" },
                  { size: "20 Yard", use: "Medium projects" },
                  { size: "30 Yard", use: "Large projects" },
                ].map((item, i) => (
                  <div key={i} className="p-4">
                    <p className="text-2xl font-black text-indigo-600">{item.size}</p>
                    <p className="text-sm text-gray-500">{item.use}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold h-14 px-8 rounded-xl shadow-xl shadow-indigo-500/30">
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
            <h3 className="text-2xl font-bold text-gray-900">Why Contractors Trust Us</h3>
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
              <div key={i} className="group bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-indigo-500 group-hover:text-white transition-colors duration-300" />
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
            <span className="inline-block text-indigo-500 font-semibold text-sm tracking-wider uppercase mb-4">FAQ</span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about our roll-off dumpster services</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 rounded-2xl border border-indigo-100">
              <p className="text-gray-700 leading-relaxed">
                Standard cancellation policies apply. Please refer to our terms for detailed information on fees and timing for order modifications.
              </p>
            </div>

            {[
              "What if I need to change the delivery date for my Dumpster Delivery order?",
              "What do I call if I need an emergency delivery of a Dumpster?",
            ].map((question, i) => (
              <div key={i} className="group bg-gradient-to-r from-indigo-500 to-violet-500 text-white p-5 rounded-2xl flex justify-between items-center cursor-pointer hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5">
                <span className="font-semibold">{question}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 px-8 font-bold">
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
