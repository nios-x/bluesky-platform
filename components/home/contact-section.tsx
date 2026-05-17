"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Areas We Serve */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 border-l-4 border-[#008CBA] pl-4">
              Areas We Serve in Michigan
            </h2>
            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-video relative shadow-inner">
              <Image
                src="/service-map.png"
                alt="Michigan Service Area Map"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-6 text-gray-600 leading-relaxed">
              We proudly serve the greater Michigan area, providing reliable dumpster rental services to homeowners, contractors, and businesses across the region. Check our service map or call us to verify coverage in your specific address.
            </p>
          </div>

          {/* Get in Touch */}
          <div className="bg-white">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 border-l-4 border-[#008CBA] pl-4">
              Get in touch
            </h2>
            <p className="text-gray-600 mb-10">
              Have questions about our dumpster sizes, pricing, or availability? Our team is here to help!
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#008CBA] shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phone</h3>
                  <p className="text-gray-600 text-sm mt-1">Call us for immediate assistance</p>
                  <a href="tel:+1234567890" className="text-[#008CBA] font-semibold mt-1 block hover:underline">
                    (586) 555-0123
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#008CBA] shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600 text-sm mt-1">Send us a message anytime</p>
                  <a href="mailto:info@blueskydisposal.com" className="text-[#008CBA] font-semibold mt-1 block hover:underline">
                    info@blueskydisposal.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#008CBA] shadow-sm">
                  <ClockIcon />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Service Hours</h3>
                  <p className="text-gray-600 text-sm mt-1">Mon - Fri: 7:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 text-sm">Sat: 8:00 AM - 12:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button className="w-full h-12 text-lg bg-[#008CBA] hover:bg-[#007ba3]">
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
