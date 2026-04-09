import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { getDb } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (token) {
      const db = getDb();
      const authService = new AuthService(db);
      authService.logout(token);
    }

    const response = NextResponse.json({ success: true });

    // Clear the auth cookie
    response.cookies.delete('auth_token');

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred during logout' } },
      { status: 500 }
    );
  }
}
