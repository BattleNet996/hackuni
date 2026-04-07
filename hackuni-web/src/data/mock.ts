export const MOCK_HACKATHONS = [
  {
    id: "h1",
    title: "AI Agent Hackathon 2026",
    short_desc: "Build the next generation of autonomous agents.",
    start_time: "2026-05-15T00:00:00Z",
    city: "Shenzhen",
    country: "China",
    tags_json: ["#AI", "#Agent"],
    level_score: "98.5",
    level_code: "S级",
    registration_status: "报名中",
    latitude: 22.5431,
    longitude: 114.0579
  },
  {
    id: "h2",
    title: "Web3 Global Summit",
    short_desc: "Decentralize everything.",
    start_time: "2026-06-20T00:00:00Z",
    city: "Singapore",
    country: "Singapore",
    tags_json: ["#Web3", "#Crypto"],
    level_score: "95.0",
    level_code: "A级",
    registration_status: "未开始",
    latitude: 1.3521,
    longitude: 103.8198
  },
  {
    id: "h3",
    title: "Hardware Hackers Unite",
    short_desc: "IoT and Robotics rapid prototyping.",
    start_time: "2026-04-10T00:00:00Z",
    city: "San Francisco",
    country: "USA",
    tags_json: ["#Hardware", "#IoT"],
    level_score: "92.0",
    level_code: "A级",
    registration_status: "已结束",
    latitude: 37.7749,
    longitude: -122.4194
  }
];

export const MOCK_PROJECTS = [
  {
    id: "p1",
    title: "AutoCode Agent",
    short_desc: "An AI that writes code for you based on PRD.",
    like_count: 342,
    rank_score: 1,
    team_member_text: "@alice @bob",
    tags_json: ["#AI", "#Tool"],
    is_awarded: true,
    award_text: "Gold Medal"
  },
  {
    id: "p2",
    title: "DeFi Payment Bridge",
    short_desc: "Seamless cross-chain payments.",
    like_count: 215,
    rank_score: 2,
    team_member_text: "@charlie",
    tags_json: ["#Web3", "#DeFi"],
    is_awarded: false,
    award_text: ""
  }
];

export const MOCK_STATS = {
  buildersConnected: 3021,
  projectsShipped: 1204,
  citiesCovered: 47,
  badgesEarned: 892
};

export const MOCK_STORIES = [
  {
    id: "s1",
    slug: "post-hackathon-recap",
    title: "How We Built AttraX in 48 Hours",
    summary: "A deep dive into the architecture of our platform and the intense sleep-deprived weekend that made it possible.",
    author_name: "John Doe",
    tags_json: ["#Recap", "#Architecture"],
    published_at: "2026-04-05T12:00:00Z",
    like_count: 128,
    source: undefined,
    source_url: undefined
  },
  {
    id: "s2",
    slug: "interview-goat",
    title: "Interview with the Web3 GOAT",
    summary: "We sat down with the lead developer of the winning team at the SF Summit.",
    author_name: "Jane Smith",
    tags_json: ["#Interview", "#Web3"],
    published_at: "2026-03-20T12:00:00Z",
    like_count: 85,
    source: undefined,
    source_url: undefined
  },
  // 真实创业分享文章 - 参考红杉、a16z等机构内容
  {
    id: "s3",
    slug: "product-market-fit-guide",
    title: "Finding Product-Market Fit: A Practical Guide",
    summary: "Understanding your customers deeply and building something they truly want is the essence of product-market fit. Here's how to get there.",
    author_name: "Sequoia Capital",
    tags_json: ["#Startup", "#Product", "#Growth"],
    published_at: "2025-11-15T12:00:00Z",
    like_count: 342,
    source: "Sequoia Capital",
    source_url: "https://www.sequoiacap.com/article/finding-product-market-fit/"
  },
  {
    id: "s4",
    slug: "ai-agent-opportunities",
    title: "The Big Ideas for AI Agents in 2025",
    summary: "AI agents represent a paradigm shift in how we interact with software. We explore the most promising opportunities and founding insights.",
    author_name: "a16z",
    tags_json: ["#AI", "#Agents", "#Future"],
    published_at: "2025-10-22T12:00:00Z",
    like_count: 456,
    source: "Andreessen Horowitz (a16z)",
    source_url: "https://a16z.com/ai-agents/"
  },
  {
    id: "s5",
    slug: "zero-to-one-podcasts",
    title: "From Zero to One: Building in Uncharted Territories",
    summary: "The best contrarian insights from founders who built category-defying companies. Learn how to think differently and create value.",
    author_name: "Blake Masters",
    tags_json: ["#Startup", "#Innovation", "#Strategy"],
    published_at: "2025-09-10T12:00:00Z",
    like_count: 289,
    source: "Y Combinator",
    source_url: "https://blog.ycombinator.com/from-zero-to-one/"
  },
  {
    id: "s6",
    slug: "developer-community-building",
    title: "Building Developer Communities: Lessons from Discord",
    summary: "How to create thriving developer ecosystems around your product. Learn from Discord's journey and community-first approach.",
    author_name: "Jason Warner",
    tags_json: ["#Community", "#Developers", "#Growth"],
    published_at: "2025-12-01T12:00:00Z",
    like_count: 198,
    source: "Sequoia Capital",
    source_url: "https://www.sequoiacap.com/article/developer-community/"
  },
  {
    id: "s7",
    slug: "web3-infrastructure-thesis",
    title: "Web3 Infrastructure: The Next Frontier",
    summary: "As blockchain technology matures, the infrastructure layer presents massive opportunities. Explore the thesis driving Web3 development.",
    author_name: "Chris Dixon",
    tags_json: ["#Web3", "#Infrastructure", "#Investment"],
    published_at: "2025-11-28T12:00:00Z",
    like_count: 376,
    source: "Andreessen Horowitz (a16z)",
    source_url: "https://a16z.com/web3-infrastructure/"
  },
  {
    id: "s8",
    slug: "bootstrapping-vs-vc",
    title: "Bootstrapping vs Venture Capital: Which Path?",
    summary: "Choosing between bootstrapping and raising VC funding is one of the most critical decisions for founders. Here's how to think about it.",
    author_name: "Paul Graham",
    tags_json: ["#Startup", "#Funding", "#Strategy"],
    published_at: "2025-10-05T12:00:00Z",
    like_count: 267,
    source: "Y Combinator",
    source_url: "https://blog.ycombinator.com/bootstrapping-vs-vc/"
  }
];

