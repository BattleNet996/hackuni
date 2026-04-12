import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { AdminLogsService } from '@/lib/services/admin-logs.service';
import { getDb } from '@/lib/db/client';

// GET /api/admin/logs - Get admin logs
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action') || undefined;
    const entityType = searchParams.get('entity_type') || undefined;
    const adminUserId = searchParams.get('admin_user_id') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    const db = getDb();
    const logsService = new AdminLogsService(db);
    const result = logsService.getLogs(page, limit, {
      action,
      entity_type: entityType,
      admin_user_id: adminUserId,
      start_date: startDate,
      end_date: endDate
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Get logs error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
