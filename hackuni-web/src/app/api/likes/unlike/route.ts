import { NextRequest, NextResponse } from 'next/server';
import { likeDAO } from '@/lib/dao';
import { authService } from '@/lib/services';

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value ||
                 request.headers.get('authorization')?.replace('Bearer ', '');

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
      const { projectDAO } = require('@/lib/dao');
      await projectDAO.updateLikeCount(target_id, -1);
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
