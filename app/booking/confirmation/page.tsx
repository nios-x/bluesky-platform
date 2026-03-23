"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useBooking } from "@/contexts/booking-context";
import { CheckCircle2, Mail, Phone, MapPin, Calendar, Package } from "lucide-react";
import Link from "next/link";

export default function BookingConfirmation() {
  const { booking } = useBooking();

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

          {/* Booking Details */}
          <div className="bg-white border-2 border-[#C89B2B] rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="text-left">
                <h2 className="text-xl font-bold text-[#142A52] mb-6">Booking Details</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Package className="text-[#C89B2B] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-[#142A52]/70">Dumpster</p>
                      <p className="font-bold text-[#142A52]">
                        {booking.dumpsterSize} yd {booking.dumpsterType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-[#C89B2B] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-[#142A52]/70">Delivery Date</p>
                      <p className="font-bold text-[#142A52]">
                        {booking.deliveryDate &&
                          new Date(booking.deliveryDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-[#C89B2B] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-[#142A52]/70">Location</p>
                      <p className="font-bold text-[#142A52]">{booking.zipCode}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="text-[#C89B2B] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-[#142A52]/70">Project Type</p>
                      <p className="font-bold text-[#142A52]">{booking.projectType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact & Payment */}
              <div className="text-left">
                <h2 className="text-xl font-bold text-[#142A52] mb-6">Contact Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-[#C89B2B] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-[#142A52]/70">Email</p>
                      <p className="font-bold text-[#142A52]">{booking.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="text-[#C89B2B] mt-1" size={20} />
                    <div>
                      <p className="text-sm text-[#142A52]/70">Phone</p>
                      <p className="font-bold text-[#142A52]">{booking.phone}</p>
                    </div>
                  </div>

                  {booking.company && (
                    <div>
                      <p className="text-sm text-[#142A52]/70">Company</p>
                      <p className="font-bold text-[#142A52]">{booking.company}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-8 pt-8 border-t-2 border-[#C89B2B]/30">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#142A52]">Total Amount</span>
                <span className="text-3xl font-bold text-[#C89B2B]">
                  ${booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}
                </span>
              </div>
              <p className="text-sm text-[#142A52]/60 mt-2">
                ✅ Payment successful - Confirmation sent to your email
              </p>
            </div>
          </div>

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
