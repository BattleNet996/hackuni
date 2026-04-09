import { NextRequest, NextResponse } from 'next/server';
import { commentDAO, likeDAO } from '@/lib/dao';
import { AuthService } from '@/lib/services/auth.service';
import { getDb } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const storyId = searchParams.get('story_id');

    if (!projectId && !storyId) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'project_id or story_id is required' } },
        { status: 400 }
      );
    }

    let comments;
    if (projectId) {
      comments = commentDAO.getProjectComments(projectId);
    } else {
      comments = commentDAO.getStoryComments(storyId!);
    }

    // Get replies for each comment
    const commentsWithReplies = comments.map(comment => ({
      ...comment,
      replies: commentDAO.getReplies(comment.id)
    }));

    return NextResponse.json({
      data: commentsWithReplies
    });
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

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

    const { project_id, story_id, content, parent_comment_id } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Content is required' } },
        { status: 400 }
      );
    }

    if (!project_id && !story_id) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'project_id or story_id is required' } },
        { status: 400 }
      );
    }

    const comment = commentDAO.create(
      { project_id, story_id, content, parent_comment_id },
      user.id,
      user.display_name || user.email
    );

    return NextResponse.json({
      data: comment
    });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
