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
      "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
      currency: "USD",
      intent: "capture",
      components: "buttons",
    })
      .then((paypal) => {
        if (isCancelled) return;
        
        if (paypal && paypal.Buttons && containerRef.current) {
          containerRef.current.innerHTML = ""; // Clear existing buttons if re-rendering
          
          paypal.Buttons({
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
            onError: (err) => {
              onError(err);
            },
          }).render(containerRef.current);
          
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
    <div className="w-full">
      {!isLoaded && <div className="text-center py-4 font-bold text-[#142A52]">Loading PayPal...</div>}
      <div ref={containerRef} className="w-full min-h-[150px] z-0 relative"></div>
    </div>
  );
}