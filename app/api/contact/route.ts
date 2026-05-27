import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate request body
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields (Name, Email, Subject, Message)." },
        { status: 400 }
      );
    }

    // SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP user or password not configured in environment variables.");
      return NextResponse.json(
        { error: "Email service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const businessEmail = "BlueSkyDisposal@gmail.com";

    // 1. Send notification to the business (e.g., BlueSkyDisposal@gmail.com and SMTP_USER)
    const toEmails = [businessEmail];
    if (smtpUser && smtpUser !== businessEmail) {
      toEmails.push(smtpUser);
    }

    const mailToBusiness = {
      from: `"${name} via Blue Sky Contact" <${smtpUser}>`,
      to: toEmails.join(", "),
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Message from Contact Form</h2>
          
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1f2937;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email:</td>
              <td style="padding: 8px 0; color: #2563eb;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Phone:</td>
              <td style="padding: 8px 0; color: #1f2937;">${phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Subject:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${subject}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #2563eb; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #4b5563; margin-bottom: 8px;">Message:</p>
            <p style="margin: 0; color: #1f2937; white-space: pre-wrap; line-height: 1.5;">${message}</p>
          </div>
          
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
            This email was sent from the contact form on Blue Sky Disposal.
          </p>
        </div>
      `,
    };

    // 2. Send confirmation to the client who submitted the form
    const mailToCustomer = {
      from: `"Blue Sky Disposal" <${smtpUser}>`,
      to: email,
      subject: `We received your message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin-bottom: 5px;">Message Received</h2>
            <p style="color: #6b7280; margin: 0;">Thank you for contacting Blue Sky Disposal</p>
          </div>
          
          <p>Hi ${name},</p>
          <p>We have successfully received your message and our team will get back to you shortly.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">Copy of your message:</h4>
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #4b5563;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 0; font-size: 14px; color: #4b5563; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>If your request is urgent, please call us directly at <a href="tel:5864123762" style="color: #2563eb; font-weight: bold; text-decoration: none;">(586) 412-3762</a>.</p>
          
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 14px; color: #1f2937; margin: 0;">
            Best regards,<br />
            <strong>Blue Sky Disposal Team</strong>
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
            <a href="https://blueskydisposal.com" style="color: #9ca3af; text-decoration: underline;">blueskydisposal.com</a>
          </p>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailToBusiness),
      transporter.sendMail(mailToCustomer),
    ]);

    return NextResponse.json({ success: true, message: "Emails sent successfully" });
  } catch (error: any) {
    console.error("Error in contact form submission API:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while sending your message." },
      { status: 500 }
    );
  }
}
