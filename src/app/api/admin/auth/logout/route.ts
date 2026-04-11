import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { AdminAuthService } from '@/lib/services/admin-auth.service';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      const db = getDb();
      const adminAuthService = new AdminAuthService(db);
      adminAuthService.logout(token);
    }

    const response = NextResponse.json({
      data: { success: true, message: 'Logged out successfully' }
    });

    // Clear cookie
    response.cookies.delete('admin_token');

    return response;
  } catch (error: any) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
