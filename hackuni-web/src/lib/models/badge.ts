export interface Badge {
  id: string;
  badge_code: string;
  badge_name: string;
  badge_name_en: string;
  badge_type: string;
  badge_desc: string;
  badge_desc_en: string;
  icon_url: string;
  rule_desc: string;
  rule_desc_en: string;
  source_type: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  status: 'pending' | 'verified' | 'rejected';
  earned_at: string | null;
  verified_at: string | null;
  created_at: string;
}

export function mapRowToBadge(row: any): Badge {
  return row;
}

export function mapRowToUserBadge(row: any): UserBadge {
  return row;
}
