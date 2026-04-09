import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO } from '@/lib/dao';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = hackathonDAO.getPaginated(page, limit);

    return NextResponse.json({
      data: result.data,
      total: result.total,
      page,
      limit,
      hasMore: page * limit < result.total
    });
  } catch (error: any) {
    console.error('Get hackathons error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
