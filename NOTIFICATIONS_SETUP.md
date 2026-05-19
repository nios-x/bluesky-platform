# SMS/Email Notification System - Setup Guide

This guide explains how to implement SMS and Email notifications for rental extensions and other booking events.

## Overview

The notification system supports:
- ✅ **Email notifications** (via SendGrid or Gmail/Nodemailer)
- ✅ **SMS notifications** (via Twilio)
- ✅ **Rental extensions** with payment processing
- ✅ **Delivery reminders** (1 day before)
- ✅ **Pickup reminders** (final day)
- ✅ **Booking confirmations**
- ✅ **Extension failure alerts**

## Architecture

```
User extends rental
    ↓
POST /api/bookings/[orderId]/extend
    ↓
Validate & calculate cost ($25/day)
    ↓
Process payment via Stripe
    ↓
Update database with new pickup date
    ↓
Send SMS + Email notifications
    ↓
Return success response
```

## Setup Instructions

### 1. Install Required Dependencies

```bash
npm install stripe twilio @sendgrid/mail nodemailer
npm install --save-dev @types/nodemailer
```

### 2. Environment Variables

Create or update `.env.local` with these variables:

```bash
# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (Email - RECOMMENDED for production)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=BlueSkyDisposal@gmail.com

# OR Gmail/SMTP (Email - Fallback)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Get API Keys

#### Stripe
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to Developers → API keys
3. Copy Secret Key (starts with `sk_test_` or `sk_live_`)
4. Copy Publishable Key (starts with `pk_test_` or `pk_live_`)

#### Twilio
1. Go to [twilio.com/console](https://twilio.com/console)
2. Copy Account SID and Auth Token
3. Get a Twilio phone number (e.g., +1 (415) 523-8886)

#### SendGrid
1. Go to [sendgrid.com](https://sendgrid.com) and create account
2. Navigate to Settings → API Keys
3. Create new API key (full access recommended)
4. Verify sender email: Settings → Sender Authentication

#### Gmail (Alternative Email)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the 16-character password as `EMAIL_PASSWORD`

## Usage

### Frontend: Trigger Extension Modal

```typescript
import { ExtendRentalModal } from "@/components/booking/extend-rental-modal";
import { OrderDetails } from "@/components/booking/order-details";

export function ConfirmationPage() {
  const order = {
    id: "ORD-12345",
    customerName: "John Doe",
    email: "john@example.com",
    phone: "+15864123762",
    dumpsterSize: 20,
    dumpsterType: "Roll-Off",
    deliveryDate: "2026-05-20",
    pickupDate: "2026-06-03",
    status: "delivered",
    totalPrice: 655,
    rentalPeriod: 14,
  };

  return (
    <OrderDetails
      order={order}
      onRefresh={() => console.log("Refreshing order...")}
    />
  );
}
```

### Backend: Send Notifications Manually

```typescript
import { notifyRentalExtension, sendEmail, sendSMS } from "@/lib/services/notificationService";

// Option 1: High-level function for rental extensions
await notifyRentalExtension(
  "customer@example.com",
  "+15864123762",
  "John Doe",
  "ORD-12345",
  20,
  "Roll-Off",
  7,        // extension days
  175,      // extension cost
  "June 10, 2026",
  "Stripe"
);

// Option 2: Low-level functions for other events
await sendEmail({
  type: "booking-confirmation",
  email: "customer@example.com",
  customerName: "John Doe",
  orderId: "ORD-12345",
  dumpsterSize: 20,
  dumpsterType: "Roll-Off",
  deliveryDate: "2026-05-20",
  pickupDate: "2026-06-03",
  totalPrice: 655,
  rentalPeriod: 14,
});

await sendSMS({
  type: "pickup-reminder",
  phone: "+15864123762",
  email: "customer@example.com",
  customerName: "John Doe",
  orderId: "ORD-12345",
  dumpsterSize: 20,
  dumpsterType: "Roll-Off",
  pickupDate: "2026-06-03",
});
```

### API Endpoint: Extend Rental

**Request:**
```bash
POST /api/bookings/ORD-12345/extend
Content-Type: application/json

