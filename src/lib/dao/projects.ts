import Database from 'better-sqlite3';
import { BaseDAO } from './base';
import { Project, ProjectCreateInput, ProjectUpdateInput, mapRowToProject } from '@/lib/models/project';

export class ProjectDAO extends BaseDAO<Project> {
  protected tableName = 'projects';

  private getTopRankedStmt!: Database.Statement;
  private getMostLikedStmt!: Database.Statement;
  private updateLikeCountStmt!: Database.Statement;

  constructor(db: Database.Database) {
    super(db);
    this.prepareStatements();
  }

  private prepareStatements(): void {
    this.getTopRankedStmt = this.db.prepare(`
      SELECT * FROM projects
      WHERE rank_score IS NOT NULL
      ORDER BY rank_score ASC
      LIMIT ?
    `);

    this.getMostLikedStmt = this.db.prepare(`
      SELECT * FROM projects
      ORDER BY like_count DESC
      LIMIT ?
    `);

    this.updateLikeCountStmt = this.db.prepare(`
      UPDATE projects
      SET like_count = like_count + ?
      WHERE id = ?
    `);
  }

  protected mapRow(row: any): Project {
    return mapRowToProject(row);
  }

  /**
   * Get top ranked projects
   */
  getTopRanked(limit: number = 20): Project[] {
    const rows = this.getTopRankedStmt.all(limit);
    return rows.map((row: any) => this.mapRow(row));
  }

  /**
   * Get most liked projects
   */
  getMostLiked(limit: number = 20): Project[] {
    const rows = this.getMostLikedStmt.all(limit);
    return rows.map((row: any) => this.mapRow(row));
  }

  /**
   * Update project like count
   */
  updateLikeCount(projectId: string, delta: number): void {
    this.updateLikeCountStmt.run(delta, projectId);
  }

  /**
   * Create new project
   */
  createWithAuthor(input: ProjectCreateInput, authorId: string): Project {
    const id = `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO projects (
        id, title, short_desc, long_desc, team_member_text,
        tags_json, demo_url, github_url, website_url,
        related_hackathon_id, author_id, images, is_awarded, award_text,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.title,
      input.short_desc,
      input.long_desc || null,
      input.team_member_text,
      JSON.stringify(input.tags_json || []),
      input.demo_url || null,
      input.github_url || null,
      input.website_url || null,
      input.related_hackathon_id || null,
      authorId,
      JSON.stringify(input.images || []),
      input.is_awarded ? 1 : 0,
      input.award_text || null,
      input.status || 'published',
      now,
      now
    );

    return this.findById(id)!;
  }

  /**
   * Update project
   */
  update(id: string, input: ProjectUpdateInput): Project | null {
    const updates: string[] = [];
    const params: any[] = [];

    if (input.title !== undefined) {
      updates.push('title = ?');
      params.push(input.title);
    }
    if (input.short_desc !== undefined) {
      updates.push('short_desc = ?');
      params.push(input.short_desc);
    }
    if (input.long_desc !== undefined) {
      updates.push('long_desc = ?');
      params.push(input.long_desc);
    }
    if (input.team_member_text !== undefined) {
      updates.push('team_member_text = ?');
      params.push(input.team_member_text);
    }
    if (input.tags_json !== undefined) {
      updates.push('tags_json = ?');
      params.push(JSON.stringify(input.tags_json));
    }
    if (input.demo_url !== undefined) {
      updates.push('demo_url = ?');
      params.push(input.demo_url);
    }
    if (input.github_url !== undefined) {
      updates.push('github_url = ?');
      params.push(input.github_url);
    }
    if (input.website_url !== undefined) {
      updates.push('website_url = ?');
      params.push(input.website_url);
    }
    if (input.related_hackathon_id !== undefined) {
      updates.push('related_hackathon_id = ?');
      params.push(input.related_hackathon_id);
    }
    if (input.images !== undefined) {
      updates.push('images = ?');
      params.push(JSON.stringify(input.images));
    }
    if (input.is_awarded !== undefined) {
      updates.push('is_awarded = ?');
      params.push(input.is_awarded ? 1 : 0);
    }
    if (input.award_text !== undefined) {
      updates.push('award_text = ?');
      params.push(input.award_text);
    }
    if (input.hidden !== undefined) {
      updates.push('hidden = ?');
      params.push(input.hidden ? 1 : 0);
    }
    if (input.status !== undefined) {
      updates.push('status = ?');
      params.push(input.status);
    }

    if (updates.length > 0) {
      updates.push('updated_at = datetime(\'now\')');
      params.push(id);

      const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
      const stmt = this.db.prepare(query);
      stmt.run(...params);
    }

    return this.findById(id);
  }

  /**
   * Get projects by author ID
   */
  findByAuthorId(authorId: string): Project[] {
    const stmt = this.db.prepare('SELECT * FROM projects WHERE author_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(authorId);
    return rows.map((row: any) => this.mapRow(row));
  }
}
