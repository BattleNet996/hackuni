import { createClient } from '@supabase/supabase-js';

// Supabase configuration for server-side usage (API routes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create Supabase client with service role key (for server-side only)
// This bypasses RLS policies - use only in API routes
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to check if using Supabase or SQLite
export function isUsingSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export default supabase;
