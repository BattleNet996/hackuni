import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/db/supabase-client';
import { getEmailRedirectTo, isValidEmail } from '@/lib/auth/email-verification';
import { userDAO } from '@/lib/dao';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: { code: 'INVALID_EMAIL', message: 'Invalid email format' } },
        { status: 400 }
      );
    }

    const existing = await userDAO.findByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: { code: 'EMAIL_EXISTS', message: 'Email already registered' } },
        { status: 409 }
      );
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: getEmailRedirectTo(request.url),
      },
    });

    if (error) {
      console.error('Send verification email error:', error);
      return NextResponse.json(
        { error: { code: 'EMAIL_SEND_FAILED', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { sent: true } });
  } catch (error: any) {
    console.error('Send verification email error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
