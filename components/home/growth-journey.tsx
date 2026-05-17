"use client";

import { motion } from "framer-motion";
import { Award, Recycle, TrendingUp, Truck, Users } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { year: "2018", customers: 150, revenue: 250 },
  { year: "2019", customers: 280, revenue: 420 },
  { year: "2020", customers: 450, revenue: 680 },
  { year: "2021", customers: 720, revenue: 1050 },
  { year: "2022", customers: 1100, revenue: 1600 },
  { year: "2023", customers: 1650, revenue: 2400 },
  { year: "2024", customers: 2200, revenue: 3200 },
];

const stats = [
  { label: "Active Customers", value: "2,200+", icon: Users, color: "blue" },
  {
    label: "Dumpsters Delivered",
    value: "12,500+",
    icon: Truck,
    color: "green",
  },
  {
    label: "Waste Recycled (Tons)",
    value: "45,000+",
    icon: Recycle,
    color: "purple",
  },
  { label: "Years in Business", value: "6+", icon: Award, color: "orange" },
];

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
};

export default function GrowthJourney() {
  return (
    <div className="w-full">
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4">Our Growth Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Since our founding, Blue Sky Disposal has experienced consistent
              growth, expanding our services and customer base across Michigan.
            </p>
          </motion.div>

          {/* Chart + Stats */}
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* LEFT – Chart */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl flex flex-col h-full"
            >
              <h3 className="text-2xl mb-6 text-center">
                Service Growth (2018-2024)
              </h3>

              <div className="flex-1 min-h-[400px] w-full">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="year" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #2563eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ fill: "#2563eb", r: 5 }}
                      name="Active Customers"
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ fill: "#16a34a", r: 5 }}
                      name="Revenue (K)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* RIGHT – Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 flex flex-col h-full"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, x: 10 }}
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600 hover:shadow-2xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses[stat.color]
                          }`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-3xl">{stat.value}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Growth note box */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-xl mt-auto">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8" />
                  <p className="text-2xl">350% Growth</p>
                </div>
                <p className="text-sm text-blue-100">
                  Customer base growth since 2018, demonstrating our commitment
                  to exceptional service.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
