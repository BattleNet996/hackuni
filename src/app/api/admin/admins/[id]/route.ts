import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/lib/services/admin-auth.service';
import { getDb } from '@/lib/db/client';
import { createHash } from 'crypto';

// PATCH /api/admin/admins/[id] - Update admin user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = (await params).id;
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

    const updateData = await request.json();

    // Check if admin exists
    const existingStmt = db.prepare('SELECT id FROM admin_users WHERE id = ?');
    const existing = existingStmt.get(adminId);

    if (!existing) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Admin user not found' } },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (updateData.email !== undefined) {
      updates.push('email = ?');
      values.push(updateData.email);
    }

    if (updateData.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(updateData.is_active ? 1 : 0);
    }

    if (updateData.password) {
      const passwordHash = createHash('sha256').update(updateData.password).digest('hex');
      updates.push('password_hash = ?');
      values.push(passwordHash);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'No fields to update' } },
        { status: 400 }
      );
    }

    updates.push('updated_at = datetime(\'now\')');
    values.push(adminId);

    const stmt = db.prepare(`
      UPDATE admin_users
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);

    const updatedAdmin = db.prepare(`
      SELECT id, username, email, is_active, last_login_at, created_at, updated_at
      FROM admin_users
      WHERE id = ?
    `).get(adminId);

    return NextResponse.json({
      data: updatedAdmin,
      message: 'Admin user updated successfully'
    });
  } catch (error: any) {
    console.error('Update admin error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/admins/[id] - Delete admin user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = (await params).id;
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

    // Prevent self-deletion
    if (adminUser.id === adminId) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Cannot delete your own account' } },
        { status: 403 }
      );
    }

    // Check if admin exists
    const existingStmt = db.prepare('SELECT id FROM admin_users WHERE id = ?');
    const existing = existingStmt.get(adminId);

    if (!existing) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Admin user not found' } },
        { status: 404 }
      );
    }

    // Delete admin user (cascades to sessions)
    const stmt = db.prepare('DELETE FROM admin_users WHERE id = ?');
    stmt.run(adminId);

    return NextResponse.json({
      data: { success: true },
      message: 'Admin user deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
