/**
 * Database Adapter
 * Provides a unified interface for both SQLite and Supabase
 * Allows seamless migration between the two databases
 */

import { supabase, isUsingSupabase } from './supabase-client';
import { getDb } from './client';

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

/**
 * Execute a query on the appropriate database
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  if (isUsingSupabase()) {
    return querySupabase(text, params);
  } else {
    return querySQLite(text, params);
  }
}

/**
 * Execute query on Supabase
 * Note: Supabase doesn't support raw SQL queries in the same way
 * This is a simplified adapter - you may need to use the Supabase client directly
 */
async function querySupabase<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  // For complex queries, you should use supabase.rpc() or direct table access
  // This is a placeholder for simple SELECT queries
  console.warn('Raw SQL queries on Supabase require adaptation. Use supabase client directly.');

  // Extract table name from simple queries
  const match = text.match(/FROM\s+(\w+)/i);
  if (match) {
    const tableName = match[1];
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) throw error;
    return { rows: data || [], rowCount: data?.length || 0 };
  }

  throw new Error('Complex SQL queries need to be adapted for Supabase');
}

/**
 * Execute query on SQLite
 */
function querySQLite<T = any>(
  text: string,
  params?: any[]
): QueryResult<T> {
  const db = getDb();
  const stmt = db.prepare(text);
  const rows = params ? stmt.all(...params) : stmt.all();
  return { rows: rows as T[], rowCount: rows.length };
}

/**
 * Get a single record
 */
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | undefined> {
  const result = await query<T>(text, params);
  return result.rows[0];
}

/**
 * Execute an insert/update/delete operation
 */
export async function execute(
  text: string,
  params?: any[]
): Promise<void> {
  if (isUsingSupabase()) {
    throw new Error('Use Supabase client directly for mutations');
  } else {
    const db = getDb();
    const stmt = db.prepare(text);
    if (params) {
      stmt.run(...params);
    } else {
      stmt.run();
    }
  }
}

/**
 * Export the appropriate client
 */
export function getDatabaseClient() {
  if (isUsingSupabase()) {
    return supabase;
  } else {
    return getDb();
  }
}

/**
 * Check which database is being used
 */
export function getDatabaseType(): 'sqlite' | 'supabase' {
  return isUsingSupabase() ? 'supabase' : 'sqlite';
}