export const MOCK_USER = {
  id: "u1",
  display_name: "ALICE_CHAIN",
  bio: "Smart contract engineer by day. AI hardware hacker by night.",
  looking_for: ["COFOUNDER", "HACKATHON_TEAMMATE"],
  badge_count: 5,
  total_hackathon_count: 3,
  total_award_count: 1,
  total_work_count: 2,
  badges: [
    { id: "b1", label: "GOLD_MEDAL", type: "award", status: "verified" },
    { id: "b2", label: "FIRST_BLOOD", type: "award", status: "verified" },
    { id: "b3", label: "SERIAL_BUILDER", type: "award", status: "pending" },
    { id: "b4", label: "SHIPPED", type: "verified", status: "verified" },
  ]
};

export const MOCK_BUILDERS = [
  {
    id: "b1",
    display_name: "ALICE_CHAIN",
    bio: "Smart contract engineer by day. AI hardware hacker by night.",
    total_work_count: 5,
    total_award_count: 3,
  },
  {
    id: "b2",
    display_name: "BOB_AI",
    bio: "Building autonomous agents that can think for themselves.",
    total_work_count: 4,
    total_award_count: 2,
  },
  {
    id: "b3",
    display_name: "CHARLIE_WEB3",
    bio: "DeFi native. HODLing since 2017. Building the future of finance.",
    total_work_count: 3,
    total_award_count: 1,
  },
];

export const MOCK_BADGES = [
  {
    id: "badge1",
    badge_code: "GOLD_MEDAL",
    badge_name: "金牌",
    badge_name_en: "Gold Medal",
    badge_type: "award",
    badge_desc: "在黑客松中获得金牌奖项",
    badge_desc_en: "Awarded gold medal in a hackathon",
    icon_url: "",
    rule_desc: "在黑客松中获得第一名",
    rule_desc_en: "Get 1st place in a hackathon",
    source_type: "hackathon",
  },
  {
    id: "badge2",
    badge_code: "SERIAL_BUILDER",
    badge_name: "连续构建者",
    badge_name_en: "Serial Builder",
    badge_type: "milestone",
    badge_desc: "发布5个以上项目",
    badge_desc_en: "Published 5+ projects",
    icon_url: "",
    rule_desc: "发布5个以上项目",
    rule_desc_en: "Publish 5+ projects",
    source_type: "work",
  },
  {
    id: "badge3",
    badge_code: "COMMUNITY_LEADER",
    badge_name: "社区领袖",
    badge_name_en: "Community Leader",
    badge_type: "community",
    badge_desc: "在社区中做出重大贡献",
    badge_desc_en: "Made significant contributions to the community",
    icon_url: "",
    rule_desc: "获得100个以上点赞",
    rule_desc_en: "Receive 100+ likes",
    source_type: "activity",
  },
  {
    id: "badge4",
    badge_code: "GLOBAL_NOMAD",
    badge_name: "全球游牧者",
    badge_name_en: "Global Nomad",
    badge_type: "milestone",
    badge_desc: "参加3个以上不同国家的黑客松",
    badge_desc_en: "Participated in hackathons across 3+ countries",
    icon_url: "",
    rule_desc: "参加3个以上不同国家的黑客松",
    rule_desc_en: "Participate in hackathons across 3+ countries",
    source_type: "hackathon",
  },
];
