import { NextRequest, NextResponse } from 'next/server';
import { projectDAO } from '@/lib/dao';
import { authService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'rank_score';
    const awarded = searchParams.get('awarded') === 'true';

    let data;
    if (sort === 'like_count') {
      data = await projectDAO.getMostLiked(limit * 2); // Get more for filtering
    } else {
      data = await projectDAO.getTopRanked(limit * 2); // Get more for filtering
    }

    // Filter by awarded status if requested
    if (awarded) {
      data = data.filter((p: any) => p.is_awarded === 1 || p.is_awarded === true);
    }

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
