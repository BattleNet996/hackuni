import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserDAO } from '../dao/users';

export interface AuthTokens {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export class AuthService {
  private userDAO: UserDAO;

  constructor(db: Database.Database) {
    this.userDAO = new UserDAO(db);
  }

  /**
   * Register new user
   */
  async register(email: string, password: string, displayName?: string): Promise<AuthTokens> {
    // Check if user exists
    const existing = this.userDAO.findByEmail(email);
    if (existing) {
      throw new Error('EMAIL_EXISTS');
    }

    // Validate email
    if (!this.isValidEmail(email)) {
      throw new Error('INVALID_EMAIL');
    }

    // Validate password
    if (password.length < 8) {
      throw new Error('PASSWORD_TOO_SHORT');
    }

    // Create user
    const user = await this.userDAO.create({
      email,
      password,
      display_name: displayName
    });

    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthTokens> {
    const user = this.userDAO.findByEmail(email);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.password_hash) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  /**
   * Verify token and get user
   */
  verifyToken(token: string): Omit<User, 'password_hash'> | null {
    const db = this.userDAO['db']; // Access private property
    const stmt = db.prepare(`
      SELECT u.*, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `);

    const result = stmt.get(token) as any;

    if (!result) {
      return null;
    }

    return this.sanitizeUser(result);
  }

  /**
   * Logout user (invalidate token)
   */
  logout(token: string): void {
    const db = this.userDAO['db'];
    const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
    stmt.run(token);
  }

  /**
   * Generate authentication token
   */
  private generateToken(userId: string): string {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const db = this.userDAO['db'];
    const sessionId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const stmt = db.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(sessionId, userId, token, expiresAt.toISOString());

    return token;
  }

  /**
   * Remove password hash from user object
   */
  private sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// Import User type for type safety
import { User } from '../models/user';
