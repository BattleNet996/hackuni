import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';

async function main() {
  const dbPath = path.join(process.cwd(), 'database', 'hackuni.db');
  const db = new Database(dbPath);

  console.log('🔄 Resetting test user passwords...\n');

  try {
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');

    const newPassword = 'password123';
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Reset alice@example.com password
    const aliceStmt = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?');
    const aliceResult = aliceStmt.run(passwordHash, 'alice@example.com');

    if (aliceResult.changes > 0) {
      console.log('✅ Reset password for alice@example.com');
      console.log(`   Email: alice@example.com`);
      console.log(`   Password: ${newPassword}`);
    } else {
      console.log('⚠️  User alice@example.com not found');
    }

    // Check how many users exist
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    console.log(`\n📊 Total users in database: ${userCount.count}`);

    // List all users
    const users = db.prepare('SELECT id, email, display_name FROM users').all();
    console.log('\n📋 All users:');
    users.forEach((user: any) => {
      console.log(`  - ${user.email} (${user.display_name || 'No display name'})`);
    });

    console.log('\n✨ Password reset completed!');
    console.log('\n🔑 You can now login with:');
    console.log('   Email: alice@example.com');
    console.log('   Password: password123');
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
