import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO, projectDAO, userDAO } from '@/lib/dao';
import { enrichFeaturedHackathon, getFeaturedHackathonFallbackById } from '@/lib/hackathon-curation';
import { withProjectLikeCounts } from '@/lib/server/like-counts';

function toTimestamp(value: string | undefined | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sourceHackathon = (await hackathonDAO.findById(id)) || getFeaturedHackathonFallbackById(id);
    const hackathon = sourceHackathon ? enrichFeaturedHackathon(sourceHackathon) : null;

    if (!hackathon) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Hackathon not found' } },
        { status: 404 }
      );
    }

    const relatedProjectsRaw = typeof (projectDAO as any).findByHackathonId === 'function'
      ? await (projectDAO as any).findByHackathonId(id)
      : [];
    const relatedProjects = (await withProjectLikeCounts(relatedProjectsRaw)).sort((left: any, right: any) => {
      const likeDelta = (right.like_count || 0) - (left.like_count || 0);
      if (likeDelta !== 0) return likeDelta;
      return toTimestamp(right.created_at) - toTimestamp(left.created_at);
    });

    const participantIds = Array.from(
      new Set(
        relatedProjects
          .map((project: any) => project.author_id)
          .filter(Boolean)
      )
    );

    const participants =
      participantIds.length > 0 && typeof (userDAO as any).findByIds === 'function'
        ? await (userDAO as any).findByIds(participantIds)
        : [];

    return NextResponse.json({
      data: {
        ...hackathon,
        relatedProjects,
        participants,
      },
    });
  } catch (error: any) {
    console.error('Get hackathon detail error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
