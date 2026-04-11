import { NextRequest, NextResponse } from 'next/server';
import { badgeDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';

// DELETE /api/admin/badges/[id] - Delete badge
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const badgeId = (await params).id;
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

    // Delete badge
    const deleted = await badgeDAO.delete(badgeId);

    if (!deleted) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Badge not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { success: true, message: 'Badge deleted successfully' }
    });
  } catch (error: any) {
    console.error('Delete badge error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/badges/[id] - Update badge
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const badgeId = (await params).id;
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

    // Update badge
    const updatedBadge = await badgeDAO.update(badgeId, updateData);

    if (!updatedBadge) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Badge not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: updatedBadge
    });
  } catch (error: any) {
    console.error('Update badge error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
