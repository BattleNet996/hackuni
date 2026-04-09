import { NextRequest, NextResponse } from 'next/server';
import { storyDAO } from '@/lib/dao';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { getDb } from '@/lib/db/client';

// GET /api/admin/stories - Get all stories
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

    const stories = storyDAO.findAll();
    return NextResponse.json({ data: stories });
  } catch (error: any) {
    console.error('Get stories error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// POST /api/admin/stories - Create new story
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

    // Create story
    const id = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO stories (
        id, slug, title, summary, source, source_url,
        author_name, tags_json, published_at, like_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.slug,
      data.title,
      data.summary || '',
      data.source || null,
      data.source_url || null,
      data.author_name || adminUser.username,
      JSON.stringify(data.tags_json || []),
      data.published_at || new Date().toISOString(),
      0
    );

    const story = storyDAO.findById(id);

    return NextResponse.json({
      data: story
    });
  } catch (error: any) {
    console.error('Create story error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
