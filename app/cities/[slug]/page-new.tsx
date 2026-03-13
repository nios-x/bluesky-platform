import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, MapPin, Clock, Phone, Mail } from "lucide-react";

interface CityInfo {
  name: string;
  region: string;
  deliveryTime: string;
  serviceAreas: string[];
  permits: {
    title: string;
    required: boolean;
    details: string;
  }[];
  allowedMaterials: string[];
  prohibitedMaterials: string[];
  localRules: {
    title: string;
    description: string;
  }[];
  populationServed: string;
  contactPhone: string;
  contactEmail: string;
}

const cityData: Record<string, CityInfo> = {
  detroit: {
    name: "Detroit",
    region: "Downtown & Metro",
    deliveryTime: "Same-day to 24 hours",
    serviceAreas: ["Downtown Detroit", "Corktown", "Midtown", "Eastern Market", "Woodbridge"],
    permits: [
      {
        required: true,
        title: "Street Placement Permit",
        details: "Required for dumpsters on public streets. Apply at Detroit DPW office or online at detroitmi.gov. Typical approval: 2-3 business days."
      },
      {
        required: false,
        title: "Property Owner Consent",
        details: "If on private property, written approval from property owner may be needed."
      }
    ],
    allowedMaterials: [
      "Drywall & construction debris",
      "Concrete & asphalt",
      "Wood & lumber",
      "Metal",
      "General household waste",
      "Yard waste (seasonal)"
    ],
    prohibitedMaterials: [
      "Hazardous materials",
      "Tires",
      "Batteries",
      "Roofing asphalt",
      "Electronics",
      "Appliances with refrigerant"
    ],
    localRules: [
      {
        title: "Parking & Placement",
        description: "Dumpsters must be placed in designated parking spaces or with proper permits. Keep 3 feet clearance from fire hydrants."
      },
      {
        title: "Weight Limits",
        description: "Standard weight limit is 4 tons per dumpster. Overweight fees: $50 per 500 lbs over limit."
      },
      {
        title: "Pickup Schedule",
        description: "Dumpsters are picked up within 24-48 hours of notification. Schedule pickups at least 24 hours in advance."
      }
    ],
    populationServed: "672,000+",
    contactPhone: "(313) 628-2451",
    contactEmail: "support@blueskydisposal.com"
  },
  warren: {
    name: "Warren",
    region: "Northern Suburbs",
    deliveryTime: "1-2 business days",
    serviceAreas: ["Downtown Warren", "Van Dyke Corridor", "Schoenherr District", "North Warren"],
    permits: [
      {
        required: true,
        title: "Dumpster Permit",
        details: "Required for any dumpster placement. Contact Warren City Hall at (586) 574-4660."
      }
    ],
    allowedMaterials: [
      "Construction waste",
      "Drywall",
      "Concrete",
      "Wood products",
      "Mixed debris"
    ],
    prohibitedMaterials: [
      "Liquids",
      "Paint",
      "Asbestos",
      "Radioactive materials",
      "Hazardous waste"
    ],
    localRules: [
      {
        title: "Dumpster Size Restrictions",
        description: "20-yard and 30-yard dumpsters require additional spacing in residential areas."
      },
      {
        title: "Noise Ordinance",
        description: "No pickups between 10 PM - 7 AM on weekdays, 10 PM - 9 AM on weekends."
      }
    ],
    populationServed: "139,000+",
    contactPhone: "(586) 947-2100",
    contactEmail: "warren@blueskydisposal.com"
  },
  "sterling-heights": {
    name: "Sterling Heights",
    region: "Premium North Metro",
    deliveryTime: "Next business day",
    serviceAreas: ["North Mound", "Van Dyke East", "Central District", "South Sterling"],
    permits: [
      {
        required: true,
        title: "Public Area Permit",
        details: "Mandatory for residential streets. Apply online at ci.sterling-heights.mi.us"
      }
    ],
    allowedMaterials: [
      "Roofing materials",
      "Drywall",
      "Concrete debris",
      "Lumber",
      "Yard waste"
    ],
    prohibitedMaterials: [
      "Appliances",
      "Electronics",
      "Hazardous chemicals",
      "Medical waste"
    ],
    localRules: [
      {
        title: "Premium Service Standards",
        description: "All dumpsters include tarping and daily weight monitoring. Premium customer service available 24/7."
      }
    ],
    populationServed: "130,000+",
    contactPhone: "(586) 446-2600",
    contactEmail: "sterling@blueskydisposal.com"
  },
  livonia: {
    name: "Livonia",
    region: "Western Suburbs",
    deliveryTime: "1-3 business days",
    serviceAreas: ["Livonia Center", "East Livonia", "West Livonia", "North Industrial"],
    permits: [
      {
        required: false,
        title: "Optional Street Permit",
        details: "Not always required but recommended for longer-term rentals. Fee: $25."
      }
    ],
    allowedMaterials: [
      "Construction debris",
      "Drywall",
      "Asphalt",
      "Metal",
      "Cardboard"
    ],
    prohibitedMaterials: [
      "Tires",
      "Batteries",
      "Paint cans with contents",
      "Propane tanks"
    ],
    localRules: [
      {
        title: "Residential Zone Restrictions",
        description: "Dumpsters in residential zones require placement on private property or designated areas."
      }
    ],
    populationServed: "95,000+",
    contactPhone: "(734) 466-2200",
    contactEmail: "livonia@blueskydisposal.com"
  },
  troy: {
    name: "Troy",
    region: "North Metro",
    deliveryTime: "Next business day",
    serviceAreas: ["Downtown Troy", "Big Beaver Corridor", "South Troy", "East Troy"],
    permits: [
      {
        required: true,
        title: "Troy DPW Permit",
        details: "All dumpsters require DPW approval. Processing time: 1 business day."
      }
    ],
    allowedMaterials: [
      "Commercial debris",
      "Construction waste",
      "Roofing materials",
      "Wood waste"
    ],
    prohibitedMaterials: [
      "Asbestos",
      "Lead paint",
      "PCBs",
      "Medical waste"
    ],
    localRules: [
      {
        title: "Commercial Standards",
        description: "Commercial dumpster placements must meet loading dock standards and safety requirements."
      }
    ],
    populationServed: "82,000+",
    contactPhone: "(248) 524-3000",
    contactEmail: "troy@blueskydisposal.com"
  },
  dearborn: {
    name: "Dearborn",
    region: "Southwest Area",
    deliveryTime: "1-2 business days",
    serviceAreas: ["Downtown Dearborn", "South End", "North Dearborn", "Ford Industrial"],
    permits: [
      {
        required: true,
        title: "Dearborn Permit Required",
        details: "All placement requires City of Dearborn permit. Contact Dearborn DPW."
      }
    ],
    allowedMaterials: [
      "Mixed debris",
      "Drywall",
      "Concrete",
      "Scrap metal",
      "Yard waste"
    ],
    prohibitedMaterials: [
      "Hazardous waste",
      "Asbestos materials",
      "Refrigerators",
      "AC units"
    ],
    localRules: [
      {
        title: "Industrial Zone Options",
        description: "Large 30+ yard dumpsters available for industrial zone placements."
      }
    ],
    populationServed: "98,000+",
    contactPhone: "(313) 943-2000",
    contactEmail: "dearborn@blueskydisposal.com"
  }
};

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = cityData[params.slug];

  if (!city) {
    notFound();
  }

  return (
    <main className="bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-blue-100 text-sm font-semibold">{city.region}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{city.name} Dumpster Rental</h1>
          <p className="text-blue-100 text-lg md:text-xl">Professional waste management for your project</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-slate-600 mb-1">Delivery Time</p>
              <p className="font-bold text-slate-900">{city.deliveryTime}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <MapPin className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm text-slate-600 mb-1">Population Served</p>
              <p className="font-bold text-slate-900">{city.populationServed}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <Phone className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm text-slate-600 mb-1">Local Support</p>
              <p className="font-bold text-slate-900 text-sm">{city.contactPhone}</p>
            </div>
          </div>

          {/* Service Areas */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Service Areas We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {city.serviceAreas.map((area, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Permits Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              Permits & Requirements
            </h2>
            <div className="space-y-4">
              {city.permits.map((permit, idx) => (
                <div key={idx} className={`p-6 rounded-xl border-2 ${permit.required ? "bg-orange-50 border-orange-300" : "bg-blue-50 border-blue-300"}`}>
                  <div className="flex items-start gap-3 mb-2">
                    {permit.required ? (
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-lg">{permit.title}</h4>
                      {permit.required && <span className="inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded mt-1">Required</span>}
                    </div>
                  </div>
                  <p className="text-slate-700 ml-8">{permit.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Allowed Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                What We Accept
              </h3>
              <ul className="space-y-3">
                {city.allowedMaterials.map((material, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></div>
                    {material}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                What We Don't Accept
              </h3>
              <ul className="space-y-3">
                {city.prohibitedMaterials.map((material, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></div>
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Local Rules */}
          <div className="mb-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border-2 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Local Rules & Regulations</h2>
            <div className="space-y-6">
              {city.localRules.map((rule, idx) => (
                <div key={idx} className="border-l-4 border-blue-600 pl-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{rule.title}</h4>
                  <p className="text-slate-700">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Book in {city.name}?</h2>
            <p className="text-blue-100 mb-8 text-lg">Get a free quote and schedule delivery in minutes</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold">
                  Book Now
                </Button>
              </Link>
              <a href={`tel:${city.contactPhone}`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold">
                  Call: {city.contactPhone}
                </Button>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Local Support Team</h3>
            <div className="space-y-3 text-slate-700">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                {city.contactPhone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                {city.contactEmail}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
