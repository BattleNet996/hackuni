import { ensureTagsArray } from '@/lib/utils/data';
import { canonicalizeHackathonStatus } from '@/lib/hackathon-status';

export interface Hackathon {
  id: string;
  title: string;
  short_desc: string;
  description: string;
  start_time: string;
  end_time: string;
  registration_deadline: string | null;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  location_detail: string;
  tags_json: string[];
  level_score: string;
  level_code: string;
  registration_status: string;
  poster_url: string;
  organizer: string;
  organizer_url: string | null;
  registration_url: string | null;
  requirements: string | null;
  prizes: string | null;
  fee: string | null;
  created_at: string;
  updated_at: string;
}

function sanitizeLevel(levelScore: unknown, levelCode: unknown) {
  const scoreText = typeof levelScore === 'string' ? levelScore.trim() : String(levelScore || '').trim();
  const codeText = typeof levelCode === 'string' ? levelCode.trim() : String(levelCode || '').trim();
  const numericScore = Number(scoreText);
  const isLegacyMockScore = Number.isFinite(numericScore) && numericScore > 10;

  if (isLegacyMockScore) {
    return {
      level_score: '',
      level_code: '',
    };
  }

  return {
    level_score: scoreText,
    level_code: codeText,
  };
}

export function mapRowToHackathon(row: any): Hackathon {
  const normalizedLevel = sanitizeLevel(row.level_score, row.level_code);

  return {
    ...row,
    tags_json: ensureTagsArray(row.tags_json),
    registration_status: canonicalizeHackathonStatus(row.registration_status),
    ...normalizedLevel,
  };
}
