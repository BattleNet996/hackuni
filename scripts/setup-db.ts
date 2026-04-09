import { initDatabase, resetAndInitDatabase } from '../src/lib/db/init';
import { seedDatabase } from '../src/lib/db/seed';
import { closeDb } from '../src/lib/db/client';

async function setup() {
  const args = process.argv.slice(2);
  const reset = args.includes('--reset');
  const seed = args.includes('--seed');

  try {
    console.log('🔧 Setting up HackUni database...\n');

    if (reset) {
      console.log('⚠️  WARNING: Resetting database (all data will be lost!)');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Give user time to cancel
      resetAndInitDatabase();
    } else {
      initDatabase();
    }

    // Seed with mock data ONLY if explicitly requested
    if (seed) {
      console.log('\n📝 Seeding database with mock data...');
      seedDatabase();
      console.log('✅ Mock data seeded!');
    } else {
      console.log('\n💡 Tip: Use --seed flag to populate with sample data for development');
      console.log('   Example: npm run setup-db -- --seed');
    }

    console.log('\n✅ Database setup complete!');
    console.log('📊 Database location: ./database/hackuni.db');

    closeDb();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    closeDb();
    process.exit(1);
  }
}

setup();
