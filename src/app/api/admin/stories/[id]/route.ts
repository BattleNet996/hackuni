import { NextRequest, NextResponse } from 'next/server';
import { storyDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';

// DELETE /api/admin/stories/[id] - Delete story
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const storyId = (await params).id;
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

    // Delete story
    const deleted = await storyDAO.delete(storyId);

    if (!deleted) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Story not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { success: true, message: 'Story deleted successfully' }
    });
  } catch (error: any) {
    console.error('Delete story error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/stories/[id] - Update story
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const storyId = (await params).id;
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

    // Handle content field - don't map it to summary, keep them separate
    // The database now has both summary and content fields
    // Only map content to summary if summary is not provided
    if (updateData.content !== undefined && !updateData.summary) {
      updateData.summary = updateData.content;
    } else if (updateData.description !== undefined && !updateData.summary) {
      updateData.summary = updateData.description;
    }

    // Update story
    const updatedStory = await storyDAO.update(storyId, updateData);

    if (!updatedStory) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Story not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: updatedStory
    });
  } catch (error: any) {
    console.error('Update story error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
