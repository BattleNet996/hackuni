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

export function mapRowToHackathon(row: any): Hackathon {
  return {
    ...row,
    tags_json: row.tags_json ? JSON.parse(row.tags_json) : [],
  };
}
