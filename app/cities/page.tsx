"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";

const MICHIGAN_CITIES = [
  { name: "Macomb", zip: "48044", county: "Macomb County", pricing: "standard" },
  { name: "Warren", zip: "48089", county: "Macomb County", pricing: "standard" },
  { name: "Clinton Township", zip: "48035", county: "Macomb County", pricing: "standard" },
  { name: "Sterling Heights", zip: "48311", county: "Macomb County", pricing: "standard" },
  { name: "Detroit", zip: "48201", county: "Wayne County", pricing: "standard" },
  { name: "Dearborn", zip: "48121", county: "Wayne County", pricing: "standard" },
  { name: "Livonia", zip: "48150", county: "Wayne County", pricing: "standard" },
  { name: "Troy", zip: "48084", county: "Oakland County", pricing: "standard" },
  { name: "Farmington Hills", zip: "48331", county: "Oakland County", pricing: "standard" },
  { name: "Southfield", zip: "48075", county: "Oakland County", pricing: "standard" },
  { name: "Pontiac", zip: "48342", county: "Oakland County", pricing: "standard" },
  { name: "Ann Arbor", zip: "48103", county: "Washtenaw County", pricing: "standard" },
  { name: "Flint", zip: "48502", county: "Genesee County", pricing: "standard" },
  { name: "Lansing", zip: "48933", county: "Ingham County", pricing: "standard" },
];

export default function CitiesPage() {
  const [selectedCounty, setSelectedCounty] = useState("all");

  const counties = ["all", ...new Set(MICHIGAN_CITIES.map((city) => city.county))];

  const filteredCities =
    selectedCounty === "all"
      ? MICHIGAN_CITIES
      : MICHIGAN_CITIES.filter((city) => city.county === selectedCounty);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#142A52] to-[#1a3a6e] py-16 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <MapPin size={40} /> Cities We Service
          </h1>
          <p className="text-lg text-white/90">
            Dumpster rental services available in major Michigan cities and surrounding areas
          </p>
        </div>
      </section>

      {/* County Filter */}
      <section className="py-8 px-4 border-b-2 border-[#142A52]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-bold text-[#142A52] mb-4">Filter by County</h2>
          <div className="flex flex-wrap gap-2">
            {counties.map((county) => (
              <button
                key={county}
                onClick={() => setSelectedCounty(county)}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  selectedCounty === county
                    ? "bg-[#C89B2B] text-white"
                    : "bg-[#142A52]/10 text-[#142A52] hover:bg-[#142A52]/20"
                }`}
              >
                {county === "all" ? "All Counties" : county}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#142A52] mb-8">
            {selectedCounty === "all"
              ? `All Michigan Cities (${filteredCities.length})`
              : `${selectedCounty} (${filteredCities.length} cities)`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <Link key={city.zip} href={`/cities/${city.name.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="bg-white border-2 border-[#142A52]/20 rounded-lg p-6 hover:border-[#C89B2B] hover:shadow-lg transition cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-[#142A52] group-hover:text-[#C89B2B] transition">
                        {city.name}
                      </h3>
                      <p className="text-sm text-[#142A52]/60">{city.county}</p>
                    </div>
                    <ChevronRight size={24} className="text-[#C89B2B]/30 group-hover:text-[#C89B2B] transition" />
                  </div>

                  <div className="bg-[#142A52]/5 rounded-lg p-3 mb-4">
                    <p className="text-sm font-bold text-[#142A52]">ZIP: {city.zip}</p>
                  </div>

                  <button className="w-full py-2 bg-gradient-to-r from-[#142A52] to-[#C89B2B] text-white font-bold rounded-lg group-hover:from-[#1a3a6e] group-hover:to-[#d4a835] transition">
                    Book Now →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Info */}
      <section className="bg-[#142A52]/5 border-y-2 border-[#142A52]/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#142A52] mb-6">Service Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border-2 border-[#C89B2B]">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-[#142A52] mb-2">Macomb County</h3>
              <p className="text-sm text-[#142A52]/70">
                Serving Macomb, Warren, Clinton Township, Sterling Heights, and more
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-[#C89B2B]">
              <div className="text-3xl mb-3">🏙️</div>
              <h3 className="font-bold text-[#142A52] mb-2">Wayne County</h3>
              <p className="text-sm text-[#142A52]/70">
                Detroit, Dearborn, Livonia, and surrounding Detroit metro areas
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-[#C89B2B]">
              <div className="text-3xl mb-3">🏗️</div>
              <h3 className="font-bold text-[#142A52] mb-2">Oakland County</h3>
              <p className="text-sm text-[#142A52]/70">
                Troy, Farmington Hills, Southfield, Pontiac, and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#142A52] mb-4">
            Don't See Your City?
          </h2>
          <p className="text-[#142A52]/70 mb-6">
            We're expanding our service area regularly. Contact us to inquire about service availability in your area.
          </p>
          <a href="tel:586-412-3762">
            <button className="px-8 py-3 bg-gradient-to-r from-[#142A52] to-[#C89B2B] text-white font-bold rounded-lg hover:from-[#1a3a6e] hover:to-[#d4a835] transition">
              📞 Call Us: 586-412-3762
            </button>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
