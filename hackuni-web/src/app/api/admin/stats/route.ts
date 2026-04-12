import { NextRequest, NextResponse } from 'next/server';
import { userDAO, hackathonDAO, projectDAO, storyDAO, badgeDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';

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

    return NextResponse.json({
      data: {
        totalUsers,
        totalHackathons,
        totalProjects,
        totalStories,
        totalBadges,
        pendingReviews: 0, // Can be calculated from projects/stories with status
        pendingBadges: 0, // Can be calculated from user_badges with status 'pending',
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
