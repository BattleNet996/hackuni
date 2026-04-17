/**
 * Project DAO - Supabase Implementation
 */

import { BaseSupabaseDAO } from './base.supabase';
import { Project, ProjectCreateInput, ProjectUpdateInput, mapRowToProject } from '@/lib/models/project';
import { supabase } from '@/lib/db/supabase-client';

export class ProjectSupabaseDAO extends BaseSupabaseDAO<Project> {
  protected tableName = 'projects';

  /**
   * Map database row to Project object
   */
  protected mapRow(row: any): Project {
    return mapRowToProject(row);
  }

  /**
   * Get top ranked projects
   */
  async getTopRanked(limit: number = 20): Promise<Project[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .not('rank_score', 'is', null)
      .order('rank_score', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get most liked projects
   */
  async getMostLiked(limit: number = 20): Promise<Project[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('like_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Update project like count
   */
  async updateLikeCount(projectId: string, delta: number): Promise<void> {
    // First get current count
    const { data: project } = await supabase
      .from(this.tableName)
      .select('like_count')
      .eq('id', projectId)
      .single();

    if (project) {
      const newCount = (project.like_count || 0) + delta;
      const { error } = await supabase
        .from(this.tableName)
        .update({ like_count: newCount })
        .eq('id', projectId);

      if (error) throw error;
    }
  }

  /**
   * Create new project
   */
  async create(input: ProjectCreateInput, authorId: string): Promise<Project> {
    const id = `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const now = new Date().toISOString();
    const projectData = {
      id,
      title: input.title,
      short_desc: input.short_desc,
      long_desc: input.long_desc || null,
      team_member_text: input.team_member_text,
      tags_json: input.tags_json || [],
      demo_url: input.demo_url || null,
      github_url: input.github_url || null,
      website_url: input.website_url || null,
      related_hackathon_id: input.related_hackathon_id || null,
      author_id: authorId,
      images: input.images || [],
      is_awarded: input.is_awarded ? 1 : 0,
      award_text: input.award_text || null,
      like_count: 0,
      status: input.status || 'published',
      hidden: 0,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(projectData)
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(data);
  }

  /**
   * Update project
   */
  async update(id: string, input: ProjectUpdateInput): Promise<Project | null> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.short_desc !== undefined) updateData.short_desc = input.short_desc;
    if (input.long_desc !== undefined) updateData.long_desc = input.long_desc;
    if (input.team_member_text !== undefined) updateData.team_member_text = input.team_member_text;
    if (input.tags_json !== undefined) updateData.tags_json = input.tags_json;
    if (input.demo_url !== undefined) updateData.demo_url = input.demo_url;
    if (input.github_url !== undefined) updateData.github_url = input.github_url;
    if (input.website_url !== undefined) updateData.website_url = input.website_url;
    if (input.related_hackathon_id !== undefined) updateData.related_hackathon_id = input.related_hackathon_id;
    if (input.images !== undefined) updateData.images = input.images;
    if (input.is_awarded !== undefined) updateData.is_awarded = input.is_awarded ? 1 : 0;
    if (input.award_text !== undefined) updateData.award_text = input.award_text;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.hidden !== undefined) updateData.hidden = input.hidden ? 1 : 0;

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
   * Get projects by author ID
   */
  async findByAuthorId(authorId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get projects by hackathon ID
   */
  async findByHackathonId(hackathonId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('related_hackathon_id', hackathonId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Search projects by title or description
   */
  async search(query: string, limit: number = 20): Promise<Project[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .or(`title.ilike.%${query}%,short_desc.ilike.%${query}%`)
      .eq('status', 'published')
      .eq('hidden', 0)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get awarded projects
   */
  async getAwarded(limit: number = 20): Promise<Project[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('is_awarded', 1)
      .eq('hidden', 0)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }
}
