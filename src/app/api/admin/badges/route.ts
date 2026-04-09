import { NextRequest, NextResponse } from 'next/server';
import { badgeDAO } from '@/lib/dao';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { getDb } from '@/lib/db/client';

// GET /api/admin/badges - Get all badges
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

    const badges = badgeDAO.findAll();
    return NextResponse.json({ data: badges });
  } catch (error: any) {
    console.error('Get badges error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// POST /api/admin/badges - Create new badge
export async function POST(request: NextRequest) {
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

    const data = await request.json();

    // Create badge
    const id = `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO badges (
        id, badge_code, badge_name, badge_name_en, badge_type,
        badge_desc, badge_desc_en, icon_url, rule_desc, rule_desc_en, source_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.badge_code,
      data.badge_name,
      data.badge_name_en || '',
      data.badge_type || 'milestone',
      data.badge_desc || '',
      data.badge_desc_en || '',
      data.icon_url || '',
      data.rule_desc || '',
      data.rule_desc_en || '',
      data.source_type || 'activity'
    );

    const badge = badgeDAO.findById(id);

    return NextResponse.json({
      data: badge
    });
  } catch (error: any) {
    console.error('Create badge error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
