/**
 * Like DAO - Supabase Implementation
 */

import { BaseSupabaseDAO } from './base.supabase';
import { Like, mapRowToLike } from '@/lib/models/like';
import { supabase } from '@/lib/db/supabase-client';

export class LikeSupabaseDAO extends BaseSupabaseDAO<Like> {
  protected tableName = 'likes';

  /**
   * Map database row to Like object
   */
  protected mapRow(row: any): Like {
    return mapRowToLike(row);
  }

  /**
   * Check if user has liked target
   */
  async hasUserLiked(userId: string, targetType: string, targetId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .limit(1);

    if (error) throw error;
    return (data || []).length > 0;
  }

  /**
   * Toggle like (add if not exists, remove if exists)
   */
  async toggleLike(userId: string, targetType: string, targetId: string): Promise<boolean> {
    const hasLiked = await this.hasUserLiked(userId, targetType, targetId);

    if (hasLiked) {
      // Remove like
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('user_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId);

      if (error) throw error;
      return false; // Unliked
    } else {
      // Add like
      const id = `l_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const { error } = await supabase
        .from(this.tableName)
        .insert({
          id,
          user_id: userId,
          target_type: targetType,
          target_id: targetId,
          created_at: now
        });

      if (error) throw error;
      return true; // Liked
    }
  }

  /**
   * Count likes for a target
   */
  async countLikes(targetType: string, targetId: string): Promise<number> {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('target_type', targetType)
      .eq('target_id', targetId);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Get all likes by user
   */
  async getByUser(userId: string): Promise<Like[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(row => this.mapRow(row));
  }

  /**
   * Get likes for a target
   */
  async getByTarget(targetType: string, targetId: string): Promise<Like[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(row => this.mapRow(row));
  }

  /**
   * Delete like
   */
  async deleteLike(userId: string, targetType: string, targetId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId);

    if (error) throw error;
  }
}
