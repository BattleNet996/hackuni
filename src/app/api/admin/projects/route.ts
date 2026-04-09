import { NextRequest, NextResponse } from 'next/server';
import { projectDAO } from '@/lib/dao';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { getDb } from '@/lib/db/client';

// GET /api/admin/projects - Get all projects (admin)
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status');

    // Get projects with optional status filter
    let projects;
    if (status) {
      // For now, return all projects and filter client-side
      // In production, add filter method to DAO
      const result = await projectDAO.getPaginated(page, limit);
      projects = result.data.filter((p: any) => p.status === status);
    } else {
      const result = await projectDAO.getPaginated(page, limit);
      projects = result.data;
    }

    return NextResponse.json({ data: projects });
  } catch (error: any) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
