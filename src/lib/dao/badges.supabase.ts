/**
 * Badge DAO - Supabase Implementation
 */

import { BaseSupabaseDAO } from './base.supabase';
import { Badge, UserBadge, mapRowToBadge, mapRowToUserBadge } from '@/lib/models/badge';
import { supabase } from '@/lib/db/supabase-client';

export class BadgeSupabaseDAO extends BaseSupabaseDAO<Badge> {
  protected tableName = 'badges';

  /**
   * Map database row to Badge object
   */
  protected mapRow(row: any): Badge {
    return mapRowToBadge(row);
  }

  /**
   * Find badge by code
   */
  async findByCode(code: string): Promise<Badge | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('badge_code', code)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.mapRow(data);
  }

  /**
   * Get all badges
   */
  async getAll(): Promise<Badge[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Create new badge
   */
  async create(data: any): Promise<Badge> {
    const { data: badge, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(badge);
  }

  /**
   * Get badges by type
   */
  async getByType(type: string): Promise<Badge[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('badge_type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get badges for a user
   */
  async getUserBadges(userId: string): Promise<Array<UserBadge & { badge: Badge | null }>> {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      badge_id: row.badge_id,
      status: row.status,
      earned_at: row.earned_at,
      verified_at: row.verified_at,
      created_at: row.created_at,
      badge: row.badge ? this.mapRow(row.badge) : null
    }));
  }

  /**
   * Award badge to user
   */
  async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    const id = `ub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const userBadgeData = {
      id,
      user_id: userId,
      badge_id: badgeId,
      status: 'earned',
      earned_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_badges')
      .insert(userBadgeData)
      .select()
      .single();

    if (error) throw error;
    return mapRowToUserBadge(data);
  }

  /**
   * Verify user badge
   */
  async verifyBadge(userBadgeId: string): Promise<void> {
    const { error } = await supabase
      .from('user_badges')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('id', userBadgeId);

    if (error) throw error;
  }

  /**
   * Get user badge count
   */
  async getUserBadgeCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'verified');

    if (error) throw error;
    return count || 0;
  }

  /**
   * Check if user has specific badge
   */
  async hasBadge(userId: string, badgeCode: string): Promise<boolean> {
    // First get badge by code
    const badge = await this.findByCode(badgeCode);
    if (!badge) return false;

    // Check if user has this badge
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', badge.id)
      .eq('status', 'verified')
      .limit(1);

    if (error) throw error;
    return (data || []).length > 0;
  }
}
