import { NextRequest, NextResponse } from 'next/server';
import { userDAO } from '@/lib/dao';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();
    const limit = Math.min(12, Math.max(1, parseInt(searchParams.get('limit') || '8', 10)));

    if (!query) {
      return NextResponse.json({ data: [] });
    }

    const users = typeof (userDAO as any).search === 'function'
      ? await (userDAO as any).search(query, limit)
      : [];

    return NextResponse.json({
      data: (users || []).map((user: any) => ({
        id: user.id,
        display_name: user.display_name || user.email?.split('@')?.[0] || 'Anonymous',
        school: user.school || '',
        company: user.company || '',
        position: user.position || '',
        avatar: user.avatar || '',
      })),
    });
  } catch (error: any) {
    console.error('Search builders error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
