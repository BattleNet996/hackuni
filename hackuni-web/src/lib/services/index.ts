/**
 * Service Factory
 * Automatically selects SQLite or Supabase implementation based on environment
 */

import { isUsingSupabase } from '../db/database';
import { AuthService } from './auth.service';
import { AuthServiceSupabase } from './auth.service.supabase';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthServiceSupabase } from './admin-auth.service.supabase';

// Get the appropriate service implementation
function getAuthService() {
  if (isUsingSupabase()) {
    return new AuthServiceSupabase();
  } else {
    const { getDb } = require('../db/client');
    const db = getDb();
    return new AuthService(db);
  }
}

function getAdminAuthService() {
  if (isUsingSupabase()) {
    return new AdminAuthServiceSupabase();
  } else {
    const { getDb } = require('../db/client');
    const db = getDb();
    return new AdminAuthService(db);
  }
}

// Export service instances
export const authService = getAuthService();
export const adminAuthService = getAdminAuthService();

// Re-export types
export type { AuthTokens } from './auth.service';
export type { AdminUser, AdminSession } from './admin-auth.service';
