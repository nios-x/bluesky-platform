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
  const handleLoadPaymentData = (paymentRequest: any) => {
    console.log('Google Pay payment data authorized:', paymentRequest);
    
    // Pass the raw Google Pay tokenization data directly to the parent component
    // The parent component has the bookingData and contactInfo needed to process the order
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentRequest);
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
   