import { NextRequest, NextResponse } from 'next/server';
import { commentDAO, likeDAO } from '@/lib/dao';
import { authService } from '@/lib/services';

interface LikeRecord {
  target_type: 'project' | 'story' | 'comment';
  target_id: string;
}

function getAuthToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('auth_token')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const xAuthToken = request.headers.get('x-auth-token');

  return cookieToken || headerToken || xAuthToken || null;
}

function isValidTargetType(targetType: string | null): targetType is 'project' | 'story' | 'comment' {
  return !!targetType && ['project', 'story', 'comment'].includes(targetType);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('target_type');
    const targetId = searchParams.get('target_id');

    if (targetType || targetId) {
      if (!isValidTargetType(targetType) || !targetId) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: 'target_type and target_id are required' } },
          { status: 400 }
        );
      }

      const count = await likeDAO.countLikes(targetType, targetId);
      const token = getAuthToken(request);
      const user = token ? await authService.verifyToken(token) : null;

      return NextResponse.json({
        data: {
          target_type: targetType,
          target_id: targetId,
          count,
          liked: user ? await likeDAO.hasUserLiked(user.id, targetType, targetId) : false,
        }
      });
    }

    const token = getAuthToken(request);

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

    const likes = await likeDAO.getByUser(user.id);
    const filteredLikes = isValidTargetType(targetType)
      ? likes.filter((like: LikeRecord) => like.target_type === targetType)
      : likes;

    return NextResponse.json({ data: filteredLikes });
  } catch (error: any) {
    console.error('Get likes error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);

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

    if (!isValidTargetType(target_type)) {
      return NextResponse.json(
        { error: { code: 'INVALID_TARGET_TYPE', message: 'Invalid target_type' } },
        { status: 400 }
      );
    }

    const liked = await likeDAO.toggleLike(user.id, target_type, target_id);

    if (target_type === 'comment') {
      if (liked) {
        await commentDAO.incrementLikes(target_id);
      } else {
        await commentDAO.decrementLikes(target_id);
      }
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
