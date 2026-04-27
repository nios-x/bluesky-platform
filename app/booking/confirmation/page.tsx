"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckCircle2, Mail, Phone, MapPin, Calendar, Package } from "lucide-react";
import Link from "next/link";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dbDumpsterTypes, setDbDumpsterTypes] = useState<any[]>([]);

  useEffect(() => {
    const fetchDumpsters = async () => {
      try {
        const response = await fetch('/api/pricing/dumpsters');
        const data = await response.json();
        
        const typesMap: Record<string, any> = {};
        
        data.dumpsters.forEach((d: any) => {
          const typeId = d.dumpster_types?.id;
          if (!typeId) return;
          if (!typesMap[typeId]) {
            typesMap[typeId] = {
              id: typeId,
              name: d.dumpster_types.name,
            };
          }
        });

        setDbDumpsterTypes(Object.values(typesMap));
      } catch (err) {
        console.error("Failed to fetch dumpsters", err);
      }
    };
    fetchDumpsters();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }
      
      try {
        let retries = 3;
        let data;
        
        // Sometimes webhooks/DB inserts take a few seconds to propagate, so we'll poll briefly
        while (retries > 0) {
          const response = await fetch(`/api/orders/my?session_id=${sessionId}`);
          data = await response.json();
          
          if (data.success && data.order) {
            break;
          }
          
          // Wait 1.5 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 1500));
          retries--;
        }
        
        if (data && data.success && data.order) {
          setOrderData(data.order);
        } else {
          setError(data?.error || "Failed to load order details. Your order may still be processing.");
        }
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError("Error loading your confirmation details.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [sessionId]);

  const getDumpsterName = (id: string) => {
    const found = dbDumpsterTypes.find(t => t.id === id);
    return found ? found.name : "Dumpster";
  };

  if (isLoading) {
    return (
      <main className="bg-gradient-to-b from-green-50 to-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#142A52] mx-auto mb-4"></div>
            <p className="text-[#142A52] font-bold">Loading your order details...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Fallback to display even if API fetch fails, using whatever we can
  const bookings = orderData?.items || [];
  const contactInfo = orderData?.customer || {};
  const finalTotal = orderData?.total_amount || 0;
  const paymentMethod = orderData?.payment_method || "Stripe";

  return (
    <main className="bg-gradient-to-b from-green-50 to-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={64} className="text-green-600" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#142A52] mb-4">
            Booking Confirmed! 🎉
          </h1>

          <p className="text-lg text-[#142A52]/70 mb-8">
            Your dumpster is booked. A confirmation email has been sent to your inbox.
          </p>

          {error && (
            <div className="mb-8 p-4 bg-yellow-50 text-yellow-800 border-2 border-yellow-200 rounded-lg">
              <p className="font-bold">⚠️ Warning: {error}</p>
              <p className="text-sm mt-1">Your payment was successful, but we couldn't load the live receipt. Please check your email for the confirmation details.</p>
            </div>
          )}

          {/* Booking Details */}
          {!error && (
            <div className="bg-white border-2 border-[#C89B2B] rounded-lg p-8 mb-8 text-left">
              <h2 className="text-xl font-bold text-[#142A52] mb-6 border-b pb-4 border-[#142A52]/10">Order Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* Left Column - Contact Info */}
                <div>
                  <h3 className="font-bold text-[#142A52] mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-[#142A52]"><span className="font-bold">Name:</span> {contactInfo.full_name}</p>
                    <p className="text-sm text-[#142A52]"><span className="font-bold">Email:</span> {contactInfo.email}</p>
                    <p className="text-sm text-[#142A52]"><span className="font-bold">Phone:</span> {contactInfo.phone}</p>
                    {contactInfo.company && (
                      <p className="text-sm text-[#142A52]"><span className="font-bold">Company:</span> {contactInfo.company}</p>
                    )}
                    {/* The first item usually carries the master zipCode in the DB schema for now */}
                    <p className="text-sm text-[#142A52]"><span className="font-bold">Location Zip:</span> {bookings[0]?.zipCode || contactInfo.zipCode || 'N/A'}</p>
                  </div>
                </div>

                {/* Right Column - Instructions */}
                <div>
                  <h3 className="font-bold text-[#142A52] mb-4">Delivery Notes</h3>
                  {contactInfo.placement_instructions ? (
                    <p className="text-sm text-[#142A52] italic">"{contactInfo.placement_instructions}"</p>
                  ) : (
                    <p className="text-sm text-[#142A52]/50 italic">No special instructions provided.</p>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-[#142A52] mb-4 border-t pt-6 border-[#142A52]/10">Items Booked</h3>
              <div className="space-y-4 mb-8">
                {bookings.map((b: any, idx: number) => (
                  <div key={idx} className="bg-[#142A52]/5 p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="font-bold text-[#142A52] text-lg">
                        {b.dumpsterSize || b.size} Yard {(b.dumpsterType || b.dumpster_type_id || 'Dumpster').replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-[#142A52]/70 mt-1 flex items-center gap-2">
                        <Calendar size={14} /> 
                        Delivery: {b.deliveryDate ? new Date(b.deliveryDate).toLocaleDateString() : 'TBD'}
                      </p>
                      {b.rentalPeriod && (
                        <p className="text-sm text-[#142A52]/70 mt-1 flex items-center gap-2">
                          <Package size={14} /> 
                          Rental Period: {b.rentalPeriod} Days
                        </p>
                      )}
                      {b.dumpsterCapacity && (
                        <p className="text-sm text-[#142A52]/70 mt-1 flex items-center gap-2">
                          <Package size={14} /> 
                          Weight Capacity: {b.dumpsterCapacity} Ton{b.dumpsterCapacity > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      {/* Backend items often store price as a separate field or it's implicitly part of total */}
                      <p className="font-bold text-[#C89B2B] text-xl">${b.totalPrice ? b.totalPrice.toFixed(2) : (b.price ? b.price.toFixed(2) : "0.00")}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Price */}
              <div className="pt-6 border-t-2 border-[#C89B2B]/30 flex flex-col items-end">
                <div className="flex justify-between items-center w-full max-w-xs">
                  <span className="text-xl font-bold text-[#142A52]">Total Paid</span>
                  <span className="text-3xl font-bold text-[#C89B2B]">${finalTotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-[#142A52]/60 mt-2 text-right">
                  ✅ Payment successful via {paymentMethod === "stripe_checkout" ? "Stripe" : paymentMethod}
                </p>
              </div>
            </div>
          )}

          {/* What Happens Next */}
          <div className="bg-blue-50 border-2 border-[#142A52]/20 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-[#142A52] mb-6">What Happens Next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#C89B2B] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-[#142A52]">Confirmation Email</p>
                  <p className="text-sm text-[#142A52]/70">You'll receive a detailed confirmation with all booking details</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#C89B2B] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-[#142A52]">Reminder 1 Day Before</p>
                  <p className="text-sm text-[#142A52]/70">We'll send you a reminder email and text 24 hours before delivery</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#C89B2B] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-[#142A52]">Delivery & Pickup</p>
                  <p className="text-sm text-[#142A52]/70">Your dumpster will be delivered on the scheduled date. Pickup reminder 2 days before removal.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#C89B2B] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-bold text-[#142A52]">Review & Feedback</p>
                  <p className="text-sm text-[#142A52]/70">After your rental, we'd love to hear about your experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help & Contact */}
          <div className="bg-[#142A52]/5 border-2 border-[#142A52]/20 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-[#142A52] mb-4">Questions or Need Help?</h3>
            <p className="text-sm text-[#142A52]/70 mb-4">
              Contact our customer service team anytime
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:586-412-3762"
                className="px-6 py-3 bg-[#142A52] text-white font-bold rounded-lg hover:bg-[#142A52]/90 transition"
              >
                📞 Call: 586-412-3762
              </a>
              <a
                href="mailto:BlueSkyDisposal@gmail.com"
                className="px-6 py-3 border-2 border-[#142A52] text-[#142A52] font-bold rounded-lg hover:bg-[#142A52]/5 transition"
              >
                ✉️ Email: BlueSkyDisposal@gmail.com
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="px-8 py-3 bg-gradient-to-r from-[#142A52] to-[#C89B2B] text-white font-bold rounded-lg hover:from-[#1a3a6e] hover:to-[#d4a835] transition">
                Back to Home
              </button>
            </Link>
            <button
              onClick={() => window.print()}
              className="px-8 py-3 border-2 border-[#142A52] text-[#142A52] font-bold rounded-lg hover:bg-[#142A52]/5 transition"
            >
              Print Confirmation
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function BookingConfirmation() {
  return (
    <Suspense fallback={
      <main className="bg-gradient-to-b from-green-50 to-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#142A52] mx-auto mb-4"></div>
            <p className="text-[#142A52] font-bold">Loading your order details...</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
}
