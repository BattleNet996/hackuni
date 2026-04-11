import Database from 'better-sqlite3';
import { BaseDAO } from './base';
import { Comment, CommentCreateInput, mapRowToComment } from '@/lib/models/comment';

export class CommentDAO extends BaseDAO<Comment> {
  protected tableName = 'comments';

  private findByProjectStmt!: Database.Statement;
  private findByStoryStmt!: Database.Statement;
  private getRepliesStmt!: Database.Statement;

  constructor(db: Database.Database) {
    super(db);
    this.prepareStatements();
  }

  private prepareStatements(): void {
    this.findByProjectStmt = this.db.prepare(`
      SELECT * FROM comments
      WHERE project_id = ? AND parent_comment_id IS NULL
      ORDER BY created_at DESC
    `);

    this.findByStoryStmt = this.db.prepare(`
      SELECT * FROM comments
      WHERE story_id = ? AND parent_comment_id IS NULL
      ORDER BY created_at DESC
    `);

    this.getRepliesStmt = this.db.prepare(`
      SELECT * FROM comments
      WHERE parent_comment_id = ?
      ORDER BY created_at ASC
    `);
  }

  protected mapRow(row: any): Comment {
    return mapRowToComment(row);
  }

  /**
   * Get comments for a project
   */
  getProjectComments(projectId: string): Comment[] {
    const rows = this.findByProjectStmt.all(projectId);
    return rows.map(row => this.mapRow(row));
  }

  /**
   * Get comments for a story
   */
  getStoryComments(storyId: string): Comment[] {
    const rows = this.findByStoryStmt.all(storyId);
    return rows.map(row => this.mapRow(row));
  }

  /**
   * Get replies to a comment
   */
  getReplies(parentCommentId: string): Comment[] {
    const rows = this.getRepliesStmt.all(parentCommentId);
    return rows.map(row => this.mapRow(row));
  }

  /**
   * Create new comment
   */
  create(input: CommentCreateInput, authorId: string, authorName: string): Comment {
    const id = `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const stmt = this.db.prepare(`
      INSERT INTO comments (
        id, project_id, story_id, author_id, author_name,
        content, parent_comment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.project_id || null,
      input.story_id || null,
      authorId,
      authorName,
      input.content,
      input.parent_comment_id || null
    );

    return this.findById(id)!;
  }

  /**
   * Increment comment likes
   */
  incrementLikes(commentId: string): void {
    const stmt = this.db.prepare(`
      UPDATE comments
      SET likes = likes + 1
      WHERE id = ?
    `);
    stmt.run(commentId);
  }

  /**
   * Decrement comment likes
   */
  decrementLikes(commentId: string): void {
    const stmt = this.db.prepare(`
      UPDATE comments
      SET likes = MAX(0, likes - 1)
      WHERE id = ?
    `);
    stmt.run(commentId);
  }
}
