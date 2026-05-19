"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Calendar, DollarSign } from "lucide-react";

interface ExtendRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentPickupDate: string;
  dumpsterSize: number;
  dumpsterType: string;
  onExtensionSuccess?: () => void;
}

const EXTENSION_RATE = 25; // $25 per day

export function ExtendRentalModal({
  isOpen,
  onClose,
  orderId,
  currentPickupDate,
  dumpsterSize,
  dumpsterType,
  onExtensionSuccess,
}: ExtendRentalModalProps) {
  const [extensionDays, setExtensionDays] = useState(1);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [newPickupDate, setNewPickupDate] = useState("");

  const extensionCost = extensionDays * EXTENSION_RATE;

  const handleExtendRental = async () => {
    if (!paymentMethodId) {
      setError("Please select a payment method");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/bookings/${orderId}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          extensionDays,
          paymentMethodId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Extension failed");
        return;
      }

      setSuccess(true);
      setNewPickupDate(data.newPickupDate);

      setTimeout(() => {
        onExtensionSuccess?.();
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#142A52] to-[#1a3a6e] text-white p-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Extend Your Rental</h2>
            <p className="text-sm text-white/80 mt-1">Order #{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success State */}
          {success && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-green-800">Extension Confirmed!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your rental has been extended to <strong>{newPickupDate}</strong>.
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Confirmation email sent. Closing in 3 seconds...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !success && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!success && (
            <>
              {/* Current Info */}
              <div className="bg-[#142A52]/5 border border-[#142A52]/10 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#142A52]/70">Dumpster:</span>
                    <span className="font-semibold text-[#142A52]">
                      {dumpsterSize}yd {dumpsterType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#142A52]/70">Current Pickup:</span>
                    <span className="font-semibold text-[#142A52]">
                      {new Date(currentPickupDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extension Days Selector */}
              <div>
                <label className="block text-sm font-bold text-[#142A52] mb-3">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  How many additional days?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 14].map((days) => (
                    <button
                      key={days}
                      onClick={() => setExtensionDays(days)}
                      className={`py-2 rounded-lg font-semibold transition-all text-sm ${
                        extensionDays === days
                          ? "bg-[#C89B2B] text-white"
                          : "border-2 border-[#142A52]/20 text-[#142A52] hover:border-[#C89B2B]"
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Display */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-semibold text-yellow-800">
                      Extension Cost:
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-900">
                    ${extensionCost.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  {extensionDays} day(s) × ${EXTENSION_RATE}/day = ${extensionCost.toFixed(2)}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Your saved payment method will be charged.
                </p>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-bold text-[#142A52] mb-3">
                  Payment Method
                </label>
                <select
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#142A52]/20 rounded-lg focus:border-[#C89B2B] focus:ring-2 focus:ring-[#C89B2B]/20 outline-none transition"
                >
                  <option value="">-- Select saved payment method --</option>
                  <option value="pm_visa_1234">Visa ending in 4242</option>
                  <option value="pm_mastercard_5678">MasterCard ending in 5555</option>
                  <option value="pm_amex_9999">American Express ending in 3030</option>
                </select>
                <p className="text-xs text-[#142A52]/60 mt-2">
                  Don't have a saved card? Contact us at 586-412-3762
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border-2 border-[#142A52]/20 rounded-lg font-semibold text-[#142A52] hover:bg-[#142A52]/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendRental}
                  disabled={loading || !paymentMethodId}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#142A52] to-[#C89B2B] text-white font-semibold rounded-lg hover:from-[#1a3a6e] hover:to-[#d4a835] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Processing..." : `Extend ${extensionDays}d for $${extensionCost.toFixed(2)}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
