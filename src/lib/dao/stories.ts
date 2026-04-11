import Database from 'better-sqlite3';
import { BaseDAO } from './base';
import { Story, mapRowToStory } from '@/lib/models/story';

export class StoryDAO extends BaseDAO<Story> {
  protected tableName = 'stories';

  private findBySlugStmt!: Database.Statement;
  private getLatestStmt!: Database.Statement;

  constructor(db: Database.Database) {
    super(db);
    this.prepareStatements();
  }

  private prepareStatements(): void {
    this.findBySlugStmt = this.db.prepare(
      'SELECT * FROM stories WHERE slug = ?'
    );
    this.getLatestStmt = this.db.prepare(`
      SELECT * FROM stories
      ORDER BY published_at DESC
      LIMIT ?
    `);
  }

  protected mapRow(row: any): Story {
    return mapRowToStory(row);
  }

  /**
   * Find story by slug
   */
  findBySlug(slug: string): Story | null {
    const row = this.findBySlugStmt.get(slug);
    return row ? this.mapRow(row) : null;
  }

  /**
   * Get latest stories
   */
  getLatest(limit: number = 10): Story[] {
    const rows = this.getLatestStmt.all(limit);
    return rows.map(row => this.mapRow(row));
  }
}
