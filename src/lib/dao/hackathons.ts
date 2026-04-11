import Database from 'better-sqlite3';
import { BaseDAO } from './base';
import { Hackathon, mapRowToHackathon } from '@/lib/models/hackathon';

export class HackathonDAO extends BaseDAO<Hackathon> {
  protected tableName = 'hackathons';

  private findUpcomingStmt!: Database.Statement;
  private findByCityStmt!: Database.Statement;

  constructor(db: Database.Database) {
    super(db);
    this.prepareStatements();
  }

  private prepareStatements(): void {
    this.findUpcomingStmt = this.db.prepare(`
      SELECT * FROM hackathons
      WHERE start_time > datetime('now')
      ORDER BY start_time ASC
    `);
    this.findByCityStmt = this.db.prepare(`
      SELECT * FROM hackathons
      WHERE city = ?
      ORDER BY start_time ASC
    `);
  }

  protected mapRow(row: any): Hackathon {
    return mapRowToHackathon(row);
  }

  /**
   * Get upcoming hackathons
   */
  findUpcoming(): Hackathon[] {
    const rows = this.findUpcomingStmt.all();
    return rows.map(row => this.mapRow(row));
  }

  /**
   * Find hackathons by city
   */
  findByCity(city: string): Hackathon[] {
    const rows = this.findByCityStmt.all(city);
    return rows.map(row => this.mapRow(row));
  }

  /**
   * Get hackathons with pagination
   */
  getPaginated(page: number = 1, limit: number = 20): { data: Hackathon[]; total: number; page: number } {
    const offset = (page - 1) * limit;

    const dataStmt = this.db.prepare(`
      SELECT * FROM hackathons
      ORDER BY start_time DESC
      LIMIT ? OFFSET ?
    `);

    const countStmt = this.db.prepare('SELECT COUNT(*) as count FROM hackathons');

    const rows = dataStmt.all(limit, offset);
    const { count } = countStmt.get() as { count: number };

    return {
      data: rows.map(row => this.mapRow(row)),
      total: count,
      page
    };
  }
}
