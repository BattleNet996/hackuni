import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';

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
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, short_desc, author_id, like_count, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('stories')
        .select('id, title, summary, author_name, like_count, created_at')
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
    ]);

    if (projectError) throw projectError;
    if (storyError) throw storyError;
    if (badgeError) throw badgeError;

    const pendingProjects = (projectRows || []).map((project: any) => ({
      ...project,
      type: 'project',
    }));

    const pendingStories = (storyRows || []).map((story: any) => ({
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

    return NextResponse.json({
      data: {
        projects: pendingProjects,
        stories: pendingStories,
        badges: pendingBadges,
        total: pendingProjects.length + pendingStories.length + pendingBadges.length
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
