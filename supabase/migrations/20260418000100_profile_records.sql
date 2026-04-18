-- Profile outlier fields and verified hackathon records.
-- Canonical Supabase CLI migration. Keep this file under supabase/migrations/.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS coolest_thing TEXT,
  ADD COLUMN IF NOT EXISTS current_build TEXT;

CREATE TABLE IF NOT EXISTS user_hackathon_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hackathon_id TEXT REFERENCES hackathons(id) ON DELETE SET NULL,
  hackathon_title TEXT NOT NULL,
  role TEXT,
  project_name TEXT,
  project_url TEXT,
  award_text TEXT,
  proof_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_hackathon_records_user_id ON user_hackathon_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hackathon_records_hackathon_id ON user_hackathon_records(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_user_hackathon_records_status ON user_hackathon_records(status);
CREATE INDEX IF NOT EXISTS idx_user_hackathon_records_created_at ON user_hackathon_records(created_at);
