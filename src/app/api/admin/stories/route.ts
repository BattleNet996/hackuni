import { NextRequest, NextResponse } from 'next/server';
import { storyDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';

const legacyStoryIdBySlug: Record<string, string> = {
  'post-hackathon-recap': 's1',
  'interview-goat': 's2',
  'ai-in-2026-two-ais': 's3',
  'ai-voice-agents-2025': 's4',
  'ai-50-2025': 's5',
  'big-ideas-tech-2025': 's6',
  'consumer-ai-2025': 's7',
  'enterprise-ai-2025': 's8',
};

async function enrichStories(stories: any[]) {
  if (stories.length === 0) {
    return [];
  }

  const storyIds = stories.map((story) => story.id);
  const legacyIds = stories
    .map((story) => legacyStoryIdBySlug[story.slug])
    .filter(Boolean);

  const likeTargetIds = Array.from(new Set([...storyIds, ...legacyIds]));
  const { data: likes, error } = await supabase
    .from('likes')
    .select('target_id')
    .eq('target_type', 'story')
    .in('target_id', likeTargetIds);

  if (error) {
    throw error;
  }

  const likeCounts = (likes || []).reduce((acc: Record<string, number>, row: any) => {
    acc[row.target_id] = (acc[row.target_id] || 0) + 1;
    return acc;
  }, {});

  return stories.map((story) => {
    const legacyId = legacyStoryIdBySlug[story.slug];
    return {
      ...story,
      like_count: (likeCounts[story.id] || 0) + (legacyId ? (likeCounts[legacyId] || 0) : 0),
    };
  });
}

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
    const enrichedStories = await enrichStories(stories);
    return NextResponse.json({ data: enrichedStories });
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
