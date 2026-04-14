/**
 * Story DAO - Supabase Implementation
 */

import { BaseSupabaseDAO } from './base.supabase';
import { Story, mapRowToStory } from '@/lib/models/story';
import { supabase } from '@/lib/db/supabase-client';

export class StorySupabaseDAO extends BaseSupabaseDAO<Story> {
  protected tableName = 'stories';

  /**
   * Map database row to Story object
   */
  protected mapRow(row: any): Story {
    return mapRowToStory(row);
  }

  /**
   * Find story by slug
   */
  async findBySlug(slug: string): Promise<Story | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.mapRow(data);
  }

  /**
   * Get latest stories
   */
  async getLatest(limit: number = 10): Promise<Story[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get featured stories
   */
  async getFeatured(limit: number = 5): Promise<Story[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('featured', 1)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get stories by tag
   */
  async getByTag(tag: string, limit: number = 10): Promise<Story[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .contains('tags_json', [tag])
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Search stories
   */
  async search(query: string, limit: number = 20): Promise<Story[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get stories with pagination
   */
  async getPaginated(page: number = 1, limit: number = 10): Promise<{
    data: Story[];
    total: number;
    page: number;
  }> {
    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    const total = count || 0;

    // Get paginated data
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data: (data || []).map((row: any) => this.mapRow(row)),
      total,
      page
    };
  }

  /**
   * Update story like count
   */
  async updateLikeCount(storyId: string, delta: number): Promise<void> {
    const { data: story, error: fetchError } = await supabase
      .from(this.tableName)
      .select('like_count')
      .eq('id', storyId)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from(this.tableName)
      .update({ like_count: Math.max(0, (story?.like_count || 0) + delta) })
      .eq('id', storyId);

    if (error) throw error;
  }

  /**
   * Create new story
   */
  async create(data: any): Promise<Story> {
    const { data: story, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(story);
  }
}
