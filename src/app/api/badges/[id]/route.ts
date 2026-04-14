import { NextRequest, NextResponse } from 'next/server';
import { badgeDAO, userDAO } from '@/lib/dao';

const earnedStatuses = new Set(['verified', 'approved', 'earned']);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    const badge = await badgeDAO.findById(id) || await (badgeDAO as any).findByCode?.(id);

    if (!badge) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Badge not found' } },
        { status: 404 }
      );
    }

    const relatedBadges = (await badgeDAO.findAll({ badge_type: (badge as any).badge_type }))
      .filter((item: any) => item.id !== (badge as any).id)
      .slice(0, 3);

    let userBadge: any = null;
    let progress = null;

    if (userId && typeof (badgeDAO as any).getUserBadges === 'function') {
      const userBadges = await (badgeDAO as any).getUserBadges(userId);
      userBadge = userBadges.find((item: any) => item.badge?.id === id) || null;

      if ((badge as any).badge_type === 'milestone') {
        const user = await userDAO.findById(userId);
        const current =
          (badge as any).source_type === 'hackathon'
            ? user?.total_hackathon_count || 0
            : user?.total_work_count || 0;
        const total = 5;
        progress = {
          current,
          total,
          percentage: Math.min(100, Math.round((current / total) * 100)),
        };
      }
    }

    return NextResponse.json({
      data: {
        ...badge,
        user_badge_status: userBadge?.status ?? null,
        is_earned: userBadge ? earnedStatuses.has(userBadge.status) : false,
        progress,
        relatedBadges,
      },
    });
  } catch (error: any) {
    console.error('Get badge detail error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
