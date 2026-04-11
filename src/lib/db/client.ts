import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

/**
 * Get database client singleton
 * Ensures only one connection exists per process (optimal for SQLite)
 */
export function getDb(): Database.Database {
  if (!db) {
    try {
      const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'database', 'hackuni.db');
      db = new Database(dbPath);

      db.pragma('foreign_keys = ON');
      db.pragma('journal_mode = WAL');
      db.pragma('synchronous = NORMAL');
      db.pragma('cache_size = -64000');
      db.pragma('temp_store = MEMORY');
      db.pragma('mmap_size = 30000000000');

      try {
        initializeAdminTables(db);
      } catch (error: any) {
        // Ignore errors during build time (tables might not exist yet)
        console.warn('Admin tables initialization warning:', error.message);
      }
      console.log(`Database connected: ${dbPath}`);
    } catch (error: any) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }
  return db;
}

/**
 * Initialize admin tables if they don't exist
 */
function initializeAdminTables(database: Database.Database): void {
  database.exec(`
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
    CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      admin_user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
  `);

  // Create admin_logs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id TEXT PRIMARY KEY,
      admin_user_id TEXT NOT NULL,
      admin_username TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      entity_name TEXT,
      details TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
    CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
    CREATE INDEX IF NOT EXISTS idx_admin_logs_entity ON admin_logs(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
  `);

  // Add content column to stories table if not exists
  try {
    database.exec(`ALTER TABLE stories ADD COLUMN content TEXT;`);
  } catch (error: any) {
    if (!error.message.includes('duplicate column')) {
      console.error('Error adding content column to stories:', error);
    }
  }

  try {
    database.exec(`ALTER TABLE users ADD COLUMN is_banned INTEGER DEFAULT 0;`);
  } catch (error: any) {
    if (!error.message.includes('duplicate column')) {
      console.error('Error adding is_banned column:', error);
    }
  }

  const crypto = require('crypto');
  const stmt = database.prepare('SELECT COUNT(*) as count FROM admin_users');
  const result = stmt.get() as { count: number };

  if (result.count === 0) {
    const adminId = `admin_${Date.now()}`;
    const passwordHash = crypto.createHash('sha256').update('cwj123').digest('hex');
    const insertStmt = database.prepare(`
      INSERT INTO admin_users (id, username, password_hash, email)
      VALUES (?, ?, ?, ?)
    `);
    insertStmt.run(adminId, 'wjj', passwordHash, 'admin@hackuni.com');
    console.log('Default admin user created');
  }
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function resetDatabase(): void {
  const database = getDb();
  database.exec(`
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS likes;
    DROP TABLE IF EXISTS user_badges;
    DROP TABLE IF EXISTS badges;
    DROP TABLE IF EXISTS stories;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS hackathons;
    DROP TABLE IF EXISTS users;
  `);
  console.log('Database reset complete');
}

export function initializeSchema(): void {
  const database = getDb();
  const fs = require('fs');
  const schemaPath = path.join(__dirname, 'schema.sql');

  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    database.exec(schema);
    console.log('Database schema initialized');
  }
}
