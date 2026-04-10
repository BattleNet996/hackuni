/**
 * Initialize Supabase Database
 *
 * This script creates the database schema in Supabase
 * Usage: npm run supabase:init
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
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

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Execute SQL script on Supabase
 * Note: Supabase doesn't support executing arbitrary SQL through the JS client
 * You need to run this SQL manually in the Supabase SQL Editor
 */
async function initializeSchema(): Promise<void> {
  console.log('🚀 Initializing Supabase database schema...\n');

  const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log('📋 Schema loaded from:', schemaPath);
  console.log('\n⚠️  Supabase does not support executing SQL through the JavaScript client.');
  console.log('\n📝 Please follow these steps:');
  console.log('\n   1. Go to your Supabase dashboard:');
  console.log(`      ${supabaseUrl.replace('.supabase.co', '.supabase.co')}/project/_/sql`);
  console.log('\n   2. Open the SQL Editor');
  console.log('\n   3. Copy and paste the SQL from:');
  console.log(`      ${schemaPath}`);
  console.log('\n   4. Execute the SQL script');
  console.log('\n   5. Run the migration script to import data:');
  console.log('      npm run migrate:supabase');

  console.log('\n📄 SQL Schema:');
  console.log('━'.repeat(80));
  console.log(schema);
  console.log('━'.repeat(80));
}

/**
 * Test Supabase connection
 */
async function testConnection(): Promise<void> {
  try {
    // Test connection by checking if we can query the database
    const { error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('✅ Connected to Supabase (schema not yet created)');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Connected to Supabase (schema exists)');
    }
  } catch (error: any) {
    console.error('❌ Cannot connect to Supabase:', error.message);
    process.exit(1);
  }
}

// Main execution
(async () => {
  console.log('🔧 Supabase Initialization Script\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  await testConnection();
  await initializeSchema();
})();
