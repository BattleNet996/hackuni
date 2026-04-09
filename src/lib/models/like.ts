export interface Like {
  id: string;
  user_id: string;
  target_type: 'project' | 'story' | 'comment';
  target_id: string;
  created_at: string;
}

export function mapRowToLike(row: any): Like {
  return row;
}
