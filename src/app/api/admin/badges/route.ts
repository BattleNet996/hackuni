import { NextRequest, NextResponse } from 'next/server';
import { badgeDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';

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

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const badges = await badgeDAO.findAll();
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

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Create badge
    const id = `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const badge = await badgeDAO.create({
      id,
      badge_code: data.badge_code,
      badge_name: data.badge_name,
      badge_name_en: data.badge_name_en || '',
      badge_type: data.badge_type || 'milestone',
      badge_desc: data.badge_desc || '',
      badge_desc_en: data.badge_desc_en || '',
      icon_url: data.icon_url || '',
      rule_desc: data.rule_desc || '',
      rule_desc_en: data.rule_desc_en || '',
      source_type: data.source_type || 'activity',
      created_at: new Date().toISOString()
    });

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
