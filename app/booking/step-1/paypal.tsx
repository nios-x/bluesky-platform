"use client";

import { useEffect, useRef, useState } from "react";
import { loadScript } from "@paypal/paypal-js";

interface PayPalButtonProps {
  amount: number;
  onSuccess: (details: any) => void;
  onError: (err: any) => void;
}

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    loadScript({
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
      currency: "USD",
      intent: "capture",
      components: "buttons",
    })
      .then((paypal) => {
        if (isCancelled) return;
        
        if (paypal && paypal.Buttons && containerRef.current) {
          containerRef.current.innerHTML = ""; // Clear existing buttons if re-rendering
          
          const buttons = paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: amount.toFixed(2),
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              if (actions.order) {
                try {
                  const details = await actions.order.capture();
                  onSuccess(details);
                } catch (err) {
                  onError(err);
                }
              }
            },
            onError: (err: any) => {
              // Ignore standard unmount errors from the SDK
              if (err && err.message && typeof err.message === 'string' && err.message.includes('Detected container element removed from DOM')) {
                return;
              }
              onError(err);
            },
          });
          
          if (containerRef.current) {
            buttons.render(containerRef.current).catch((err: any) => {
               if (err && err.message && typeof err.message === 'string' && err.message.includes('Detected container element removed from DOM')) {
                  return;
               }
               console.error("PayPal render error:", err);
            });
          }
          
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("failed to load the PayPal JS SDK script", err);
          onError(err);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [amount, onSuccess, onError]);

  return (
    <div className="w-full relative">
      {!isLoaded && <div className="text-center py-4 font-bold text-[#142A52] absolute inset-0 z-10 bg-white/80 flex items-center justify-center">Loading PayPal...</div>}
      <div className="w-full min-h-[150px] z-0 relative">
        <div ref={containerRef}></div>
      </div>
    </div>
  );
}