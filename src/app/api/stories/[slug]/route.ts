import { NextRequest, NextResponse } from 'next/server';
import { storyDAO } from '@/lib/dao';
import { mapRowToStory } from '@/lib/models/story';
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const story = await storyDAO.findBySlug(slug) || await storyDAO.findById(slug);

    if (!story) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Story not found' } },
        { status: 404 }
      );
    }

    const [data] = await withStoryLikeCounts([mapRowToStory(story as any)], legacyStoryIdBySlug);

    if (data.status === 'draft' || data.hidden) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Story not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Get story error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
