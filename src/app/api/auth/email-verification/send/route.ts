import { NextRequest, NextResponse } from 'next/server';
import {
  createVerificationStateCookieValue,
  getEmailVerificationCookieName,
  getEmailVerificationTtlSeconds,
  isValidEmail,
  sendVerificationEmail,
  generateVerificationCode,
} from '@/lib/auth/email-verification';
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

    const code = generateVerificationCode();
    await sendVerificationEmail(normalizedEmail, code);

    const response = NextResponse.json({ data: { sent: true, method: 'custom_otp' } });
    response.cookies.set(getEmailVerificationCookieName(), createVerificationStateCookieValue(normalizedEmail, code), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getEmailVerificationTtlSeconds(),
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Send verification email error:', error);

    if (String(error?.message || '').includes('EMAIL_PROVIDER_NOT_CONFIGURED')) {
      return NextResponse.json(
        { error: { code: 'EMAIL_PROVIDER_NOT_CONFIGURED', message: 'Email provider is not configured' } },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to send verification email' } },
      { status: 500 }
    );
  }
}
