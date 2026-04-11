import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { adminAuthService } from '@/lib/services';

/**
 * Initialize admin system
 * POST /api/admin/init
 * This endpoint creates the admin tables and initial admin user
 * Should be called once during setup
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDb();

    // Create admin tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT,
        is_active INTEGER DEFAULT 1,
        last_login_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        admin_user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
    `);

    // Add is_banned column to users table if not exists
    try {
      db.exec(`ALTER TABLE users ADD COLUMN is_banned INTEGER DEFAULT 0;`);
    } catch (error: any) {
      if (!error.message.includes('duplicate column')) {
        throw error;
      }
    }

    // Create initial admin user
    await adminAuthService.createInitialAdminUser();

    return NextResponse.json({
      data: {
        success: true,
        message: 'Admin system initialized successfully',
        credentials: {
          username: 'wjj',
          password: 'cwj123'
        }
      }
    });
  } catch (error: any) {
    console.error('Init admin system error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

/**
 * Check if admin system is initialized
 * GET /api/admin/init
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const stmt = db.prepare('SELECT COUNT(*) as count FROM admin_users');
    const result = stmt.get() as { count: number };

    return NextResponse.json({
      data: {
        initialized: result.count > 0,
        adminCount: result.count
      }
    });
  } catch (error: any) {
    console.error('Check init status error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
