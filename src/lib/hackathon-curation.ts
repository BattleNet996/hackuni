import type { Hackathon } from '@/lib/models/hackathon';
import { canonicalizeHackathonStatus } from '@/lib/hackathon-status';

const TSINGHUA_OPENCLAW_HACKATHON_ID = 'tsinghua-openclaw-hackathon-2026';
const SPRING_HACKATHON_ID = 'h0';
const TSINGHUA_OPENCLAW_ALIASES = new Set([
  TSINGHUA_OPENCLAW_HACKATHON_ID,
  'beijing-hackathon-0314',
]);
const SPRING_HACKATHON_ALIASES = new Set([
  SPRING_HACKATHON_ID,
  'spring-shenzhen-ai-hardware-hackathon-2026',
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
    SPRING_HACKATHON_ALIASES.has(hackathon.id) ||
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
  return 2;
}

function getRegistrationStatusRank(hackathon: Hackathon): number {
  const status = canonicalizeHackathonStatus(hackathon.registration_status);

  if (status === 'open' || status === 'live') {
    return 0;
  }

  if (status === 'ended') {
    return 1;
  }

  return 2;
}

function getReferenceTime(hackathon: Hackathon, now: number): number {
  const startTime = toTimestamp(hackathon.start_time);
  const endTime = toTimestamp(hackathon.end_time);

  if (startTime && endTime && startTime <= now && now <= endTime) {
    return now;
  }

  if (startTime && now < startTime) {
    return startTime;
  }

  return endTime || startTime;
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
  registration_status: 'ended',
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

export const SPRING_HACKATHON: Hackathon = {
  id: SPRING_HACKATHON_ID,
  title: '春潮 Spring｜深圳 AI/硬件黑客松',
  short_desc:
    '4 月 23 日至 26 日，AttraX 与 BREWTOWN 在深圳发起四天三夜 Outlier 黑客松，用软件、硬件、艺术和城市生活场景定义下一个可能性。',
  description:
    '春潮 Spring 是年轻创造者对时代精神的传承与重启。活动由 AttraX 与 BREWTOWN 主办，指导单位包括华润万象生活、共青团深圳市宝安区委员会，面向 200-250 位参赛选手，预计路演观众规模 1000 人。五大赛道包括 Software & Social & Entertainment、Hardware & Embodied Experience、Global Products / Going Global、AI Inspiration & Creation、AI for Better City Life。现场提供专业路演厅、独立开发区、能量补给区、住宿与休息区支持，并提供 AirJelly、灵光 App、LibTV、开发板、机械臂、龙虾盒子、3D 打印设备等软硬件资源。活动日程覆盖开幕式、团队组建、赞助商 workshop、48 小时深度创造、Live Coding、EXPO 巡场评审、Top20 决赛路演、颁奖礼与 AfterParty。',
  start_time: '2026-04-23T13:30:00+08:00',
  end_time: '2026-04-26T21:30:00+08:00',
  registration_deadline: null,
  city: 'Shenzhen',
  country: 'China',
  latitude: 22.5431,
  longitude: 114.0579,
  location_detail: '深圳 BREWTOWN 雪花啤酒小镇',
  tags_json: ['#AI', '#Hardware', '#Outlier', '#Spring', '#Shenzhen'],
  level_score: '',
  level_code: '',
  registration_status: 'open',
  poster_url: 'https://brewtown.cn/',
  organizer: 'AttraX｜BREWTOWN',
  organizer_url: 'https://brewtown.cn/',
  registration_url: null,
  requirements:
    '活动规模 200-250 位参赛选手，欢迎软件、硬件、艺术、产品、设计、内容、商业、城市生活等跨学科背景的 Outlier 组队参赛。OpenClaw 可作为推荐工具但非强制。',
  prizes:
    '总奖金池超过 150000 元，并提供总价值超过 100000 元的软硬件奖品。五大赛道基础奖金：一等奖 12000 元、二等奖 9000 元、三等奖 6000 元；另设最佳人气奖 6666 元、最具玩心奖 3333 元、下一场海外黑客松直通奖，以及 6 个伦敦企业 3 周 Challenge 直通机会。',
  fee: '免费；外地选手住宿与现场休息资源按录取和报名顺序发放',
  created_at: '2026-04-07T17:21:58+08:00',
  updated_at: '2026-04-17T00:00:00+08:00',
};

export function enrichFeaturedHackathon(hackathon: Hackathon): Hackathon {
  if (isSpringHackathon(hackathon)) {
    return {
      ...hackathon,
      ...SPRING_HACKATHON,
      id: hackathon.id,
      created_at: hackathon.created_at || SPRING_HACKATHON.created_at,
      updated_at: hackathon.updated_at || SPRING_HACKATHON.updated_at,
    };
  }

  if (isTsinghuaOpenClawHackathon(hackathon)) {
    return {
      ...hackathon,
      ...TSINGHUA_OPENCLAW_HACKATHON,
      id: hackathon.id === 'beijing-hackathon-0314' ? TSINGHUA_OPENCLAW_HACKATHON_ID : hackathon.id,
      created_at: hackathon.created_at || TSINGHUA_OPENCLAW_HACKATHON.created_at,
      updated_at: hackathon.updated_at || TSINGHUA_OPENCLAW_HACKATHON.updated_at,
    };
  }

  return hackathon;
}

export function buildFeaturedHackathonList(hackathons: Hackathon[]): Hackathon[] {
  const curatedHackathons = hackathons.map((hackathon) => enrichFeaturedHackathon(hackathon));
  const now = Date.now();

  if (!curatedHackathons.some(isSpringHackathon)) {
    curatedHackathons.push(SPRING_HACKATHON);
  }

  if (!curatedHackathons.some(isTsinghuaOpenClawHackathon)) {
    curatedHackathons.push(TSINGHUA_OPENCLAW_HACKATHON);
  }

  return curatedHackathons.sort((left, right) => {
    const leftPriority = getHackathonPriority(left);
    const rightPriority = getHackathonPriority(right);
    const priorityDelta = leftPriority - rightPriority;
    if (priorityDelta !== 0) return priorityDelta;

    const statusDelta = getRegistrationStatusRank(left) - getRegistrationStatusRank(right);
    if (statusDelta !== 0) return statusDelta;

    const leftReferenceTime = getReferenceTime(left, now);
    const rightReferenceTime = getReferenceTime(right, now);
    const distanceDelta = Math.abs(leftReferenceTime - now) - Math.abs(rightReferenceTime - now);
    if (distanceDelta !== 0) return distanceDelta;

    const startTimeDelta = toTimestamp(left.start_time) - toTimestamp(right.start_time);
    if (startTimeDelta !== 0) return startTimeDelta;

    return toTimestamp(right.created_at) - toTimestamp(left.created_at);
  });
}

export function getFeaturedHackathonFallbackById(id: string): Hackathon | null {
  if (SPRING_HACKATHON_ALIASES.has(id)) {
    return SPRING_HACKATHON;
  }

  if (TSINGHUA_OPENCLAW_ALIASES.has(id)) {
    return TSINGHUA_OPENCLAW_HACKATHON;
  }

  return null;
}
