#!/usr/bin/env ts-node

/**
 * Database Configuration Checker
 * 检查当前项目使用哪个数据库
 */

import { isUsingSupabase } from '../src/lib/db/database';

console.log('=== 数据库配置检查 ===\n');

// 检查环境变量
const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('环境变量状态:');
console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${hasSupabaseUrl ? '✅ 已配置' : '❌ 未配置'}`);
console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${hasServiceKey ? '✅ 已配置' : '❌ 未配置'}`);

// 检查使用的数据库
const usingSupabase = isUsingSupabase();

console.log('\n当前使用的数据库:');
if (usingSupabase) {
  console.log('  ✅ Supabase (云数据库)');
  console.log(`  URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
} else {
  console.log('  ✅ SQLite (本地数据库)');
  console.log('  位置: database/hackuni.db');
}

// 数据统计
console.log('\n建议:');
if (!usingSupabase) {
  console.log('  ⚠️  本地开发环境使用 SQLite');
  console.log('  ⚠️  Vercel 生产环境需要配置 Supabase');
  console.log('\n  📝 Vercel 需要配置的环境变量:');
  console.log('     - NEXT_PUBLIC_SUPABASE_URL');
  console.log('     - SUPABASE_SERVICE_ROLE_KEY');
} else {
  console.log('  ✅ 已配置 Supabase，可以使用云数据库');
}
