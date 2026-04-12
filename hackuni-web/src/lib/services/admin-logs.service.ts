import { randomBytes } from 'crypto';

interface AdminUser {
  id: string;
  username: string;
}

interface LogOptions {
  entity_type?: 'user' | 'hackathon' | 'project' | 'story' | 'badge' | 'admin';
  entity_id?: string;
  entity_name?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export class AdminLogsService {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  /**
   * Log an admin action
   */
  log(
    admin: AdminUser,
    action: string,
    options: LogOptions = {}
  ): void {
    try {
      const id = `log_${Date.now()}_${randomBytes(8).toString('hex')}`;

      const stmt = this.db.prepare(`
        INSERT INTO admin_logs (
          id, admin_user_id, admin_username, action,
          entity_type, entity_id, entity_name, details,
          ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        admin.id,
        admin.username,
        action,
        options.entity_type || null,
        options.entity_id || null,
        options.entity_name || null,
        options.details ? JSON.stringify(options.details) : null,
        options.ip_address || null,
        options.user_agent || null
      );
    } catch (error) {
      console.error('Failed to log admin action:', error);
      // Don't throw - logging failures shouldn't break the main operation
    }
  }

  /**
   * Get logs with pagination and filtering
   */
  getLogs(page: number = 1, limit: number = 50, filters: {
    action?: string;
    entity_type?: string;
    admin_user_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}) {
    try {
      const offset = (page - 1) * limit;

      let whereClause = '1=1';
      const params: any[] = [];

      if (filters.action) {
        whereClause += ' AND action = ?';
        params.push(filters.action);
      }

      if (filters.entity_type) {
        whereClause += ' AND entity_type = ?';
        params.push(filters.entity_type);
      }

      if (filters.admin_user_id) {
        whereClause += ' AND admin_user_id = ?';
        params.push(filters.admin_user_id);
      }

      if (filters.start_date) {
        whereClause += ' AND created_at >= ?';
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        whereClause += ' AND created_at <= ?';
        params.push(filters.end_date);
      }

      const countStmt = this.db.prepare(`
        SELECT COUNT(*) as total
        FROM admin_logs
        WHERE ${whereClause}
      `);
      const { total } = countStmt.get(...params);

      const logsStmt = this.db.prepare(`
        SELECT
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
        FROM admin_logs
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `);

      const logs = logsStmt.all(...params, limit, offset);

      return {
        data: logs.map((log: any) => ({
          ...log,
          details: log.details ? JSON.parse(log.details) : null
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
  getRecentLogs(limit: number = 10) {
    try {
      const stmt = this.db.prepare(`
        SELECT
          id,
          admin_username,
          action,
          entity_type,
          entity_name,
          created_at
        FROM admin_logs
        ORDER BY created_at DESC
        LIMIT ?
      `);

      const logs = stmt.all(limit);

      return logs;
    } catch (error) {
      console.error('Failed to get recent logs:', error);
      return [];
    }
  }

  /**
   * Delete old logs (for cleanup)
   */
  deleteOldLogs(daysToKeep: number = 90): number {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM admin_logs
        WHERE created_at < datetime('now', '-' || ? || ' days')
      `);

      const result = stmt.run(daysToKeep);

      return result.changes;
    } catch (error) {
      console.error('Failed to delete old logs:', error);
      return 0;
    }
  }

  /**
   * Get statistics by action type
   */
  getStatsByAction(days: number = 30) {
    try {
      const stmt = this.db.prepare(`
        SELECT
          action,
          COUNT(*) as count
        FROM admin_logs
        WHERE created_at >= datetime('now', '-' || ? || ' days')
        GROUP BY action
        ORDER BY count DESC
      `);

      return stmt.all(days);
    } catch (error) {
      console.error('Failed to get stats:', error);
      return [];
    }
  }

  /**
   * Get most active admins
   */
  getMostActiveAdmins(days: number = 30, limit: number = 5) {
    try {
      const stmt = this.db.prepare(`
        SELECT
          admin_username,
          COUNT(*) as action_count
        FROM admin_logs
        WHERE created_at >= datetime('now', '-' || ? || ' days')
        GROUP BY admin_user_id, admin_username
        ORDER BY action_count DESC
        LIMIT ?
      `);

      return stmt.all(days, limit);
    } catch (error) {
      console.error('Failed to get active admins:', error);
      return [];
    }
  }
}
