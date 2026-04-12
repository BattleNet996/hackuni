import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken as verifyJwtToken } from '../auth/jwt';
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

    // Generate JWT token (no database storage needed)
    const token = generateToken(user.id);

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

    // Generate JWT token (no database storage needed)
    const token = generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  /**
   * Verify token and get user using JWT
   */
  verifyToken(token: string): Omit<User, 'password_hash'> | null {
    // Verify JWT token
    const verified = verifyJwtToken(token);

    if (!verified) {
      return null;
    }

    // Get user from database
    const user = this.userDAO.findById(verified.userId);

    if (!user) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  /**
   * Logout user (invalidate token)
   * Note: JWT tokens cannot be invalidated, but this is handled by cookie expiration
   */
  logout(token: string): void {
    // For JWT, we just clear the cookie on the client side
    // The token will expire automatically after 30 days
    const db = this.userDAO['db'];
    const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
    stmt.run(token);
  }

  /**
   * Generate authentication token (deprecated, kept for compatibility)
   */
  private generateToken(userId: string): string {
    const token = require('crypto').randomBytes(32).toString('hex');
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
