import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';

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

    // Create hackathon
    const id = `h_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Helper function to convert date to ISO string
    const parseDate = (dateValue: any): string | null => {
      if (!dateValue) return null;
      if (typeof dateValue === 'string') {
        // Already a string, ensure it's valid ISO format
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? null : date.toISOString();
      }
      if (dateValue instanceof Date) {
        return isNaN(dateValue.getTime()) ? null : dateValue.toISOString();
      }
      return null;
    };

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
      tags_json: Array.isArray(data.tags_json) ? data.tags_json : [],
      level_score: String(data.level_score || '0'),
      level_code: String(data.level_code || 'B'),
      registration_status: data.registration_status || 'upcoming',
      poster_url: data.poster_url || '',
      organizer: data.organizer || '',
      organizer_url: data.organizer_url || null,
      registration_url: data.registration_url || null,
      requirements: data.requirements || null,
      prizes: data.prizes || null,
      fee: data.fee || null,
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
