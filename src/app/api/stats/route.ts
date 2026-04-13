import { NextRequest, NextResponse } from 'next/server';
import { userDAO, hackathonDAO, projectDAO } from '@/lib/dao';

export async function GET(request: NextRequest) {
  try {
    // Get real statistics from database
    const buildersCount = await userDAO.count();
    const projectsCount = await projectDAO.count();
    const hackathonsCount = await hackathonDAO.count();

    // Get unique cities from hackathons
    const allHackathons = await hackathonDAO.findAll();
    const uniqueCities = new Set(
      allHackathons
        .map(h => `${h.city}, ${h.country}`)
        .filter(Boolean)
    );

    // Calculate total badges (sum of all user badge counts)
    const allUsers = await userDAO.findAll();
    const totalBadges = allUsers.reduce((sum, user) => sum + (user.badge_count || 0), 0);

    return NextResponse.json({
      data: {
        buildersConnected: buildersCount,
        projectsShipped: projectsCount,
        citiesCovered: uniqueCities.size,
        badgesEarned: totalBadges,
        hackathonsCount
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
