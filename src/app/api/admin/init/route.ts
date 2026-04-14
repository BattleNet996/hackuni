import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';

/**
 * Initialize admin system
 * POST /api/admin/init
 * This endpoint creates the admin tables and initial admin user
 * Should be called once during setup
 */
export async function POST(request: NextRequest) {
  try {
    await adminAuthService.createInitialAdminUser();

    return NextResponse.json({
      data: {
        success: true,
        message: 'Admin system initialized successfully',
        credentials: {
          username: 'wjj',
          password: 'cwj123'
        }
      }
    });
  } catch (error: any) {
    console.error('Init admin system error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

/**
 * Check if admin system is initialized
 * GET /api/admin/init
 */
export async function GET(request: NextRequest) {
  try {
    const { count, error } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: {
        initialized: (count || 0) > 0,
        adminCount: count || 0
      }
    });
  } catch (error: any) {
    console.error('Check init status error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
