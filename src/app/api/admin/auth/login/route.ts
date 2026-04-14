import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log('[ADMIN LOGIN] Attempt:', { username, passwordLength: password?.length });

    if (!username || !password) {
      console.log('[ADMIN LOGIN] Missing credentials');
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Username and password are required' } },
        { status: 400 }
      );
    }

    await adminAuthService.createInitialAdminUser();

    // Clean up expired sessions
    await adminAuthService.cleanupExpiredSessions();

    const result = await adminAuthService.login(username, password);
    console.log('[ADMIN LOGIN] Result:', result ? 'SUCCESS' : 'FAILED');

    if (!result) {
      console.log('[ADMIN LOGIN] Invalid credentials');
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } },
        { status: 401 }
      );
    }

    // Set HTTP-only cookie with token
    const response = NextResponse.json({
      data: {
        adminUser: {
          id: result.adminUser.id,
          username: result.adminUser.username,
          email: result.adminUser.email,
        },
        token: result.token,
      }
    });

    response.cookies.set('admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    console.log('[ADMIN LOGIN] Cookie set, token:', result.token.substring(0, 10) + '...');
    return response;
  } catch (error: any) {
    console.error('[ADMIN LOGIN] Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
