import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { AdminLogsService } from '@/lib/services/admin-logs.service';
import { getDb } from '@/lib/db/client';

// GET /api/admin/reviews - Get pending items for review
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

    // Get pending projects (status = 'pending')
    const pendingProjectsStmt = db.prepare(`
      SELECT
        id, title, short_desc, author_id,
        like_count, created_at, 'project' as type
      FROM projects
      WHERE status = 'pending'
      ORDER BY created_at DESC
      LIMIT 20
    `);
    const pendingProjects = pendingProjectsStmt.all();

    // Get pending stories (status = 'pending')
    const pendingStoriesStmt = db.prepare(`
      SELECT
        id, title, summary, author_name,
        like_count, created_at, 'story' as type
      FROM stories
      WHERE status = 'pending'
      ORDER BY created_at DESC
      LIMIT 20
    `);
    const pendingStories = pendingStoriesStmt.all();

    // Get pending badge requests (user_badges with status = 'pending')
    const pendingBadgesStmt = db.prepare(`
      SELECT
        ub.id, u.display_name as user_name, b.badge_name,
        ub.status, ub.earned_at, ub.created_at,
        'badge' as type
      FROM user_badges ub
      JOIN users u ON ub.user_id = u.id
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.status = 'pending'
      ORDER BY ub.created_at DESC
      LIMIT 20
    `);
    const pendingBadges = pendingBadgesStmt.all();

    return NextResponse.json({
      data: {
        projects: pendingProjects,
        stories: pendingStories,
        badges: pendingBadges,
        total: pendingProjects.length + pendingStories.length + pendingBadges.length
      }
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
