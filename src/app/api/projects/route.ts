import { NextRequest, NextResponse } from 'next/server';
import { projectDAO } from '@/lib/dao';
import { authService } from '@/lib/services';

function toTimestamp(value: string | undefined | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortProjects(projects: any[], sort: string): any[] {
  const normalizedSort = sort === 'recent' ? 'created_at' : sort;
  const next = [...projects];

  if (normalizedSort === 'rank_score') {
    next.sort((left, right) => {
      const leftRank = typeof left.rank_score === 'number' ? left.rank_score : Number.POSITIVE_INFINITY;
      const rightRank = typeof right.rank_score === 'number' ? right.rank_score : Number.POSITIVE_INFINITY;
      if (leftRank !== rightRank) return leftRank - rightRank;

      const likeDelta = (right.like_count || 0) - (left.like_count || 0);
      if (likeDelta !== 0) return likeDelta;

      return toTimestamp(right.created_at) - toTimestamp(left.created_at);
    });
    return next;
  }

  if (normalizedSort === 'like_count') {
    next.sort((left, right) => {
      const likeDelta = (right.like_count || 0) - (left.like_count || 0);
      if (likeDelta !== 0) return likeDelta;

      const leftRank = typeof left.rank_score === 'number' ? left.rank_score : Number.POSITIVE_INFINITY;
      const rightRank = typeof right.rank_score === 'number' ? right.rank_score : Number.POSITIVE_INFINITY;
      if (leftRank !== rightRank) return leftRank - rightRank;

      return toTimestamp(right.created_at) - toTimestamp(left.created_at);
    });
    return next;
  }

  next.sort((left, right) => {
    const createdDelta = toTimestamp(right.created_at) - toTimestamp(left.created_at);
    if (createdDelta !== 0) return createdDelta;
    return (right.like_count || 0) - (left.like_count || 0);
  });
  return next;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));
    const sort = searchParams.get('sort') || 'created_at';
    const awarded = searchParams.get('awarded') === 'true';
    const status = searchParams.get('status') || 'published';

    const filters: Record<string, any> = {
      hidden: 0,
    };

    if (status !== 'all') {
      filters.status = status;
    }

    let data = await projectDAO.findAll(filters);

    if (awarded) {
      data = data.filter((p: any) => p.is_awarded === 1 || p.is_awarded === true);
    }

    data = sortProjects(data, sort);

    const paginatedData = data.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginatedData,
      total: data.length,
      page,
      limit,
      hasMore: page * limit < data.length
    });
  } catch (error: any) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    // Verify authentication - check multiple token sources
    const cookieToken = request.cookies.get('auth_token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const xAuthToken = request.headers.get('x-auth-token');
    const token = cookieToken || headerToken || xAuthToken;

    console.log('[Projects API] Cookie token:', !!cookieToken);
    console.log('[Projects API] Authorization header:', !!headerToken);
    console.log('[Projects API] X-Auth-Token header:', !!xAuthToken);
    console.log('[Projects API] Using token source:', cookieToken ? 'cookie' : headerToken ? 'authorization' : xAuthToken ? 'x-auth-token' : 'none');

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.short_desc || !data.team_member_text) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Create project
    const project = await projectDAO.create({
      title: data.title,
      short_desc: data.short_desc,
      long_desc: data.long_desc,
      team_member_text: data.team_member_text,
      tags_json: data.tags_json || [],
      demo_url: data.demo_url,
      github_url: data.github_url,
      website_url: data.website_url,
      related_hackathon_id: data.hackathon_id,
      images: data.images || [],
      is_awarded: data.is_awarded || false,
      award_text: data.award_text
    }, user.id);

    return NextResponse.json({ data: project });
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
