/**
 * Migration Script: SQLite → Supabase
 *
 * This script exports data from SQLite and imports it to Supabase
 * Usage: npm run migrate:supabase
 */

import Database from 'better-sqlite3';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
  global: {
    headers: {
      'Connection': 'keep-alive'
    }
  }
});
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'database', 'hackuni.db');
const db = new Database(dbPath);

// Table migration order (respecting foreign keys)
const TABLES = [
  'users',
  'badges',
  'hackathons',
  'stories',
  'projects',
  'user_badges',
  'likes',
  'comments',
  'sessions',
  'admin_users',
  'admin_sessions',
  'admin_logs'
];

/**
 * Validate and convert date string to PostgreSQL format
 * Returns null for invalid dates
 */
function convertDate(dateStr: any): string | null {
  if (!dateStr || dateStr === '') return null;

  // If already in ISO format, return as is
  if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return dateStr;
  }

  // Try to extract date from strings like "2026-06-06前完成注册阶段"
  if (typeof dateStr === 'string') {
    // Extract date pattern (YYYY-MM-DD)
    const dateMatch = dateStr.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      return dateMatch[1] + 'T00:00:00Z';
    }
  }

  // Invalid date, return null
  console.warn(`⚠️  Invalid date format, converting to null: ${dateStr}`);
  return null;
}

/**
 * Convert SQLite row to PostgreSQL format
 */
function convertRow(tableName: string, row: any): any {
  const converted = { ...row };

  // Convert JSON strings to JSONB for specific columns
  const jsonColumns = {
    users: ['looking_for'],
    hackathons: ['tags_json'],
    projects: ['tags_json', 'images'],
    stories: ['tags_json'],
    admin_logs: ['details']
  };

  const columnsToJson = jsonColumns[tableName as keyof typeof jsonColumns] || [];
  columnsToJson.forEach(col => {
    if (converted[col] && typeof converted[col] === 'string') {
      try {
        converted[col] = JSON.parse(converted[col]);
      } catch (e) {
        console.warn(`⚠️  Failed to parse JSON for ${tableName}.${col}:`, converted[col]);
      }
    }
  });

  // Convert date columns for tables that have timestamps
  const dateColumns = {
    hackathons: ['start_time', 'end_time', 'registration_deadline'],
    projects: ['created_at', 'updated_at'],
    stories: ['published_at', 'created_at', 'updated_at'],
    user_badges: ['earned_at', 'verified_at', 'created_at'],
    admin_users: ['last_login_at', 'created_at', 'updated_at'],
    admin_sessions: ['expires_at', 'created_at'],
    admin_logs: ['created_at']
  };

  const columnsToDate = dateColumns[tableName as keyof typeof dateColumns] || [];
  columnsToDate.forEach(col => {
    if (converted[col] !== null && converted[col] !== undefined) {
      converted[col] = convertDate(converted[col]);
    }
  });

  // NOTE: Don't convert integer booleans (is_banned, is_active, etc.)
  // PostgreSQL schema uses INTEGER, not BOOLEAN, so keep as 0/1

  return converted;
}

/**
 * Insert batch with retry logic - use upsert to handle duplicates
 */
async function insertBatch(tableName: string, batch: any[], retries = 5): Promise<void> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Use upsert instead of insert to handle existing data
      const { error } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      return;
    } catch (error: any) {
      if (attempt === retries - 1) {
        throw error;
      }

      // Wait before retry with exponential backoff
      const waitTime = 2000 * Math.pow(1.5, attempt);
      console.log(`   ⏳ Retry ${attempt + 1}/${retries} after ${Math.round(waitTime)}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * Migrate a single table
 */
async function migrateTable(tableName: string): Promise<void> {
  console.log(`\n📦 Migrating ${tableName}...`);

  try {
    // Check if table exists in SQLite
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name=?
    `).get(tableName);

    if (!tableExists) {
      console.log(`   ⏭️  Skipping (table doesn't exist in SQLite)`);
      return;
    }

    // Get all rows from SQLite
    const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
    console.log(`   Found ${rows.length} rows in SQLite`);

    if (rows.length === 0) {
      console.log(`   ⏭️  Skipping (no data)`);
      return;
    }

    // Convert and insert into Supabase
    const convertedRows = rows.map(row => convertRow(tableName, row));

    // Insert in very small batches (10) and add delay between batches
    const batchSize = 10;
    for (let i = 0; i < convertedRows.length; i += batchSize) {
      const batch = convertedRows.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(convertedRows.length / batchSize);

      process.stdout.write(`   Processing batch ${batchNum}/${totalBatches} (${i}-${i + batch.length})...`);

      await insertBatch(tableName, batch);

      console.log(` ✅`);

      // Add small delay between batches to avoid overwhelming the server
      if (i + batchSize < convertedRows.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`   ✅ Successfully migrated ${tableName} (${rows.length} rows)`);

  } catch (error: any) {
    console.error(`   ❌ Failed to migrate ${tableName}:`, error.message);

    // Provide helpful error message
    if (error.message.includes('column') || error.message.includes('schema cache')) {
      console.log(`\n💡 Schema issue detected. Please run in Supabase SQL Editor:`);
      console.log(`   https://supabase.com/dashboard/project/hapvchvxnkgomfptlcwn/sql`);
      console.log(`   \n   Check that all columns exist in the ${tableName} table.`);
    }

    throw error;
  }
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log('🚀 Starting migration from SQLite to Supabase...');
  console.log(`📂 SQLite database: ${dbPath}`);
  console.log(`🌐 Supabase URL: ${supabaseUrl}`);

  // Test Supabase connection
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Connected to Supabase');
  } catch (error: any) {
    console.error('❌ Cannot connect to Supabase:', error.message);
    process.exit(1);
  }

  // Migrate each table
  for (const table of TABLES) {
    await migrateTable(table);
  }

  console.log('\n🎉 Migration completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Verify data in Supabase dashboard');
  console.log('   2. Update .env.local to set USE_SUPABASE=true');
  console.log('   3. Restart your development server');
}

// Run migration
migrate().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
}).finally(() => {
  db.close();
});
