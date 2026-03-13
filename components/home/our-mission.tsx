"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { motion } from "framer-motion";
import { Award, Heart, Target, Users } from "lucide-react";

const colorBackground: Record<string, string> = {
  blue: "bg-blue-100",
  green: "bg-green-100",
  purple: "bg-purple-100",
  orange: "bg-orange-100",
};

const colorText: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
};

export default function OurMission() {
  const values = [
    {
      icon: Target,
      title: "Reliability",
      description: "Dependable service you can count on, every time",
      color: "blue",
    },
    {
      icon: Heart,
      title: "Care",
      description: "We care about our community and environment",
      color: "green",
    },
    {
      icon: Users,
      title: "Service",
      description: "Customer-first approach in everything we do",
      color: "purple",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Striving for the highest standards",
      color: "orange",
    },
  ];

  return (
    <div className="w-full">
      {/* Company Overview */}
      <section className="relative py-20 px-4 max-w-6xl mx-auto">
        <div className="relative grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl w-full h-96"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800"
              alt="Sustainable recycling and environment"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* RIGHT SIDE TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative rounded-xl p-10 shadow-xl border border-white/50 overflow-hidden bg-white/30 backdrop-blur-lg"
          >
            {/* Watermark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[300px] h-[300px] rounded-full bg-green-300 opacity-20" />
            </motion.div>

            {/* Content */}
            <h2 className="relative z-10 text-4xl font-extrabold mb-6 text-gray-900 tracking-wide">
              Our Mission
            </h2>

            <p className="relative z-10 text-lg text-gray-700 mb-4 leading-relaxed">
              Our mission is to become a leader in the dumpster booking
              industry. By offering the highest service quality and specialized
              solutions, we strive to fulfill our customers' waste removal needs
              across Michigan.
            </p>

            <p className="relative z-10 text-lg text-gray-700 mb-4 leading-relaxed">
              Through a strong commitment to this mission, Blue Sky Disposal
              continues to be recognized as one of the most trusted names in
              waste management.
            </p>

            <p className="relative z-10 text-lg text-gray-700 leading-relaxed">
              And don't forget—when you rent a dumpster from a 100%
              Michigan-owned company, every dollar supports our local community
              and economy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-gray-900"
          >
            Our Core Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colorBackground[value.color]
                      }`}
                  >
                    <Icon className={`w-8 h-8 ${colorText[value.color]}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
