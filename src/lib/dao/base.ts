import Database from 'better-sqlite3';

export abstract class BaseDAO<T> {
  constructor(protected db: Database.Database) {}

  protected abstract tableName: string;
  protected abstract mapRow(row: any): T;

  /**
   * Find entity by ID
   */
  findById(id: string): T | null {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    const row = stmt.get(id);
    return row ? this.mapRow(row) : null;
  }

  /**
   * Find all entities with optional filters
   */
  findAll(filters?: Record<string, any>): T[] {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];

    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map(key => {
        params.push(filters[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params);
    return rows.map(row => this.mapRow(row));
  }

  /**
   * Count entities with optional filters
   */
  count(filters?: Record<string, any>): number {
    let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params: any[] = [];

    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map(key => {
        params.push(filters[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const stmt = this.db.prepare(query);
    const result = stmt.get(...params) as { count: number };
    return result.count;
  }

  /**
   * Check if entity exists
   */
  exists(id: string): boolean {
    const stmt = this.db.prepare(`SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`);
    const result = stmt.get(id);
    return !!result;
  }

  /**
   * Delete entity by ID
   */
  delete(id: string): boolean {
    const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
