import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services';

// GET /api/auth/verify - Verify if user is logged in
export async function GET(request: NextRequest) {
  try {
    // Try multiple token sources
    const cookieToken = request.cookies.get('auth_token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const xAuthToken = request.headers.get('x-auth-token');

    const token = cookieToken || headerToken || xAuthToken;

    if (!token) {
      console.log('[Verify] No token found in cookie, authorization header, or x-auth-token');
      return NextResponse.json({ data: null });
    }

    console.log('[Verify] Token found, verifying...');
    const user = await authService.verifyToken(token);

    if (!user) {
      console.log('[Verify] Token verification failed');
      return NextResponse.json({ data: null });
    }

    console.log('[Verify] User verified:', user.id);
    return NextResponse.json({ data: user });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ data: null });
  }
}
