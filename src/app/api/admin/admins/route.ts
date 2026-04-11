import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { getDb } from '@/lib/db/client';
import { createHash, randomBytes } from 'crypto';

// GET /api/admin/admins - Get all admin users
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

    const db = getDb();
    const stmt = db.prepare(`
      SELECT id, username, email, is_active, last_login_at, created_at, updated_at
      FROM admin_users
      ORDER BY created_at DESC
    `);

    const admins = stmt.all();

    return NextResponse.json({ data: admins });
  } catch (error: any) {
    console.error('Get admins error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// POST /api/admin/admins - Create new admin user
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

    // Validate required fields
    if (!data.username || !data.password) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Username and password are required' } },
        { status: 400 }
      );
    }

    const db = getDb();
    // Check if username already exists
    const existingStmt = db.prepare('SELECT id FROM admin_users WHERE username = ?');
    const existing = existingStmt.get(data.username);

    if (existing) {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_USERNAME', message: 'Username already exists' } },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = createHash('sha256').update(data.password).digest('hex');

    // Create admin user
    const id = `admin_${Date.now()}_${randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO admin_users (id, username, password_hash, email, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, ?, ?)
    `);

    stmt.run(id, data.username, passwordHash, data.email || null, now, now);

    const newAdmin = db.prepare('SELECT id, username, email, is_active, created_at FROM admin_users WHERE id = ?').get(id);

    return NextResponse.json({
      data: newAdmin,
      message: 'Admin user created successfully'
    });
  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
