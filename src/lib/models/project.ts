import { ensureImagesArray, ensureTagsArray } from '@/lib/utils/data';

export interface Project {
  id: string;
  title: string;
  short_desc: string;
  long_desc: string | null;
  like_count: number;
  rank_score: number | null;
  team_member_text: string;
  tags_json: string[];
  is_awarded: boolean;
  award_text: string | null;
  images: string[];
  demo_url: string | null;
  github_url: string | null;
  website_url: string | null;
  related_hackathon_id: string | null;
  author_id: string | null;
  status: string;
  hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreateInput {
  title: string;
  short_desc: string;
  long_desc?: string;
  team_member_text: string;
  tags_json?: string[];
  demo_url?: string;
  github_url?: string;
  website_url?: string;
  related_hackathon_id?: string;
  images?: string[];
  is_awarded?: boolean;
  award_text?: string;
  status?: string;
}

export interface ProjectUpdateInput {
  title?: string;
  short_desc?: string;
  long_desc?: string;
  team_member_text?: string;
  tags_json?: string[];
  demo_url?: string;
  github_url?: string;
  website_url?: string;
  related_hackathon_id?: string;
  images?: string[];
  is_awarded?: boolean;
  award_text?: string;
  status?: string;
  hidden?: boolean;
}

export function mapRowToProject(row: any): Project {
  return {
    ...row,
    tags_json: ensureTagsArray(row.tags_json),
    images: ensureImagesArray(row.images),
    is_awarded: row.is_awarded === 1,
    hidden: row.hidden === 1,
  };
}
