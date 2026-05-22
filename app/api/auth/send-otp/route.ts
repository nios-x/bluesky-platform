import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save to otp_requests table
    const { error: dbError } = await supabaseAdmin
      .from('otp_requests')
      .upsert(
        { email, otp_code: otp, expires_at: expiresAt.toISOString() },
        { onConflict: 'email' }
      );

    if (dbError) {
      console.error('Failed to save OTP:', dbError);
      return NextResponse.json({ error: 'Database error storing OTP' }, { status: 500 });
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send the email
    const mailOptions = {
      from: `"Blue Sky Disposal" <${process.env.SMTP_USER || 'noreply@blueskydisposal.com'}>`,
      to: email,
      subject: 'Your Blue Sky Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <h2 style="color: #0A1628;">Welcome to Blue Sky Disposal!</h2>
          <p>Please use the following 6-digit verification code to complete your sign-up:</p>
          <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #2563eb; letter-spacing: 4px; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    // Note: If SMTP variables are missing, this will throw an error in the console.
    if (!process.env.SMTP_USER) {
      console.warn("SMTP credentials missing. Mocking OTP send. OTP is:", otp);
    } else {
      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
  }
}
