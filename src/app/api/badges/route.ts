import { NextRequest, NextResponse } from 'next/server';
import { badgeDAO } from '@/lib/dao';

const earnedStatuses = new Set(['verified', 'approved', 'earned']);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('user_id');

    const badges = type && typeof (badgeDAO as any).getByType === 'function'
      ? await (badgeDAO as any).getByType(type)
      : typeof (badgeDAO as any).getAll === 'function'
        ? await (badgeDAO as any).getAll()
        : await badgeDAO.findAll();

    let userBadgeMap = new Map<string, any>();
    if (userId && typeof (badgeDAO as any).getUserBadges === 'function') {
      userBadgeMap = new Map(
        (await (badgeDAO as any).getUserBadges(userId))
          .filter((item: any) => item.badge)
          .map((item: any) => [
            item.badge.id,
            item,
          ])
      );
    }

    const data = badges.map((badge: any) => {
      const userBadge = userBadgeMap.get(badge.id);
      return {
        ...badge,
        user_badge_status: userBadge?.status ?? null,
        is_earned: userBadge ? earnedStatuses.has(userBadge.status) : false,
      };
    });

    const earnedCount = data.filter((badge: any) => badge.is_earned).length;

    return NextResponse.json({
      data,
      stats: userId
        ? {
            earnedCount,
            totalCount: data.length,
            completionRate: data.length > 0 ? Math.round((earnedCount / data.length) * 100) : 0,
          }
        : null,
    });
  } catch (error: any) {
    console.error('Get badges error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
