import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
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

    // 3. Find the User ID for this email
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Failed to list users:', listError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const user = listData.users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 400 });
    }

    // 4. Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Failed to update password:', updateError);
      return NextResponse.json({ error: 'Failed to reset password. Please try again later.' }, { status: 500 });
    }

    // 5. Delete the OTP record to prevent reuse
    await supabaseAdmin
      .from('otp_requests')
      .delete()
      .eq('email', email);

    return NextResponse.json({ success: true, message: 'Password reset successfully' });

  } catch (error: any) {
    console.error('Verify Forgot Password OTP Error:', error);
    return NextResponse.json({ error: 'Server error during verification' }, { status: 500 });
  }
}
