import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';
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

    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('id, username, email, is_active, last_login_at, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: admins || [] });
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

    const { data: existingAdmins, error: existingError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', data.username)
      .limit(1);

    if (existingError) {
      throw existingError;
    }

    if ((existingAdmins || []).length > 0) {
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
    const { data: newAdmin, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        id,
        username: data.username,
        password_hash: passwordHash,
        email: data.email || null,
        is_active: 1,
        created_at: now,
        updated_at: now,
      })
      .select('id, username, email, is_active, created_at')
      .single();

    if (insertError) {
      throw insertError;
    }

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
