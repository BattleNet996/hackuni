import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO, projectDAO, userDAO } from '@/lib/dao';
import { getFeaturedHackathonFallbackById } from '@/lib/hackathon-curation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hackathon = (await hackathonDAO.findById(id)) || getFeaturedHackathonFallbackById(id);

    if (!hackathon) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Hackathon not found' } },
        { status: 404 }
      );
    }

    const relatedProjects = typeof (projectDAO as any).findByHackathonId === 'function'
      ? await (projectDAO as any).findByHackathonId(id)
      : [];

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
