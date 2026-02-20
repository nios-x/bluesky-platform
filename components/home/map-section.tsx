"use client";

import Image from "next/image";
import Link from "next/link";

const cities = [
  { name: "Detroit", slug: "detroit" },
  { name: "Warren", slug: "warren" },
  { name: "Sterling Heights", slug: "sterling-heights" },
  { name: "Livonia", slug: "livonia" },
  { name: "Troy", slug: "troy" },
  { name: "Dearborn", slug: "dearborn" }
];

export default function MapSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Service Area Map
            </h2>
            <p className="text-slate-600 mb-6">
              Tap a city to see local service details, permits, and rules.
            </p>
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <Image
                src="/service-map.png"
                alt="Michigan Service Area Map"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Cities</h3>
              <div className="flex flex-wrap gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4">
                Can’t find your city? We likely serve it—check availability in the booking panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
