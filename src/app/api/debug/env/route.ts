import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL_prefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY_prefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      USE_SUPABASE: process.env.USE_SUPABASE,
      NODE_ENV: process.env.NODE_ENV,
    },
    isUsingSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
}
