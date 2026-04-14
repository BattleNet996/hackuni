import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';
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

    const adminUser = await adminAuthService.verifyToken(token);

    if (!adminUser) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired admin token' } },
        { status: 401 }
      );
    }

    const updateData = await request.json();

    const { data: existingAdmins, error: existingError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', adminId)
      .limit(1);

    if (existingError) {
      throw existingError;
    }

    if ((existingAdmins || []).length === 0) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Admin user not found' } },
        { status: 404 }
      );
    }

    const updatePayload: Record<string, any> = {};

    if (updateData.email !== undefined) {
      updatePayload.email = updateData.email;
    }

    if (updateData.is_active !== undefined) {
      updatePayload.is_active = updateData.is_active ? 1 : 0;
    }

    if (updateData.password) {
      updatePayload.password_hash = createHash('sha256').update(updateData.password).digest('hex');
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'No fields to update' } },
        { status: 400 }
      );
    }

    updatePayload.updated_at = new Date().toISOString();

    const { data: updatedAdmin, error: updateError } = await supabase
      .from('admin_users')
      .update(updatePayload)
      .eq('id', adminId)
      .select('id, username, email, is_active, last_login_at, created_at, updated_at')
      .single();

    if (updateError) {
      throw updateError;
    }

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

    const adminUser = await adminAuthService.verifyToken(token);

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

    const { data: existingAdmins, error: existingError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', adminId)
      .limit(1);

    if (existingError) {
      throw existingError;
    }

    if ((existingAdmins || []).length === 0) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Admin user not found' } },
        { status: 404 }
      );
    }

    // Delete admin user (cascades to sessions)
    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId);

    if (deleteError) {
      throw deleteError;
    }

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
