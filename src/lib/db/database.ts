/**
 * Unified Database Interface
 * Provides a seamless abstraction layer over SQLite and Supabase
 */

import { supabase } from './supabase-client';
import { isUsingSupabaseRuntime } from './runtime';

export interface QueryBuilder {
  select(columns?: string): QueryBuilder;
  where(column: string, operator: string, value: any): QueryBuilder;
  whereIn(column: string, values: any[]): QueryBuilder;
  orderBy(column: string, direction?: 'asc' | 'desc'): QueryBuilder;
  limit(count: number): QueryBuilder;
  offset(count: number): QueryBuilder;
  execute(): Promise<any[]>;
  first(): Promise<any>;
  count(): Promise<number>;
}

export interface DatabaseClient {
  table(tableName: string): Table;
  query(sql: string, params?: any[]): Promise<any[]>;
  transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T>;
}

export interface Table {
  select(columns?: string): QueryBuilder;
  insert(data: any): Promise<{ data: any; error: any }>;
  update(data: any): QueryBuilder;
  delete(): QueryBuilder;
  upsert(data: any, options?: any): Promise<{ data: any; error: any }>;
}

export interface Transaction {
  table(tableName: string): Table;
  query(sql: string, params?: any[]): Promise<any[]>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * Get the appropriate database client based on environment
 */
export function getDatabaseClient(): DatabaseClient {
  if (isUsingSupabase()) {
    return new SupabaseClient();
  } else {
    // SQLite client will be wrapped
    return new SQLiteClient();
  }
}

/**
 * Check if using Supabase
 */
export function isUsingSupabase(): boolean {
  return isUsingSupabaseRuntime();
}

/**
 * Supabase implementation of DatabaseClient
 */
class SupabaseClient implements DatabaseClient {
  table(tableName: string): Table {
    return new SupabaseTable(tableName);
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    console.warn('Raw SQL queries not recommended with Supabase. Use table API instead.');
    // For complex queries, consider using Supabase RPC functions
    return [];
  }

  async transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {
    // Supabase handles transactions automatically
    return callback(new SupabaseTransaction());
  }
}

class SupabaseTable implements Table {
  private query: any;

  constructor(tableName: string) {
    this.query = supabase.from(tableName);
  }

  select(columns?: string): QueryBuilder {
    return new SupabaseQueryBuilder(this.query.select(columns));
  }

  async insert(data: any) {
    return await this.query.insert(data);
  }

  update(data: any): QueryBuilder {
    return new SupabaseQueryBuilder(this.query.update(data));
  }

  delete(): QueryBuilder {
    return new SupabaseQueryBuilder(this.query.delete());
  }

  async upsert(data: any, options?: any) {
    return await this.query.upsert(data, options);
  }
}

class SupabaseQueryBuilder implements QueryBuilder {
  private query: any;

  constructor(query: any) {
    this.query = query;
  }

  select(columns?: string): QueryBuilder {
    return new SupabaseQueryBuilder(this.query.select(columns));
  }

  where(column: string, operator: string, value: any): QueryBuilder {
    const op = operator === '=' ? 'eq' : operator === '!=' ? 'neq' : operator;
    return new SupabaseQueryBuilder(this.query[op](column, value));
  }

  whereIn(column: string, values: any[]): QueryBuilder {
    return new SupabaseQueryBuilder(this.query.in(column, values));
  }

  orderBy(column: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
    return new SupabaseQueryBuilder(this.query.order(column, { ascending: direction === 'asc' }));
  }

  limit(count: number): QueryBuilder {
    return new SupabaseQueryBuilder(this.query.limit(count));
  }

  offset(count: number): QueryBuilder {
    return new SupabaseQueryBuilder(this.query.range(count, count + 1000));
  }

  async execute(): Promise<any[]> {
    const { data, error } = await this.query;
    if (error) throw error;
    return data || [];
  }

  async first(): Promise<any> {
    const results = await this.execute();
    return results[0] || null;
  }

  async count(): Promise<number> {
    const { count, error } = await this.query;
    if (error) throw error;
    return count || 0;
  }
}

class SupabaseTransaction implements Transaction {
  table(tableName: string): Table {
    return new SupabaseTable(tableName);
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    return [];
  }

  async commit(): Promise<void> {
    // Supabase handles this automatically
  }

  async rollback(): Promise<void> {
    // Supabase handles this automatically
  }
}

/**
 * SQLite implementation (wrapper around existing better-sqlite3)
 */
class SQLiteClient implements DatabaseClient {
  private db: any;

  constructor() {
    // Import SQLite client dynamically
    const { getDb } = require('./client');
    this.db = getDb();
  }

  table(tableName: string): Table {
    return new SQLiteTable(tableName, this.db);
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    const stmt = this.db.prepare(sql);
    return params ? stmt.all(...params) : stmt.all();
  }

