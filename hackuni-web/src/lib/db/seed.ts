import { getDb } from './client';
import { MOCK_HACKATHONS, MOCK_PROJECTS, MOCK_STORIES, MOCK_BADGES, MOCK_USER } from '@/data/mock';

/**
 * Seed database with mock data
 */
export function seedDatabase(): void {
  const db = getDb();

  console.log('Seeding database with mock data...');

  // Use transaction for faster inserts
  const insert = db.transaction(() => {
    // Seed badges
    const insertBadge = db.prepare(`
      INSERT OR IGNORE INTO badges (
        id, badge_code, badge_name, badge_name_en, badge_type,
        badge_desc, badge_desc_en, icon_url, rule_desc, rule_desc_en, source_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const badge of MOCK_BADGES) {
      insertBadge.run(
        badge.id,
        badge.badge_code,
        badge.badge_name,
        badge.badge_name_en,
        badge.badge_type,
        badge.badge_desc,
        badge.badge_desc_en,
        badge.icon_url,
        badge.rule_desc,
        badge.rule_desc_en,
        badge.source_type
      );
    }
    console.log(`✓ Seeded ${MOCK_BADGES.length} badges`);

    // Seed users
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (
        id, email, password_hash, display_name, bio, looking_for,
        total_hackathon_count, total_work_count, total_award_count,
        badge_count, certification_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Create mock user with a default password hash
    const bcrypt = require('bcrypt');
    const passwordHash = bcrypt.hashSync('password123', 10);

    insertUser.run(
      MOCK_USER.id,
      'alice@example.com',
      passwordHash,
      MOCK_USER.display_name,
      MOCK_USER.bio,
      JSON.stringify(MOCK_USER.looking_for),
      MOCK_USER.total_hackathon_count,
      MOCK_USER.total_work_count,
      MOCK_USER.total_award_count,
      MOCK_USER.badge_count,
      MOCK_USER.certification_count || 0
    );
    console.log(`✓ Seeded 1 user`);

    // Seed user badges
    const insertUserBadge = db.prepare(`
      INSERT OR IGNORE INTO user_badges (id, user_id, badge_id, status)
      VALUES (?, ?, ?, ?)
    `);

    // Get badge IDs from database
    const allBadges = db.prepare('SELECT id, badge_code FROM badges').all() as Array<{ id: string; badge_code: string }>;
    const badgeCodeToId = new Map(allBadges.map(b => [b.badge_code, b.id]));

    for (const userBadge of MOCK_USER.badges) {
      // Find matching badge by badge_code (label in user.badges)
      const badgeId = badgeCodeToId.get(userBadge.label);
      if (badgeId) {
        const ubId = `ub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        insertUserBadge.run(ubId, MOCK_USER.id, badgeId, userBadge.status);
      }
    }
    console.log(`✓ Seeded ${MOCK_USER.badges.length} user badges`);

    // Seed hackathons
    const insertHackathon = db.prepare(`
      INSERT OR IGNORE INTO hackathons (
        id, title, short_desc, description, start_time, end_time,
        registration_deadline, city, country, latitude, longitude,
        location_detail, tags_json, level_score, level_code,
        registration_status, poster_url, organizer, organizer_url,
        registration_url, requirements, prizes, fee
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const hackathon of MOCK_HACKATHONS) {
      insertHackathon.run(
        hackathon.id,
        hackathon.title,
        hackathon.short_desc,
        hackathon.description,
        hackathon.start_time,
        hackathon.end_time,
        hackathon.registration_deadline,
        hackathon.city,
        hackathon.country,
        hackathon.latitude,
        hackathon.longitude,
        hackathon.location_detail,
        JSON.stringify(hackathon.tags_json),
        hackathon.level_score,
        hackathon.level_code,
        hackathon.registration_status,
        hackathon.poster_url,
        hackathon.organizer,
        hackathon.organizer_url,
        hackathon.registration_url,
        hackathon.requirements,
        hackathon.prizes,
        hackathon.fee
      );
    }
    console.log(`✓ Seeded ${MOCK_HACKATHONS.length} hackathons`);

    // Seed projects
    const insertProject = db.prepare(`
      INSERT OR IGNORE INTO projects (
        id, title, short_desc, like_count, rank_score,
        team_member_text, tags_json, is_awarded, award_text
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const project of MOCK_PROJECTS) {
      insertProject.run(
        project.id,
        project.title,
        project.short_desc,
        project.like_count,
        project.rank_score,
        project.team_member_text,
        JSON.stringify(project.tags_json),
        project.is_awarded ? 1 : 0,
        project.award_text
      );
    }
    console.log(`✓ Seeded ${MOCK_PROJECTS.length} projects`);

    // Seed stories
    const insertStory = db.prepare(`
      INSERT OR IGNORE INTO stories (
        id, slug, title, summary, source, source_url,
        author_name, tags_json, published_at, like_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const story of MOCK_STORIES) {
      insertStory.run(
        story.id,
        story.slug,
        story.title,
        story.summary,
        story.source || null,
        story.source_url || null,
        story.author_name,
        JSON.stringify(story.tags_json),
        story.published_at,
        story.like_count
      );
    }
    console.log(`✓ Seeded ${MOCK_STORIES.length} stories`);
  });

  insert();
  console.log('Database seeded successfully!');
}
