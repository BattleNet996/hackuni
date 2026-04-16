export interface TalentPlanetEvent {
  id: string;
  label: string;
  city: string;
  country: string;
}

export interface TalentPlanetPoint {
  id: string;
  maskedName: string;
  eventId: string;
  eventName: string;
  city: string;
  country: string;
  education: string;
  organization: string;
  major: string;
  coolestThing: string;
  building: string;
  skills: string[];
  signal: string;
  seed: number;
}

export const talentPlanetEvents: TalentPlanetEvent[] = [
  { id: 'all', label: 'ALL_OUTLIERS', city: 'Global', country: 'Network' },
  { id: 'beijing-0402', label: '4.2 北京站', city: 'Beijing', country: 'China' },
  { id: 'nanjing-0408', label: '4.8 南京站', city: 'Nanjing', country: 'China' },
  { id: 'nju-0409', label: '4.09 南大分享', city: 'Nanjing', country: 'China' },
  { id: 'shanghai-0410-bai', label: '4.10 上海站 BAI', city: 'Shanghai', country: 'China' },
  { id: 'shanghai-0410', label: '4.10 上海站', city: 'Shanghai', country: 'China' },
  { id: 'hangzhou-0412', label: '4.12 杭州站', city: 'Hangzhou', country: 'China' },
  { id: 'shenzhen-0415', label: '4.15 深圳站', city: 'Shenzhen', country: 'China' },
  { id: 'shenzhen-intl-0416', label: '4.16 深圳国际场', city: 'Shenzhen', country: 'China' },
  { id: 'beijing-hackathon-0314', label: '3.14 北京黑客松', city: 'Beijing', country: 'China' },
];

const cityCountryByEventId: Record<string, { city: string; country: string }> = {
  'beijing-0402': { city: 'Beijing', country: 'China' },
  'nanjing-0408': { city: 'Nanjing', country: 'China' },
  'nju-0409': { city: 'Nanjing', country: 'China' },
  'shanghai-0410-bai': { city: 'Shanghai', country: 'China' },
  'shanghai-0410': { city: 'Shanghai', country: 'China' },
  'hangzhou-0412': { city: 'Hangzhou', country: 'China' },
  'shenzhen-0415': { city: 'Shenzhen', country: 'China' },
  'shenzhen-intl-0416': { city: 'Shenzhen', country: 'China' },
  'beijing-hackathon-0314': { city: 'Beijing', country: 'China' },
};

const eventNameByEventId: Record<string, string> = Object.fromEntries(
  talentPlanetEvents.filter((event) => event.id !== 'all').map((event) => [event.id, event.label])
);

const eventCounts: Record<string, number> = {
  'nju-0409': 38,
  'shanghai-0410-bai': 33,
  'shanghai-0410': 22,
  'hangzhou-0412': 42,
  'shenzhen-0415': 63,
  'shenzhen-intl-0416': 36,
  'beijing-0402': 56,
  'nanjing-0408': 34,
  'beijing-hackathon-0314': 313,
};

