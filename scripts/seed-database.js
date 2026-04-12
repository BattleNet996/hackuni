#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 将 MOCK 数据导入到数据库中
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database/hackuni.db');
const db = new Database(dbPath);

// 启用外键
db.pragma('foreign_keys = ON');

console.log('🚀 开始初始化数据库...\n');

// 1. 导入黑客松数据
console.log('📦 导入黑客松数据...');
const { MOCK_HACKATHONS } = require('../src/data/mock');

const insertHackathon = db.prepare(`
  INSERT OR IGNORE INTO hackathons (
    id, title, short_desc, description, start_time, end_time, registration_deadline,
    city, country, latitude, longitude, location_detail, tags_json, level_score, level_code,
    registration_status, poster_url, organizer, organizer_url, registration_url,
    requirements, prizes, fee
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let hackathonCount = 0;
MOCK_HACKATHONS.forEach(hack => {
  try {
    insertHackathon.run(
      hack.id,
      hack.title,
      hack.short_desc,
      hack.description || '',
      hack.start_time,
      hack.end_time,
      hack.registration_deadline,
      hack.city,
      hack.country,
      hack.latitude,
      hack.longitude,
      hack.location_detail,
      JSON.stringify(hack.tags_json),
      hack.level_score,
      hack.level_code,
      hack.registration_status,
      hack.poster_url || '',
      hack.organizer || '',
      hack.organizer_url || '',
      hack.registration_url || '',
      hack.requirements || '',
      hack.prizes || '',
      hack.fee || ''
    );
    hackathonCount++;
  } catch (error) {
    console.error(`  ❌ 导入黑客松失败 [${hack.id}]:`, error.message);
  }
});
console.log(`  ✓ 成功导入 ${hackathonCount} 个黑客松\n`);

// 2. 导入项目数据
console.log('📦 导入项目数据...');
const { MOCK_PROJECTS } = require('../src/data/mock');

const insertProject = db.prepare(`
  INSERT OR REPLACE INTO projects (
    id, title, short_desc, long_desc, like_count, rank_score,
    team_member_text, tags_json, is_awarded, award_text,
    demo_url, github_url, website_url,
    related_hackathon_id, author_id, status, hidden,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

let projectCount = 0;
MOCK_PROJECTS.forEach(proj => {
  try {
    insertProject.run(
      proj.id,
      proj.title,
      proj.short_desc,
      proj.long_desc || '',
      proj.like_count,
      proj.rank_score,
      proj.team_member_text,
      JSON.stringify(proj.tags_json),
      proj.is_awarded ? 1 : 0,
      proj.award_text || '',
      proj.demo_url || '',
      proj.github_url || '',
      proj.website_url || '',
      null, // related_hackathon_id
      'u1', // author_id - 默认分配给 Alice
      'published',
      0 // hidden
    );
    projectCount++;
  } catch (error) {
    console.error(`  ❌ 导入项目失败 [${proj.id}]:`, error.message);
  }
});
console.log(`  ✓ 成功导入 ${projectCount} 个项目\n`);

// 3. 导入资讯数据
console.log('📦 导入资讯数据...');
const { MOCK_STORIES } = require('../src/data/mock');

const insertStory = db.prepare(`
  INSERT OR REPLACE INTO stories (
    id, slug, title, summary, content, source, source_url,
    author_name, tags_json, published_at, like_count,
    status, hidden, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

let storyCount = 0;
MOCK_STORIES.forEach(story => {
  try {
    insertStory.run(
      story.id,
      story.slug,
      story.title,
      story.summary,
      story.summary, // content 默认使用 summary
      story.source || '',
      story.source_url || '',
      story.author_name,
      JSON.stringify(story.tags_json || []),
      story.published_at,
      story.like_count,
      'published',
      0
    );
    storyCount++;
  } catch (error) {
    console.error(`  ❌ 导入资讯失败 [${story.id}]:`, error.message);
  }
});
console.log(`  ✓ 成功导入 ${storyCount} 个资讯\n`);

// 4. 导入徽章数据
console.log('🏆 导入徽章数据...');
const { MOCK_BADGES } = require('../src/data/mock');

const insertBadge = db.prepare(`
  INSERT OR REPLACE INTO badges (
    id, badge_code, badge_name, badge_name_en, badge_type,
    badge_desc, badge_desc_en, icon_url,
    rule_desc, rule_desc_en, source_type, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

let badgeCount = 0;
MOCK_BADGES.forEach(badge => {
  try {
    insertBadge.run(
      badge.id,
      badge.badge_code,
      badge.badge_name,
      badge.badge_name_en,
      badge.badge_type,
      badge.badge_desc,
      badge.badge_desc_en,
      badge.icon_url || '',
      badge.rule_desc || '',
      badge.rule_desc_en || '',
      badge.source_type,
    );
    badgeCount++;
  } catch (error) {
    console.error(`  ❌ 导入徽章失败 [badge.id]:`, error.message);
  }
});
console.log(`  ✓ 成功导入 ${badgeCount} 个徽章\n`);

// 5. 创建默认用户 Alice
console.log('👤 创建默认用户 Alice...');
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (
    id, email, password_hash, display_name, bio,
    looking_for, total_hackathon_count, total_work_count,
    total_award_count, badge_count, certification_count
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

try {
  // 使用 SHA256 哈希密码 "123456"
  const crypto = require('crypto');
  const passwordHash = crypto.createHash('sha256').update('123456').digest('hex');

  insertUser.run(
    'u1',
    'alice@example.com',
    passwordHash,
    'ALICE_CHAIN',
    'Smart contract engineer by day. AI hardware hacker by night.',
    JSON.stringify(['COFOUNDER', 'HACKATHON_TEAMMATE']),
    3,
    2,
    1,
    5,
    2
  );
  console.log('  ✓ 用户 Alice 创建成功\n');
} catch (error) {
  console.log('  ℹ️  用户 Alice 可能已存在\n');
}

// 6. 创建默认管理员账号
console.log('🔐 创建默认管理员账号...');
const insertAdmin = db.prepare(`
  INSERT OR IGNORE INTO admin_users (
    id, username, password_hash, email, is_active, created_at, updated_at
  ) VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
`);

try {
  const crypto = require('crypto');
  const adminPasswordHash = crypto.createHash('sha256').update('cwj123').digest('hex');

  insertAdmin.run(
    'admin_001',
    'wjj',
    adminPasswordHash,
    'admin@hackuni.com'
  );
  console.log('  ✓ 管理员账号创建成功');
  console.log('    用户名: wjj');
  console.log('    密码: cwj123\n');
} catch (error) {
  console.log('  ℹ️  管理员账号可能已存在\n');
}

console.log('✅ 数据库初始化完成！\n');
console.log('📊 统计信息：');
console.log(`  - 黑客松: ${hackathonCount} 个`);
console.log(`  - 项目: ${projectCount} 个`);
console.log(`  - 资讯: ${storyCount} 个`);
console.log(`  - 徽章: ${badgeCount} 个`);
console.log(`  - 用户: 1 个 (Alice)`);
console.log(`  - 管理员: 1 个 (wjj)\n`);

db.close();
