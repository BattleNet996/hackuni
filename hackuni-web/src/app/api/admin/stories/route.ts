import { NextRequest, NextResponse } from 'next/server';
import { storyDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';

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

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const stories = await storyDAO.findAll();
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

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Create story
    const id = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const story = await storyDAO.create({
      id,
      slug: data.slug,
      title: data.title,
      summary: data.summary || '',
      content: data.content || null,
      source: data.source || null,
      source_url: data.source_url || null,
      author_name: data.author_name || adminUser.username,
      tags_json: data.tags_json || [],
      published_at: data.published_at || new Date().toISOString(),
      like_count: 0,
      status: data.status || 'published',
      hidden: data.hidden ? 1 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

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
