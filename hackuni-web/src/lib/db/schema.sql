-- HackUni Web Database Schema
-- SQLite database for hackathon community platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    avatar TEXT,
    bio TEXT,
    school TEXT,
    major TEXT,
    company TEXT,
    position TEXT,
    phone TEXT,
    twitter_url TEXT,
    github_url TEXT,
    website_url TEXT,
    looking_for TEXT, -- JSON array
    total_hackathon_count INTEGER DEFAULT 0,
    total_work_count INTEGER DEFAULT 0,
    total_award_count INTEGER DEFAULT 0,
    badge_count INTEGER DEFAULT 0,
    certification_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_display_name ON users(display_name);

-- Hackathons table
CREATE TABLE IF NOT EXISTS hackathons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_desc TEXT,
    description TEXT,
    start_time TEXT,
    end_time TEXT,
    registration_deadline TEXT,
    city TEXT,
    country TEXT,
    latitude REAL,
    longitude REAL,
    location_detail TEXT,
    tags_json TEXT, -- JSON array
    level_score TEXT,
    level_code TEXT,
    registration_status TEXT,
    poster_url TEXT,
    organizer TEXT,
    organizer_url TEXT,
    registration_url TEXT,
    requirements TEXT,
    prizes TEXT,
    fee TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_hackathons_start_time ON hackathons(start_time);
CREATE INDEX IF NOT EXISTS idx_hackathons_city ON hackathons(city);
CREATE INDEX IF NOT EXISTS idx_hackathons_level_score ON hackathons(level_score);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_desc TEXT,
    long_desc TEXT,
    like_count INTEGER DEFAULT 0,
    rank_score INTEGER,
    team_member_text TEXT,
    tags_json TEXT, -- JSON array
    is_awarded INTEGER DEFAULT 0,
    award_text TEXT,
    images TEXT, -- JSON array
    demo_url TEXT,
    github_url TEXT,
    website_url TEXT,
    related_hackathon_id TEXT,
    author_id TEXT,
    status TEXT DEFAULT 'published', -- published, pending, rejected, hidden
    hidden INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (related_hackathon_id) REFERENCES hackathons(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_projects_rank_score ON projects(rank_score);
CREATE INDEX IF NOT EXISTS idx_projects_like_count ON projects(like_count);
CREATE INDEX IF NOT EXISTS idx_projects_hackathon_id ON projects(related_hackathon_id);
CREATE INDEX IF NOT EXISTS idx_projects_author_id ON projects(author_id);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    source TEXT,
    source_url TEXT,
    author_name TEXT,
    tags_json TEXT, -- JSON array
    published_at TEXT,
    like_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published', -- published, pending, rejected, hidden
    hidden INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at);
CREATE INDEX IF NOT EXISTS idx_stories_like_count ON stories(like_count);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id TEXT PRIMARY KEY,
    badge_code TEXT UNIQUE NOT NULL,
    badge_name TEXT NOT NULL,
    badge_name_en TEXT,
    badge_type TEXT, -- award, milestone, community
    badge_desc TEXT,
    badge_desc_en TEXT,
    icon_url TEXT,
    rule_desc TEXT,
    rule_desc_en TEXT,
    source_type TEXT, -- hackathon, work, activity
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_badges_code ON badges(badge_code);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);

-- User Badges junction table
CREATE TABLE IF NOT EXISTS user_badges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    badge_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, verified, rejected
    earned_at TEXT,
    verified_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_status ON user_badges(status);

-- Likes table (polymorphic)
CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    target_type TEXT NOT NULL, -- project, story, comment
    target_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    story_id TEXT,
    author_id TEXT,
    author_name TEXT,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    parent_comment_id TEXT,
    likes INTEGER DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON comments(story_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    is_active INTEGER DEFAULT 1,
    last_login_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Admin Sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    admin_user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Admin Logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id TEXT PRIMARY KEY,
    admin_user_id TEXT NOT NULL,
    admin_username TEXT NOT NULL,
    action TEXT NOT NULL, -- create, update, delete, ban, unban, etc.
    entity_type TEXT, -- user, hackathon, project, story, badge, admin
    entity_id TEXT,
    entity_name TEXT,
    details TEXT, -- JSON string with additional details
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity ON admin_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- Add is_banned column to users table if not exists
-- This will be checked when running migrations
