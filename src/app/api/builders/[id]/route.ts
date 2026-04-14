import { NextRequest, NextResponse } from 'next/server';
import { badgeDAO, projectDAO, userDAO } from '@/lib/dao';

const earnedStatuses = new Set(['verified', 'approved', 'earned']);

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await userDAO.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Builder not found' } },
        { status: 404 }
      );
    }

    const projects = typeof (projectDAO as any).findByAuthorId === 'function'
      ? await (projectDAO as any).findByAuthorId(id)
      : [];

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

    const footprintCities: Array<{ city: string; country: string; date: string }> = [];
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
    ];

    return NextResponse.json({
      data: {
        user: sanitizeUser(user),
        projects,
        hackathons: [],
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
