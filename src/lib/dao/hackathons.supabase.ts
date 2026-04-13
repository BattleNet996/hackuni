/**
 * Hackathon DAO - Supabase Implementation
 */

import { BaseSupabaseDAO } from './base.supabase';
import { Hackathon, mapRowToHackathon } from '@/lib/models/hackathon';
import { supabase } from '@/lib/db/supabase-client';

export class HackathonSupabaseDAO extends BaseSupabaseDAO<Hackathon> {
  protected tableName = 'hackathons';

  /**
   * Map database row to Hackathon object
   */
  protected mapRow(row: any): Hackathon {
    return mapRowToHackathon(row);
  }

  /**
   * Get upcoming hackathons
   */
  async findUpcoming(): Promise<Hackathon[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .gt('start_time', now)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Find hackathons by city
   */
  async findByCity(city: string): Promise<Hackathon[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('city', city)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get hackathons with pagination
   */
  async getPaginated(page: number = 1, limit: number = 20): Promise<{
    data: Hackathon[];
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
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data: (data || []).map((row: any) => this.mapRow(row)),
      total,
      page
    };
  }

  /**
   * Search hackathons by title or description
   */
  async search(query: string, limit: number = 20): Promise<Hackathon[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .or(`title.ilike.%${query}%,short_desc.ilike.%${query}%,city.ilike.%${query}%`)
      .eq('hidden', 0)
      .order('start_time', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Create new hackathon
   */
  async create(data: any): Promise<Hackathon> {
    const { data: hackathon, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(hackathon);
  }

  /**
   * Get ongoing hackathons
   */
  async getOngoing(): Promise<Hackathon[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .lte('start_time', now)
      .gte('end_time', now)
      .eq('hidden', 0)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Get past hackathons
   */
  async getPast(limit: number = 20): Promise<Hackathon[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .lt('end_time', now)
      .eq('hidden', 0)
      .order('end_time', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }
}
