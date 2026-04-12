import { NextRequest, NextResponse } from 'next/server';
import { userDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
        { status: 401 }
      );
    }

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    // Get all users (without password_hash)
    const users = await userDAO.findAll();
    const sanitizedUsers = users.map(u => {
      const { password_hash, ...rest } = u as any;
      return rest;
    });

    return NextResponse.json({
      data: sanitizedUsers
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
