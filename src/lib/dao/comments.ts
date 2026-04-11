import Database from 'better-sqlite3';
import { BaseDAO } from './base';
import { Like, mapRowToLike } from '@/lib/models/like';

export class LikeDAO extends BaseDAO<Like> {
  protected tableName = 'likes';

  private checkLikeStmt!: Database.Statement;
  private countLikesStmt!: Database.Statement;
  private deleteLikeStmt!: Database.Statement;

  constructor(db: Database.Database) {
    super(db);
    this.prepareStatements();
  }

  private prepareStatements(): void {
    this.checkLikeStmt = this.db.prepare(`
      SELECT * FROM likes
      WHERE user_id = ? AND target_type = ? AND target_id = ?
    `);

    this.countLikesStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM likes
      WHERE target_type = ? AND target_id = ?
    `);

    this.deleteLikeStmt = this.db.prepare(`
      DELETE FROM likes
      WHERE user_id = ? AND target_type = ? AND target_id = ?
    `);
  }

  protected mapRow(row: any): Like {
    return mapRowToLike(row);
  }

  /**
   * Check if user has liked target
   */
  hasUserLiked(userId: string, targetType: string, targetId: string): boolean {
    const row = this.checkLikeStmt.get(userId, targetType, targetId);
    return !!row;
  }

  /**
   * Toggle like (add if not exists, remove if exists)
   */
  toggleLike(userId: string, targetType: string, targetId: string): boolean {
    if (this.hasUserLiked(userId, targetType, targetId)) {
      this.deleteLikeStmt.run(userId, targetType, targetId);
      return false; // Unliked
    } else {
      const id = `l_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const stmt = this.db.prepare(`
        INSERT INTO likes (id, user_id, target_type, target_id)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(id, userId, targetType, targetId);
      return true; // Liked
    }
  }

  /**
   * Count likes for a target
   */
  countLikes(targetType: string, targetId: string): number {
    const result = this.countLikesStmt.get(targetType, targetId) as { count: number };
    return result.count;
  }
}
