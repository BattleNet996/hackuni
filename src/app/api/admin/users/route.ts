import { NextRequest, NextResponse } from 'next/server';
import { userDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';

function isSeedUser(user: any) {
  return user?.email?.endsWith('@example.com');
}

async function enrichUsers(users: any[]) {
  if (users.length === 0) {
    return [];
  }

  const userIds = users.map((user) => user.id);
  const [{ data: projectRows, error: projectError }, { data: badgeRows, error: badgeError }] = await Promise.all([
    supabase
      .from('projects')
      .select('author_id, status')
      .in('author_id', userIds),
    supabase
      .from('user_badges')
      .select('user_id, status')
      .in('user_id', userIds),
  ]);

  if (projectError) throw projectError;
  if (badgeError) throw badgeError;

  return users.map((user: any) => {
    const userProjects = (projectRows || []).filter((row: any) => row.author_id === user.id);
    const userBadges = (badgeRows || []).filter((row: any) => row.user_id === user.id);

    return {
      ...user,
      is_seed: isSeedUser(user),
      total_projects: userProjects.filter((project: any) => project.status === 'published').length,
      pending_projects: userProjects.filter((project: any) => project.status === 'pending').length,
      verified_badges: userBadges.filter((badge: any) => badge.status === 'verified').length,
    };
  });
}

// GET /api/admin/users - Get all users
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

    // Get all users (without password_hash)
    const users = await userDAO.findAll();
    const enrichedUsers = await enrichUsers(users);
    const sanitizedUsers = enrichedUsers.map((u: any) => {
      const { password_hash, ...rest } = u;
      return rest;
    }).sort((left: any, right: any) => {
      const seedDelta = Number(left.is_seed) - Number(right.is_seed);
      if (seedDelta !== 0) return seedDelta;
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });

    return NextResponse.json({
      data: sanitizedUsers
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
