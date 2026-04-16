import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO } from '@/lib/dao';
import { getDatabaseRuntimeConfig } from '@/lib/db/runtime';
import { buildFeaturedHackathonList } from '@/lib/hackathon-curation';

export async function GET(request: NextRequest) {
  try {
    const runtime = getDatabaseRuntimeConfig();
    console.log('🔍 API: Database type =', runtime.databaseType);
    console.log('🔍 API: Database reason =', runtime.reason);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const allHackathons = await hackathonDAO.findAll();
    const featuredHackathons = buildFeaturedHackathonList(allHackathons || []);
    const offset = (page - 1) * limit;
    const paginatedHackathons = featuredHackathons.slice(offset, offset + limit);

    console.log('🔍 API: Result count =', paginatedHackathons.length);

    return NextResponse.json({
      data: paginatedHackathons,
      total: featuredHackathons.length,
      page,
      limit,
      hasMore: page * limit < featuredHackathons.length
    });
  } catch (error: any) {
    console.error('Get hackathons error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
