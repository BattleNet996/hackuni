import { NextResponse } from 'next/server';
import { hackathonDAO, projectDAO, storyDAO, userDAO } from '@/lib/dao';
import { getDatabaseRuntimeConfig } from '@/lib/db/runtime';

export async function GET() {
  const runtime = getDatabaseRuntimeConfig();

  let counts: Record<string, number> | { error: string };
  try {
    counts = {
      users: await userDAO.count(),
      stories: await storyDAO.count(),
      hackathons: await hackathonDAO.count(),
      projects: await projectDAO.count(),
    };
  } catch (error: any) {
    counts = {
      error: error.message,
    };
  }

  return NextResponse.json({
    environment: {
      NEXT_PUBLIC_SUPABASE_URL: runtime.hasSupabaseUrl,
      NEXT_PUBLIC_SUPABASE_URL_prefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) || null,
      SUPABASE_SERVICE_ROLE_KEY: runtime.hasSupabaseServiceRoleKey,
      SUPABASE_SERVICE_ROLE_KEY_prefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) || null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: runtime.hasSupabaseAnonKey,
      USE_SUPABASE: process.env.USE_SUPABASE,
      USE_SUPABASE_trimmed: runtime.normalizedUseSupabase,
      NODE_ENV: process.env.NODE_ENV,
    },
    database: {
      selected: runtime.databaseType,
      isUsingSupabase: runtime.isUsingSupabase,
      reason: runtime.reason,
    },
    counts,
  });
}
