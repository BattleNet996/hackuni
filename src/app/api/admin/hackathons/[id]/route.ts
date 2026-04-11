import { NextRequest, NextResponse } from 'next/server';
import { hackathonDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';

// DELETE /api/admin/hackathons/[id] - Delete hackathon
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const hackId = (await params).id;
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

    // Delete hackathon
    const deleted = await hackathonDAO.delete(hackId);

    if (!deleted) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Hackathon not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { success: true, message: 'Hackathon deleted successfully' }
    });
  } catch (error: any) {
    console.error('Delete hackathon error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/hackathons/[id] - Update hackathon
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const hackId = (await params).id;
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

    // Update hackathon
    const updatedHackathon = await hackathonDAO.update(hackId, updateData);

    if (!updatedHackathon) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Hackathon not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: updatedHackathon
    });
  } catch (error: any) {
    console.error('Update hackathon error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
