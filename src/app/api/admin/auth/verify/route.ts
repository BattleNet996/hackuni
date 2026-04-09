import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { AdminAuthService } from '@/lib/services/admin-auth.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'No token provided' } },
        { status: 401 }
      );
    }

    const db = getDb();
    const adminAuthService = new AdminAuthService(db);
    const adminUser = adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    return NextResponse.json({
      data: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
      }
    });
  } catch (error: any) {
    console.error('Admin verify error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
