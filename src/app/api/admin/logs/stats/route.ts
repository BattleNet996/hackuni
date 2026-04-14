import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { AdminLogsService } from '@/lib/services/admin-logs.service';

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

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const logsService = new AdminLogsService();

    const [statsByAction, activeAdmins] = await Promise.all([
      logsService.getStatsByAction(days),
      logsService.getMostActiveAdmins(days),
    ]);

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
