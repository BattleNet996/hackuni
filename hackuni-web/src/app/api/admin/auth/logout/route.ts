import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      await adminAuthService.logout(token);
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