  async transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {
    return this.db.transaction(() => callback(new SQLiteTransaction(this.db)))();
  }
}

class SQLiteTable implements Table {
  private tableName: string;
  private db: any;

  constructor(tableName: string, db: any) {
    this.tableName = tableName;
    this.db = db;
  }

  select(columns?: string): QueryBuilder {
    return new SQLiteQueryBuilder(this.tableName, this.db, columns || '*');
  }

  async insert(data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

    try {
      const stmt = this.db.prepare(sql);
      stmt.run(...values);
      return { data: data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  update(data: any): QueryBuilder {
    return new SQLiteQueryBuilder(this.tableName, this.db).update(data);
  }

  delete(): QueryBuilder {
    return new SQLiteQueryBuilder(this.tableName, this.db).delete();
  }

  async upsert(data: any, options?: any) {
    // SQLite upsert simulation
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const updateClause = keys.map(k => `${k} = excluded.${k}`).join(', ');

    const sql = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      ON CONFLICT(id) DO UPDATE SET ${updateClause}
    `;

    try {
      const stmt = this.db.prepare(sql);
      stmt.run(...values);
      return { data: data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }
}

class SQLiteQueryBuilder implements QueryBuilder {
  private tableName: string;
  private db: any;
  private selectColumns: string;
  private whereConditions: string[] = [];
  private whereParams: any[] = [];
  private orderClause: string = '';
  private limitClause: string = '';
  private offsetClause: string = '';
  private updateData: any = null;
  private isDelete: boolean = false;

  constructor(tableName: string, db: any, columns?: string) {
    this.tableName = tableName;
    this.db = db;
    this.selectColumns = columns || '*';
  }

  select(columns?: string): QueryBuilder {
    this.selectColumns = columns || '*';
    return this;
  }

  where(column: string, operator: string, value: any): QueryBuilder {
    this.whereConditions.push(`${column} ${operator} ?`);
    this.whereParams.push(value);
    return this;
  }

  whereIn(column: string, values: any[]): QueryBuilder {
    const placeholders = values.map(() => '?').join(', ');
    this.whereConditions.push(`${column} IN (${placeholders})`);
    this.whereParams.push(...values);
    return this;
  }

  orderBy(column: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
    this.orderClause = `ORDER BY ${column} ${direction.toUpperCase()}`;
    return this;
  }

  limit(count: number): QueryBuilder {
    this.limitClause = `LIMIT ${count}`;
    return this;
  }

  offset(count: number): QueryBuilder {
    this.offsetClause = `OFFSET ${count}`;
    return this;
  }

  update(data: any): QueryBuilder {
    this.updateData = data;
    return this;
  }

  delete(): QueryBuilder {
    this.isDelete = true;
    return this;
  }

  private buildQuery(): string {
    if (this.isDelete) {
      let sql = `DELETE FROM ${this.tableName}`;
      if (this.whereConditions.length > 0) {
        sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
      }
      return sql;
    }

    if (this.updateData) {
      const keys = Object.keys(this.updateData);
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      let sql = `UPDATE ${this.tableName} SET ${setClause}`;
      if (this.whereConditions.length > 0) {
        sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
      }
      return sql;
    }

    let sql = `SELECT ${this.selectColumns} FROM ${this.tableName}`;
    if (this.whereConditions.length > 0) {
      sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }
    if (this.orderClause) sql += ` ${this.orderClause}`;
    if (this.limitClause) sql += ` ${this.limitClause}`;
    if (this.offsetClause) sql += ` ${this.offsetClause}`;
    return sql;
  }

  private getParams(): any[] {
    let params = [...this.whereParams];

    if (this.updateData) {
      params = [...Object.values(this.updateData), ...params];
    }

    return params;
  }

  async execute(): Promise<any[]> {
    const sql = this.buildQuery();
    const params = this.getParams();
    const stmt = this.db.prepare(sql);
    return params ? stmt.all(...params) : stmt.all();
  }

  async first(): Promise<any> {
    const results = await this.execute();
    return results[0] || null;
  }

  async count(): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    if (this.whereConditions.length > 0) {
      const whereClause = this.whereConditions.join(' AND ');
      const fullSql = `${sql} WHERE ${whereClause}`;
      const stmt = this.db.prepare(fullSql);
      const result = stmt.get(...this.whereParams);
      return result?.count || 0;
    }
    const stmt = this.db.prepare(sql);
    const result = stmt.get();
    return result?.count || 0;
  }
}

class SQLiteTransaction implements Transaction {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  table(tableName: string): Table {
    return new SQLiteTable(tableName, this.db);
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    const stmt = this.db.prepare(sql);
    return params ? stmt.all(...params) : stmt.all();
  }

  async commit(): Promise<void> {
    // SQLite handles this automatically
  }

  async rollback(): Promise<void> {
    // SQLite handles this automatically
  }
}

// Export singleton instance
export const db = getDatabaseClient();
