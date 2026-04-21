import GooglePayButton from '@google-pay/button-react';
import getPaymentDataRequest from '../../lib/constants/gpay';

interface GPayButtonProps {
  amount: number;
  currency?: string;
  countryCode?: string;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: any) => void;
}

export default function GPayButton({
  amount,
  currency = 'USD',
  countryCode = 'US',
  onPaymentSuccess,
  onPaymentError
}: GPayButtonProps) {
  const handleLoadPaymentData = async (paymentRequest: any) => {
    try {
      console.log('Google Pay payment data:', paymentRequest);

      // Check if we're using example gateway (development mode)
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey || stripeKey.includes('replace_with')) {
        // In development mode, simulate a successful payment
        console.log('Development mode: Simulating Google Pay payment');
        if (onPaymentSuccess) {
          onPaymentSuccess({
            paymentIntentId: `dev_${Date.now()}`,
            status: 'succeeded'
          });
        }
        return;
      }

      const response = await fetch('/api/payments/google-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentData: paymentRequest,
          amount: amount,
          currency: currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      const result = await response.json();
      console.log('Payment processed successfully:', result);

      if (onPaymentSuccess) {
        onPaymentSuccess(result);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      if (onPaymentError) {
        onPaymentError(error);
      }
    }
  };
    
  return (
    <GooglePayButton
      environment="TEST"
      paymentRequest={getPaymentDataRequest(amount.toFixed(2), currency, countryCode)}
      onLoadPaymentData={handleLoadPaymentData}
      onError={(error) => {
        console.error('Google Pay error:', error);
        if (onPaymentError) {
          onPaymentError(error);
        }
      }}
      buttonColor="default"
      buttonType="pay"
      buttonSizeMode="fill"
    />
  );
}
   