import { NextRequest, NextResponse } from 'next/server';
import { projectDAO, userDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';
import { supabase } from '@/lib/db/supabase-client';

async function enrichProjects(projects: any[]) {
  if (projects.length === 0) {
    return [];
  }

  const projectIds = projects.map((project) => project.id);
  const authorIds = Array.from(new Set(projects.map((project) => project.author_id).filter(Boolean)));

  const [{ data: likes, error: likesError }, authors] = await Promise.all([
    supabase
      .from('likes')
      .select('target_id')
      .eq('target_type', 'project')
      .in('target_id', projectIds),
    authorIds.length > 0 ? userDAO.findByIds(authorIds) : Promise.resolve([]),
  ]);

  if (likesError) {
    throw likesError;
  }

  const likeCounts = (likes || []).reduce((acc: Record<string, number>, row: any) => {
    acc[row.target_id] = (acc[row.target_id] || 0) + 1;
    return acc;
  }, {});

  const authorMap = new Map((authors || []).map((author: any) => [author.id, author as any]));

  return projects.map((project) => ({
    ...project,
    like_count: likeCounts[project.id] || 0,
    author_name: project.author_id ? ((authorMap.get(project.author_id) as any)?.display_name || (authorMap.get(project.author_id) as any)?.email || null) : null,
  }));
}

// GET /api/admin/projects - Get all projects (admin)
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status');

    const result = await projectDAO.getPaginated(page, limit);
    let projects = result.data;

    if (status) {
      projects = projects.filter((project: any) => project.status === status);
    }

    const enrichedProjects = await enrichProjects(projects);

    return NextResponse.json({ data: enrichedProjects });
  } catch (error: any) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
