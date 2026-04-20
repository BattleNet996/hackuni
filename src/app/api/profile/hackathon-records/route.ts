import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';
import {
  decodeHackathonRecordNotes,
  encodeHackathonRecordNotes,
  ensureHackathonRecordSchema,
  normalizeContributionAreas,
  shouldRepairHackathonRecordSchema,
} from '@/lib/server/hackathon-records';

function getAuthToken(request: NextRequest) {
  const cookieToken = request.cookies.get('auth_token')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const xAuthToken = request.headers.get('x-auth-token');
  return cookieToken || headerToken || xAuthToken;
}

function normalizeString(value: unknown, maxLength: number) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeRole(value: unknown) {
  const normalized = normalizeString(value, 40).toLowerCase();
  if (normalized === 'captain' || normalized === '队长') return 'captain';
  if (normalized === 'member' || normalized === '队员') return 'member';
  return '';
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
    const role = normalizeRole(data.role);
    const contributionAreas = normalizeContributionAreas(data.contribution_areas);
    const contributionOther = normalizeString(data.contribution_other, 120);

    if (!hackathonTitle) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Hackathon is required' } },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Role is required' } },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const record = {
      id: `uhr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      user_id: user.id,
      hackathon_id: data.hackathon_id || null,
      hackathon_title: hackathonTitle,
      role,
      project_name: normalizeString(data.project_name, 160) || null,
      project_url: normalizeString(data.project_url, 240) || null,
      award_text: normalizeString(data.award_text, 160) || null,
      proof_url: normalizeString(data.proof_url, 240) || null,
      notes: encodeHackathonRecordNotes(normalizeString(data.notes, 800), {
        contribution_areas: contributionAreas,
        contribution_other: contributionOther,
        proof_image_url: normalizeString(data.proof_image_url, 500),
      }) || null,
      status: 'pending',
      created_at: now,
      updated_at: now,
    };

    let inserted: any = null;
    let error: any = null;

    const result = await supabase
      .from('user_hackathon_records')
      .insert(record)
      .select()
      .single();

    inserted = result.data;
    error = result.error;

    if (error && shouldRepairHackathonRecordSchema(error)) {
      await ensureHackathonRecordSchema();
      const retryResult = await supabase
        .from('user_hackathon_records')
        .insert(record)
        .select()
        .single();
      inserted = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      throw error;
    }

    const decoded = decodeHackathonRecordNotes(inserted?.notes);

    return NextResponse.json({
      data: {
        ...inserted,
        notes: decoded.notes,
        contribution_areas: decoded.contribution_areas,
        contribution_other: decoded.contribution_other,
        proof_image_url: decoded.proof_image_url,
      },
    });
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
