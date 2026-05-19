/**
 * POST /api/bookings/[orderId]/extend
 * Handles rental extension requests
 * - Calculates additional cost
 * - Processes payment
 * - Updates booking dates
 * - Sends SMS/Email notification
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { notifyRentalExtension, notifyExtensionFailure } from '@/lib/services/notificationService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

interface ExtensionRequest {
  orderId: string;
  extensionDays: number;
  paymentMethodId: string;
}

interface BookingData {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  dumpsterSize: number;
  dumpsterType: string;
  pickupDate: string;
  paymentIntentId?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  rentalPeriod?: number;
}

/**
 * Helper: Calculate extension cost
 */
const calculateExtensionCost = (days: number): number => {
  const EXTENSION_RATE = 25; // $25 per day
  return days * EXTENSION_RATE;
};

/**
 * Helper: Add days to a date (skipping weekends)
 */
const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let daysAdded = 0;

  while (daysAdded < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return result;
};

/**
 * Helper: Fetch booking from database
 * (Replace with your actual DB query)
 */
const fetchBookingFromDB = async (orderId: string): Promise<BookingData | null> => {
  try {
    // Mock implementation - replace with actual DB call
    // Example: const booking = await db.bookings.findOne({ id: orderId });
    console.log(`Fetching booking ${orderId} from database...`);
    return null;
  } catch (error) {
    console.error('DB fetch error:', error);
    return null;
  }
};

/**
 * Helper: Update booking in database
 * (Replace with your actual DB update)
 */
const updateBookingInDB = async (
  orderId: string,
  updates: Partial<BookingData>
): Promise<boolean> => {
  try {
    // Mock implementation - replace with actual DB call
    // Example: await db.bookings.updateOne({ id: orderId }, updates);
    console.log(`Updating booking ${orderId}:`, updates);
    return true;
  } catch (error) {
    console.error('DB update error:', error);
    return false;
  }
};

/**
 * Main handler
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId;

  try {
    // 1. Parse request body
    const body: ExtensionRequest = await req.json();
    const { extensionDays, paymentMethodId } = body;

    if (!extensionDays || extensionDays <= 0) {
      return NextResponse.json(
        { error: 'Invalid extension days' },
        { status: 400 }
      );
    }

    // 2. Fetch booking from database
    const booking = await fetchBookingFromDB(orderId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // 3. Calculate extension cost
    const extensionCost = calculateExtensionCost(extensionDays);

    // 4. Process payment via Stripe
    let paymentIntentId: string;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(extensionCost * 100), // Convert to cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        description: `Rental Extension - Order ${orderId}`,
        metadata: {
          orderId,
          extensionDays,
          type: 'rental_extension',
        },
      });

      if (paymentIntent.status !== 'succeeded') {
        // Payment failed
        await notifyExtensionFailure(
          booking.email,
          booking.phone,
          `${booking.firstName} ${booking.lastName}`,
          orderId
        );

        return NextResponse.json(
          { error: 'Payment declined. Please try another payment method.' },
          { status: 402 }
        );
      }

      paymentIntentId = paymentIntent.id;
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError);

      // Notify customer of payment failure
      await notifyExtensionFailure(
        booking.email,
        booking.phone,
        `${booking.firstName} ${booking.lastName}`,
        orderId
      );

      return NextResponse.json(
        { error: `Payment failed: ${stripeError.message}` },
        { status: 402 }
      );
    }

    // 5. Calculate new pickup date
    const currentPickupDate = new Date(booking.pickupDate);
    const newPickupDate = addBusinessDays(currentPickupDate, extensionDays);
    const formattedPickupDate = newPickupDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 6. Update booking in database
    const updateSuccess = await updateBookingInDB(orderId, {
      pickupDate: newPickupDate.toISOString(),
      rentalPeriod: (booking.rentalPeriod || 0) + extensionDays,
    });

    if (!updateSuccess) {
      // Rollback: Refund the charge if DB update fails
      await stripe.refunds.create({ payment_intent: paymentIntentId });

      return NextResponse.json(
        { error: 'Failed to update booking. Refund processed.' },
        { status: 500 }
      );
    }

    // 7. Send SMS/Email notification
    const customerName = `${booking.firstName} ${booking.lastName}`;
    const dumpsterType = booking.dumpsterType || 'Roll-Off';

    await notifyRentalExtension(
      booking.email,
      booking.phone,
      customerName,
      orderId,
      booking.dumpsterSize,
      dumpsterType,
      extensionDays,
      extensionCost,
      formattedPickupDate,
      'Credit Card' // Assuming card payment
    );

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        orderId,
        extensionDays,
        extensionCost,
        newPickupDate: formattedPickupDate,
        paymentIntentId,
        message: `Rental extended successfully! New pickup: ${formattedPickupDate}. Confirmation sent to ${booking.email}.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Extension endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
