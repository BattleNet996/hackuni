import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';

function getAuthToken(request: NextRequest) {
  const cookieToken = request.cookies.get('auth_token')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const xAuthToken = request.headers.get('x-auth-token');
  return cookieToken || headerToken || xAuthToken;
}

function normalizeString(value: unknown, maxLength: number) {
  return String(value || '').trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    const data = await request.json();
    const hackathonTitle = normalizeString(data.hackathon_title, 180);

    if (!hackathonTitle) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Hackathon is required' } },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const record = {
      id: `uhr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      user_id: user.id,
      hackathon_id: data.hackathon_id || null,
      hackathon_title: hackathonTitle,
      role: normalizeString(data.role, 120) || null,
      project_name: normalizeString(data.project_name, 160) || null,
      project_url: normalizeString(data.project_url, 240) || null,
      award_text: normalizeString(data.award_text, 160) || null,
      proof_url: normalizeString(data.proof_url, 240) || null,
      notes: normalizeString(data.notes, 800) || null,
      status: 'pending',
      created_at: now,
      updated_at: now,
    };

    const { data: inserted, error } = await supabase
      .from('user_hackathon_records')
      .insert(record)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: inserted });
  } catch (error: any) {
    console.error('Create hackathon record error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      },
      { status: 500 }
    );
  }
}
