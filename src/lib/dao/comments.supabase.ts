/**
 * Comment DAO - Supabase Implementation
 */

import { BaseSupabaseDAO } from './base.supabase';
import { Comment, mapRowToComment } from '@/lib/models/comment';
import { supabase } from '@/lib/db/supabase-client';

export class CommentSupabaseDAO extends BaseSupabaseDAO<Comment> {
  protected tableName = 'comments';

  /**
   * Map database row to Comment object
   */
  protected mapRow(row: any): Comment {
    return mapRowToComment(row);
  }

  /**
   * Get comments for a target (project or story)
   */
  private async getByColumn(column: 'project_id' | 'story_id', targetId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq(column, targetId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get comments by user ID
   */
  async getByUserId(userId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Create new comment
   * Compatible with SQLite DAO signature
   */
  async createWithAuthor(
    input: any,
    authorId: string,
    authorName?: string
  ): Promise<Comment> {
    const id = `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Support both old and new input formats
    const content = input.content;
    const parent_comment_id = input.parent_comment_id || null;
    const project_id =
      input.project_id ||
      (input.target_type === 'project' ? input.target_id : null) ||
      null;
    const story_id =
      input.story_id ||
      (input.target_type === 'story' ? input.target_id : null) ||
      null;

    const now = new Date().toISOString();
    const commentData = {
      id,
      project_id,
      story_id,
      author_id: authorId,
      author_name: authorName || '',
      content,
      parent_comment_id,
      likes: 0,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(data);
  }

  /**
   * Get comment count for a target
   */
  async countByTarget(targetId: string, targetType: 'project' | 'story'): Promise<number> {
    const column = targetType === 'project' ? 'project_id' : 'story_id';
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq(column, targetId);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Delete all comments for a target
   */
  async deleteByTarget(targetId: string, targetType: 'project' | 'story'): Promise<void> {
    const column = targetType === 'project' ? 'project_id' : 'story_id';
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq(column, targetId);

    if (error) throw error;
  }

  /**
   * Get recent comments across all targets
   */
  async getRecent(limit: number = 10): Promise<Comment[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get comments for a project
   */
  async getProjectComments(projectId: string): Promise<Comment[]> {
    return this.getByColumn('project_id', projectId);
  }

  /**
   * Get comments for a story
   */
  async getStoryComments(storyId: string): Promise<Comment[]> {
    return this.getByColumn('story_id', storyId);
  }

  /**
   * Get replies to a comment
   */
  async getReplies(parentCommentId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('parent_comment_id', parentCommentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Increment comment likes
   */
  async incrementLikes(commentId: string): Promise<void> {
    // First get current likes
    const { data } = await supabase
      .from(this.tableName)
      .select('likes')
      .eq('id', commentId)
      .single();

    if (data) {
      const newLikes = (data.likes || 0) + 1;
      const { error } = await supabase
        .from(this.tableName)
        .update({ likes: newLikes })
        .eq('id', commentId);

      if (error) throw error;
    }
  }

  /**
   * Decrement comment likes
   */
  async decrementLikes(commentId: string): Promise<void> {
    // First get current likes
    const { data } = await supabase
      .from(this.tableName)
      .select('likes')
      .eq('id', commentId)
      .single();

    if (data) {
      const newLikes = Math.max(0, (data.likes || 0) - 1);
      const { error } = await supabase
        .from(this.tableName)
        .update({ likes: newLikes })
        .eq('id', commentId);

      if (error) throw error;
    }
  }
}
