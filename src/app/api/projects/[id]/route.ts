import { NextRequest, NextResponse } from 'next/server';
import { projectDAO } from '@/lib/dao';
import { AuthService } from '@/lib/services/auth.service';
import { getDb } from '@/lib/db/client';

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = projectDAO.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error: any) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const db = getDb();
    const authService = new AuthService(db);
    const user = authService.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if project exists
    const existingProject = projectDAO.findById(id);
    if (!existingProject) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (existingProject.author_id !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You can only edit your own projects' } },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Update project
    const updatedProject = projectDAO.update(id, {
      title: data.title,
      short_desc: data.short_desc,
      long_desc: data.long_desc,
      team_member_text: data.team_member_text,
      tags_json: data.tags_json,
      demo_url: data.demo_url,
      github_url: data.github_url,
      website_url: data.website_url,
      related_hackathon_id: data.hackathon_id,
      images: data.images,
      is_awarded: data.is_awarded,
      award_text: data.award_text
    });

    return NextResponse.json({ data: updatedProject });
  } catch (error: any) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const db = getDb();
    const authService = new AuthService(db);
    const user = authService.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if project exists
    const existingProject = projectDAO.findById(id);
    if (!existingProject) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (existingProject.author_id !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You can only delete your own projects' } },
        { status: 403 }
      );
    }

    // Delete project
    const deleted = projectDAO.delete(id);

    if (deleted) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete project' } },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