const eventTemplates: Record<string, Array<Omit<TalentPlanetPoint, 'id' | 'maskedName' | 'eventId' | 'eventName' | 'city' | 'country' | 'seed'>>> = {
  'nju-0409': [
    {
      education: '未公开',
      organization: '南京大学生态',
      major: 'Humanities / Self-directed',
      coolestThing: '填志愿时逆着安全路线走，主动选了一条更像自己的路径。',
      building: '写小说，把日常感受转成可被阅读的叙事世界。',
      skills: ['Writing', 'AI Tools'],
      signal: 'Narrative Builder',
    },
    {
      education: '未公开',
      organization: '南京高校网络',
      major: 'Student Researcher',
      coolestThing: '参加省级创新竞赛并把兴趣做成能拿奖的长期项目。',
      building: '在学业、pre 和个人探索之间寻找新的节奏系统。',
      skills: ['Research', 'Presentation'],
      signal: 'Emerging Researcher',
    },
    {
      education: '未公开',
      organization: '青年创作社群',
      major: 'Independent Explorer',
      coolestThing: '把运动、学习和表达习惯当作可以长期迭代的个人实验。',
      building: '把“建立习惯”这件事做成自己的持续工程。',
      skills: ['Self-Experiment', 'Learning'],
      signal: 'Curiosity Engine',
    },
  ],
  'shanghai-0410-bai': [
    {
      education: '博士 | PhD',
      organization: '上海交通大学高级金融学院',
      major: '金融学',
      coolestThing: '疫情期间进入一线量化团队实习，在极端环境里完成职业探索。',
      building: '面向二级市场主动投资的 AI 投研 Agent，输出结构化评分和收益预期。',
      skills: ['Development', 'Finance'],
      signal: 'Finance Agent',
    },
    {
      education: '硕士 | Master',
      organization: 'Fudan / Google',
      major: 'International Management / Ads Product',
      coolestThing: '同时维持全职工作和研究生学习，两套系统彼此独立但都持续运行。',
      building: 'Google Ads 场景里的 A2A Agent，让广告工作流具备自动协作能力。',
      skills: ['Product', 'Business'],
      signal: 'Workflow Agent',
    },
    {
      education: '本科 | Undergraduate',
      organization: 'Enterprise IT Center',
      major: 'Information Systems / Digital Transformation',
      coolestThing: '把 IT、运营、采购、财务和管理层拉到一张桌子上，让组织真正开始协同。',
      building: '连接 AI、企业系统和工业运营的数据桥，把 IT 变成组织的底层基础设施。',
      skills: ['Product', 'Operations', 'Business'],
      signal: 'Enterprise AI',
    },
    {
      education: '硕士 | Master',
      organization: 'Momenté',
      major: 'Cross-border FinTech',
      coolestThing: '在复杂关系和跨国环境里做高风险判断，训练现实世界里的感知能力。',
      building: '从内容广告生态延伸出的全球资金基础设施。',
      skills: ['Product', 'Operations', 'Business'],
      signal: 'FinTech Infra',
    },
  ],
  'shanghai-0410': [
    {
      education: '硕士 | Master',
      organization: '同济大学',
      major: 'AI + Data Design',
      coolestThing: '没有标准化语言成绩，却主动去海外交流，把路径问题变成行动问题。',
      building: '语音控制 vibe coding，用自然语言驱动创作工作流。',
      skills: ['Development', 'Design', 'Product'],
      signal: 'Voice Coding',
    },
    {
      education: '硕士 | Master',
      organization: 'CUHK / Tech Startup',
      major: 'MBA / Technical Co-founder',
      coolestThing: '带着两只猫自驾环游中国边境线，把生活方式直接做成作品。',
      building: '面向宠物主和宠物创业者的 AI assistant / skill 体系。',
      skills: ['Business', 'Product', 'Development'],
      signal: 'Pet AI',
    },
    {
      education: '本科 | Undergraduate',
      organization: '深圳技术大学',
      major: 'Founder',
      coolestThing: '持续追问为什么，把问题意识直接当成产品方法。',
      building: '膳食均衡 Agent，让健康饮食从建议变成可执行计划。',
      skills: ['Product', 'Development'],
      signal: 'Health Agent',
    },
    {
      education: '本科 | Undergraduate',
      organization: 'Tongji University',
      major: 'Organizational Analytics',
      coolestThing: '连续赢下创业周末赛事，并把速度感带进长期建设里。',
      building: 'AI-powered organizational health reports for businesses.',
      skills: ['Development', 'Design'],
      signal: 'Org Intelligence',
    },
  ],
  'hangzhou-0412': [
    {
      education: '本科 | Undergraduate',
      organization: 'Nodesk',
      major: 'Context Engineer',
      coolestThing: '敢承认自己不行，也敢从头再来。',
      building: 'AI 语音输入法和企业私域运营工具，把上下文变成生产力。',
      skills: ['Product', 'Development'],
      signal: 'Context Engineering',
    },
    {
      education: '本科 | Undergraduate',
      organization: '杭州有赞科技',
      major: 'AI Development Engineer',
      coolestThing: '主动克服公开表达恐惧，完成一次完整演讲。',
      building: '面向企业服务场景的语音 Agent。',
      skills: ['Development'],
      signal: 'B2B Voice Agent',
    },
    {
      education: '本科 | Undergraduate',
      organization: 'HealthTech Startup',
      major: 'CEO',
      coolestThing: '20 岁退役、退学后参与创立心理咨询平台，并做到行业头部规模。',
      building: '心理支持 Agent，持续理解用户状态并匹配合适的干预方式。',
      skills: ['Product', 'Development', 'Operations'],
      signal: 'Mental Health AI',
    },
    {
      education: '本科 | Undergraduate',
      organization: 'AI Founder Community',
      major: 'Industry + Ecosystem Operations',
      coolestThing: '把松散个体组织成可持续互助网络。',
      building: '一站式赋能 OPC 个体的 YC 式支持系统。',
      skills: ['Product', 'Operations', 'Business'],
      signal: 'Founder Network',
    },
  ],
  'shenzhen-0415': [
    {
      education: '硕士 | Master',
      organization: '东北大学',
      major: '控制科学与工程',
      coolestThing: '从硬件黑客松初赛打到全国总决赛，拿下商业价值奖。',
      building: '属于女性的 3D 打印机，让硬件创作更贴近日常真实需求。',
      skills: ['Hardware', 'Development'],
      signal: 'Inclusive Hardware',
    },
    {
      education: '硕士 | Master',
      organization: '北京大学 / NUS',
      major: 'Business Management + Financial Engineering',
      coolestThing: '把“想做”变成资源调动和系统学习，主动进入 AI 浪潮。',
      building: 'Neuro-symbolic AI for finance，把模糊需求理解和符号规则路由结合起来。',
      skills: ['Finance', 'AI Research'],
      signal: 'Neuro-symbolic AI',
    },
    {
      education: '本科 | Undergraduate',
      organization: 'AI Search Studio',
      major: 'AI Search Optimization / Instructor',
      coolestThing: '连续多月跨城市 AI 巡讲，把知识传播做成高密度行动。',
      building: '围绕新一代搜索入口持续迭代 GEO 搜索优化系统。',
      skills: ['Operations', 'Growth', 'AI'],
      signal: 'AI Search',
    },
    {
      education: '硕士 | Master',
      organization: '中山大学',
      major: '力学',
      coolestThing: '比赛中开发自己的算法解决问题，并得到极佳结果。',
      building: '把 AI 融入无人机操作流程，探索半自动化飞行设计。',
      skills: ['Algorithm', 'Robotics'],
      signal: 'Drone AI',
    },
  ],
  'shenzhen-intl-0416': [
    {
      education: '本科 | Undergraduate',
      organization: 'University of Hong Kong',
      major: 'Psychology + Neuroscience',
      coolestThing: '国际商业竞赛获奖，并把结果回流到公益场景。',
      building: '探索心理学、神经科学和消费产品之间的连接。',
      skills: ['Psychology', 'Consumer Product'],
      signal: 'Neuro Consumer',
    },
    {
      education: '本科 | Undergraduate',
      organization: 'Telegram Ecosystem',
      major: 'APAC Ecosystem',
      coolestThing: '深入真实生态场域，理解 AI、社区和跨境网络如何连接。',
      building: '连接 APAC 技术生态中的开发者、产品和社区资源。',
      skills: ['Ecosystem', 'Community'],
      signal: 'Network Builder',
    },
    {
      education: '硕士 | Master',
      organization: 'Peking University',
      major: 'Finance',
      coolestThing: '把竞技状态、身体控制和冒险精神一起带进生活里。',
      building: '关注金融、全球网络和青年创造者之间的交叉机会。',
      skills: ['Finance', 'Community'],
      signal: 'Global Finance',
    },
  ],
  'beijing-0402': [
    {
      education: '本科 | Undergraduate',
      organization: '清华大学',
      major: '交叉信息研究院',
      coolestThing: '把“永不认命、永不轻信”当作长期探索方式，而不是一次性项目。',
      building: '具备自主思考和行动能力的 AI Agent，希望推动生产力范式变化。',
      skills: ['Development', 'Design', 'Product'],
      signal: 'AI Agent',
    },
    {
      education: '硕士 | Master',
      organization: '北京协和医学院',
      major: '生命科学 / 策略',
      coolestThing: '把“活着”本身视为一个持续探索身体、技术和社会系统的实验。',
      building: '关注具身智能，把 AI 放进真实世界的行动闭环。',
      skills: ['Design', 'Product', 'Operations'],
      signal: 'Embodied AI',
    },
    {
      education: '本科 | Undergraduate',
      organization: 'Columbia University',
      major: 'Economics + Computer Science',
      coolestThing: '在加纳阿克拉做线下市场调研，用一天时间拆解轮胎市场规模。',
      building: 'AI MCN 与互动影游，把内容生产和用户互动做成新型叙事系统。',
      skills: ['Business', 'Product', 'Operations'],
      signal: 'Interactive Media',
    },
    {
      education: '本科 | Undergraduate',
      organization: 'Brunel University London / NIO',
      major: 'AI Product',
      coolestThing: 'Gap year 期间组织青年成长社群，独立发起多场线下活动。',
      building: '重做个人信息获取渠道，让大模型帮助处理大量非结构化信息。',
      skills: ['Product', 'Community'],
      signal: 'Personal AI OS',
    },
  ],
  'nanjing-0408': [
    {
      education: '硕士 | Master',
      organization: '南京大学',
      major: '大气科学',
      coolestThing: '为一件事持续投入三年，用长期主义穿透不确定性。',
      building: 'AI 电子衣橱，把个人风格、场景和衣物库存组织成智能助手。',
      skills: ['Product'],
      signal: 'Lifestyle Agent',
    },
    {
      education: '硕士 | Master',
      organization: '南京大学',
      major: '英语笔译',
      coolestThing: '连续六小时完成拼豆创作，把耐心、审美和手工密度压到极限。',
      building: 'AI 辅助求职工具，帮助候选人把经历翻译成更清晰的机会匹配。',
      skills: ['Operations', 'Product', 'Design'],
      signal: 'Career AI',
    },
    {
      education: '本科 | Undergraduate',
      organization: '南京大学',
      major: '智能科学与技术',
      coolestThing: '独立开发小程序和游戏，把想法直接变成可玩的原型。',
      building: '带策略技能的五子棋智能体，探索轻量级游戏 Agent。',
      skills: ['Product', 'Development'],
      signal: 'Game Agent',
    },
    {
      education: '硕士 | Master',
      organization: '南京大学',
      major: '建筑学',
      coolestThing: '让一个建筑设计真正落地，从图纸走到现实空间。',
      building: 'AI 自我档案馆，把人的记忆、作品和状态组织成可交互空间。',
      skills: ['Design'],
      signal: 'Memory Archive',
    },
  ],
  'beijing-hackathon-0314': [
    {
      education: '博士在读 | PhD Candidate',
      organization: '清华大学',
      major: 'Industrial Design',
      coolestThing: '高中临时转向艺术路径，坚持进入设计领域并持续做具体情境下的创造。',
      building: '社会角色机器人、互动装置和小而巧的硬件设计。',
      skills: ['Design', 'Product', 'Hardware'],
      signal: 'Robotic Objects',
    },
    {
      education: '未公开',
      organization: '中国传媒大学',
      major: 'AI Entrepreneurship',
      coolestThing: '围绕新叙事和社交传播做高强度实验，验证内容场景的流量潜力。',
      building: 'Audience-oriented AI product，面向创作者和观众关系重构。',
      skills: ['Product', 'Growth'],
      signal: 'Audience AI',
    },
    {
      education: '未公开',
      organization: 'Independent Builder',
      major: 'Automation / Workflow',
      coolestThing: '把一个人的工作流拆成可自动化模块，并持续寻找套利式效率提升。',
      building: 'OpenClaw + 一人公司：套利交易系统、自动化工作流、多智能体系统。',
      skills: ['Automation', 'Agents', 'Development'],
      signal: 'Solo Company OS',
    },
    {
      education: '未公开',
      organization: '高校创作网络',
      major: 'Creative Technology',
      coolestThing: '把社交、设计和技术混成同一个现场，快速做出能用的原型。',
      building: '围绕 OpenClaw 和个人效率的原型实验。',
      skills: ['Design', 'Development', 'Product'],
      signal: 'OpenClaw Hack',
    },
  ],
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9999.17) * 10000;
  return value - Math.floor(value);
}

