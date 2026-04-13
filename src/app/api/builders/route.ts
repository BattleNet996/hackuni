import { NextRequest, NextResponse } from 'next/server';
import { userDAO } from '@/lib/dao';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'awards';

    let builders;
    if (sort === 'hackathons') {
      builders = await userDAO.getTopByHackathons(limit);
    } else if (sort === 'work') {
      builders = await userDAO.getTopByWorkCount(limit);
    } else {
      // Default: sort by awards
      builders = await userDAO.getTopByAwards(limit);
    }

    return NextResponse.json({
      data: builders,
      total: builders.length,
      limit,
      sort
    });
  } catch (error: any) {
    console.error('Get builders error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
