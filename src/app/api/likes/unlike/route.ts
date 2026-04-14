import { NextRequest, NextResponse } from 'next/server';
import { commentDAO, likeDAO, projectDAO, storyDAO } from '@/lib/dao';
import { authService } from '@/lib/services';

export async function DELETE(request: NextRequest) {
  try {
    const token =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.headers.get('x-auth-token');

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

    // Check if user has liked this item
    const hasLiked = await likeDAO.hasUserLiked(user.id, target_type, target_id);

    if (!hasLiked) {
      return NextResponse.json(
        { error: { code: 'NOT_LIKED', message: 'You have not liked this item' } },
        { status: 400 }
      );
    }

    // Toggle like (remove it)
    await likeDAO.toggleLike(user.id, target_type, target_id);

    // Update like count on target
    if (target_type === 'project') {
      await projectDAO.updateLikeCount(target_id, -1);
    } else if (target_type === 'story') {
      await storyDAO.updateLikeCount(target_id, -1);
    } else if (target_type === 'comment') {
      await commentDAO.decrementLikes(target_id);
    }

    const count = await likeDAO.countLikes(target_type, target_id);

    return NextResponse.json({
      data: {
        success: true,
        liked: false,
        count
      }
    });
  } catch (error: any) {
    console.error('Unlike error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
