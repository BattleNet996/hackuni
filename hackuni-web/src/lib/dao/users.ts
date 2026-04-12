import Database from 'better-sqlite3';
import { BaseDAO } from './base';
import { User, UserCreateInput, UserUpdateInput, mapRowToUser } from '@/lib/models/user';
import bcrypt from 'bcrypt';

export class UserDAO extends BaseDAO<User> {
  protected tableName = 'users';

  private findByEmailStmt!: Database.Statement;
  private createStmt!: Database.Statement;
  private updateStmt!: Database.Statement;

  constructor(db: Database.Database) {
    super(db);
    this.prepareStatements();
  }

  private prepareStatements(): void {
    this.findByEmailStmt = this.db.prepare(
      'SELECT * FROM users WHERE email = ?'
    );
    this.createStmt = this.db.prepare(`
      INSERT INTO users (
        id, email, password_hash, display_name, bio, looking_for,
        total_hackathon_count, total_work_count, total_award_count,
        badge_count, certification_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    this.updateStmt = this.db.prepare(`
      UPDATE users
      SET display_name = COALESCE(?, display_name),
          bio = COALESCE(?, bio),
          avatar = COALESCE(?, avatar),
          school = COALESCE(?, school),
          major = COALESCE(?, major),
          company = COALESCE(?, company),
          position = COALESCE(?, position),
          phone = COALESCE(?, phone),
          twitter_url = COALESCE(?, twitter_url),
          github_url = COALESCE(?, github_url),
          website_url = COALESCE(?, website_url),
          looking_for = COALESCE(?, looking_for),
          updated_at = datetime('now')
      WHERE id = ?
    `);
  }

  protected mapRow(row: any): User {
    return mapRowToUser(row);
  }

  /**
   * Find user by email
   */
  findByEmail(email: string): User | null {
    const row = this.findByEmailStmt.get(email);
    return row ? this.mapRow(row) : null;
  }

  /**
   * Create new user
   */
  async createWithPassword(input: UserCreateInput): Promise<User> {
    const id = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = await bcrypt.hash(input.password, 10);
    const now = new Date().toISOString();

    this.createStmt.run(
      id,
      input.email,
      passwordHash,
      input.display_name || input.email.split('@')[0],
      '', // bio
      '[]', // looking_for
      0, // total_hackathon_count
      0, // total_work_count
      0, // total_award_count
      0, // badge_count
      0, // certification_count
      now, // created_at
      now  // updated_at
    );

    return this.findById(id)!;
  }

  /**
   * Update user profile
   */
  update(id: string, input: UserUpdateInput): User | null {
    const lookingForJson = input.looking_for ? JSON.stringify(input.looking_for) : null;

    this.updateStmt.run(
      input.display_name,
      input.bio,
      input.avatar,
      input.school,
      input.major,
      input.company,
      input.position,
      input.phone,
      input.twitter_url,
      input.github_url,
      input.website_url,
      lookingForJson,
      id
    );

    return this.findById(id);
  }

  /**
   * Verify user password
   */
  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const stmt = this.db.prepare('SELECT password_hash FROM users WHERE id = ?');
    const row = stmt.get(userId) as { password_hash: string } | undefined;

    if (!row) return false;

    return bcrypt.compare(password, row.password_hash);
  }

  /**
   * Update user statistics
   */
  updateStats(userId: string, stats: {
    total_hackathon_count?: number;
    total_work_count?: number;
    total_award_count?: number;
    badge_count?: number;
    certification_count?: number;
  }): void {
    const updates: string[] = [];
    const params: any[] = [];

    if (stats.total_hackathon_count !== undefined) {
      updates.push('total_hackathon_count = ?');
      params.push(stats.total_hackathon_count);
    }
    if (stats.total_work_count !== undefined) {
      updates.push('total_work_count = ?');
      params.push(stats.total_work_count);
    }
    if (stats.total_award_count !== undefined) {
      updates.push('total_award_count = ?');
      params.push(stats.total_award_count);
    }
    if (stats.badge_count !== undefined) {
      updates.push('badge_count = ?');
      params.push(stats.badge_count);
    }
    if (stats.certification_count !== undefined) {
      updates.push('certification_count = ?');
      params.push(stats.certification_count);
    }

    if (updates.length > 0) {
      updates.push('updated_at = datetime(\'now\')');
      params.push(userId);

      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      const stmt = this.db.prepare(query);
      stmt.run(...params);
    }
  }
}
