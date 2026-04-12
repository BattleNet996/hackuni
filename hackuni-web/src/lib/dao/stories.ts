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

  /**
   * Update story
   */
  update(id: string, input: any): Story | null {
    const updates: string[] = [];
    const params: any[] = [];

    if (input.slug !== undefined) {
      updates.push('slug = ?');
      params.push(input.slug);
    }
    if (input.title !== undefined) {
      updates.push('title = ?');
      params.push(input.title);
    }
    if (input.summary !== undefined) {
      updates.push('summary = ?');
      params.push(input.summary);
    }
    if (input.content !== undefined) {
      updates.push('content = ?');
      params.push(input.content);
    }
    if (input.source !== undefined) {
      updates.push('source = ?');
      params.push(input.source);
    }
    if (input.source_url !== undefined) {
      updates.push('source_url = ?');
      params.push(input.source_url);
    }
    if (input.author_name !== undefined) {
      updates.push('author_name = ?');
      params.push(input.author_name);
    }
    if (input.tags_json !== undefined) {
      updates.push('tags_json = ?');
      params.push(JSON.stringify(input.tags_json));
    }
    if (input.published_at !== undefined) {
      updates.push('published_at = ?');
      params.push(input.published_at);
    }
    if (input.status !== undefined) {
      updates.push('status = ?');
      params.push(input.status);
    }
    if (input.hidden !== undefined) {
      updates.push('hidden = ?');
      params.push(input.hidden ? 1 : 0);
    }

    if (updates.length > 0) {
      updates.push('updated_at = datetime(\'now\')');
      params.push(id);

      const query = `UPDATE stories SET ${updates.join(', ')} WHERE id = ?`;
      const stmt = this.db.prepare(query);
      stmt.run(...params);
    }

    return this.findById(id);
  }
}
