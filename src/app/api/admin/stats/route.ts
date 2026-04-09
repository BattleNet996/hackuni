import { NextRequest, NextResponse } from 'next/server';
import { userDAO, hackathonDAO, projectDAO, storyDAO, badgeDAO } from '@/lib/dao';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { getDb } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
        { status: 401 }
      );
    }

    const db = getDb();
    const adminAuthService = new AdminAuthService(db);
    const adminUser = adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    // Get real-time statistics from database
    const totalUsers = userDAO.count();
    const totalHackathons = hackathonDAO.count();
    const totalProjects = projectDAO.count();
    const totalStories = storyDAO.count();
    const totalBadges = badgeDAO.count();

    return NextResponse.json({
      data: {
        totalUsers,
        totalHackathons,
        totalProjects,
        totalStories,
        totalBadges,
        pendingReviews: 0, // Can be calculated from projects/stories with status
        pendingBadges: 0, // Can be calculated from user_badges with status 'pending'
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
