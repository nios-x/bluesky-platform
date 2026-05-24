"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { supabaseAnon } from "@/lib/supabase/client";
import { format } from "date-fns";
import {
  User,
  Package,
  Bell,
  Heart,
  MapPin,
  CreditCard,
  Gift,
  Settings,
  LogOut,
  Star,
  ShoppingBag,
  Award,
  HelpCircle,
  FileText,
  Shield,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setIsLoading(true);
      // Fetch Orders joined with order_services
      const { data: ordersData } = await supabaseAnon
        .from('orders')
        .select(`
          id,
          created_at,
          order_status,
          total_amount,
          order_services (
            id, dumpster_size, price
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }

      // Fetch Addresses
      const { data: addressData } = await supabaseAnon
        .from('customer_addresses')
        .select('*');

      if (addressData) {
        setAddresses(addressData);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [user]);

  if (!isLoggedIn) {
    router.push("/auth");
    return null;
  }

  const menuItems = [
    {
      id: "orders",
      icon: Package,
      label: "My Orders",
      count: orders.length,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "addresses",
      icon: MapPin,
      label: "Addresses",
      count: addresses.length,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "rewards",
      icon: Gift,
      label: "Super Coins",
      count: user?.rewards || 0,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  const quickActions = [
    { icon: FileText, label: "Terms & Conditions", href: "/terms-conditions" },
    { icon: Shield, label: "Privacy Policy", href: "/privacy-policy" }
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* User Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 sm:p-8 text-white mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">{user?.name}</h1>
                  <p className="text-blue-100">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      <Gift size={16} />
                      <span className="font-semibold">{user?.rewards} Coins</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      <Star size={16} fill="currentColor" />
                      <span className="font-semibold">Gold Member</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Menu */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-4">My Account</h2>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${activeTab === item.id
                        ? `${item.bgColor} ${item.color}`
                        : "hover:bg-slate-50 text-slate-700"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.count > 0 && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${activeTab === item.id ? "bg-white/50" : "bg-slate-100"
                          }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-slate-200 my-4"></div>

                  {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-all">
                        <action.icon size={20} />
                        <span className="font-medium">{action.label}</span>
                      </button>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              {activeTab === "orders" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="py-12 flex justify-center text-blue-600">
                        <Loader2 className="animate-spin w-8 h-8" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 border border-slate-200 border-dashed rounded-xl">
                        <Package className="mx-auto w-12 h-12 mb-3 text-slate-300" />
                        <p>No orders found yet.</p>
                        <Link href="/services/dumpster-rental">
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Rent a Dumpster</Button>
                        </Link>
                      </div>
                    ) : (
                      orders.map((order) => {
                        const itemsStr = order.order_services
                          ?.map((s: any) => `${s.dumpster_size} Yard Dumpster`)
                          .join(", ") || "No items attached";

                        let statusColor = "text-slate-600";
                        if (order.order_status === "COMPLETED") statusColor = "text-green-600";
                        if (order.order_status === "CONFIRMED") statusColor = "text-blue-600";
                        if (order.order_status === "CANCELLED") statusColor = "text-red-600";

                        return (
                          <div
                            key={order.id}
                            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <ShoppingBag size={20} className="text-blue-600" />
                                  <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={order.id}>
                                    {order.id.split('-')[0].toUpperCase()}...
                                  </span>
                                  <span className={`text-sm font-medium ${statusColor}`}>
                                    • {order.order_status}
                                  </span>
                                </div>
                                <p className="text-slate-600 mb-1">{itemsStr}</p>
                                <p className="text-sm text-slate-500">{format(new Date(order.created_at), 'PPP')}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-slate-900 mb-2">${order.total_amount}</p>
                                <Button size="sm" variant="outline">Track Order</Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4">
                      <Gift size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                      {user?.rewards} Super Coins
                    </h2>
                    <p className="text-slate-600">Redeem coins for exclusive discounts!</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-amber-200 rounded-lg p-4 hover:border-amber-400 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">$10 Off</span>
                        <span className="text-amber-600 font-bold">100 Coins</span>
                      </div>
                      <p className="text-sm text-slate-600">On orders above $200</p>
                    </div>
                    <div className="border-2 border-amber-200 rounded-lg p-4 hover:border-amber-400 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">$25 Off</span>
                        <span className="text-amber-600 font-bold">250 Coins</span>
                      </div>
                      <p className="text-sm text-slate-600">On orders above $500</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Saved Addresses</h2>
                    <Button variant="outline" size="sm">Add New</Button>
                  </div>

                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="py-12 flex justify-center text-blue-600">
                        <Loader2 className="animate-spin w-8 h-8" />
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 border border-slate-200 border-dashed rounded-xl">
                        <MapPin className="mx-auto w-12 h-12 mb-3 text-slate-300" />
                        <p>No addresses saved yet.</p>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div key={addr.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <MapPin size={24} className="text-blue-600 mt-1" />
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-1">
                                  {addr.address_line1} {addr.is_default && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">Default</span>}
                                </h3>
                                <p className="text-slate-600">{addr.city}, {addr.state} {addr.zip}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">Edit</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Add more tab content as needed */}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
