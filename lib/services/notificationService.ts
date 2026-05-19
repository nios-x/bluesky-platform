/**
 * Notification Service
 * Handles sending SMS and Email notifications for booking events
 * Supports: Extension confirmations, delivery reminders, pickup reminders, etc.
 */

interface NotificationPayload {
  type: 'extension' | 'delivery-reminder' | 'pickup-reminder' | 'booking-confirmation' | 'extension-failed';
  phone?: string;
  email: string;
  customerName: string;
  dumpsterSize: number;
  dumpsterType: string;
  orderId: string;
  rentalPeriod?: number;
  extensionDays?: number;
  extensionCost?: number;
  deliveryDate?: string;
  pickupDate?: string;
  totalPrice?: number;
  paymentMethod?: string;
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  channel: 'sms' | 'email';
}

/**
 * Build notification templates
 */
const buildEmailTemplate = (payload: NotificationPayload): { subject: string; body: string } => {
  switch (payload.type) {
    case 'extension':
      return {
        subject: `Rental Extension Confirmed - Order #${payload.orderId}`,
        body: `
          <h2>Rental Extension Confirmed!</h2>
          <p>Hi ${payload.customerName},</p>
          <p>Your rental extension has been successfully confirmed.</p>
          <hr />
          <h3>Extension Details:</h3>
          <ul>
            <li><strong>Order ID:</strong> ${payload.orderId}</li>
            <li><strong>Dumpster:</strong> ${payload.dumpsterSize}yd ${payload.dumpsterType}</li>
            <li><strong>Extension Period:</strong> ${payload.extensionDays} additional day(s)</li>
            <li><strong>Extension Cost:</strong> $${payload.extensionCost?.toFixed(2)}</li>
            <li><strong>New Pickup Date:</strong> ${payload.pickupDate}</li>
            <li><strong>Payment Method:</strong> ${payload.paymentMethod}</li>
          </ul>
          <hr />
          <p>Your payment method has been charged $${payload.extensionCost?.toFixed(2)} for the extension.</p>
          <p>Thank you for choosing Blue Sky Disposal!</p>
          <footer>
            <p>Questions? Contact us at 586-412-3762 or BlueSkyDisposal@gmail.com</p>
          </footer>
        `,
      };

    case 'extension-failed':
      return {
        subject: `Extension Payment Failed - Order #${payload.orderId}`,
        body: `
          <h2>Extension Payment Failed</h2>
          <p>Hi ${payload.customerName},</p>
          <p>We were unable to process your rental extension payment.</p>
          <p><strong>Order ID:</strong> ${payload.orderId}</p>
          <p><strong>Reason:</strong> Payment method declined</p>
          <p>Please update your payment method or contact us at 586-412-3762 to retry.</p>
        `,
      };

    case 'delivery-reminder':
      return {
        subject: `Delivery Reminder - Your Dumpster Arrives Soon! (Order #${payload.orderId})`,
        body: `
          <h2>Delivery Reminder</h2>
          <p>Hi ${payload.customerName},</p>
          <p>Your ${payload.dumpsterSize}yd ${payload.dumpsterType} dumpster is scheduled for delivery on:</p>
          <p><strong>${payload.deliveryDate}</strong></p>
          <hr />
          <h3>Delivery Preparation Checklist:</h3>
          <ul>
            <li>✓ Ensure at least 60 feet of clear access for the truck</li>
            <li>✓ Mark where you want the dumpster placed (driveway, street, etc.)</li>
            <li>✓ Remove objects that could obstruct placement</li>
            <li>✓ Have a contact person available on delivery day</li>
          </ul>
          <p>If you need to reschedule, please call us at 586-412-3762.</p>
        `,
      };

    case 'pickup-reminder':
      return {
        subject: `Pickup Reminder - Final Day to Load Your Dumpster (Order #${payload.orderId})`,
        body: `
          <h2>Pickup Reminder</h2>
          <p>Hi ${payload.customerName},</p>
          <p>Your ${payload.dumpsterSize}yd dumpster pickup is scheduled for:</p>
          <p><strong>${payload.pickupDate}</strong></p>
          <hr />
          <h3>Pickup Guidelines:</h3>
          <ul>
            <li>✓ Ensure debris is NOT overfilled (must be at or below top rail)</li>
            <li>✓ Remove any locks or chains before pickup</li>
            <li>✓ Keep truck access clear — no vehicles blocking the dumpster</li>
            <li>✓ Be ready for pickup within the scheduled window</li>
          </ul>
          <p>Need more time? Extend your rental by calling 586-412-3762.</p>
        `,
      };

    case 'booking-confirmation':
      return {
        subject: `Booking Confirmed! Your Dumpster is Reserved (Order #${payload.orderId})`,
        body: `
          <h2>Booking Confirmed!</h2>
          <p>Hi ${payload.customerName},</p>
          <p>Your dumpster rental has been confirmed.</p>
          <hr />
          <h3>Order Summary:</h3>
          <ul>
            <li><strong>Order ID:</strong> ${payload.orderId}</li>
            <li><strong>Dumpster:</strong> ${payload.dumpsterSize}yd ${payload.dumpsterType}</li>
            <li><strong>Rental Period:</strong> ${payload.rentalPeriod} days</li>
            <li><strong>Delivery Date:</strong> ${payload.deliveryDate}</li>
            <li><strong>Pickup Date:</strong> ${payload.pickupDate}</li>
            <li><strong>Total Price:</strong> $${payload.totalPrice?.toFixed(2)}</li>
          </ul>
          <p>Thank you for choosing Blue Sky Disposal!</p>
        `,
      };

    default:
      return {
        subject: 'Blue Sky Disposal - Notification',
        body: '<p>Notification update</p>',
      };
  }
};

