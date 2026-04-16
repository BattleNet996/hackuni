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
  title: '清华 Outlier｜OpenClaw 黑客松',
  short_desc: '一场在清华办、为“好玩”而存在的 Outlier 黑客松，围绕 OpenClaw 的娱乐、一人公司与硬件三大赛道展开。',
  description:
    '在清华办一场属于 Outlier 的黑客松。带上 OpenClaw，用玩心去做一个你一直想做的东西。活动以“我们不相信商业闭环是价值的唯一标准，我们在乎你创造了什么”为底色，鼓励选手用 48 小时把奇怪但真实想做的脑洞做成 demo。赛道覆盖 OpenClaw + 娱乐、OpenClaw + 一人公司、OpenClaw + 硬件，面向想把 AI 社会实验、自动化收益系统、具身交互原型真正做出来的跨学科构建者。',
  start_time: '2026-03-14T12:00:00+08:00',
  end_time: '2026-03-16T12:00:00+08:00',
  registration_deadline: null,
  city: 'Beijing',
  country: 'China',
  latitude: 40.0054,
  longitude: 116.3269,
  location_detail: '清华大学校内（如审批流程较长则启用校外备选场地）',
  tags_json: ['#OpenClaw', '#Outlier', '#Entertainment', '#SoloCompany', '#Hardware'],
  level_score: '',
  level_code: '',
  registration_status: '已结束',
  poster_url: '',
  organizer: 'AttraX × 清华大学创客空间 × 清华MBA人工智能俱乐部',
  organizer_url: null,
  registration_url: null,
  requirements: '70-80 人规模，建议 2-4 人组队。适合对 OpenClaw、AI 原生产品、自动化系统、硬件调用与跨学科原型感兴趣的构建者。',
  prizes:
    '三大赛道均设一等奖 3000 元、二等奖 2000 元、三等奖 1000 元；另设最具玩心/创意奖、最具设计潜力奖。赛道一一二三等奖团队可获得腾讯游戏实习面试机会，评分前 10 团队可进入腾讯游戏创作大赛专属通道。',
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
