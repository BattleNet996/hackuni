/**
 * Clear all data from Supabase tables
 * Usage: npm run clear:supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' }
});

// Tables in reverse order of dependencies (to avoid foreign key violations)
const TABLES = [
  'admin_logs',
  'admin_sessions',
  'admin_users',
  'sessions',
  'comments',
  'likes',
  'user_badges',
  'badges',
  'stories',
  'projects',
  'hackathons',
  'users'
];

/**
 * Clear table with retry logic
 */
async function clearTable(tableName: string, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      // Use RPC to call a SQL function that truncates the table
      const { error } = await supabase
        .from(tableName)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (error) {
        // If table is already empty, that's fine
        if (error.code === 'PGRST116') {
          console.log(`   ⏭️  ${tableName} is already empty`);
          return;
        }
        throw error;
      }

      console.log(`   ✅ Cleared ${tableName}`);
      return;
    } catch (error: any) {
      console.error(`   ❌ Attempt ${i + 1} failed for ${tableName}:`, error.message);

      if (i === retries - 1) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function clearAllTables(): Promise<void> {
  console.log('🗑️  Clearing all Supabase tables...\n');
  console.log('ℹ️  If this fails, use SQL Editor instead:');
  console.log('   https://supabase.com/dashboard/project/hapvchvxnkgomfptlcwn/sql\n');

  for (const table of TABLES) {
    process.stdout.write(`   clearing ${table}...`);
    try {
      await clearTable(table);
    } catch (error: any) {
      console.error(`\n   ❌ Failed to clear ${table}:`, error.message);
      console.log('\n💡 Please use SQL Editor to clear tables manually:');
      console.log(`
TRUNCATE TABLE admin_logs CASCADE;
TRUNCATE TABLE admin_sessions CASCADE;
TRUNCATE TABLE admin_users CASCADE;
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE likes CASCADE;
TRUNCATE TABLE user_badges CASCADE;
TRUNCATE TABLE badges CASCADE;
TRUNCATE TABLE stories CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE hackathons CASCADE;
TRUNCATE TABLE users CASCADE;
      `);
      process.exit(1);
    }
  }

  console.log('\n✅ All tables cleared successfully!');
}

// Run
clearAllTables().catch(error => {
  console.error('\n❌ Failed to clear tables:', error);
  process.exit(1);
});
