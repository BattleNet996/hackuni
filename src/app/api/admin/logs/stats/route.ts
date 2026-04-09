import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { AdminLogsService } from '@/lib/services/admin-logs.service';
import { getDb } from '@/lib/db/client';

// GET /api/admin/logs/stats - Get log statistics
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
        { status: 401 }
      );
    }

    const db = getDb();
    const adminAuthService = new AdminAuthService(db);
    const adminUser = adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const logsService = new AdminLogsService(db);

    const statsByAction = logsService.getStatsByAction(days);
    const activeAdmins = logsService.getMostActiveAdmins(days);

    return NextResponse.json({
      data: {
        stats_by_action: statsByAction,
        active_admins: activeAdmins,
        period_days: days
      }
    });
  } catch (error: any) {
    console.error('Get log stats error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
