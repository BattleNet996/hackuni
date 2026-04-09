import { NextRequest, NextResponse } from 'next/server';
import { commentDAO } from '@/lib/dao';
import { AuthService } from '@/lib/services/auth.service';
import { getDb } from '@/lib/db/client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const commentId = (await params).id;
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

    // Check if comment exists and belongs to user
    const comment = commentDAO.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Comment not found' } },
        { status: 404 }
      );
    }

    // Allow deletion if user is author
    if (comment.author_id !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You can only delete your own comments' } },
        { status: 403 }
      );
    }

    const deleted = commentDAO.delete(commentId);

    if (!deleted) {
      return NextResponse.json(
        { error: { code: 'DELETE_FAILED', message: 'Failed to delete comment' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { success: true }
    });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
