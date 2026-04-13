/**
 * Test Supabase Connection
 * Verifies that Supabase is properly configured and accessible
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Connection...\n');

// Check environment variables
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
  process.exit(1);
}

console.log('✅ Environment variables found:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('📡 Testing connection to Supabase...\n');

    // Test 1: Check if we can query the database
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (tablesError) {
      if (tablesError.code === '42P01') {
        console.error('❌ Database tables do not exist yet!');
        console.error('   Please run the schema.sql in Supabase SQL Editor:\n');
        console.error('   1. Go to: https://zflybdodxmtotkpmyqse.supabase.co');
        console.error('   2. Click "SQL Editor"');
        console.error('   3. Run the SQL from: supabase/schema.sql\n');
        process.exit(1);
      }
      throw tablesError;
    }

    console.log('✅ Connection successful!\n');

    // Test 2: Check existing data
    console.log('📊 Checking database tables...\n');

    const tables_to_check = [
      { name: 'users', column: 'id' },
      { name: 'hackathons', column: 'id' },
      { name: 'projects', column: 'id' },
      { name: 'stories', column: 'id' }
    ];

    for (const table of tables_to_check) {
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`⚠️  ${table.name.padEnd(12)} - Error: ${error.message}`);
      } else {
        console.log(`✅ ${table.name.padEnd(12)} - ${count} records`);
      }
    }

    console.log('\n🎉 Supabase is ready! You can now deploy to Vercel.\n');

  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your Supabase URL is correct');
    console.error('2. Verify SERVICE_ROLE_KEY (not ANON_KEY)');
    console.error('3. Make sure your Supabase project is active\n');
    process.exit(1);
  }
}

testConnection();
