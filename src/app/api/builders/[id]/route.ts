import { NextRequest, NextResponse } from 'next/server';
import { badgeDAO, projectDAO, userDAO } from '@/lib/dao';
import { supabase } from '@/lib/db/supabase-client';
import { authService } from '@/lib/services';

const earnedStatuses = new Set(['verified', 'approved', 'earned']);

function isMissingHackathonRecordRelation(error: any) {
  return error?.code === '42P01' || error?.code === 'PGRST205' || /user_hackathon_records/i.test(error?.message || '');
}

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.headers.get('x-auth-token');
    const viewer = token ? await authService.verifyToken(token) : null;
    const isOwnProfile = viewer?.id === id;
    const user = await userDAO.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Builder not found' } },
        { status: 404 }
      );
    }

    const allProjects = typeof (projectDAO as any).findByAuthorId === 'function'
      ? await (projectDAO as any).findByAuthorId(id)
      : [];
    const projects = allProjects.filter((project: any) => {
      if (project.hidden) return false;
      if (project.status === 'published') return true;
      return isOwnProfile && ['pending', 'rejected'].includes(project.status);
    });

    const userBadges = typeof (badgeDAO as any).getUserBadges === 'function'
      ? await (badgeDAO as any).getUserBadges(id)
      : [];

    const badges = userBadges
      .filter((item: any) => item.badge)
      .map((item: any) => ({
        ...item.badge,
        user_badge_id: item.id,
        user_badge_status: item.status,
        earned_at: item.earned_at,
        verified_at: item.verified_at,
        created_at: item.created_at,
        is_earned: earnedStatuses.has(item.status),
      }));

    const { data: recordRows, error: recordError } = await supabase
      .from('user_hackathon_records')
      .select(`
        id,
        user_id,
        hackathon_id,
        hackathon_title,
        role,
        project_name,
        project_url,
        award_text,
        proof_url,
        notes,
        status,
        verified_at,
        created_at,
        hackathon:hackathons(city, country, start_time)
      `)
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (recordError && !isMissingHackathonRecordRelation(recordError)) {
      throw recordError;
    }

    const hackathonRecords = recordError && isMissingHackathonRecordRelation(recordError) ? [] : (recordRows || []);
    const publicHackathonRecords = hackathonRecords.filter((record: any) => ['approved', 'verified'].includes(record.status));

    const footprintCities = publicHackathonRecords
      .map((record: any) => ({
        city: record.hackathon?.city,
        country: record.hackathon?.country,
        date: record.hackathon?.start_time || record.verified_at || record.created_at,
      }))
      .filter((item: any) => item.city && item.country && item.date);

    const heatmapActivities = [
      ...(user.created_at ? [{
        date: user.created_at,
        type: 'joined',
      }] : []),
      ...projects.map((project: any) => ({
        date: project.created_at,
        type: 'project',
      })),
      ...badges
        .filter((badge: any) => badge.is_earned)
        .map((badge: any) => ({
        date: badge.verified_at || badge.earned_at || badge.created_at,
        type: 'badge',
      })),
      ...publicHackathonRecords.map((record: any) => ({
        date: record.verified_at || record.created_at,
        type: 'hackathon',
      })),
    ];

    return NextResponse.json({
      data: {
        user: sanitizeUser(user),
        projects,
        hackathons: publicHackathonRecords,
        pendingHackathonRecords: hackathonRecords.filter((record: any) => record.status === 'pending'),
        badges,
        footprintCities,
        heatmapActivities,
      },
    });
  } catch (error: any) {
    console.error('Get builder detail error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
