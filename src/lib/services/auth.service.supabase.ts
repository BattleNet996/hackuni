/**
 * Authentication Service - Supabase Implementation
 */

import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { userDAO } from '../dao';
import { supabase } from '../db/supabase-client';

export interface AuthTokens {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export class AuthServiceSupabase {
  /**
   * Register new user
   */
  async register(email: string, password: string, displayName?: string): Promise<AuthTokens> {
    // Check if user exists
    const existing = await userDAO.findByEmail(email);
    if (existing) {
      throw new Error('EMAIL_EXISTS');
    }

    // Validate email
    if (!this.isValidEmail(email)) {
      throw new Error('INVALID_EMAIL');
    }

    // Validate password
    if (password.length < 8) {
      throw new Error('PASSWORD_TOO_SHORT');
    }

    // Create user
    const user = await userDAO.create({
      email,
      password,
      display_name: displayName
    });

    const token = await this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await userDAO.findByEmail(email);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.password_hash) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = await this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  /**
   * Verify token and get user
   */
  async verifyToken(token: string): Promise<Omit<User, 'password_hash'> | null> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('sessions')
      .select('user_id, expires_at, users(*)')
      .eq('token', token)
      .gt('expires_at', now)
      .single();

    if (error || !data || !data.users || !Array.isArray(data.users) || data.users.length === 0) {
      return null;
    }

    return this.sanitizeUser(data.users[0]);
  }

  /**
   * Logout user (invalidate token)
   */
  async logout(token: string): Promise<void> {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('token', token);

    if (error) throw error;
  }

  /**
   * Generate authentication token
   */
  private async generateToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const sessionId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        token: token,
        expires_at: expiresAt.toISOString()
      });

    if (error) throw error;

    return token;
  }

  /**
   * Remove password hash from user object
   */
  private sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// Import User type for type safety
import { User } from '../models/user';
