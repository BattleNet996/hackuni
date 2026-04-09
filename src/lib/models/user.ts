export interface User {
  id: string;
  email: string;
  password_hash?: string; // Never expose to client
  display_name?: string;
  avatar?: string;
  bio?: string;
  school?: string;
  major?: string;
  company?: string;
  position?: string;
  phone?: string;
  twitter_url?: string;
  github_url?: string;
  website_url?: string;
  looking_for: string[];
  total_hackathon_count: number;
  total_work_count: number;
  total_award_count: number;
  badge_count: number;
  certification_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  display_name?: string;
}

export interface UserUpdateInput {
  display_name?: string;
  avatar?: string;
  bio?: string;
  school?: string;
  major?: string;
  company?: string;
  position?: string;
  phone?: string;
  twitter_url?: string;
  github_url?: string;
  website_url?: string;
  looking_for?: string[];
}

export function mapRowToUser(row: any): User {
  return {
    ...row,
    looking_for: row.looking_for ? JSON.parse(row.looking_for) : [],
  };
}
