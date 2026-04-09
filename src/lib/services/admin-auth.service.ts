import Database from 'better-sqlite3';
import crypto from 'crypto';

export interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
}

export interface AdminSession {
  id: string;
  admin_user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export class AdminAuthService {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  /**
   * Hash password using SHA-256
   */
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  /**
   * Generate secure random token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Authenticate admin user with username and password
   */
  login(username: string, password: string): { adminUser: AdminUser; token: string } | null {
    const passwordHash = this.hashPassword(password);

    const stmt = this.db.prepare(`
      SELECT id, username, email, is_active, last_login_at, created_at
      FROM admin_users
      WHERE username = ? AND password_hash = ? AND is_active = 1
    `);

    const adminUser = stmt.get(username, passwordHash) as AdminUser | undefined;

    if (!adminUser) {
      return null;
    }

    // Create session
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const sessionStmt = this.db.prepare(`
      INSERT INTO admin_sessions (id, admin_user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `);

    const sessionId = `admin_session_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    sessionStmt.run(sessionId, adminUser.id, token, expiresAt);

    // Update last_login_at
    const updateStmt = this.db.prepare(`
      UPDATE admin_users
      SET last_login_at = ?
      WHERE id = ?
    `);
    updateStmt.run(new Date().toISOString(), adminUser.id);

    return { adminUser, token };
  }

  /**
   * Verify admin token and return admin user
   */
  verifyToken(token: string): AdminUser | null {
    const stmt = this.db.prepare(`
      SELECT admin_sessions.expires_at, admin_users.*
      FROM admin_sessions
      INNER JOIN admin_users ON admin_sessions.admin_user_id = admin_users.id
      WHERE admin_sessions.token = ? AND admin_users.is_active = 1
    `);

    const result = stmt.get(token) as (AdminSession & AdminUser) | undefined;

    if (!result) {
      return null;
    }

    // Check if token is expired
    if (new Date(result.expires_at) < new Date()) {
      // Delete expired session
      this.deleteSession(token);
      return null;
    }

    // Return admin user without session fields
    const { expires_at, admin_user_id, created_at, ...adminUser } = result;
    return adminUser as AdminUser;
  }

  /**
   * Logout admin user by deleting session
   */
  logout(token: string): boolean {
    const stmt = this.db.prepare('DELETE FROM admin_sessions WHERE token = ?');
    const result = stmt.run(token);
    return result.changes > 0;
  }

  /**
   * Delete session by token
   */
  private deleteSession(token: string): void {
    const stmt = this.db.prepare('DELETE FROM admin_sessions WHERE token = ?');
    stmt.run(token);
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions(): void {
    const stmt = this.db.prepare('DELETE FROM admin_sessions WHERE expires_at < ?');
    stmt.run(new Date().toISOString());
  }

  /**
   * Create initial admin user if not exists
   */
  createInitialAdminUser(): void {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM admin_users');
    const result = stmt.get() as { count: number };

    if (result.count === 0) {
      const adminId = `admin_${Date.now()}`;
      const passwordHash = this.hashPassword('cwj123'); // Default password

      const insertStmt = this.db.prepare(`
        INSERT INTO admin_users (id, username, password_hash, email)
        VALUES (?, ?, ?, ?)
      `);

      insertStmt.run(adminId, 'wjj', passwordHash, 'admin@hackuni.com');
      console.log('Initial admin user created: wjj / cwj123');
    }
  }
}
