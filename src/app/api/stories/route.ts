import { NextRequest, NextResponse } from 'next/server';
import { storyDAO } from '@/lib/dao';
import { mapRowToStory, type Story } from '@/lib/models/story';
import { getDatabaseRuntimeConfig } from '@/lib/db/runtime';
import { withStoryLikeCounts } from '@/lib/server/like-counts';

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

export async function GET(request: NextRequest) {
  try {
    const runtime = getDatabaseRuntimeConfig();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    console.log('🔍 Stories API runtime:', runtime.databaseType, '-', runtime.reason);

    const stories = await withStoryLikeCounts((await storyDAO.findAll())
      .map((story: any) => mapRowToStory(story))
      .filter((story: Story) => story.status !== 'draft' && !story.hidden)
      .sort((a: Story, b: Story) => {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }), legacyStoryIdBySlug);

    const data = stories.slice(offset, offset + limit);

    return NextResponse.json({
      data,
      total: stories.length,
      page,
      limit,
      hasMore: page * limit < stories.length,
    });
  } catch (error: any) {
    console.error('Get stories error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
