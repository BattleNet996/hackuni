import { NextRequest, NextResponse } from 'next/server';
import { userDAO } from '@/lib/dao';
import { authService } from '@/lib/services';

function getAuthToken(request: NextRequest) {
  const cookieToken = request.cookies.get('auth_token')?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const xAuthToken = request.headers.get('x-auth-token');
  return cookieToken || headerToken || xAuthToken;
}

function normalizeOptionalString(value: unknown, maxLength: number) {
  if (value === undefined) return undefined;
  if (value === null) return '';
  return String(value).trim().slice(0, maxLength);
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const user = await authService.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }

    const data = await request.json();
    const updatePayload: Record<string, any> = {
      display_name: normalizeOptionalString(data.display_name, 80),
      avatar: normalizeOptionalString(data.avatar, 500_000),
      bio: normalizeOptionalString(data.bio, 600),
      school: normalizeOptionalString(data.school, 120),
      major: normalizeOptionalString(data.major, 120),
      company: normalizeOptionalString(data.company, 120),
      position: normalizeOptionalString(data.position, 120),
      phone: normalizeOptionalString(data.phone, 80),
      twitter_url: normalizeOptionalString(data.twitter_url, 240),
      github_url: normalizeOptionalString(data.github_url, 240),
      website_url: normalizeOptionalString(data.website_url, 240),
      coolest_thing: normalizeOptionalString(data.coolest_thing, 600),
      current_build: normalizeOptionalString(data.current_build, 600),
      looking_for: Array.isArray(data.looking_for) ? data.looking_for.slice(0, 8).map(String) : undefined,
    };

    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key] === undefined) {
        delete updatePayload[key];
      }
    });

    const updatedUser = await userDAO.update(user.id, updatePayload);

    if (!updatedUser) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const { password_hash, ...safeUser } = updatedUser;
    return NextResponse.json({ data: safeUser });
  } catch (error: any) {
    console.error('Update profile error:', error);
    const isMissingColumn = error?.code === 'PGRST204' || /coolest_thing|current_build/i.test(error?.message || '');
    return NextResponse.json(
      {
        error: {
          code: isMissingColumn ? 'SCHEMA_MIGRATION_REQUIRED' : 'INTERNAL_ERROR',
          message: isMissingColumn
            ? 'Profile schema migration is required before saving these fields'
            : error.message,
        },
      },
      { status: isMissingColumn ? 409 : 500 }
    );
  }
}
