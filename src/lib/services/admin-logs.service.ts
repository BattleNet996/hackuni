import { randomBytes } from 'crypto';
import { supabase } from '../db/supabase-client';

interface AdminUser {
  id: string;
  username: string;
}

interface LogOptions {
  entity_type?: 'user' | 'hackathon' | 'hackathon_record' | 'project' | 'story' | 'badge' | 'admin';
  entity_id?: string;
  entity_name?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export class AdminLogsService {
  constructor(_db?: any) {}

  private parseDetails(details: any) {
    if (!details) return null;
    if (typeof details !== 'string') return details;

    try {
      return JSON.parse(details);
    } catch {
      return details;
    }
  }

  private applyFilters(query: any, filters: {
    action?: string;
    entity_type?: string;
    admin_user_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}) {
    let nextQuery = query;

    if (filters.action) {
      nextQuery = nextQuery.eq('action', filters.action);
    }

    if (filters.entity_type) {
      nextQuery = nextQuery.eq('entity_type', filters.entity_type);
    }

    if (filters.admin_user_id) {
      nextQuery = nextQuery.eq('admin_user_id', filters.admin_user_id);
    }

    if (filters.start_date) {
      nextQuery = nextQuery.gte('created_at', filters.start_date);
    }

    if (filters.end_date) {
      nextQuery = nextQuery.lte('created_at', filters.end_date);
    }

    return nextQuery;
  }

  /**
   * Log an admin action
   */
  async log(
    admin: AdminUser,
    action: string,
    options: LogOptions = {}
  ): Promise<void> {
    try {
      const id = `log_${Date.now()}_${randomBytes(8).toString('hex')}`;
      const { error } = await supabase
        .from('admin_logs')
        .insert({
          id,
          admin_user_id: admin.id,
          admin_username: admin.username,
          action,
          entity_type: options.entity_type || null,
          entity_id: options.entity_id || null,
          entity_name: options.entity_name || null,
          details: options.details ? JSON.stringify(options.details) : null,
          ip_address: options.ip_address || null,
          user_agent: options.user_agent || null,
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }

  /**
   * Get logs with pagination and filtering
   */
  async getLogs(page: number = 1, limit: number = 50, filters: {
    action?: string;
    entity_type?: string;
    admin_user_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const countQuery = this.applyFilters(
        supabase.from('admin_logs').select('*', { count: 'exact', head: true }),
        filters
      );
      const { count, error: countError } = await countQuery;

      if (countError) {
        throw countError;
      }

      const logsQuery = this.applyFilters(
        supabase
          .from('admin_logs')
          .select(`
            id,
            admin_user_id,
            admin_username,
            action,
            entity_type,
            entity_id,
            entity_name,
            details,
            ip_address,
            created_at
          `)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1),
        filters
      );
      const { data: logs, error } = await logsQuery;

      if (error) {
        throw error;
      }

      const total = count || 0;

      return {
        data: (logs || []).map((log: any) => ({
          ...log,
          details: this.parseDetails(log.details)
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Failed to get logs:', error);
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  /**
   * Get recent logs for dashboard
   */
  async getRecentLogs(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select(`
          id,
          admin_username,
          action,
          entity_type,
          entity_name,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get recent logs:', error);
      return [];
    }
  }

  /**
   * Delete old logs (for cleanup)
   */
  async deleteOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('admin_logs')
        .delete()
        .lt('created_at', cutoff)
        .select('id');

      if (error) {
        throw error;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Failed to delete old logs:', error);
      return 0;
    }
  }

  /**
   * Get statistics by action type
   */
  async getStatsByAction(days: number = 30) {
    try {
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('admin_logs')
        .select('action')
        .gte('created_at', cutoff);

      if (error) {
        throw error;
      }

      const counts = (data || []).reduce((acc: Record<string, number>, row: any) => {
        const action = row.action || 'unknown';
        acc[action] = (acc[action] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts)
        .map(([action, count]) => ({ action, count: Number(count) }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Failed to get stats:', error);
      return [];
    }
  }

  /**
   * Get most active admins
   */
  async getMostActiveAdmins(days: number = 30, limit: number = 5) {
    try {
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('admin_logs')
        .select('admin_user_id, admin_username')
        .gte('created_at', cutoff);

      if (error) {
        throw error;
      }

      const counts = (data || []).reduce((acc: Record<string, { admin_username: string; action_count: number }>, row: any) => {
        const key = row.admin_user_id || row.admin_username || 'unknown';
        const current = acc[key] || {
          admin_username: row.admin_username || 'unknown',
          action_count: 0,
        };
        current.action_count += 1;
        acc[key] = current;
        return acc;
      }, {});

      return (Object.values(counts) as Array<{ admin_username: string; action_count: number }>)
        .sort((a, b) => b.action_count - a.action_count)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get active admins:', error);
      return [];
    }
  }
}
