import { NextRequest, NextResponse } from 'next/server';
import { projectDAO, userDAO } from '@/lib/dao';
import { adminAuthService } from '@/lib/services';
import { withProjectLikeCounts } from '@/lib/server/like-counts';
import { sortProjectsByGoatOrder } from '@/lib/server/project-ordering';

async function enrichProjects(projects: any[]) {
  if (projects.length === 0) {
    return [];
  }

  const authorIds = Array.from(new Set(projects.map((project) => project.author_id).filter(Boolean)));
  const [projectsWithLikes, authors] = await Promise.all([
    withProjectLikeCounts(projects),
    authorIds.length > 0 ? userDAO.findByIds(authorIds) : Promise.resolve([]),
  ]);

  const authorMap = new Map<string, any>((authors || []).map((author: any) => [author.id, author]));

  return projectsWithLikes.map((project) => ({
    ...project,
    author_name: project.author_id ? (authorMap.get(project.author_id)?.display_name || authorMap.get(project.author_id)?.email || null) : null,
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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '100', 10));
    const status = searchParams.get('status');
    const includeHidden = searchParams.get('include_hidden') === 'true';

    let projects = await projectDAO.findAll(status ? { status } : undefined);

    if (!includeHidden) {
      projects = projects.filter((project: any) => !project.hidden);
    }

    const enrichedProjects = sortProjectsByGoatOrder(await enrichProjects(projects));
    const paginatedProjects = enrichedProjects.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginatedProjects,
      total: enrichedProjects.length,
      page,
      limit,
      hasMore: page * limit < enrichedProjects.length,
    });
  } catch (error: any) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
