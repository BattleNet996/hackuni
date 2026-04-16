import type { Hackathon } from '@/lib/models/hackathon';

const TSINGHUA_OPENCLAW_HACKATHON_ID = 'tsinghua-openclaw-hackathon-2026';
const TSINGHUA_OPENCLAW_ALIASES = new Set([
  TSINGHUA_OPENCLAW_HACKATHON_ID,
  'beijing-hackathon-0314',
]);

function normalizeHackathonText(value: string | null | undefined): string {
  return (value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[|｜·•,，.。:：/\\()（）_\-]/g, '');
}

function toTimestamp(value: string | null | undefined): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function isSpringHackathon(hackathon: Hackathon): boolean {
  const title = normalizeHackathonText(hackathon.title);
  const city = normalizeHackathonText(hackathon.city);

  return (
    hackathon.id === 'h0' ||
    title.includes('春潮') ||
    (title.includes('spring') &&
      (title.includes('硬件') || title.includes('hardware')) &&
      (city.includes('shenzhen') || city.includes('深圳')))
  );
}

function isTsinghuaOpenClawHackathon(hackathon: Hackathon): boolean {
  if (TSINGHUA_OPENCLAW_ALIASES.has(hackathon.id)) {
    return true;
  }

  const title = normalizeHackathonText(hackathon.title);
  return title.includes('openclaw') && (title.includes('清华') || title.includes('tsinghua'));
}

function getHackathonPriority(hackathon: Hackathon): number {
  if (isSpringHackathon(hackathon)) return 0;
  if (isTsinghuaOpenClawHackathon(hackathon)) return 1;
  return Number.POSITIVE_INFINITY;
}

export const TSINGHUA_OPENCLAW_HACKATHON: Hackathon = {
  id: TSINGHUA_OPENCLAW_HACKATHON_ID,
  title: '清华 OpenClaw Hackathon',
  short_desc: '围绕 OpenClaw、多智能体原型与跨学科创作展开的清华校园黑客松。',
  description:
    '由 AttraX 发起的一场 OpenClaw 主题校园黑客松，聚焦多智能体、个人效率、原型实验与跨学科协作。活动更看重“先做出来”的现场创造力，欢迎工程、设计、内容、硬件与研究背景混编组队，把那些没用但很酷的念头尽快做成可以被体验的作品。',
  start_time: '2026-03-14T09:00:00+08:00',
  end_time: '2026-03-14T21:00:00+08:00',
  registration_deadline: null,
  city: 'Beijing',
  country: 'China',
  latitude: 40.0054,
  longitude: 116.3269,
  location_detail: '清华大学周边',
  tags_json: ['#OpenClaw', '#AI', '#Outlier', '#Tsinghua', '#Hackathon'],
  level_score: '',
  level_code: '',
  registration_status: '已结束',
  poster_url: '',
  organizer: 'AttraX（由清华和北大学生发起）',
  organizer_url: null,
  registration_url: null,
  requirements: '适合对 OpenClaw、Agent、产品、硬件、叙事或创意原型感兴趣的跨学科构建者。',
  prizes: null,
  fee: '免费',
  created_at: '2026-03-01T00:00:00+08:00',
  updated_at: '2026-04-16T00:00:00+08:00',
};

export function buildFeaturedHackathonList(hackathons: Hackathon[]): Hackathon[] {
  const curatedHackathons = [...hackathons];

  if (!curatedHackathons.some(isTsinghuaOpenClawHackathon)) {
    curatedHackathons.push(TSINGHUA_OPENCLAW_HACKATHON);
  }

  return curatedHackathons.sort((left, right) => {
    const priorityDelta = getHackathonPriority(left) - getHackathonPriority(right);
    if (priorityDelta !== 0) return priorityDelta;

    const startTimeDelta = toTimestamp(right.start_time) - toTimestamp(left.start_time);
    if (startTimeDelta !== 0) return startTimeDelta;

    return toTimestamp(right.created_at) - toTimestamp(left.created_at);
  });
}

export function getFeaturedHackathonFallbackById(id: string): Hackathon | null {
  if (TSINGHUA_OPENCLAW_ALIASES.has(id)) {
    return TSINGHUA_OPENCLAW_HACKATHON;
  }

  return null;
}
