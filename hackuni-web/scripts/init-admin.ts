/**
 * Initialize database with admin user
 * Run this script to set up the admin system
 */

import path from 'path';
import { getDb, initializeSchema } from '../src/lib/db/client';
import { AdminAuthService } from '../src/lib/services/admin-auth.service';

function initAdminSystem() {
  console.log('🚀 Initializing admin system...\n');

  try {
    const db = getDb();

    // Initialize schema
    console.log('📝 Initializing database schema...');
    initializeSchema();
    console.log('✅ Schema initialized\n');

    // Add is_banned column to users table if not exists
    console.log('📝 Adding is_banned column to users table...');
    try {
      db.exec(`
        ALTER TABLE users ADD COLUMN is_banned INTEGER DEFAULT 0;
      `);
      console.log('✅ is_banned column added\n');
    } catch (error: any) {
      if (error.message.includes('duplicate column')) {
        console.log('ℹ️  is_banned column already exists\n');
      } else {
        throw error;
      }
    }

    // Create initial admin user
    console.log('👤 Creating initial admin user...');
    const adminAuthService = new AdminAuthService(db);
    adminAuthService.createInitialAdminUser();
    console.log('✅ Admin user created\n');

    console.log('✨ Admin system initialized successfully!\n');
    console.log('📋 Default credentials:');
    console.log('   Username: wjj');
    console.log('   Password: cwj123');
    console.log('\n🔐 Please change the password after first login!\n');

  } catch (error: any) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initAdminSystem();
}

export { initAdminSystem };
