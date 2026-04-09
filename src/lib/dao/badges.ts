import Database from 'better-sqlite3';
import { BaseDAO } from './base';
import { Badge, UserBadge, mapRowToBadge, mapRowToUserBadge } from '@/lib/models/badge';

export class BadgeDAO extends BaseDAO<Badge> {
  protected tableName = 'badges';

  private findByCodeStmt: Database.Statement;

  constructor(db: Database.Database) {
    super(db);
    this.prepareStatements();
  }

  private prepareStatements(): void {
    this.findByCodeStmt = this.db.prepare(
      'SELECT * FROM badges WHERE badge_code = ?'
    );
  }

  protected mapRow(row: any): Badge {
    return mapRowToBadge(row);
  }

  /**
   * Find badge by code
   */
  findByCode(code: string): Badge | null {
    const row = this.findByCodeStmt.get(code);
    return row ? this.mapRow(row) : null;
  }

  /**
   * Get badges for a user
   */
  getUserBadges(userId: string): Array<UserBadge & { badge: Badge }> {
    const stmt = this.db.prepare(`
      SELECT ub.*, b.* FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ?
      ORDER BY ub.created_at DESC
    `);

    const rows = stmt.all(userId);

    return rows.map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      badge_id: row.badge_id,
      status: row.status,
      earned_at: row.earned_at,
      verified_at: row.verified_at,
      created_at: row.created_at,
      badge: {
        id: row.badge_id || row.id,
        badge_code: row.badge_code,
        badge_name: row.badge_name,
        badge_name_en: row.badge_name_en,
        badge_type: row.badge_type,
        badge_desc: row.badge_desc,
        badge_desc_en: row.badge_desc_en,
        icon_url: row.icon_url,
        rule_desc: row.rule_desc,
        rule_desc_en: row.rule_desc_en,
        source_type: row.source_type,
        created_at: row.created_at,
      }
    }));
  }
}
