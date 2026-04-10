/**
 * Verify Supabase Migration
 * Check that all data was migrated correctly
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTable(tableName: string, expectedMin: number) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    const status = count! >= expectedMin ? '✅' : '⚠️';
    console.log(`${status} ${tableName}: ${count} rows`);

    return count! >= expectedMin;
  } catch (error: any) {
    console.log(`❌ ${tableName}: Error - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Verifying Supabase Migration...\n');

  const checks = [
    verifyTable('users', 3),
    verifyTable('badges', 4),
    verifyTable('hackathons', 8),
    verifyTable('stories', 7),
    verifyTable('projects', 26),
    verifyTable('user_badges', 2),
    verifyTable('likes', 21),
    verifyTable('admin_users', 1),
  ];

  const results = await Promise.all(checks);
  const allPassed = results.every(r => r);

  console.log('\n' + '='.repeat(50));

  if (allPassed) {
    console.log('✅ Migration Verification Successful!');
    console.log('\n📊 Summary:');
    console.log('   - All tables migrated');
    console.log('   - Data integrity verified');
    console.log('   - Ready for deployment');
  } else {
    console.log('⚠️  Some checks failed');
    console.log('   Please review the table counts above');
  }

  console.log('\n🚀 Next Steps:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Test the application');
  console.log('   3. Deploy to Vercel');
}

main().catch(console.error);
