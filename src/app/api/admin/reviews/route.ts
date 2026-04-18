import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';
import { withProjectLikeCounts, withStoryLikeCounts } from '@/lib/server/like-counts';

function isMissingRelation(error: any) {
  return error?.code === '42P01' || /does not exist|user_hackathon_records/i.test(error?.message || '');
}

const legacyStoryIdBySlug: Record<string, string> = {
  'post-hackathon-recap': 's1',
  'interview-goat': 's2',
  'ai-in-2026-two-ais': 's3',
  'ai-voice-agents-2025': 's4',
  'ai-50-2025': 's5',
  'big-ideas-tech-2025': 's6',
  'consumer-ai-2025': 's7',
  'enterprise-ai-2025': 's8',
};

// GET /api/admin/reviews - Get pending items for review
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

    const [
      { data: projectRows, error: projectError },
      { data: storyRows, error: storyError },
      { data: badgeRows, error: badgeError },
      { data: recordRows, error: recordError },
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, short_desc, author_id, related_hackathon_id, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('stories')
        .select('id, slug, title, summary, author_name, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('user_badges')
        .select(`
          id,
          status,
          earned_at,
          created_at,
          user:users(display_name),
          badge:badges(badge_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
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
          created_at,
          user:users(display_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(30),
    ]);

    if (projectError) throw projectError;
    if (storyError) throw storyError;
    if (badgeError) throw badgeError;
    if (recordError && !isMissingRelation(recordError)) throw recordError;

    const [projectRowsWithLikes, storyRowsWithLikes] = await Promise.all([
      withProjectLikeCounts(projectRows || []),
      withStoryLikeCounts(storyRows || [], legacyStoryIdBySlug),
    ]);

    const pendingProjects = projectRowsWithLikes.map((project: any) => ({
      ...project,
      type: 'project',
    }));

    const pendingStories = storyRowsWithLikes.map((story: any) => ({
      ...story,
      type: 'story',
    }));

    const pendingBadges = (badgeRows || []).map((badge: any) => ({
      id: badge.id,
      user_name: badge.user?.display_name || '',
      badge_name: badge.badge?.badge_name || '',
      status: badge.status,
      earned_at: badge.earned_at,
      created_at: badge.created_at,
      type: 'badge',
    }));

    const pendingHackathonRecords = (recordError && isMissingRelation(recordError) ? [] : (recordRows || [])).map((record: any) => ({
      id: record.id,
      user_id: record.user_id,
      user_name: record.user?.display_name || record.user?.email || '',
      hackathon_id: record.hackathon_id,
      hackathon_title: record.hackathon_title,
      role: record.role,
      project_name: record.project_name,
      project_url: record.project_url,
      award_text: record.award_text,
      proof_url: record.proof_url,
      notes: record.notes,
      status: record.status,
      created_at: record.created_at,
      type: 'hackathon_record',
    }));

    return NextResponse.json({
      data: {
        projects: pendingProjects,
        stories: pendingStories,
        badges: pendingBadges,
        hackathonRecords: pendingHackathonRecords,
        total: pendingProjects.length + pendingStories.length + pendingBadges.length + pendingHackathonRecords.length
      }
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
