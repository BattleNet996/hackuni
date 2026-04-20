import { NextRequest, NextResponse } from 'next/server';
import { userDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';
import { withProjectLikeCounts } from '@/lib/server/like-counts';
import { decodeHackathonRecordNotes } from '@/lib/server/hackathon-records';

function isMissingRelation(error: any) {
  return error?.code === '42P01' || error?.code === 'PGRST205' || /does not exist|user_hackathon_records/i.test(error?.message || '');
}

// GET /api/admin/users/[id] - Get user detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
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

    const user = await userDAO.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const [
      { data: projects, error: projectsError },
      { data: badges, error: badgesError },
      { data: likes, error: likesError },
      { data: comments, error: commentsError },
      { data: sessions, error: sessionsError },
      { data: hackathonRecords, error: hackathonRecordsError },
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, status, created_at')
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase
        .from('user_badges')
        .select('id, badge_id, status, created_at, verified_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase
        .from('likes')
        .select('id, target_type, target_id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase
        .from('comments')
        .select('id, project_id, story_id, content, created_at')
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase
        .from('sessions')
        .select('id, expires_at, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('user_hackathon_records')
        .select('id, hackathon_id, hackathon_title, role, project_name, award_text, notes, status, verified_at, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(12),
    ]);

    if (projectsError) throw projectsError;
    if (badgesError) throw badgesError;
    if (likesError) throw likesError;
    if (commentsError) throw commentsError;
    if (sessionsError) throw sessionsError;
    if (hackathonRecordsError && !isMissingRelation(hackathonRecordsError)) throw hackathonRecordsError;

    const projectsWithLikes = await withProjectLikeCounts(projects || []);

    const { password_hash, ...sanitized } = user as any;

    return NextResponse.json({
      data: {
        ...sanitized,
        projects: projectsWithLikes,
        badges: badges || [],
        likes: likes || [],
        comments: comments || [],
        sessions: sessions || [],
        hackathonRecords: hackathonRecordsError && isMissingRelation(hackathonRecordsError)
          ? []
          : (hackathonRecords || []).map((record: any) => {
              const decoded = decodeHackathonRecordNotes(record.notes);
              return {
                ...record,
                notes: decoded.notes,
                contribution_areas: decoded.contribution_areas,
                contribution_other: decoded.contribution_other,
                proof_image_url: decoded.proof_image_url,
                linked_project_id: decoded.linked_project_id,
                linked_project_title: decoded.linked_project_title,
                team_members: decoded.team_members,
              };
            }),
      }
    });
  } catch (error: any) {
    console.error('Get user detail error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
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

    // Update user
    const updatedUser = await userDAO.update(userId, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const { password_hash, ...sanitized } = updatedUser as any;

    return NextResponse.json({
      data: sanitized
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
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

    // Prevent deleting yourself (though admin is different from regular user)
    // This check doesn't make sense here since adminUser is from admin_users table
    // but keeping it for safety if needed in future

    const deleted = await userDAO.delete(userId);

    if (!deleted) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { success: true, message: 'User deleted successfully' }
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
