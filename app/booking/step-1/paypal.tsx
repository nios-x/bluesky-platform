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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const buttonInstanceRef = useRef<any>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Separate effect for script loading (runs only once)
  useEffect(() => {
    let isCancelled = false;

    const initPayPal = async () => {
      try {
        const paypal = await loadScript({
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
          currency: "USD",
          intent: "capture",
          components: "buttons",
        });

        if (isCancelled || !paypal?.Buttons) {
          return;
        }

        // Store the paypal reference for use in the amount effect
        (window as any).__paypalInstance = paypal;
        if (!isCancelled) {
          setScriptLoaded(true);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("failed to load the PayPal JS SDK script", err);
          onErrorRef.current(err);
        }
      }
    };

    initPayPal();

    return () => {
      isCancelled = true;
    };
  }, []); // Only load script once on mount

  // Separate effect for rendering button (runs when amount or scriptLoaded changes)
  useEffect(() => {
    if (!scriptLoaded) return;
    const paypal = (window as any).__paypalInstance;
    if (!paypal?.Buttons || !containerRef.current) return;

    let isCancelled = false;

    const renderButton = () => {
      if (isCancelled) return;

      try {
        // Clear previous button
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        const buttons = paypal.Buttons({
          createOrder: (data: any, actions: any) => {
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
          onApprove: async (data: any, actions: any) => {
            if (actions.order) {
              try {
                const details = await actions.order.capture();
                
                // Check for card rejection / testing scenarios where capture status is DECLINED or FAILED
                const capture = details.purchase_units?.[0]?.payments?.captures?.[0];
                if (capture && (capture.status === 'DECLINED' || capture.status === 'FAILED')) {
                  const errorMsg = capture.processor_response 
                    ? `Card was declined (Code: ${capture.processor_response.response_code})`
                    : `Payment was ${capture.status.toLowerCase()}`;
                  onErrorRef.current(new Error(errorMsg));
                  return;
                }
                
                // Also check if details indicates an error directly
                if (details.error) {
                  onErrorRef.current(new Error(details.error.message || "Payment processing failed"));
                  return;
                }

                onSuccessRef.current(details);
              } catch (err) {
                onErrorRef.current(err);
              }
            }
          },
          onError: (err: any) => {
            if (
              err &&
              err.message &&
              typeof err.message === "string" &&
              err.message.includes("Detected container element removed from DOM")
            ) {
              return;
            }
            onErrorRef.current(err);
          },
        });

        buttonInstanceRef.current = buttons;

        if (containerRef.current) {
          buttons.render(containerRef.current).catch((err: any) => {
            if (
              err &&
              err.message &&
              typeof err.message === "string" &&
              err.message.includes("Detected container element removed from DOM")
            ) {
              return;
            }
            console.error("PayPal render error:", err);
          });
        }

        setIsLoaded(true);
      } catch (err) {
        console.error("Error rendering PayPal button:", err);
      }
    };

    renderButton();

    return () => {
      isCancelled = true;
    };
  }, [amount, scriptLoaded]); // Re-render when amount or scriptLoaded changes

  return (
    <div className="w-full relative">
      {!isLoaded && <div className="text-center py-4 font-bold text-[#0A1628] absolute inset-0 z-10 bg-white/80 flex items-center justify-center">Loading PayPal...</div>}
      <div className="w-full min-h-[150px] z-0 relative">
        <div ref={containerRef}></div>
      </div>
    </div>
  );
}