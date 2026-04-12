/**
 * Admin Authentication Service - Supabase Implementation
 */

import crypto from 'crypto';
import { supabase } from '../db/supabase-client';

export interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
}

export interface AdminSession {
  id: string;
  admin_user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export class AdminAuthServiceSupabase {
  /**
   * Hash password using SHA-256
   */
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  /**
   * Generate secure random token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Authenticate admin user with username and password
   */
  async login(username: string, password: string): Promise<{ adminUser: AdminUser; token: string } | null> {
    const passwordHash = this.hashPassword(password);

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', passwordHash)
      .eq('is_active', 1)
      .single();

    if (error || !data) {
      return null;
    }

    const adminUser = data as AdminUser;

    // Create session
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const sessionId = `admin_session_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        id: sessionId,
        admin_user_id: adminUser.id,
        token: token,
        expires_at: expiresAt
      });

    if (sessionError) throw sessionError;

    // Update last_login_at
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminUser.id);

    if (updateError) throw updateError;

    return { adminUser, token };
  }

  /**
   * Verify admin token and return admin user
   */
  async verifyToken(token: string): Promise<AdminUser | null> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('admin_sessions')
      .select('expires_at, admin_users(*)')
      .eq('token', token)
      .single();

    if (error || !data || !data.admin_users) {
      return null;
    }

    const result = data as unknown as { expires_at: string; admin_users: AdminUser };

    // Check if token is expired
    if (new Date(result.expires_at) < new Date()) {
      // Delete expired session
      await this.deleteSession(token);
      return null;
    }

    return result.admin_users;
  }

  /**
   * Logout admin user by deleting session
   */
  async logout(token: string): Promise<boolean> {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('token', token);

    if (error) throw error;
    return true;
  }

  /**
   * Delete session by token
   */
  private async deleteSession(token: string): Promise<void> {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('token', token);

    if (error) throw error;
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .lt('expires_at', now);

    if (error) throw error;
  }

  /**
   * Create initial admin user if not exists
   */
  async createInitialAdminUser(): Promise<void> {
    const { count, error } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    if (count === 0) {
      const adminId = `admin_${Date.now()}`;
      const passwordHash = this.hashPassword('cwj123'); // Default password

      const now = new Date().toISOString();
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: adminId,
          username: 'wjj',
          password_hash: passwordHash,
          email: 'admin@hackuni.com',
          created_at: now,
          updated_at: now
        });

      if (insertError) throw insertError;
      console.log('Initial admin user created: wjj / cwj123');
    }
  }
}
