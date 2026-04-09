import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { AdminLogsService } from '@/lib/services/admin-logs.service';
import { getDb } from '@/lib/db/client';

// PATCH /api/admin/reviews/[id] - Approve or reject a submission
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const itemId = (await params).id;
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

    const { action, type } = await request.json();

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid action' } },
        { status: 400 }
      );
    }

    const logsService = new AdminLogsService(db);
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    if (type === 'project') {
      // Update project status
      const stmt = db.prepare('UPDATE projects SET status = ? WHERE id = ?');
      const result = stmt.run(newStatus, itemId);

      if (result.changes === 0) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Project not found' } },
          { status: 404 }
        );
      }

      // Get project details for logging
      const project = db.prepare('SELECT title, author_id FROM projects WHERE id = ?').get(itemId);

      logsService.log(adminUser, action, {
        entity_type: 'project',
        entity_id: itemId,
        entity_name: project?.title,
        details: { status: newStatus }
      });

    } else if (type === 'story') {
      // Update story status
      const stmt = db.prepare('UPDATE stories SET status = ? WHERE id = ?');
      const result = stmt.run(newStatus, itemId);

      if (result.changes === 0) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Story not found' } },
          { status: 404 }
        );
      }

      // Get story details for logging
      const story = db.prepare('SELECT title FROM stories WHERE id = ?').get(itemId);

      logsService.log(adminUser, action, {
        entity_type: 'story',
        entity_id: itemId,
        entity_name: story?.title,
        details: { status: newStatus }
      });

    } else if (type === 'badge') {
      // Update user_badge status
      const stmt = db.prepare(`
        UPDATE user_badges
        SET status = ?, verified_at = datetime('now')
        WHERE id = ?
      `);
      const result = stmt.run(newStatus, itemId);

      if (result.changes === 0) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Badge request not found' } },
          { status: 404 }
        );
      }

      // Get badge details for logging
      const badgeInfo = db.prepare(`
        SELECT u.display_name, b.badge_name
        FROM user_badges ub
        JOIN users u ON ub.user_id = u.id
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.id = ?
      `).get(itemId);

      logsService.log(adminUser, action, {
        entity_type: 'badge',
        entity_id: itemId,
        entity_name: `${badgeInfo?.display_name} - ${badgeInfo?.badgege_name}`,
        details: { status: newStatus }
      });
    } else {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid type' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: { success: true, status: newStatus },
      message: action === 'approve'
        ? 'Submission approved successfully'
        : 'Submission rejected successfully'
    });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
