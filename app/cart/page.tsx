"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { useBooking } from "@/contexts/booking-context";
import { useAuth } from "@/contexts/auth-context";

export default function CartPage() {
  const router = useRouter();
  const { bookings, removeBooking } = useBooking();
  const { isLoggedIn } = useAuth();
  
  // Filter out empty bookings (e.g., default template)
  const validBookings = bookings.filter((b: any) => b.totalPrice > 0 || b.dumpsterSize > 0);

  const subtotal = validBookings.reduce(
    (sum: number, item: any) => sum + item.basePrice + item.surcharges,
    0
  );
  
  const discount = validBookings.reduce((sum: number, item: any) => sum + item.accountDiscount, 0);
  const tax = (subtotal - discount) * 0.06;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      // Typically, trigger a login modal here or redirect to auth
      // For now, we rely on the auth modal logic which could be opened via a context function
      router.push("/auth");
    } else {
      router.push("/booking/order");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Shopping Cart
            </h1>
            <div className="flex items-center gap-2 text-slate-600">
              <ShoppingBag size={24} />
              <span className="font-semibold">{validBookings.length} Items</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {validBookings.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <ShoppingBag size={64} className="mx-auto text-slate-300 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                  <p className="text-slate-600 mb-6">Add some dumpsters to get started!</p>
                  <Link href="/services/dumpster-rental">
                    <Button className="bg-blue-600 hover:bg-blue-700">Browse Dumpsters</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {validBookings.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-2">
                          <img
                            src={item.dumpsterSize === 10 ? "/images/rubber-wheel-dumpster.png" : "/images/roll-off-dumpster.png"}
                            alt={`${item.dumpsterSize} Yard Dumpster`}
                            className="w-full h-full object-contain mix-blend-multiply"
                            loading="lazy"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                            {item.dumpsterSize} Yard Dumpster
                          </h3>
                          <p className="text-sm text-slate-600 mb-4">
                            Rental Period: <span className="font-semibold">{item.rentalPeriod} Days</span>
                            <br />
                            Delivery: <span className="font-semibold">{item.deliveryDate}</span>
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Price */}
                            <div>
                              <p className="text-2xl font-bold text-blue-600">
                                ${(item.basePrice + item.surcharges).toFixed(2)}
                              </p>
                              {item.accountDiscount > 0 && (
                                <p className="text-sm text-green-600">Discount: -${item.accountDiscount.toFixed(2)}</p>
                              )}
                            </div>

                            {/* Total Price */}
                            <div className="text-right">
                              <p className="text-sm text-slate-600 mb-1">Subtotal</p>
                              <p className="text-xl sm:text-2xl font-bold text-slate-900">
                                ${(item.totalPrice).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeBooking(index)}
                            className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                            <span className="text-sm font-semibold">Remove from Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {validBookings.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24 shadow-lg">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({validBookings.length} items)</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Tax (6%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-xl font-bold text-slate-900">
                        Total
                      </span>
                      <span className="text-3xl font-bold text-blue-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {isLoggedIn ? (
                    <Button onClick={handleCheckout} className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold">
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 text-center">
                        Please sign in to complete your order
                      </p>
                      <Button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold">
                        Sign In to Checkout
                      </Button>
                    </div>
                  )}
                  
                  <Link href="/services/dumpster-rental">
                    <Button variant="outline" className="w-full mt-3 h-12">
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center mb-3">
                      We accept all major payment methods
                    </p>
                    <div className="flex justify-center gap-2 grayscale opacity-50">
                      <div className="w-10 h-6 bg-slate-200 rounded"></div>
                      <div className="w-10 h-6 bg-slate-200 rounded"></div>
                      <div className="w-10 h-6 bg-slate-200 rounded"></div>
                      <div className="w-10 h-6 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
