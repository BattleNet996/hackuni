import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database', 'hackuni.db');
const db = new Database(dbPath);

console.log('🔄 Running database migration: Adding status and hidden fields...\n');

try {
  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  // Check if columns already exist
  const projectsInfo = db.pragma('table_info(projects)') as any[];
  const projectsColumns = projectsInfo.map((col: any) => col.name);

  const storiesInfo = db.pragma('table_info(stories)') as any[];
  const storiesColumns = storiesInfo.map((col: any) => col.name);

  const hackathonsInfo = db.pragma('table_info(hackathons)') as any[];
  const hackathonsColumns = hackathonsInfo.map((col: any) => col.name);

  // Add status and hidden to projects table
  if (!projectsColumns.includes('status')) {
    db.exec('ALTER TABLE projects ADD COLUMN status TEXT DEFAULT \'published\'');
    console.log('✅ Added status column to projects table');
  } else {
    console.log('ℹ️  Status column already exists in projects table');
  }

  if (!projectsColumns.includes('hidden')) {
    db.exec('ALTER TABLE projects ADD COLUMN hidden INTEGER DEFAULT 0');
    console.log('✅ Added hidden column to projects table');
  } else {
    console.log('ℹ️  Hidden column already exists in projects table');
  }

  // Add status and hidden to stories table
  if (!storiesColumns.includes('status')) {
    db.exec('ALTER TABLE stories ADD COLUMN status TEXT DEFAULT \'published\'');
    console.log('✅ Added status column to stories table');
  } else {
    console.log('ℹ️  Status column already exists in stories table');
  }

  if (!storiesColumns.includes('hidden')) {
    db.exec('ALTER TABLE stories ADD COLUMN hidden INTEGER DEFAULT 0');
    console.log('✅ Added hidden column to stories table');
  } else {
    console.log('ℹ️  Hidden column already exists in stories table');
  }

  // Add hidden to hackathons table
  if (!hackathonsColumns.includes('hidden')) {
    db.exec('ALTER TABLE hackathons ADD COLUMN hidden INTEGER DEFAULT 0');
    console.log('✅ Added hidden column to hackathons table');
  } else {
    console.log('ℹ️  Hidden column already exists in hackathons table');
  }

  // Verify the changes
  console.log('\n📊 Verification:');

  const finalProjectsColumns = (db.pragma('table_info(projects)') as any[]).map((col: any) => col.name);
  console.log(`  Projects columns: ${finalProjectsColumns.join(', ')}`);

  const finalStoriesColumns = (db.pragma('table_info(stories)') as any[]).map((col: any) => col.name);
  console.log(`  Stories columns: ${finalStoriesColumns.join(', ')}`);

  const finalHackathonsColumns = (db.pragma('table_info(hackathons)') as any[]).map((col: any) => col.name);
  console.log(`  Hackathons columns: ${finalHackathonsColumns.join(', ')}`);

  console.log('\n✨ Migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}
