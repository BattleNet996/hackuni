import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    const { user, token } = await authService.login(email, password);

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
    console.error('Login error:', error);

    if (error.message === 'INVALID_CREDENTIALS') {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred during login' } },
      { status: 500 }
    );
  }
}
