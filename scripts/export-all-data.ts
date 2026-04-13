#!/usr/bin/env tsx

/**
 * Export all SQLite data to Supabase-compatible SQL
 * 导出所有 SQLite 数据为 Supabase 兼容的 SQL 文件
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const sqliteDb = new Database('database/hackuni.db');
const outputDir = 'supabase/migration';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🔄 Exporting SQLite data to Supabase-compatible SQL...\n');

// SQL value escaping for PostgreSQL
function escapePostgresString(str: any): string {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return str.toString();
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';

  // Escape single quotes by doubling them
  let escaped = str.toString().replace(/'/g, "''");
  return `'${escaped}'`;
}

// Convert SQLite boolean/integer to PostgreSQL format
function convertBoolean(value: any): string {
  if (value === null || value === undefined) return 'NULL';
  if (value === 1 || value === true) return 'TRUE';
  if (value === 0 || value === false) return 'FALSE';
  return 'NULL';
}

function escapeJson(jsonStr: string | null): string {
  if (!jsonStr) return 'NULL';
  // Escape single quotes in JSON
  let escaped = jsonStr.toString().replace(/'/g, "''");
  return `'${escaped}'::jsonb`;
}

function escapeArray(jsonStr: string | null): string {
  if (!jsonStr) return 'NULL';
  // Try to parse as JSON array and format as PostgreSQL array
  try {
    const arr = JSON.parse(jsonStr);
    if (Array.isArray(arr)) {
      const elements = arr.map((e: any) => escapePostgresString(e));
      return `ARRAY[${elements.join(', ')}]`;
    }
  } catch (e) {
    // If not valid JSON, just escape as string
  }
  let escaped = jsonStr.toString().replace(/'/g, "''");
  return `'${escaped}'`;
}

// Export table data
function exportTable(tableName: string, columns: string[]) {
  console.log(`📋 Exporting ${tableName}...`);

  try {
    const query = `SELECT ${columns.join(', ')} FROM ${tableName}`;
    const rows = sqliteDb.prepare(query).all() as any[];

    if (rows.length === 0) {
      console.log(`   ⚠️  No data found\n`);
      return null;
    }

    console.log(`   Found ${rows.length} records`);

    const sqlLines: string[] = [];

    // Clear existing data
    sqlLines.push(`-- Clear existing data`);
    sqlLines.push(`DELETE FROM ${tableName};`);
    sqlLines.push(``);

    // Reset sequences if there are serial columns
    sqlLines.push(`-- Reset sequences`);
    sqlLines.push(`SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), coalesce(max(id), 0) + 1, false) FROM ${tableName};`);
    sqlLines.push(``);

    // Insert data
    sqlLines.push(`-- Insert data`);
    sqlLines.push(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES`);

    const valueLines = rows.map((row, index) => {
      const values = columns.map(col => {
        const value = row[col];

        // Handle different column types
        if (col.endsWith('_json') || col === 'images' || col === 'looking_for' || col === 'details') {
          return escapeJson(value);
        }

        if (col === 'is_banned' || col === 'hidden' || col === 'is_active' || col === 'is_awarded') {
          return convertBoolean(value);
        }

        if (col.includes('count') || col === 'like_count' || col === 'likes' ||
            col === 'rank_score' || col === 'latitude' || col === 'longitude') {
          return value === null ? 'NULL' : value.toString();
        }

        // Handle datetime fields
        if (col.includes('_at') || col.includes('_time') || col.includes('_date')) {
          return escapePostgresString(value);
        }

        // Default: escape as string
        return escapePostgresString(value);
      });

      return `  (${values.join(', ')})${index === rows.length - 1 ? ';' : ','}`;
    });

    sqlLines.push(...valueLines);
    sqlLines.push(``);

    return sqlLines.join('\n');
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}\n`);
    return null;
  }
}

// Export all tables
const tables = [
  { name: 'users', columns: ['id', 'email', 'password_hash', 'display_name', 'avatar', 'bio',
              'school', 'major', 'company', 'position', 'phone', 'twitter_url',
              'github_url', 'website_url', 'looking_for', 'total_hackathon_count',
              'total_work_count', 'total_award_count', 'badge_count',
              'certification_count', 'created_at', 'updated_at', 'is_banned'] },
  { name: 'hackathons', columns: ['id', 'title', 'short_desc', 'description', 'start_time', 'end_time',
              'registration_deadline', 'city', 'country', 'latitude', 'longitude',
              'location_detail', 'tags_json', 'level_score', 'level_code',
              'registration_status', 'poster_url', 'organizer', 'organizer_url',
              'registration_url', 'requirements', 'prizes', 'fee', 'hidden',
              'created_at', 'updated_at'] },
  { name: 'projects', columns: ['id', 'title', 'short_desc', 'long_desc', 'like_count', 'rank_score',
              'team_member_text', 'tags_json', 'is_awarded', 'award_text', 'images',
              'demo_url', 'github_url', 'website_url', 'related_hackathon_id',
              'author_id', 'status', 'hidden', 'created_at', 'updated_at'] },
  { name: 'stories', columns: ['id', 'slug', 'title', 'summary', 'source', 'source_url',
              'author_name', 'content', 'tags_json', 'published_at', 'like_count',
              'status', 'hidden', 'created_at', 'updated_at'] },
  { name: 'comments', columns: ['id', 'project_id', 'story_id', 'author_id', 'author_name',
              'content', 'created_at', 'updated_at', 'parent_comment_id', 'likes'] },
  { name: 'likes', columns: ['id', 'user_id', 'target_type', 'target_id', 'created_at'] },
  { name: 'badges', columns: ['id', 'badge_code', 'badge_name', 'badge_name_en', 'badge_type',
              'badge_desc', 'badge_desc_en', 'icon_url', 'rule_desc', 'rule_desc_en',
              'source_type', 'created_at'] },
  { name: 'user_badges', columns: ['id', 'user_id', 'badge_id', 'status', 'earned_at',
              'verified_at', 'created_at'] },
  { name: 'sessions', columns: ['id', 'user_id', 'token', 'expires_at', 'created_at'] },
  { name: 'admin_users', columns: ['id', 'username', 'password_hash', 'email', 'is_active',
              'last_login_at', 'created_at', 'updated_at'] },
  { name: 'admin_sessions', columns: ['id', 'admin_user_id', 'token', 'expires_at', 'created_at'] },
  { name: 'admin_logs', columns: ['id', 'admin_user_id', 'admin_username', 'action', 'entity_type',
              'entity_id', 'entity_name', 'details', 'ip_address', 'user_agent',
              'created_at'] }
];

console.log('📊 Export Summary:');
console.log('═══════════════════════════════════════════════\n');

const allSqlLines: string[] = [];

// Add header
allSqlLines.push(`-- HackUni Web - Complete Data Migration`);
allSqlLines.push(`-- Generated: ${new Date().toISOString()}`);
allSqlLines.push(`-- Source: SQLite database/hackuni.db`);
allSqlLines.push(`-- Target: Supabase PostgreSQL`);
allSqlLines.push(``);
allSqlLines.push(`BEGIN;`);
allSqlLines.push(``);

// Export each table
for (const table of tables) {
  const sql = exportTable(table.name, table.columns);
  if (sql) {
    allSqlLines.push(`-- ========================================`);
    allSqlLines.push(`-- Table: ${table.name}`);
    allSqlLines.push(`-- ========================================`);
    allSqlLines.push(sql);
  }
}

// Add footer
allSqlLines.push(`COMMIT;`);
allSqlLines.push(``);

// Write to file
const outputFile = path.join(outputDir, 'all_data_migration.sql');
fs.writeFileSync(outputFile, allSqlLines.join('\n'));

console.log('═══════════════════════════════════════════════');
console.log(`\n✅ Migration SQL file created: ${outputFile}`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Open Supabase SQL Editor: https://app.supabase.com`);
console.log(`   2. Select your project`);
console.log(`   3. Click "SQL Editor" in the left menu`);
console.log(`   4. Copy and paste the contents of ${outputFile}`);
console.log(`   5. Click "Run" to execute the migration`);
console.log(`\n💡 Tip: You can open the file with: cat ${outputFile} | pbcopy`);

sqliteDb.close();
