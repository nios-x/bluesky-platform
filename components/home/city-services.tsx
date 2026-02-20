"use client";

import { FileText, MapPin, ShieldCheck } from "lucide-react";

const cards = [
  {
    title: "City-Specific Service Details",
    description: "Pickup schedules, local availability, and neighborhood notes tailored to your city.",
    icon: MapPin
  },
  {
    title: "Permit & Placement Guidance",
    description: "Quick rules for driveway vs. street placement and permit requirements.",
    icon: FileText
  },
  {
    title: "Allowed & Prohibited Materials",
    description: "Know what can go in the dumpster before booking—no surprises at checkout.",
    icon: ShieldCheck
  }
];

const popularCities = [
  "Detroit",
  "Warren",
  "Sterling Heights",
  "Livonia",
  "Troy",
  "Dearborn",
  "Southfield",
  "Royal Oak"
];

export default function CityServices() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white via-blue-50/40 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">City Services</h2>
          <p className="text-slate-600 mt-3">
            Local details to help you book the right dumpster fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition">
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-6 md:p-8 shadow-xl">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl" />

            <div className="relative flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-white">Popular Cities</h3>
                <p className="text-blue-100 text-sm mt-1">Tap a city to see local service details and rules.</p>
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-white" />
                Metro Detroit
              </span>
            </div>

            <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularCities.map((city) => (
                <button
                  key={city}
                  className="group flex items-center justify-between gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <span>{city}</span>
                  <span className="text-white/70 transition group-hover:text-white">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
