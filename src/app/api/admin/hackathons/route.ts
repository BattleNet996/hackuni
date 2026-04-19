import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';
import { canonicalizeHackathonStatus } from '@/lib/hackathon-status';

function parseDate(dateValue: unknown): string | null {
  if (!dateValue) return null;
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue.toISOString();
  }
  return null;
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeRequiredString(value: unknown): string | null {
  return normalizeOptionalString(value);
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

// GET /api/admin/hackathons - Get all hackathons
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
        { status: 401 }
      );
    }

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const { data } = await hackathonDAO.getPaginated(1, 1000);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Get hackathons error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// POST /api/admin/hackathons - Create new hackathon
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
        { status: 401 }
      );
    }

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const data = await request.json();

    const levelScore = normalizeRequiredString(data.level_score);
    const levelCode = normalizeRequiredString(data.level_code);

    if (!levelScore || !levelCode) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'level_score and level_code are required' } },
        { status: 400 }
      );
    }

    // Create hackathon
    const id = `h_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const hackathon = await hackathonDAO.create({
      id,
      title: data.title || '',
      short_desc: data.short_desc || '',
      description: data.description || '',
      start_time: parseDate(data.start_time),
      end_time: parseDate(data.end_time),
      registration_deadline: parseDate(data.registration_deadline),
      city: data.city || '',
      country: data.country || '',
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      location_detail: data.location_detail || '',
      tags_json: normalizeTags(data.tags_json),
      level_score: levelScore,
      level_code: levelCode,
      registration_status: canonicalizeHackathonStatus(data.registration_status || 'open'),
      poster_url: data.poster_url || '',
      organizer: data.organizer || '',
      organizer_url: normalizeOptionalString(data.organizer_url),
      registration_url: normalizeOptionalString(data.registration_url),
      requirements: normalizeOptionalString(data.requirements),
      prizes: normalizeOptionalString(data.prizes),
      fee: normalizeOptionalString(data.fee),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({
      data: hackathon
    });
  } catch (error: any) {
    console.error('Create hackathon error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