{
  "orderId": "ORD-12345",
  "extensionDays": 7,
  "paymentMethodId": "pm_visa_1234"
}
```

**Response (Success):**
```json
{
  "success": true,
  "orderId": "ORD-12345",
  "extensionDays": 7,
  "extensionCost": 175,
  "newPickupDate": "Wednesday, June 10, 2026",
  "paymentIntentId": "pi_1234567890",
  "message": "Rental extended successfully! New pickup: Wednesday, June 10, 2026. Confirmation sent to customer@example.com."
}
```

**Response (Error):**
```json
{
  "error": "Payment declined. Please try another payment method."
}
```

## Email Templates

The system includes templates for:

1. **Extension Confirmation** - Sent immediately after successful extension
2. **Extension Failure** - Sent if payment is declined
3. **Delivery Reminder** - Scheduled 1 day before delivery
4. **Pickup Reminder** - Scheduled on final day before pickup
5. **Booking Confirmation** - Sent when booking is completed

All templates include:
- Professional HTML formatting
- Order details and dates
- Clear instructions
- Support contact information
- Customer name personalization

## SMS Templates

SMS messages are kept brief (under 160 characters for single-segment delivery):
- Order ID for tracking
- Key dates (delivery/pickup)
- Cost information
- Support phone number

## Database Integration

You'll need to update these functions in `notificationService.ts`:

```typescript
// Replace with your actual database calls:
const fetchBookingFromDB = async (orderId: string): Promise<BookingData | null> => {
  // Example: const booking = await db.bookings.findOne({ id: orderId });
}

const updateBookingInDB = async (
  orderId: string,
  updates: Partial<BookingData>
): Promise<boolean> => {
  // Example: await db.bookings.updateOne({ id: orderId }, updates);
}
```

## Testing

### 1. Test Email
```bash
# Add to your code temporarily
await sendEmail({
  type: "extension",
  email: "your-test-email@example.com",
  customerName: "Test User",
  orderId: "TEST-001",
  dumpsterSize: 20,
  dumpsterType: "Roll-Off",
  extensionDays: 7,
  extensionCost: 175,
  pickupDate: "June 10, 2026",
  paymentMethod: "Visa",
});
```

### 2. Test SMS
```bash
# Add to your code temporarily
await sendSMS({
  type: "extension",
  phone: "+1YOUR_PHONE_NUMBER",
  email: "your-email@example.com",
  customerName: "Test User",
  orderId: "TEST-001",
  dumpsterSize: 20,
  dumpsterType: "Roll-Off",
  extensionDays: 7,
  extensionCost: 175,
  pickupDate: "June 10, 2026",
  paymentMethod: "Visa",
});
```

### 3. Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/bookings/ORD-12345/extend \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-12345",
    "extensionDays": 7,
    "paymentMethodId": "pm_visa_4242"
  }'
```

## Security Considerations

1. **API Key Protection**
   - Never commit `.env.local` to version control
   - Use `.env.local` (not `.env` which may be tracked)
   - Rotate keys regularly in production

2. **Payment Security**
   - Always use HTTPS in production
   - Validate payment intent status before updating database
   - Implement refund logic if database update fails

3. **Customer Data**
   - Don't log sensitive payment information
   - Comply with GDPR/CCPA for email/SMS preferences
   - Implement opt-out mechanisms

4. **Rate Limiting**
   - Consider adding rate limiting to `/api/bookings/[orderId]/extend`
   - Prevent extension spam or abuse

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check SENDGRID_API_KEY or EMAIL_USER/PASSWORD in `.env.local` |
| SMS not receiving | Verify TWILIO_PHONE_NUMBER is valid and account is active |
| Payment fails | Check STRIPE_SECRET_KEY and ensure card/payment method exists |
| Database not updating | Verify `updateBookingInDB` is connected to your actual database |
| Notifications not triggering | Check logs for errors, verify phone/email fields are populated |

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up API keys (Stripe, Twilio, SendGrid)
3. ✅ Add environment variables
4. ✅ Connect to your database
5. ✅ Test notifications
6. ✅ Deploy to production
7. ✅ Set up scheduled reminders (delivery/pickup 1-2 days before)

## Support

For questions or issues:
- **Phone:** 586-412-3762
- **Email:** BlueSkyDisposal@gmail.com
- **Documentation:** See IMPLEMENTATION_CHECKLIST.md for full feature list
