import { NextRequest, NextResponse } from 'next/server';
import { likeDAO, userDAO, projectDAO, storyDAO } from '@/lib/dao';
import { AuthService } from '@/lib/services/auth.service';
import { getDb } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value ||
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const db = getDb();
    const authService = new AuthService(db);
    const user = authService.verifyToken(token);

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

    const liked = likeDAO.toggleLike(user.id, target_type, target_id);

    // Update like count on target
    const delta = liked ? 1 : -1;
    if (target_type === 'project') {
      projectDAO.updateLikeCount(target_id, delta);
    } else if (target_type === 'story') {
      // Add storyDAO.updateLikeCount if needed
    }

    const count = likeDAO.countLikes(target_type, target_id);

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
