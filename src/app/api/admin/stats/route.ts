import { NextRequest, NextResponse } from 'next/server';
import { userDAO, hackathonDAO, projectDAO, storyDAO, badgeDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';

function isMissingRelation(error: any) {
  return error?.code === '42P01' || /does not exist|user_hackathon_records/i.test(error?.message || '');
}

export async function GET(request: NextRequest) {
  try {
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

    // Get real-time statistics from database
    const totalUsers = await userDAO.count();
    const totalHackathons = await hackathonDAO.count();
    const totalProjects = await projectDAO.count();
    const totalStories = await storyDAO.count();
    const totalBadges = await badgeDAO.count();
    const [
      { count: pendingProjectsCount, error: pendingProjectsError },
      { count: pendingStoriesCount, error: pendingStoriesError },
      { count: pendingBadgesCount, error: pendingBadgesError },
      { count: pendingRecordsCount, error: pendingRecordsError },
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase
        .from('user_hackathon_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ]);

    if (pendingProjectsError) throw pendingProjectsError;
    if (pendingStoriesError) throw pendingStoriesError;
    if (pendingBadgesError) throw pendingBadgesError;
    if (pendingRecordsError && !isMissingRelation(pendingRecordsError)) throw pendingRecordsError;

    const pendingHackathonRecords = pendingRecordsError && isMissingRelation(pendingRecordsError) ? 0 : (pendingRecordsCount || 0);
    const pendingReviews = (pendingProjectsCount || 0) + (pendingStoriesCount || 0) + (pendingBadgesCount || 0) + pendingHackathonRecords;

    return NextResponse.json({
      data: {
        totalUsers,
        totalHackathons,
        totalProjects,
        totalStories,
        totalBadges,
        pendingReviews,
        pendingBadges: pendingBadgesCount || 0,
        pendingHackathonRecords,
      }
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
