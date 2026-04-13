export type DatabaseType = 'sqlite' | 'supabase';

export interface DatabaseRuntimeConfig {
  databaseType: DatabaseType;
  isUsingSupabase: boolean;
  hasSupabaseUrl: boolean;
  hasSupabaseServiceRoleKey: boolean;
  hasSupabaseAnonKey: boolean;
  rawUseSupabase: string | undefined;
  normalizedUseSupabase: string | null;
  requestedUseSupabase: boolean | null;
  reason: string;
}

function normalizeBooleanEnv(
  value: string | undefined
): { normalized: string | null; parsed: boolean | null } {
  const normalized = value?.trim().toLowerCase() || null;

  if (!normalized) {
    return { normalized, parsed: null };
  }

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return { normalized, parsed: true };
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return { normalized, parsed: false };
  }

  return { normalized, parsed: null };
}

export function getDatabaseRuntimeConfig(): DatabaseRuntimeConfig {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const hasSupabaseServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const hasSupabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const { normalized, parsed } = normalizeBooleanEnv(process.env.USE_SUPABASE);

  if (parsed === false) {
    return {
      databaseType: 'sqlite',
      isUsingSupabase: false,
      hasSupabaseUrl,
      hasSupabaseServiceRoleKey,
      hasSupabaseAnonKey,
      rawUseSupabase: process.env.USE_SUPABASE,
      normalizedUseSupabase: normalized,
      requestedUseSupabase: parsed,
      reason: 'USE_SUPABASE explicitly disables Supabase.',
    };
  }

  if (hasSupabaseUrl && hasSupabaseServiceRoleKey) {
    return {
      databaseType: 'supabase',
      isUsingSupabase: true,
      hasSupabaseUrl,
      hasSupabaseServiceRoleKey,
      hasSupabaseAnonKey,
      rawUseSupabase: process.env.USE_SUPABASE,
      normalizedUseSupabase: normalized,
      requestedUseSupabase: parsed,
      reason: parsed === true
        ? 'USE_SUPABASE enabled and required Supabase credentials are present.'
        : 'Supabase credentials are present, so Supabase is selected automatically.',
    };
  }

  return {
    databaseType: 'sqlite',
    isUsingSupabase: false,
    hasSupabaseUrl,
    hasSupabaseServiceRoleKey,
    hasSupabaseAnonKey,
    rawUseSupabase: process.env.USE_SUPABASE,
    normalizedUseSupabase: normalized,
    requestedUseSupabase: parsed,
    reason: parsed === true
      ? 'USE_SUPABASE enabled, but required Supabase credentials are incomplete. Falling back to SQLite.'
      : 'Supabase credentials are incomplete, so SQLite is selected.',
  };
}

export function isUsingSupabaseRuntime(): boolean {
  return getDatabaseRuntimeConfig().isUsingSupabase;
}
