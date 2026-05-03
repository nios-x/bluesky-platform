"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Truck, ShoppingCart, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const metrics = [
    { label: "Total Users", value: "1,284", icon: Users, color: "from-blue-500 to-cyan-600", trend: "+12%" },
    { label: "Active Rentals", value: "42", icon: ShoppingCart, color: "from-emerald-500 to-green-600", trend: "+8%" },
    { label: "Dumpsters", value: "156", icon: Truck, color: "from-purple-500 to-pink-600", trend: "+5%" },
    { label: "Revenue", value: "$24.5K", icon: TrendingUp, color: "from-amber-500 to-orange-600", trend: "+23%" },
  ];

  const recentOrders = [
    { id: "#ORD001", customer: "John Doe", dumpster: "20 Yard", amount: "$380", status: "Completed" },
    { id: "#ORD002", customer: "Jane Smith", dumpster: "15 Yard", amount: "$350", status: "In Progress" },
    { id: "#ORD003", customer: "Bob Wilson", dumpster: "10 Yard", amount: "$320", status: "Pending" },
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-slate-400">Manage users, rentals, and monitor system performance.</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ translateY: -8 }}
              className={`bg-gradient-to-br ${metric.color} p-6 rounded-xl shadow-lg text-white border border-white/10`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-white/40" />
                <span className="text-emerald-400 text-sm font-semibold">{metric.trend}</span>
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">{metric.label}</p>
              <p className="text-white text-3xl font-bold">{metric.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Orders */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
        <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-left text-gray-700 dark:text-slate-400 font-semibold">Order ID</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-slate-400 font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-slate-400 font-semibold">Dumpster</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-slate-400 font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-slate-400 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-slate-400 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b border-slate-200 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{order.id}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-slate-300">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-slate-300">{order.dumpster}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "Completed"
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : order.status === "In Progress"
                            ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-400"
                            : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="ghost" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
            <h3 className="text-gray-900 dark:text-white font-bold">Issues to Review</h3>
          </div>
          <p className="text-red-700 dark:text-red-400 text-2xl font-bold">3</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            <h3 className="text-gray-900 dark:text-white font-bold">Completed Today</h3>
          </div>
          <p className="text-emerald-700 dark:text-emerald-400 text-2xl font-bold">12</p>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-500" />
            <h3 className="text-gray-900 dark:text-white font-bold">New Users</h3>
          </div>
          <p className="text-cyan-700 dark:text-cyan-400 text-2xl font-bold">8</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