/**
 * Build SMS template (concise text format)
 */
const buildSMSTemplate = (payload: NotificationPayload): string => {
  switch (payload.type) {
    case 'extension':
      return `Blue Sky Disposal: Your rental extension for Order #${payload.orderId} is confirmed! Extended ${payload.extensionDays} day(s) at $${payload.extensionCost?.toFixed(2)}. New pickup: ${payload.pickupDate}. Reply HELP for support.`;

    case 'extension-failed':
      return `Blue Sky Disposal: Payment failed for Order #${payload.orderId} extension. Please update payment at BlueSkyDisposal.com or call 586-412-3762.`;

    case 'delivery-reminder':
      return `Blue Sky Disposal: Reminder - your ${payload.dumpsterSize}yd dumpster delivery is scheduled for ${payload.deliveryDate}. Clear 60ft access. Reply HELP for questions.`;

    case 'pickup-reminder':
      return `Blue Sky Disposal: Final reminder - pickup scheduled for ${payload.pickupDate}. Ensure debris is NOT overfilled. Reply HELP for questions.`;

    case 'booking-confirmation':
      return `Blue Sky Disposal: Order #${payload.orderId} confirmed! ${payload.dumpsterSize}yd dumpster. Delivery: ${payload.deliveryDate}. Total: $${payload.totalPrice?.toFixed(2)}. Reply HELP for support.`;

    default:
      return 'Blue Sky Disposal: Notification update.';
  }
};

/**
 * Send Email via SendGrid or NodeMailer
 */
export const sendEmail = async (
  payload: NotificationPayload
): Promise<SendResult> => {
  try {
    const { subject, body } = buildEmailTemplate(payload);

    // Option 1: SendGrid (recommended for production)
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (sendgridApiKey) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(sendgridApiKey);

      const msg = {
        to: payload.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'BlueSkyDisposal@gmail.com',
        subject,
        html: body,
      };

      const result = await sgMail.send(msg);
      return {
        success: true,
        messageId: result[0].headers['x-message-id'],
        channel: 'email',
      };
    }

    // Option 2: Nodemailer (Gmail or SMTP fallback)
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'BlueSkyDisposal@gmail.com',
      to: payload.email,
      subject,
      html: body,
    });

    return {
      success: true,
      messageId: info.messageId,
      channel: 'email',
    };
  } catch (error: any) {
    console.error('Email send failed:', error);
    return {
      success: false,
      error: error.message,
      channel: 'email',
    };
  }
};

/**
 * Send SMS via Twilio
 */
export const sendSMS = async (
  payload: NotificationPayload
): Promise<SendResult> => {
  try {
    if (!payload.phone) {
      return {
        success: false,
        error: 'Phone number required for SMS',
        channel: 'sms',
      };
    }

    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = buildSMSTemplate(payload);

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: payload.phone,
    });

    return {
      success: true,
      messageId: result.sid,
      channel: 'sms',
    };
  } catch (error: any) {
    console.error('SMS send failed:', error);
    return {
      success: false,
      error: error.message,
      channel: 'sms',
    };
  }
};

/**
 * Send both SMS and Email (main entry point)
 */
export const sendNotification = async (
  payload: NotificationPayload,
  channels: ('sms' | 'email')[] = ['sms', 'email']
): Promise<SendResult[]> => {
  const results: SendResult[] = [];

  if (channels.includes('email')) {
    const emailResult = await sendEmail(payload);
    results.push(emailResult);
  }

  if (channels.includes('sms')) {
    const smsResult = await sendSMS(payload);
    results.push(smsResult);
  }

  return results;
};

/**
 * Notify on rental extension (core function for your use case)
 */
export const notifyRentalExtension = async (
  email: string,
  phone: string | undefined,
  customerName: string,
  orderId: string,
  dumpsterSize: number,
  dumpsterType: string,
  extensionDays: number,
  extensionCost: number,
  newPickupDate: string,
  paymentMethod: string
): Promise<SendResult[]> => {
  const payload: NotificationPayload = {
    type: 'extension',
    email,
    phone,
    customerName,
    orderId,
    dumpsterSize,
    dumpsterType,
    extensionDays,
    extensionCost,
    pickupDate: newPickupDate,
    paymentMethod,
  };

  return sendNotification(payload, phone ? ['sms', 'email'] : ['email']);
};

/**
 * Notify on extension failure
 */
export const notifyExtensionFailure = async (
  email: string,
  phone: string | undefined,
  customerName: string,
  orderId: string
): Promise<SendResult[]> => {
  const payload: NotificationPayload = {
    type: 'extension-failed',
    email,
    phone,
    customerName,
    orderId,
    dumpsterSize: 0,
    dumpsterType: '',
  };

  return sendNotification(payload, phone ? ['sms', 'email'] : ['email']);
};
