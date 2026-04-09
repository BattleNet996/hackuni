import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { getDb } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  try {
    const { email, password, display_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const authService = new AuthService(db);

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
