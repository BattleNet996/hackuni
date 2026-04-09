export interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  source: string | null;
  source_url: string | null;
  author_name: string;
  tags_json: string[];
  published_at: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export function mapRowToStory(row: any): Story {
  return {
    ...row,
    tags_json: row.tags_json ? JSON.parse(row.tags_json) : [],
  };
}
