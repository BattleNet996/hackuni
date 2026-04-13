/**
 * User DAO - Supabase Implementation
 */

import { BaseSupabaseDAO } from './base.supabase';
import { User, UserCreateInput, UserUpdateInput, mapRowToUser } from '@/lib/models/user';
import { supabase } from '@/lib/db/supabase-client';
import bcrypt from 'bcrypt';

export class UserSupabaseDAO extends BaseSupabaseDAO<User> {
  protected tableName = 'users';

  /**
   * Map database row to User object
   */
  protected mapRow(row: any): User {
    return mapRowToUser(row);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.mapRow(data);
  }

  /**
   * Create new user
   */
  async create(input: UserCreateInput): Promise<User> {
    const id = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = await bcrypt.hash(input.password, 10);
    const now = new Date().toISOString();

    const userData = {
      id,
      email: input.email,
      password_hash: passwordHash,
      display_name: input.display_name || input.email.split('@')[0],
      bio: '',
      looking_for: [],
      total_hackathon_count: 0,
      total_work_count: 0,
      total_award_count: 0,
      badge_count: 0,
      certification_count: 0,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(data);
  }

  /**
   * Update user profile
   */
  async update(id: string, input: UserUpdateInput): Promise<User | null> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (input.display_name !== undefined) updateData.display_name = input.display_name;
    if (input.bio !== undefined) updateData.bio = input.bio;
    if (input.avatar !== undefined) updateData.avatar = input.avatar;
    if (input.school !== undefined) updateData.school = input.school;
    if (input.major !== undefined) updateData.major = input.major;
    if (input.company !== undefined) updateData.company = input.company;
    if (input.position !== undefined) updateData.position = input.position;
    if (input.phone !== undefined) updateData.phone = input.phone;
    if (input.twitter_url !== undefined) updateData.twitter_url = input.twitter_url;
    if (input.github_url !== undefined) updateData.github_url = input.github_url;
    if (input.website_url !== undefined) updateData.website_url = input.website_url;
    if (input.looking_for !== undefined) updateData.looking_for = input.looking_for;

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.mapRow(data);
  }

  /**
   * Verify user password
   */
  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (error || !data) return false;

    return bcrypt.compare(password, data.password_hash);
  }

  /**
   * Update user statistics
   */
  async updateStats(userId: string, stats: {
    total_hackathon_count?: number;
    total_work_count?: number;
    total_award_count?: number;
    badge_count?: number;
    certification_count?: number;
  }): Promise<void> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (stats.total_hackathon_count !== undefined) {
      updateData.total_hackathon_count = stats.total_hackathon_count;
    }
    if (stats.total_work_count !== undefined) {
      updateData.total_work_count = stats.total_work_count;
    }
    if (stats.total_award_count !== undefined) {
      updateData.total_award_count = stats.total_award_count;
    }
    if (stats.badge_count !== undefined) {
      updateData.badge_count = stats.badge_count;
    }
    if (stats.certification_count !== undefined) {
      updateData.certification_count = stats.certification_count;
    }

    const { error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', userId);

    if (error) throw error;
  }

  /**
   * Find users by multiple IDs
   */
  async findByIds(ids: string[]): Promise<User[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .in('id', ids);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Search users by display name or email
   */
  async search(query: string, limit: number = 10): Promise<User[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get top users by hackathon count
   */
  async getTopByHackathons(limit: number = 10): Promise<User[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('total_hackathon_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get top users by award count
   */
  async getTopByAwards(limit: number = 10): Promise<User[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('total_award_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get top users by total work count (projects + hackathons)
   */
  async getTopByWorkCount(limit: number = 10): Promise<User[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('total_work_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }
}