function pickTemplate(eventId: string, index: number) {
  const templates = eventTemplates[eventId];
  if (!templates || templates.length === 0) {
    return {
      education: '未公开',
      organization: 'Outlier Network',
      major: 'Independent Builder',
      coolestThing: '在边界地带持续做自己认为重要的事。',
      building: 'Still building.',
      skills: ['Outlier'],
      signal: 'OUTLIER_SIGNAL',
    };
  }

  const base = templates[index % templates.length];
  const variant = Math.floor(index / templates.length);
  const skills = [...base.skills];
  if (variant % 5 === 1 && !skills.includes('AI')) skills.push('AI');
  if (variant % 7 === 2 && !skills.includes('Research')) skills.push('Research');
  if (variant % 6 === 3 && !skills.includes('Community')) skills.push('Community');

  return {
    ...base,
    coolestThing: variant === 0 ? base.coolestThing : `${base.coolestThing} // Iteration ${variant + 1}`,
    building: variant === 0 ? base.building : `${base.building} / Variant ${variant + 1}`,
    skills: skills.slice(0, 4),
    signal: variant === 0 ? base.signal : `${base.signal} ${variant + 1}`,
  };
}

const generatedPoints: TalentPlanetPoint[] = [];
let globalIndex = 0;

Object.entries(eventCounts).forEach(([eventId, count]) => {
  const eventName = eventNameByEventId[eventId];
  const { city, country } = cityCountryByEventId[eventId];

  for (let index = 0; index < count; index += 1) {
    const template = pickTemplate(eventId, index);
    const seed = Math.floor(seededRandom(globalIndex + 1) * 10_000_000_000_000);
    globalIndex += 1;

    generatedPoints.push({
      id: `talent-${String(globalIndex).padStart(3, '0')}`,
      maskedName: `OUTLIER-${String(globalIndex).padStart(3, '0')}`,
      eventId,
      eventName,
      city,
      country,
      education: template.education,
      organization: template.organization,
      major: template.major,
      coolestThing: template.coolestThing,
      building: template.building,
      skills: template.skills,
      signal: template.signal,
      seed,
    });
  }
});

export const talentPlanetPoints: TalentPlanetPoint[] = generatedPoints;
