import { NextRequest, NextResponse } from 'next/server';
import { commentDAO, likeDAO } from '@/lib/dao';
import { authService } from '@/lib/services';

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
      comments = await commentDAO.getProjectComments(projectId);
    } else {
      comments = await commentDAO.getStoryComments(storyId!);
    }

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(comments.map(async (comment: any) => ({
      ...comment,
      replies: await commentDAO.getReplies(comment.id)
    })));

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

    const user = await authService.verifyToken(token);

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

    // Convert to target_id/target_type format
    const target_id = project_id || story_id;
    const target_type = project_id ? 'project' : 'hackathon';

    const comment = await commentDAO.create(
      { target_id, target_type, content, parent_comment_id } as any,
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
