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

function isMissingRelation(error: any) {
  return error?.code === '42P01' || /does not exist|user_hackathon_records/i.test(error?.message || '');
}

async function refreshUserCounters(userId: string) {
  const [
    { count: verifiedRecordsCount, error: recordsError },
    { count: publishedProjectsCount, error: projectsError },
    { count: verifiedBadgesCount, error: badgesError },
    { count: awardedProjectsCount, error: awardsError },
  ] = await Promise.all([
    supabase
      .from('user_hackathon_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['verified', 'approved']),
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'published'),
    supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'verified'),
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'published')
      .eq('is_awarded', 1),
  ]);

  if (recordsError && !isMissingRelation(recordsError)) throw recordsError;
  if (projectsError) throw projectsError;
  if (badgesError) throw badgesError;
  if (awardsError) throw awardsError;

  const verifiedRecords = recordsError && isMissingRelation(recordsError) ? 0 : (verifiedRecordsCount || 0);
  const verifiedBadges = verifiedBadgesCount || 0;
  const publishedProjects = publishedProjectsCount || 0;

  const { error: userUpdateError } = await supabase
    .from('users')
    .update({
      total_hackathon_count: verifiedRecords,
      total_work_count: publishedProjects + verifiedRecords,
      total_award_count: awardsError ? 0 : (awardedProjectsCount || 0),
      badge_count: verifiedBadges,
      certification_count: verifiedRecords + verifiedBadges,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (userUpdateError) throw userUpdateError;
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

      const newStatus = action === 'approve' ? 'published' : 'rejected';
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

      if (project.author_id) {
        await refreshUserCounters(project.author_id);
      }

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

      const newStatus = action === 'approve' ? 'published' : 'rejected';
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
          user_id,
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

      const newStatus = action === 'approve' ? 'verified' : 'rejected';
      const { error: updateError } = await supabase
        .from('user_badges')
        .update({
          status: newStatus,
          verified_at: action === 'approve' ? new Date().toISOString() : null,
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

      if ((badgeInfo as any).user_id) {
        await refreshUserCounters((badgeInfo as any).user_id);
      }
    } else if (type === 'hackathon_record') {
      const { data: recordRows, error: recordError } = await supabase
        .from('user_hackathon_records')
        .select('id, user_id, hackathon_title, role, project_name')
        .eq('id', itemId)
        .limit(1);

      if (recordError) {
        throw recordError;
      }

      const record = recordRows?.[0];

      if (!record) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Hackathon record not found' } },
          { status: 404 }
        );
      }

      const newStatus = action === 'approve' ? 'verified' : 'rejected';
      const { error: updateError } = await supabase
        .from('user_hackathon_records')
        .update({
          status: newStatus,
          verified_at: action === 'approve' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (updateError) {
        throw updateError;
      }

      await refreshUserCounters(record.user_id);

      await logsService.log(adminUser, action, {
        entity_type: 'hackathon_record',
        entity_id: itemId,
        entity_name: `${record.hackathon_title}${record.project_name ? ` - ${record.project_name}` : ''}`,
        details: { status: newStatus, role: record.role },
        ...requestMetadata,
      });
    } else {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid type' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: { success: true },
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
