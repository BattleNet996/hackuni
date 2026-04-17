import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services';
import { verifyEmailVerificationToken } from '@/lib/auth/email-verification';

export async function POST(request: NextRequest) {
  try {
    const { email, password, display_name, email_verification_token } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    if (!email_verification_token || !verifyEmailVerificationToken(email_verification_token, email)) {
      return NextResponse.json(
        { error: { code: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email before registering' } },
        { status: 403 }
      );
    }

    const { user, token } = await authService.register(email, password, display_name);

    const response = NextResponse.json({
      data: { user, token }
    });

    // Set HTTP-only cookie with consistent name
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.message === 'EMAIL_EXISTS') {
      return NextResponse.json(
        { error: { code: 'EMAIL_EXISTS', message: 'Email already registered' } },
        { status: 409 }
      );
    }

    if (error.message === 'INVALID_EMAIL') {
      return NextResponse.json(
        { error: { code: 'INVALID_EMAIL', message: 'Invalid email format' } },
        { status: 400 }
      );
    }

    if (error.message === 'PASSWORD_TOO_SHORT') {
      return NextResponse.json(
        { error: { code: 'PASSWORD_TOO_SHORT', message: 'Password must be at least 8 characters' } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred during registration' } },
      { status: 500 }
    );
  }
}
