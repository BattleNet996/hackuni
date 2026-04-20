import { getSupabaseClient } from '@/lib/db/supabase-client';
import { parseStringArray } from '@/lib/utils/data';

const METADATA_PREFIX = '__ATTRAX_HACKATHON_RECORD_META__';

function isMissingRecordTableError(error: any) {
  const message = String(error?.message || '');
  return error?.code === '42P01' || error?.code === 'PGRST205' || /user_hackathon_records/i.test(message);
}

function isMissingRecordColumnError(error: any) {
  const message = String(error?.message || '');
  return error?.code === '42703' || /contribution_areas|contribution_other|proof_image_url/i.test(message);
}

async function runSql(sql: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.rpc('exec_sql', { sql });

  if (error && error.code !== 'PGRST202') {
    throw error;
  }
}

export async function ensureHackathonRecordSchema() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS user_hackathon_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      hackathon_id TEXT REFERENCES hackathons(id) ON DELETE SET NULL,
      hackathon_title TEXT NOT NULL,
      role TEXT,
      contribution_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
      contribution_other TEXT,
      project_name TEXT,
      project_url TEXT,
      award_text TEXT,
      proof_url TEXT,
      proof_image_url TEXT,
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
  `;

  const addColumnsSql = `
    ALTER TABLE user_hackathon_records
      ADD COLUMN IF NOT EXISTS contribution_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS contribution_other TEXT,
      ADD COLUMN IF NOT EXISTS proof_image_url TEXT;
    CREATE INDEX IF NOT EXISTS idx_user_hackathon_records_contribution_areas
      ON user_hackathon_records USING GIN (contribution_areas);
  `;

  try {
    await runSql(createTableSql);
    await runSql(addColumnsSql);
  } catch {
    // If exec_sql is unavailable, callers should rely on existing schema.
  }
}

export function shouldRepairHackathonRecordSchema(error: any) {
  return isMissingRecordTableError(error) || isMissingRecordColumnError(error);
}

export function normalizeContributionAreas(value: unknown): string[] {
  return parseStringArray(value, { allowDelimitedString: true }).slice(0, 6);
}

type HackathonRecordMetadata = {
  contribution_areas?: string[];
  contribution_other?: string;
  proof_image_url?: string;
  linked_project_id?: string;
  linked_project_title?: string;
  team_members?: Array<{
    name: string;
    user_id?: string;
    invite_url?: string;
    source?: 'manual' | 'platform' | 'invite';
  }>;
};

function normalizeTeamMembers(value: unknown) {
  if (!Array.isArray(value)) return [] as HackathonRecordMetadata['team_members'];

  return value
    .map((member) => {
      const candidate = member as Record<string, unknown>;
      const name = String(candidate?.name || '').trim().slice(0, 80);
      if (!name) return null;

      const userId = String(candidate?.user_id || '').trim().slice(0, 120);
      const inviteUrl = String(candidate?.invite_url || '').trim().slice(0, 500);
      const sourceRaw = String(candidate?.source || '').trim();
      const source = sourceRaw === 'platform' || sourceRaw === 'invite' ? sourceRaw : 'manual';

      return {
        name,
        ...(userId ? { user_id: userId } : {}),
        ...(inviteUrl ? { invite_url: inviteUrl } : {}),
        source,
      };
    })
    .filter(Boolean)
    .slice(0, 12) as HackathonRecordMetadata['team_members'];
}

export function encodeHackathonRecordNotes(notes: string | null | undefined, metadata: HackathonRecordMetadata) {
  const cleanNotes = String(notes || '').trim();
  const payload: HackathonRecordMetadata = {};

  if (metadata.contribution_areas?.length) {
    payload.contribution_areas = metadata.contribution_areas;
  }
  if (metadata.contribution_other) {
    payload.contribution_other = metadata.contribution_other;
  }
  if (metadata.proof_image_url) {
    payload.proof_image_url = metadata.proof_image_url;
  }
  if (metadata.linked_project_id) {
    payload.linked_project_id = metadata.linked_project_id;
  }
  if (metadata.linked_project_title) {
    payload.linked_project_title = metadata.linked_project_title;
  }
  const teamMembers = normalizeTeamMembers(metadata.team_members) || [];
  if (teamMembers.length > 0) {
    payload.team_members = teamMembers;
  }

  if (Object.keys(payload).length === 0) {
    return cleanNotes;
  }

  return `${cleanNotes}\n${METADATA_PREFIX}${JSON.stringify(payload)}`.trim();
}

export function decodeHackathonRecordNotes(rawNotes: string | null | undefined) {
  const text = String(rawNotes || '');
  const markerIndex = text.indexOf(METADATA_PREFIX);

  if (markerIndex === -1) {
    return {
      notes: text.trim(),
      contribution_areas: [] as string[],
      contribution_other: '',
      proof_image_url: '',
    };
  }

  const visibleNotes = text.slice(0, markerIndex).trim();
  const metadataText = text.slice(markerIndex + METADATA_PREFIX.length).trim();

  try {
    const parsed = JSON.parse(metadataText);
    return {
      notes: visibleNotes,
      contribution_areas: normalizeContributionAreas(parsed?.contribution_areas),
      contribution_other: String(parsed?.contribution_other || '').trim(),
      proof_image_url: String(parsed?.proof_image_url || '').trim(),
      linked_project_id: String(parsed?.linked_project_id || '').trim(),
      linked_project_title: String(parsed?.linked_project_title || '').trim(),
      team_members: normalizeTeamMembers(parsed?.team_members),
    };
  } catch {
    return {
      notes: text.trim(),
      contribution_areas: [] as string[],
      contribution_other: '',
      proof_image_url: '',
      linked_project_id: '',
      linked_project_title: '',
      team_members: [] as NonNullable<HackathonRecordMetadata['team_members']>,
    };
  }
}
