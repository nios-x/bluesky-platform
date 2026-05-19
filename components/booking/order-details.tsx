"use client";

import { useState } from "react";
import { Calendar, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { ExtendRentalModal } from "@/components/booking/extend-rental-modal";

interface OrderDetailsProps {
  order: {
    id: string;
    customerName: string;
    email: string;
    phone?: string;
    dumpsterSize: number;
    dumpsterType: string;
    deliveryDate: string;
    pickupDate: string;
    status: "pending" | "confirmed" | "delivered" | "completed";
    totalPrice: number;
    rentalPeriod: number;
  };
  onRefresh?: () => void;
}

export function OrderDetails({ order, onRefresh }: OrderDetailsProps) {
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendedSuccess, setExtendedSuccess] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-300 text-yellow-800";
      case "confirmed":
        return "bg-blue-50 border-blue-300 text-blue-800";
      case "delivered":
        return "bg-purple-50 border-purple-300 text-purple-800";
      case "completed":
        return "bg-green-50 border-green-300 text-green-800";
      default:
        return "bg-gray-50 border-gray-300 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "delivered":
        return <Truck className="w-5 h-5" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const statusColor = getStatusColor(order.status);
  const daysUntilPickup = Math.ceil(
    (new Date(order.pickupDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <div className="bg-white border-2 border-[#142A52]/10 rounded-lg p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-[#142A52]/10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#142A52]">Order #{order.id}</h1>
              <p className="text-sm text-[#142A52]/70 mt-1">Blue Sky Disposal</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${statusColor}`}>
              {getStatusIcon(order.status)}
              <span className="font-semibold capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Extended Successfully Banner */}
        {extendedSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-800">Rental Extended!</h3>
              <p className="text-sm text-green-700 mt-1">
                Your rental period has been successfully extended. Confirmation sent to {order.email}.
              </p>
            </div>
          </div>
        )}

        {/* Dumpster Info */}
        <div className="mb-6 bg-[#142A52]/5 border border-[#142A52]/10 rounded-lg p-4">
          <h2 className="text-lg font-bold text-[#142A52] mb-4">Dumpster Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#142A52]/70">Size</p>
              <p className="text-lg font-semibold text-[#142A52]">{order.dumpsterSize}yd</p>
            </div>
            <div>
              <p className="text-sm text-[#142A52]/70">Type</p>
              <p className="text-lg font-semibold text-[#142A52]">{order.dumpsterType}</p>
            </div>
            <div>
              <p className="text-sm text-[#142A52]/70">Rental Period</p>
              <p className="text-lg font-semibold text-[#142A52]">{order.rentalPeriod} days</p>
            </div>
            <div>
              <p className="text-sm text-[#142A52]/70">Total Price</p>
              <p className="text-lg font-semibold text-[#C89B2B]">${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6 space-y-4">
          <h2 className="text-lg font-bold text-[#142A52]">Schedule</h2>

          {/* Delivery */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="w-1 h-12 bg-blue-200"></div>
            </div>
            <div className="pb-4">
              <p className="font-semibold text-[#142A52]">Delivery</p>
              <p className="text-sm text-[#142A52]/70">
                {formatDate(order.deliveryDate)}
              </p>
              <p className="text-xs text-[#142A52]/60 mt-2">
                ✓ Ensure 60ft clearance for truck access
              </p>
            </div>
          </div>

          {/* Pickup */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#142A52]">Pickup</p>
              <p className="text-sm text-[#142A52]/70">
                {formatDate(order.pickupDate)}
              </p>
              {daysUntilPickup > 0 && (
                <p className="text-xs text-orange-600 font-semibold mt-2">
                  ⏰ {daysUntilPickup} days remaining
                </p>
              )}
              <p className="text-xs text-[#142A52]/60 mt-2">
                ✓ Debris must be at or below top rail (no overfilling)
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6 bg-[#142A52]/5 border border-[#142A52]/10 rounded-lg p-4">
          <h2 className="text-lg font-bold text-[#142A52] mb-4">Contact Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-[#142A52]/70">Name</p>
              <p className="font-semibold text-[#142A52]">{order.customerName}</p>
            </div>
            <div>
              <p className="text-[#142A52]/70">Email</p>
              <p className="font-semibold text-[#142A52]">{order.email}</p>
            </div>
            {order.phone && (
              <div>
                <p className="text-[#142A52]/70">Phone</p>
                <p className="font-semibold text-[#142A52]">{order.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#142A52]/10">
          <button
            onClick={() => setShowExtendModal(true)}
            disabled={order.status === "completed"}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#142A52] to-[#C89B2B] text-white font-semibold rounded-lg hover:from-[#1a3a6e] hover:to-[#d4a835] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Extend Rental
          </button>
          <button
            onClick={onRefresh}
            className="flex-1 px-4 py-3 border-2 border-[#142A52]/20 text-[#142A52] font-semibold rounded-lg hover:bg-[#142A52]/5 transition"
          >
            Refresh Status
          </button>
          <button
            onClick={() => window.location.href = `mailto:${order.email}`}
            className="flex-1 px-4 py-3 border-2 border-[#142A52]/20 text-[#142A52] font-semibold rounded-lg hover:bg-[#142A52]/5 transition"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Extend Rental Modal */}
      <ExtendRentalModal
        isOpen={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        orderId={order.id}
        currentPickupDate={order.pickupDate}
        dumpsterSize={order.dumpsterSize}
        dumpsterType={order.dumpsterType}
        onExtensionSuccess={() => {
          setExtendedSuccess(true);
          onRefresh?.();
          setTimeout(() => setExtendedSuccess(false), 5000);
        }}
      />
    </>
  );
}
