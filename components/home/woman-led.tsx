"use client";

import ImageWithFallback from "@/components/ui/image-with-fallback";
import { motion } from "framer-motion";

export default function WomanLedCompany() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl text-[#008CBA] mb-6 font-medium">
          Blue Sky Dumpsters – a Woman Led Company
        </h2>

        <p className="text-gray-600 max-w-4xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
          See Blue Sky Owners / Founders Migena, Annie, and Elvana Featured in Crain’s Detroit Business for our story and growth as a company.
        </p>

        <p className="text-gray-500 max-w-5xl mx-auto mb-16 text-xs md:text-sm leading-relaxed italic">
          As women in the waste management business we are breaking the concrete ceiling and changing the way the waste industry does business. We take extra care to make sure our clients are treated with the utmost respect and feel comfortable telling us your disposal needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl overflow-hidden shadow-lg h-64"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1605218427319-bbe105273752?q=80&w=800&auto=format&fit=crop"
              alt="Woman recycling"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl overflow-hidden shadow-lg h-64"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb7d5afa?q=80&w=800&auto=format&fit=crop"
              alt="Dumpsters"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl overflow-hidden shadow-lg h-64"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=800&auto=format&fit=crop"
              alt="Team working"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
