ALTER TABLE user_hackathon_records
  ADD COLUMN IF NOT EXISTS contribution_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contribution_other TEXT,
  ADD COLUMN IF NOT EXISTS proof_image_url TEXT;

CREATE INDEX IF NOT EXISTS idx_user_hackathon_records_contribution_areas
  ON user_hackathon_records USING GIN (contribution_areas);
