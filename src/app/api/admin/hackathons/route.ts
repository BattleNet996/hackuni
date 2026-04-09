import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO } from '@/lib/dao';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { getDb } from '@/lib/db/client';

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

    const db = getDb();
    const adminAuthService = new AdminAuthService(db);
    const adminUser = adminAuthService.verifyToken(token);

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

    const db = getDb();
    const adminAuthService = new AdminAuthService(db);
    const adminUser = adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Create hackathon
    const id = `h_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO hackathons (
        id, title, short_desc, description, start_time, end_time,
        registration_deadline, city, country, latitude, longitude,
        location_detail, tags_json, level_score, level_code,
        registration_status, poster_url, organizer, organizer_url,
        registration_url, requirements, prizes, fee
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.title,
      data.short_desc || '',
      data.description || '',
      data.start_time || null,
      data.end_time || null,
      data.registration_deadline || null,
      data.city || '',
      data.country || '',
      data.latitude || null,
      data.longitude || null,
      data.location_detail || '',
      JSON.stringify(data.tags_json || []),
      data.level_score || '0',
      data.level_code || 'B',
      data.registration_status || 'upcoming',
      data.poster_url || '',
      data.organizer || '',
      data.organizer_url || null,
      data.registration_url || null,
      data.requirements || null,
      data.prizes || null,
      data.fee || null
    );

    const hackathon = hackathonDAO.findById(id);

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
