/**
 * Base Supabase DAO
 * Provides a common interface for Supabase data access
 */

import { supabase } from '@/lib/db/supabase-client';

export abstract class BaseSupabaseDAO<T> {
  protected abstract tableName: string;
  protected abstract mapRow(row: any): T;

  /**
   * Find entity by ID
   */
  async findById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return this.mapRow(data);
  }

  /**
   * Find all entities with optional filters
   */
  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');

    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Find entities with pagination
   */
  async findPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<{ data: T[]; total: number; page: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    let countQuery = supabase.from(this.tableName).select('*', { count: 'exact', head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        countQuery = countQuery.eq(key, value);
      });
    }

    const { count } = await countQuery;
    const total = count || 0;

    // Get paginated data
    let dataQuery = supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        dataQuery = dataQuery.eq(key, value);
      });
    }

    const { data, error } = await dataQuery;

    if (error) throw error;

    return {
      data: (data || []).map((row: any) => this.mapRow(row)),
      total,
      page
    };
  }

  /**
   * Get paginated results (alias for findPaginated)
   */
  async getPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<{ data: T[]; total: number; page: number }> {
    return this.findPaginated(page, limit, filters);
  }

  /**
   * Count entities with optional filters
   */
  async count(filters?: Record<string, any>): Promise<number> {
    let query = supabase.from(this.tableName).select('*', { count: 'exact', head: true });

    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .limit(1);

    if (error) throw error;
    return (data || []).length > 0;
  }

  /**
   * Update entity
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };

    const { data: updated, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.mapRow(updated);
  }

  /**
   * Delete entity
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * Delete multiple entities by filters
   */
  async deleteByFilters(filters: Record<string, any>): Promise<number> {
    let query = supabase.from(this.tableName).delete();

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { error } = await query;

    if (error) throw error;
    return 0; // Supabase doesn't return count on delete
  }

  /**
   * Bulk insert entities
   */
  async bulkInsert(entities: Partial<T>[]): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .insert(entities);

    if (error) throw error;
  }

  /**
   * Bulk upsert entities
   */
  async bulkUpsert(entities: Partial<T>[]): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .upsert(entities, { onConflict: 'id' });

    if (error) throw error;
  }

  /**
   * Find entities by IN clause
   */
  async findByIds(ids: string[]): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .in('id', ids);

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }

  /**
   * Find entities with ordering
   */
  async findOrdered(
    orderBy: string,
    order: 'asc' | 'desc' = 'asc',
    limit?: number
  ): Promise<T[]> {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .order(orderBy, { ascending: order === 'asc' });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map((row: any) => this.mapRow(row));
  }
}
