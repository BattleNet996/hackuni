import { NextRequest, NextResponse } from 'next/server';
import { storyDAO } from '@/lib/dao';
import { mapRowToStory } from '@/lib/models/story';

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

    const data = mapRowToStory(story as any);

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
