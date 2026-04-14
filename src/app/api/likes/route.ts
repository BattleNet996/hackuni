import { NextRequest, NextResponse } from 'next/server';
import { likeDAO, userDAO, projectDAO, storyDAO } from '@/lib/dao';
import { authService } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication - check multiple token sources
    const cookieToken = request.cookies.get('auth_token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const xAuthToken = request.headers.get('x-auth-token');
    const token = cookieToken || headerToken || xAuthToken;

    console.log('[Likes API] Cookie token:', !!cookieToken);
    console.log('[Likes API] Authorization header:', !!headerToken);
    console.log('[Likes API] X-Auth-Token header:', !!xAuthToken);
    console.log('[Likes API] Using token source:', cookieToken ? 'cookie' : headerToken ? 'authorization' : xAuthToken ? 'x-auth-token' : 'none');

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

    const { target_type, target_id } = await request.json();

    if (!target_type || !target_id) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'target_type and target_id are required' } },
        { status: 400 }
      );
    }

    if (!['project', 'story', 'comment'].includes(target_type)) {
      return NextResponse.json(
        { error: { code: 'INVALID_TARGET_TYPE', message: 'Invalid target_type' } },
        { status: 400 }
      );
    }

    const liked = await likeDAO.toggleLike(user.id, target_type, target_id);

    // Update like count on target
    const delta = liked ? 1 : -1;
    if (target_type === 'project') {
      await projectDAO.updateLikeCount(target_id, delta);
    } else if (target_type === 'story') {
      await storyDAO.updateLikeCount(target_id, delta);
    }

    const count = await likeDAO.countLikes(target_type, target_id);

    return NextResponse.json({
      data: {
        success: true,
        liked,
        count
      }
    });
  } catch (error: any) {
    console.error('Toggle like error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
