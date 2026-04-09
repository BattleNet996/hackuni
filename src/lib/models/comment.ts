export interface Comment {
  id: string;
  project_id: string | null;
  story_id: string | null;
  author_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id: string | null;
  likes: number;
}

export interface CommentCreateInput {
  project_id?: string;
  story_id?: string;
  content: string;
  parent_comment_id?: string;
}

export function mapRowToComment(row: any): Comment {
  return row;
}
