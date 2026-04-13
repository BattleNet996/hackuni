import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO } from '@/lib/dao';
import { getDatabaseRuntimeConfig } from '@/lib/db/runtime';

export async function GET(request: NextRequest) {
  try {
    const runtime = getDatabaseRuntimeConfig();
    console.log('🔍 API: Database type =', runtime.databaseType);
    console.log('🔍 API: Database reason =', runtime.reason);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await hackathonDAO.getPaginated(page, limit);

    console.log('🔍 API: Result count =', result.data?.length || 0);

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
