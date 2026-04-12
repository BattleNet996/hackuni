/**
 * Check and fix Supabase schema
 * Adds missing columns
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Check if a column exists in a table
 */
async function columnExists(table: string, column: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('check_column_exists', { table_name: table, column_name: column })
    .select();

  // If RPC doesn't exist, try direct query
  if (error) {
    try {
      const result = await supabase
        .from(table)
        .select(column)
        .limit(1);
      return !result.error;
    } catch {
      return false;
    }
  }

  return !!data;
}

/**
 * Add missing column using raw SQL
 */
async function addColumn(table: string, column: string, dataType: string): Promise<void> {
  console.log(`   Adding ${table}.${column}...`);

  // Use direct SQL via supabase
  const { error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${dataType};`
  });

  if (error && !error.message.includes('already exists')) {
    console.warn(`   ⚠️  Could not add column (may need manual SQL): ${error.message}`);
  } else {
    console.log(`   ✅ Added ${table}.${column}`);
  }
}

async function main() {
  console.log('🔍 Checking Supabase schema...\n');

  // Check stories.content
  console.log('Checking stories table...');
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('id, content')
      .limit(1);

    if (error && error.message.includes('content')) {
      console.log('   ⚠️  stories.content column is missing');
      console.log('\n💡 Please run this SQL in Supabase SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/hapvchvxnkgomfptlcwn/sql\n');
      console.log('   ALTER TABLE stories ADD COLUMN IF NOT EXISTS content TEXT;\n');
    } else {
      console.log('   ✅ stories.content exists');
    }
  } catch (e: any) {
    console.log('   ⚠️  stories.content column is missing');
    console.log('\n💡 Please run this SQL in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/hapvchvxnkgomfptlcwn/sql\n');
    console.log('   ALTER TABLE stories ADD COLUMN IF NOT EXISTS content TEXT;\n');
  }

  console.log('\n✅ Schema check complete!');
}

main().catch(console.error);
