import { getDb, initializeSchema, resetDatabase } from './client';

/**
 * Initialize database with schema
 */
export function initDatabase(): void {
  try {
    console.log('Initializing database...');
    initializeSchema();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Reset database (WARNING: Deletes all data)
 */
export function resetAndInitDatabase(): void {
  try {
    console.log('Resetting database...');
    resetDatabase();
    initializeSchema();
    console.log('Database reset and initialized successfully');
  } catch (error) {
    console.error('Failed to reset database:', error);
    throw error;
  }
}
