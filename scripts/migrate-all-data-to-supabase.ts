#!/usr/bin/env tsx

/**
 * SQLite to Supabase Migration Script
 * 将所有数据从 SQLite 迁移到 Supabase
 */

import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sqliteDb = new Database('database/hackuni.db');

// Check Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔄 Starting SQLite to Supabase migration...\n');

// Helper function to convert SQLite datetime to PostgreSQL timestamp
function convertDateTime(dateStr: string | null): string | null {
  if (!dateStr) return null;
  // SQLite returns datetime strings, PostgreSQL can parse them directly
  return dateStr;
}

// Helper function to handle JSON fields
function handleJsonField(jsonStr: string | null): string | null {
  return jsonStr;
}

// Migration table configurations
const tables = [
  {
    name: 'users',
    columns: ['id', 'email', 'password_hash', 'display_name', 'avatar', 'bio',
              'school', 'major', 'company', 'position', 'phone', 'twitter_url',
              'github_url', 'website_url', 'looking_for', 'total_hackathon_count',
              'total_work_count', 'total_award_count', 'badge_count',
              'certification_count', 'created_at', 'updated_at', 'is_banned']
  },
  {
    name: 'hackathons',
    columns: ['id', 'title', 'short_desc', 'description', 'start_time', 'end_time',
              'registration_deadline', 'city', 'country', 'latitude', 'longitude',
              'location_detail', 'tags_json', 'level_score', 'level_code',
              'registration_status', 'poster_url', 'organizer', 'organizer_url',
              'registration_url', 'requirements', 'prizes', 'fee', 'hidden',
              'created_at', 'updated_at']
  },
  {
    name: 'projects',
    columns: ['id', 'title', 'short_desc', 'long_desc', 'like_count', 'rank_score',
              'team_member_text', 'tags_json', 'is_awarded', 'award_text', 'images',
              'demo_url', 'github_url', 'website_url', 'related_hackathon_id',
              'author_id', 'status', 'hidden', 'created_at', 'updated_at']
  },
  {
    name: 'stories',
    columns: ['id', 'slug', 'title', 'summary', 'source', 'source_url',
              'author_name', 'content', 'tags_json', 'published_at', 'like_count',
              'status', 'hidden', 'created_at', 'updated_at']
  },
  {
    name: 'comments',
    columns: ['id', 'project_id', 'story_id', 'author_id', 'author_name',
              'content', 'created_at', 'updated_at', 'parent_comment_id', 'likes']
  },
  {
    name: 'likes',
    columns: ['id', 'user_id', 'target_type', 'target_id', 'created_at']
  },
  {
    name: 'badges',
    columns: ['id', 'badge_code', 'badge_name', 'badge_name_en', 'badge_type',
              'badge_desc', 'badge_desc_en', 'icon_url', 'rule_desc', 'rule_desc_en',
              'source_type', 'created_at']
  },
  {
    name: 'user_badges',
    columns: ['id', 'user_id', 'badge_id', 'status', 'earned_at',
              'verified_at', 'created_at']
  },
  {
    name: 'sessions',
    columns: ['id', 'user_id', 'token', 'expires_at', 'created_at']
  },
  {
    name: 'admin_users',
    columns: ['id', 'username', 'password_hash', 'email', 'is_active',
              'last_login_at', 'created_at', 'updated_at']
  },
  {
    name: 'admin_sessions',
    columns: ['id', 'admin_user_id', 'token', 'expires_at', 'created_at']
  },
  {
    name: 'admin_logs',
    columns: ['id', 'admin_user_id', 'admin_username', 'action', 'entity_type',
              'entity_id', 'entity_name', 'details', 'ip_address', 'user_agent',
              'created_at']
  }
];

async function migrateTable(tableName: string, columns: string[]) {
  console.log(`\n📋 Migrating ${tableName}...`);

  try {
    // Get data from SQLite
    const selectQuery = `SELECT ${columns.join(', ')} FROM ${tableName}`;
    const rows = sqliteDb.prepare(selectQuery).all() as any[];

    if (rows.length === 0) {
      console.log(`   ⚠️  No data found in ${tableName}, skipping`);
      return { success: true, count: 0 };
    }

    console.log(`   Found ${rows.length} records`);

    // Delete existing data in Supabase (to avoid conflicts)
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.log(`   ⚠️  Warning clearing ${tableName}:`, deleteError.message);
    }

    // Insert data in batches
    const batchSize = 100;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from(tableName)
        .insert(batch);

      if (error) {
        console.log(`   ❌ Batch ${i / batchSize + 1} failed:`, error.message);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
      }
    }

    console.log(`   ✅ Successfully migrated ${successCount} records`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed to migrate ${errorCount} records`);
    }

    return { success: errorCount === 0, count: successCount, errors: errorCount };
  } catch (error: any) {
    console.error(`   ❌ Error migrating ${tableName}:`, error.message);
    return { success: false, count: 0, errors: 0 };
  }
}

async function main() {
  console.log('📊 Migration Summary:');
  console.log('───────────────────────────────────────────────');

  const results: any = {};

  for (const table of tables) {
    const result = await migrateTable(table.name, table.columns);
    results[table.name] = result;
  }

  // Print summary
  console.log('\n\n📊 Migration Results:');
  console.log('═══════════════════════════════════════════════');

  let totalSuccess = 0;
  let totalErrors = 0;

  for (const table of tables) {
    const result = results[table.name];
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${table.name.padEnd(20)} ${result.count} records`);
    totalSuccess += result.count;
    totalErrors += result.errors || 0;
  }

  console.log('───────────────────────────────────────────────');
  console.log(`Total: ${totalSuccess} records migrated, ${totalErrors} failed`);

  // Verify data in Supabase
  console.log('\n🔍 Verifying data in Supabase...');
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table.name)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ ${table.name}: ${error.message}`);
    } else {
      console.log(`   ✅ ${table.name}: ${count || 0} records`);
    }
  }

  sqliteDb.close();

  if (totalErrors === 0) {
    console.log('\n🎉 Migration completed successfully!');
  } else {
    console.log('\n⚠️  Migration completed with some errors');
  }
}

main().catch(console.error);
