import { NextRequest, NextResponse } from 'next/server';
import { projectDAO } from '@/lib/dao';
import { withProjectLikeCounts } from '@/lib/server/like-counts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '8', 10)));

    if (!query) {
      return NextResponse.json({ data: [] });
    }

    const projects = typeof (projectDAO as any).search === 'function'
      ? await (projectDAO as any).search(query, limit)
      : [];

    const projectsWithLikes = await withProjectLikeCounts(projects || []);

    return NextResponse.json({
      data: projectsWithLikes.map((project: any) => ({
        id: project.id,
        title: project.title,
        short_desc: project.short_desc,
        like_count: project.like_count || 0,
        author_id: project.author_id,
      })),
    });
  } catch (error: any) {
    console.error('Search projects error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
