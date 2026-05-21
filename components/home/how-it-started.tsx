"use client";

import { motion } from "framer-motion";
import { Lightbulb, Target, Zap, Heart, Users, Trophy } from "lucide-react";

const timeline = [
  {
    year: "2018",
    title: "The Beginning",
    icon: Lightbulb,
    description: "Migena Gjonaj, with 18 years of waste management experience, saw a gap in the market—affordable, customer-focused dumpster rental service in Michigan.",
    color: "blue"
  },
  {
    year: "2019",
    title: "First Step",
    icon: Zap,
    description: "Blue Sky Disposal officially launched with a mission to revolutionize waste management with honesty, speed, and genuine care.",
    color: "cyan"
  },
  {
    year: "2021",
    title: "Rapid Growth",
    icon: Target,
    description: "Expanded operations across Michigan with a growing fleet and team. The women-led company became a trusted name.",
    color: "green"
  },
  {
    year: "2024",
    title: "Market Leader",
    icon: Trophy,
    description: "Over 2,200 active customers, 12,500+ dumpsters delivered, and 45,000+ tons of waste responsibly recycled.",
    color: "orange"
  },
];

const colorClasses: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  cyan: "from-cyan-500 to-cyan-600",
  green: "from-green-500 to-green-600",
  orange: "from-[#B8860B] to-[#DAA520]",
};

export default function HowItStarted() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Started</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From a single vision to Michigan's most trusted waste management company—the Blue Sky story.
          </p>
        </motion.div>

        {/* Horizontal Timeline - Book Pages Style */}
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-6 px-6 md:px-12 py-4"
            style={{ minWidth: 'fit-content' }}
          >
            {timeline.map((item, idx) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  whileHover={{ y: -10, rotateZ: 2 }}
                  className="flex-shrink-0"
                >
                  {/* Book Page Shape */}
                  <div className="relative w-72 h-96 group">
                    {/* Page Shadow/Depth Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-400/30 to-transparent rounded-r-3xl blur-lg transform translate-x-2 translate-y-2" />
                    
                    {/* Main Card with Page Curl Effect */}
                    <div className="relative h-full bg-white rounded-r-3xl rounded-l-lg shadow-2xl border-l-4 border-gray-100 overflow-hidden group-hover:shadow-3xl transition-all duration-300">
                      {/* Top Accent Bar */}
                      <div className={`h-2 w-full bg-gradient-to-r ${colorClasses[item.color]}`} />

                      {/* Page Corner Fold Effect */}
                      <div className="absolute top-0 right-0 w-8 h-8 bg-gray-50 transform -translate-y-1 translate-x-1 rounded-full opacity-50" />

                      {/* Content */}
                      <div className="p-5 h-full flex flex-col justify-between">
                        {/* Year Badge */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${colorClasses[item.color]} mb-3 shadow-lg`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>

                        {/* Year */}
                        <p className="text-xs font-bold text-blue-600 mb-1 tracking-wider">YEAR {item.year}</p>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{item.title}</h3>

                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed text-xs flex-grow">
                          {item.description}
                        </p>

                        {/* Bottom Page Detail */}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex gap-2">
                            {[1, 2, 3].map((dot) => (
                              <motion.div
                                key={dot}
                                animate={{ y: [0, 2, 0] }}
                                transition={{ delay: dot * 0.1, duration: 2, repeat: Infinity }}
                                className={`w-1.5 h-1.5 rounded-full ${dot === 1 ? `bg-gradient-to-r ${colorClasses[item.color]}` : 'bg-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 pt-20 border-t border-gray-200"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built on Three Pillars
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Honesty",
                description: "No hidden fees, transparent pricing, and straightforward communication with every customer."
              },
              {
                icon: Zap,
                title: "Speed",
                description: "Same-day service available and rapid delivery. We respect your time and deadlines."
              },
              {
                icon: Users,
                title: "Community Impact",
                description: "Women-owned business giving back to Michigan through sustainable waste management and local employment."
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">{pillar.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{pillar.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
