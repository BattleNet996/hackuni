import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO } from '@/lib/dao';
import { isUsingSupabase } from '@/lib/db/supabase-client';

export async function GET(request: NextRequest) {
  try {
    // Log database type for debugging
    console.log('🔍 API: Database type =', isUsingSupabase() ? 'Supabase' : 'SQLite');
    console.log('🔍 API: NEXT_PUBLIC_SUPABASE_URL =', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔍 API: SUPABASE_SERVICE_ROLE_KEY =', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

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
