import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email, otp, password, name, phone, userType } = await req.json();

    if (!email || !otp || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the OTP record
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from('otp_requests')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired OTP request' }, { status: 400 });
    }

    // 2. Validate the OTP code and expiration
    if (otpRecord.otp_code !== otp) {
      return NextResponse.json({ error: 'Incorrect verification code' }, { status: 400 });
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // 3. OTP is valid! Create the user in Supabase Auth via Admin API
    // Setting email_confirm: true skips the native Supabase verification email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        phone,
        user_type: userType
      }
    });

    if (authError || !authData.user) {
      console.error('Admin createUser error:', authError);
      return NextResponse.json({ error: authError?.message || 'Failed to create user account' }, { status: 400 });
    }

    // 4. Create the customer profile
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "Name";

    const { error: customerError } = await supabaseAdmin
      .from("customers")
      .insert({
        user_id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        phone: phone || "",
        customer_type: userType === "customer" ? "RESIDENTIAL" : "BUSINESS"
      });

    if (customerError) {
      console.error("Failed to create customer profile:", customerError);
      // We log but don't strictly fail the request, the user was created successfully
    }

    // 5. Delete the OTP record to prevent reuse
    await supabaseAdmin
      .from('otp_requests')
      .delete()
      .eq('email', email);

    return NextResponse.json({ success: true, message: 'User created successfully' });

  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Server error during verification' }, { status: 500 });
  }
}
