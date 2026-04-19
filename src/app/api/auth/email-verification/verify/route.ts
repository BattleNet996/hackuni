import { NextRequest, NextResponse } from 'next/server';
import {
  createEmailVerificationToken,
  getEmailVerificationCookieName,
  isValidEmail,
  verifyVerificationStateCookieValue,
} from '@/lib/auth/email-verification';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedCode = String(code || '').trim().replace(/\D/g, '');

    if (!isValidEmail(normalizedEmail) || normalizedCode.length !== 6) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Email and a 6-digit verification code are required' } },
        { status: 400 }
      );
    }

    const verificationCookie = request.cookies.get(getEmailVerificationCookieName())?.value;

    if (!verificationCookie || !verifyVerificationStateCookieValue(verificationCookie, normalizedEmail, normalizedCode)) {
      return NextResponse.json(
        { error: { code: 'INVALID_CODE', message: 'Invalid or expired verification code' } },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      data: {
        verified: true,
        email_verification_token: createEmailVerificationToken(normalizedEmail),
      },
    });
    response.cookies.delete(getEmailVerificationCookieName());
    return response;
  } catch (error: any) {
    console.error('Verify email code error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
