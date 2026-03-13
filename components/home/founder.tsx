"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { motion } from "framer-motion";

export default function FounderSection() {
  return (
    <section className="py-20 px-6 bg-[#f8f9fa]">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 text-black"
        >
          Our Founder
        </motion.h2>

        {/* Founder Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]"
        >
          {/* Founder Image */}
          <div className="md:w-5/12 relative h-64 md:h-auto">
            <ImageWithFallback
              src="https://www.blueskydisposal.com/wp-content/themes/bluesky/images/migena_photo.jpg"
              alt="Migena Gjonaj"
              width={400}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Founder Content */}
          <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-black mb-1">Migena Gjonaj</h3>
            <p className="text-[#007bff] text-lg font-bold mb-6">
              Founder & CEO
            </p>

            <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
              <p>
                Migena Gjonaj, a tenacious and visionary entrepreneur, is the proud
                founder of Blue Sky Disposal, built with passion and dedication to
                transform Michigan’s waste management industry.
              </p>

              <p>
                Born in Tirana, Albania, Migena and her sisters Annie and Elvana
                moved to the United States chasing opportunity and building a
                legacy grounded in hard work, service, and integrity.
              </p>

              <p>
                Starting her journey as a phone operator at Allied Waste in 2000,
                she mastered dispatch, logistics, and operations—skills that later
                shaped Blue Sky Disposal into a customer-first, community-driven
                business.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
