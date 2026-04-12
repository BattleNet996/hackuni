import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services';

// GET /api/auth/verify - Verify if user is logged in
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ data: null });
    }

    const user = await authService.verifyToken(token);

    if (!user) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: user });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ data: null });
  }
}
