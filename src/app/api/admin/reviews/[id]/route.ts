import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { AdminLogsService } from '@/lib/services/admin-logs.service';
import { supabase } from '@/lib/db/supabase-client';

function getRequestMetadata(request: NextRequest) {
  return {
    ip_address:
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      undefined,
    user_agent: request.headers.get('user-agent') || undefined,
  };
}

// PATCH /api/admin/reviews/[id] - Approve or reject a submission
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const itemId = (await params).id;
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
        { status: 401 }
      );
    }

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const { action, type } = await request.json();

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid action' } },
        { status: 400 }
      );
    }

    const logsService = new AdminLogsService();
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const requestMetadata = getRequestMetadata(request);

    if (type === 'project') {
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('id, title, author_id')
        .eq('id', itemId)
        .limit(1);

      if (projectError) {
        throw projectError;
      }

      const project = projects?.[0];

      if (!project) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Project not found' } },
          { status: 404 }
        );
      }

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (updateError) {
        throw updateError;
      }

      await logsService.log(adminUser, action, {
        entity_type: 'project',
        entity_id: itemId,
        entity_name: project.title,
        details: { status: newStatus },
        ...requestMetadata,
      });

    } else if (type === 'story') {
      const { data: stories, error: storyError } = await supabase
        .from('stories')
        .select('id, title')
        .eq('id', itemId)
        .limit(1);

      if (storyError) {
        throw storyError;
      }

      const story = stories?.[0];

      if (!story) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Story not found' } },
          { status: 404 }
        );
      }

      const { error: updateError } = await supabase
        .from('stories')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (updateError) {
        throw updateError;
      }

      await logsService.log(adminUser, action, {
        entity_type: 'story',
        entity_id: itemId,
        entity_name: story.title,
        details: { status: newStatus },
        ...requestMetadata,
      });

    } else if (type === 'badge') {
      const { data: badgeRows, error: badgeInfoError } = await supabase
        .from('user_badges')
        .select(`
          id,
          user:users(display_name),
          badge:badges(badge_name)
        `)
        .eq('id', itemId)
        .limit(1);

      if (badgeInfoError) {
        throw badgeInfoError;
      }

      const badgeInfo = badgeRows?.[0];

      if (!badgeInfo) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Badge request not found' } },
          { status: 404 }
        );
      }

      const { error: updateError } = await supabase
        .from('user_badges')
        .update({
          status: newStatus,
          verified_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (updateError) {
        throw updateError;
      }

      await logsService.log(adminUser, action, {
        entity_type: 'badge',
        entity_id: itemId,
        entity_name: `${badgeInfo.user?.display_name || 'Unknown'} - ${badgeInfo.badge?.badge_name || 'Unknown'}`,
        details: { status: newStatus },
        ...requestMetadata,
      });
    } else {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid type' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: { success: true, status: newStatus },
      message: action === 'approve'
        ? 'Submission approved successfully'
        : 'Submission rejected successfully'
    });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
