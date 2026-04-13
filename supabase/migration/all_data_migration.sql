-- HackUni Web - Complete Data Migration
-- Generated: 2026-04-13T13:37:52.180Z
-- Source: SQLite database/hackuni.db
-- Target: Supabase PostgreSQL

BEGIN;

-- ========================================
-- Table: users
-- ========================================
-- Clear existing data
DELETE FROM users;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id), 0) + 1, false) FROM users;

-- Insert data
INSERT INTO users (id, email, password_hash, display_name, avatar, bio, school, major, company, position, phone, twitter_url, github_url, website_url, looking_for, total_hackathon_count, total_work_count, total_award_count, badge_count, certification_count, created_at, updated_at, is_banned) VALUES
  ('u1', 'alice@example.com', '$2b$10$p7ziAj3VAxgdCKyUbgIfyOQn95BcaM.ySX8qIAxjmvUgxsgOK3udq', 'ALICE_CHAIN', NULL, 'Smart contract engineer by day. AI hardware hacker by night.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '["COFOUNDER","HACKATHON_TEAMMATE"]'::jsonb, 3, 2, 1, 5, 2, '2026-04-07 17:21:58', '2026-04-08 09:40:36', FALSE),
  ('u_1775630509451_k18ngjsga', 'charleschen01@foxmail.com', '$2b$10$seifGZPXGsbJx9Ayw2Xsy.y.dvHxKAyFfi4qCAWcVXf9ZACFujNuK', '毕之爱吃鱼', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb, 0, 0, 0, 0, 0, '2026-04-08 06:41:49', '2026-04-08 09:40:37', FALSE),
  ('u_1775735969135_rr0t8z5j3', '1340709767@qq.com', '$2b$10$qL9fjqOqBhlHwjzQZiML5eFHL8JruExjLg7Xwf8u7g3F4.ReyZbgy', '毕之爱吃鱼', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]'::jsonb, 0, 0, 0, 0, 0, '2026-04-09 11:59:29', '2026-04-09 11:59:29', FALSE);

-- ========================================
-- Table: hackathons
-- ========================================
-- Clear existing data
DELETE FROM hackathons;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('hackathons', 'id'), coalesce(max(id), 0) + 1, false) FROM hackathons;

-- Insert data
INSERT INTO hackathons (id, title, short_desc, description, start_time, end_time, registration_deadline, city, country, latitude, longitude, location_detail, tags_json, level_score, level_code, registration_status, poster_url, organizer, organizer_url, registration_url, requirements, prizes, fee, hidden, created_at, updated_at) VALUES
  ('h0', '深圳 春潮·Spring AI/硬件黑客松', '集结跨学科领域中不愿被主流归类的创新者，以「快乐、叛逆、自由」为精神，探索边界之外的可能。We engineer the UNNECESSARY', '打造国内最有趣、潮流的创新者场域。这是一次以黑客松为主题的社会性事件，更是一场「Outlier」的创客宣言。我们是一群因好奇而躁动、因热爱而相遇的人。我们快乐、叛逆、爱表达，命中注定要做一些打破规则的事。核心精神：快乐、叛逆、自由。跨学科创新者聚集，打造国内最潮流的创客场景。', '2026-04-23T00:00:00Z', '2026-04-26T23:59:59Z', NULL, 'Shenzhen', China, 22.5431, 114.0579, '深圳 BREWTOWN 啤酒小镇', '["#AI","#Hardware","#Outlier","#Spring","#Shenzhen"]'::jsonb, '99.0', 'S级', '报名中', 'https://brewtown.cn/', 'Attrax（由清华和北大学生发起）', NULL, NULL, NULL, NULL, NULL, FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('xhs-hackathon-peak-2026', '小红书首届"黑客松巅峰赛"', '小红书举办首届黑客松巅峰赛，聚焦00后AI创造群体，总奖金池50万元', '小红书首届"黑客松巅峰赛"于2026年3月20日正式启动报名，线下决赛于4月7日至10日在上海张江科学会堂举行。这是小红书今年规模最大的线下科技活动，聚焦00后创造群体，设置了50万元总奖金池。赛事采用"定向邀请+站内招募"的报名方式，最终入围约200名选手，分为硬件和软件两大竞赛单元，在线下决赛中进行48小时极限创作，并在Demo Day进行路演展示和现场答辩。全场大奖最高单项奖金20万元，另设5个特别单元奖，总奖金10万元。', '2026-04-07 09:00:00+08', '2026-04-10 18:00:00+08', '2026-04-01 23:59:59+08', '上海', 中国, 31.2087, 121.6024, '上海张江科学会堂', '["AI", "硬件", "软件", "创意", "00后"]'::jsonb, '5', 'S', 'closed', NULL, '小红书（Xiaohongshu）', 'https://www.xiaohongshu.com', 'https://www.xiaohongshu.com', '面向00后创造群体，采用"定向邀请+站内招募"方式，约200名选手入围，分硬件和软件两个赛道', '总奖金池50万元人民币；全场大奖20万元；硬件赛道10万元；软件赛道10万元；5个特别单元奖共10万元', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('makermods-openclaw-amd-shenzhen-2026', 'MakerMods × OpenClaw × AMD 具身智能黑客松（深圳站）', '聚焦Physical AI的全球性技术赛事，33小时真机实战，250+全球开发者参与', '由硅谷团队MakerMods发起，联合OpenClaw与AMD共同举办的具身智能黑客松，于2026年3月28日至29日在深圳南山区桃里平山百校大街·校友会馆举行。活动提供25台XLeRobot机器人和10台3D打印机，要求开发者在33小时内完成从创意到真实物理部署的全流程。AMD通过"云-边-端"协同方案，为参赛者构建了易用的Physical AI开发环境。共吸引超过250名来自中国及硅谷的开发者参与，设有硬件结构创新、仿真转真机、Industrial、OpenClaw最佳使用等多个赛道。', '2026-03-28 09:00:00+08', '2026-03-29 18:00:00+08', '2026-03-25 23:59:59+08', '深圳', 中国, 22.5431, 113.9344, '深圳南山区桃里平山百校大街·校友会馆', '["具身智能", "Physical AI", "机器人", "AMD", "硬件", "AI"]'::jsonb, '4', 'A', 'closed', NULL, 'MakerMods / OpenClaw / AMD', 'https://www.makermods.com', 'https://opc.so/openclaw', '面向具身智能开发者，需具备一定的机器人或AI开发基础，团队或个人均可参与', '设有多个赛道奖项，AMD算力资源支持；具体奖金未公开披露', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('fujian-ai-hackathon-2026', '福建首届AI黑客松大赛（爱XIA创）', '福建规模最大AI主题黑客松，48小时极限挑战，打造"赛孵投"创新生态', '福建首届AI黑客松大赛"爱XIA创"于2026年3月28日至29日在厦门软件园三期举行，历时48小时。这是福建规模最大的AI主题黑客松，汇聚了开发者、高中生、大学生等群体。全国500余人报名，超百人入围，其中三四成选手来自外地，还有海外参与者。优胜团队将获得福建省（厦门）人工智能产业园孵化器的直通名额，享受办公空间、对接10亿元孵化基金、全周期创业导师陪伴及OPC孵化体系支持。', '2026-03-28 09:00:00+08', '2026-03-29 18:00:00+08', '2026-03-25 23:59:59+08', '厦门', 中国, 24.4798, 118.0894, '厦门软件园三期', '["AI", "创业", "孵化", "大学生", "开发者"]'::jsonb, '3', 'B', 'closed', NULL, '福建省（厦门）人工智能产业园孵化器', NULL, NULL, '面向开发者、大学生、高中生，团队参赛，接受外地及海外参与者', '优胜团队获孵化园直通名额、10亿元孵化基金对接资源；具体现金奖金未公开', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('ibss-etron-ai-agent-hackathon-2026', 'IBSS × Etron AI Agent 黑客松', '西交利物浦大学20周年庆典活动，AI智能体赋能真实商业场景，四大行业赛道', '作为西交利物浦大学20周年庆典活动之一，IBSS × Etron AI Agent黑客松决赛于2026年3月29日在苏州举行。赛事主题为"AI Agents赋能真实商业，创新方案驱动产业升级"，由国际商学院苏州（IBSS）与亿通科技联合主办，西交利物浦大学Learning Mall协办，Dify和CFA协会赞助。四个决赛赛道分别聚焦医疗、餐饮、外贸和教育行业，测试参赛者的技术应用能力和商业理解能力。', '2026-03-29 09:00:00+08', '2026-03-29 18:00:00+08', '2026-03-20 23:59:59+08', '苏州', 中国, 31.2983, 120.5832, '西交利物浦大学 Learning Mall', '["AI Agent", "商业", "医疗", "餐饮", "外贸", "教育", "大学生"]'::jsonb, '3', 'B', 'closed', NULL, 'IBSS（国际商学院苏州）/ 亿通科技（Etron）', 'https://www.xjtlu.edu.cn', 'https://www.xjtlu.edu.cn/en/news/2026/03/ibss-and-etron-stage-ai-agent-hackathon-final', '面向西交利物浦大学及各专业学生，团队参赛，需具备一定AI或商业背景', '设有赛道冠军、特别奖等多个奖项；亿通科技计划为获奖项目提供实习及就业通道', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('shanghai-sasac-agent-hackathon-2026', '上海国资国企智能体开放主题黑客松挑战赛', '上海市国资委发起，开放50个国企智能体赛题，推动AI技术赋能国资国企转型', '2026年3月28日，上海市国资委在2026全球开发者先锋大会（GDPS）期间启动"智能体开放主题黑客松挑战赛"。赛事向社会开放来自8家重点市属国企的50道场景赛题，鼓励国企同民企等各类市场主体组建创新团队，通过同台竞技、协同开发开展跨界协作，促进产业协同创新。市国资委、徐汇区国资委携手启动2026国资国企AI+场景征集活动，面向市属企业及区属企业征集具备典型示范作用的标杆场景。', '2026-03-28 09:00:00+08', NULL, NULL, '上海', 中国, 31.2304, 121.4737, '上海（具体场地待定）', '["AI Agent", "智能体", "国企", "场景应用", "产业创新"]'::jsonb, '4', 'A', 'open', NULL, '上海市国有资产监督管理委员会', 'https://www.gzw.sh.gov.cn', 'https://www.gzw.sh.gov.cn/shgzw_xwzx_gzyw/20260330/04482891f23c42ebbfbd7631b4a9f730.html', '面向OPC创业团队、科研机构、创新型企业，可组建跨界创新团队', '具体奖金未公开，优秀成果将获得产业基金、孵化平台和创新基地等资源支持', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('tencent-cloud-pentest-hackathon-2026-s2', '第二届腾讯云黑客松智能渗透挑战赛', '基于大语言模型构建AI智能体，挑战真实攻防场景，22万元现金奖励', '由腾讯云鼎实验室-腾讯安全众测平台发起的第二届"黑客松-智能渗透挑战赛"，于2026年3月18日开放报名，报名截至4月8日。本届赛事升级：需基于大语言模型构建AI智能体，实现从"解题"到"破网"的实战跨越，挑战多层真实攻防场景。另设"零界"AI社交博弈战场（线上挑战赛：4月13日至17日）。前10支队伍瓜分22万现金，另有腾讯实习直通车、腾讯云专属权益等奖励。', '2026-04-13 00:00:00+08', '2026-04-17 23:59:59+08', '2026-04-08 23:59:59+08', '线上', 中国, NULL, NULL, '线上（腾讯安全众测平台）', '["网络安全", "AI Agent", "渗透测试", "LLM", "CTF"]'::jsonb, '4', 'A', 'closed', NULL, '腾讯云鼎实验室 / 腾讯安全众测平台', 'https://cloud.tencent.com', 'https://cloud.tencent.com/developer/article/2640523', '面向安全研究人员、白帽子、开发者，需具备AI和网络安全相关知识，团队参赛', '前10支队伍瓜分22万元现金；腾讯实习直通车；腾讯云专属权益；周边好礼', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('mingwan-glimmer-hackathon-2026', '明湾"微光黑客松"夏令营', '深圳明湾学校发起，面向青少年的AI公益黑客松，关注真实社会问题', '由深圳明湾学校发起的"微光黑客松"夏令营，于2026年7月9日至12日在深圳明湾学校举行。活动面向青少年，以"用AI照亮他人世界"为主题，引导孩子直面真实社会问题（如残障人士、老年人数字鸿沟等），用AI技术创造有温度的解决方案。招募"舰长"（教师/教育创业者）带领2-6名学生组队参加，也开放学生单人报名。5月至6月将组织多场线上交流会和舰长培训。', '2026-07-09 09:00:00+08', '2026-07-12 18:00:00+08', '2026-06-30 23:59:59+08', '深圳', 中国, 22.5431, 113.9344, '深圳明湾学校', '["AI", "教育", "青少年", "公益", "社会创新"]'::jsonb, '3', 'B', 'open', NULL, '深圳明湾学校', NULL, 'https://news.qq.com/rain/a/20260401A06TJC00', '面向青少年（中小学生），舰长带队（2-6名学生），也接受学生单人报名；舰长需为教师或教育创业者', '优秀方案将获得落地推广资源支持；无现金奖励', '报名费0元；往返交通、食宿需自理', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('ethglobal-cannes-2026', 'ETHGlobal Cannes 2026', 'ETHGlobal首个线下黑客松，810名来自59个国家的开发者，奖金逾15万美元', 'ETHGlobal Cannes 2026是ETHGlobal 2026年首个线下黑客松，于2026年4月3日至5日在法国戛纳举行，吸引了来自59个国家的810名开发者参与。赛事聚焦以太坊生态系统，涵盖AI x Crypto、DeFi、ZK Proofs等主题，提供超过15万美元的奖金池。活动包括工作坊、导师辅导和Web3项目创建等环节。', '2026-04-03 09:00:00+01', '2026-04-05 18:00:00+01', '2026-03-25 23:59:59+01', '戛纳', 法国, 43.5528, 7.0174, 'Cannes, France', '["Web3", "Ethereum", "AI x Crypto", "DeFi", "ZK Proofs", "区块链"]'::jsonb, '5', 'S', 'closed', NULL, 'ETHGlobal', 'https://ethglobal.com', 'https://ethglobal.com/events/cannes2026', '面向以太坊开发者，需提交申请并通过审核，需质押一定ETH作为出席保证', '总奖金超过150,000美元；设有多个协议赞助奖项（ENS $20,000、0G $15,000、Sui $15,000等）', '免费（需质押ETH保证出席）', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('ethglobal-newyork-2026', 'ETHGlobal New York 2026', '全球最大Web3黑客松之一，800+参与者，聚焦AI x Crypto、ZK Proofs、DeFi', 'ETHGlobal New York 2026将于2026年6月12日至14日在纽约大都会展馆（Metropolitan Pavilion）举行。赛事聚焦以太坊生态，涵盖Zero Knowledge Proofs、AI x Crypto、DeFi、Layer 2s、Interoperability等主题，提供多个协议赞助奖项。活动包括800+参与者、11+协议、29+工作坊，对新手友好，提供技术导师支持和免费餐饮。', '2026-06-12 09:00:00-04', '2026-06-14 18:00:00-04', '2026-05-31 23:59:59-04', '纽约', 美国, 40.7128, -74.006, 'Metropolitan Pavilion, 125 W 18th St, New York, NY 10011', '["Web3", "Ethereum", "AI x Crypto", "ZK Proofs", "DeFi", "Layer 2"]'::jsonb, '5', 'S', 'open', NULL, 'ETHGlobal', 'https://ethglobal.com', 'https://ethglobal.com/events/newyork2026', '面向以太坊开发者，需提交申请并通过审核，需质押ETH作为出席保证；新手友好', '多个协议赞助奖项：ENS $20,000、0G $15,000、Sui $15,000、World $15,000、Uniswap Foundation $10,000、Dynamic $10,000等', '免费（需质押ETH保证出席）', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('hack-nation-global-ai-hackathon-5th-2026', 'Hack-Nation 第5届全球AI黑客松', '全球混合式AI黑客松，24小时极限创作，$30K+奖金及$150K+ API额度', 'Hack-Nation第5届全球AI黑客松于2026年4月25日至26日举行，采用线上+全球Hub混合模式。活动在旧金山、斯坦福、MIT、纽约、巴黎、伦敦、慕尼黑、苏黎世等15+个城市设有本地Hub。参赛者无需提前准备创意，活动当天将公布挑战题目，提供MIT教职人员和OpenAI等顶级导师指导。合作伙伴包括Databricks、World Bank、OpenAI、Lovable等。优秀团队可进入Venture Track创业孵化计划。', '2026-04-25 11:15:00-04', '2026-04-26 16:00:00-04', '2026-04-17 23:59:59-04', '线上/全球多城市', 全球, NULL, NULL, '线上 + 全球15+城市本地Hub（旧金山、斯坦福、MIT、纽约、巴黎、伦敦、慕尼黑、苏黎世、亚美尼亚叶里温、印度德里、巴基斯坦GIKI等）', '["AI", "创业", "全球", "混合式", "Venture Track"]'::jsonb, '4', 'A', 'open', NULL, 'Hack-Nation', 'https://hack-nation.ai', 'https://hack-nation.ai', '面向全球开发者、研究人员和创新者，免费开放报名，无需提前准备创意', '$30,000+现金奖金及API额度；活动期间提供$150,000+ API额度；优秀团队进入Venture Track', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('zervehack-2026', 'ZerveHack：Zerve AI 数据科学黑客松', '使用Zerve AI原生数据科学平台，分析数据集并构建可部署的应用或API，$10,000奖金', 'ZerveHack是由Zerve AI主办的在线数据科学黑客松，截止日期为2026年4月29日。挑战要求参赛者使用Zerve平台（AI原生数据科学平台）构建原创项目，分析数据集并发布可供他人使用的分析报告、应用或API。提供预测市场与预测、金融与经济、体育与竞技、气候与能源、社会与文化趋势等五大数据集方向，也可自带数据。目前已有1665名参与者报名。', '2026-03-15 00:00:00+00', '2026-04-29 18:00:00+00', '2026-04-29 18:00:00+00', '线上', 全球, NULL, NULL, '线上（全球，魁北克省除外）', '["AI", "数据科学", "机器学习", "数据分析", "API", "应用开发"]'::jsonb, '3', 'B', 'open', NULL, 'Zerve AI', 'https://zerve.ai', 'https://zervehack.devpost.com/', '需年满法定成年年龄，仅限特定国家/地区参与（魁北克省除外）', '1st Place: $5,000；2nd Place: $3,000；3rd Place: $2,000；总奖金$10,000', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('0g-hackquest-apac-hackathon-2026', '0G × HackQuest 亚太黑客松', '全奖$150K，聚焦Web 4.0时代AI智能体编排，面向亚太区开发者', '0G与HackQuest联合举办的亚太黑客松，于2026年3月19日开放报名，截止日期为2026年5月9日。赛事聚焦Web 4.0时代AI智能体的编排与应用，总奖金池为$150,000美元。设有线上Checkpoint（3月下旬）供参赛团队提交阶段性进展。面向亚太区开发者，通过HackQuest平台报名。', '2026-03-19 00:00:00+08', '2026-05-09 23:59:59+08', '2026-05-09 23:59:59+08', '线上', 全球（亚太区为主）, NULL, NULL, '线上（HackQuest平台）', '["Web3", "AI Agent", "Web 4.0", "亚太", "区块链"]'::jsonb, '4', 'A', 'open', NULL, '0G / HackQuest', 'https://hackquest.io', 'https://juejin.cn/post/7620307193842663458', '面向亚太区开发者，团队参赛，需在HackQuest平台注册报名', '总奖金池$150,000美元；设有多个赛道奖项', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('agents-assemble-healthcare-ai-2026', 'Agents Assemble: Healthcare AI Hackathon', '聚焦医疗AI智能体应用，在线黑客松，探索AI在医疗保健领域的创新解决方案', 'Agents Assemble是一场面向医疗保健领域的AI智能体在线黑客松，托管于Devpost平台。赛事鼓励参赛者利用AI Agent技术解决医疗保健领域的真实问题，包括患者护理、医疗数据分析、临床决策支持等方向。', '2026-03-20 00:00:00+00', '2026-04-30 23:59:59+00', '2026-04-30 23:59:59+00', '线上', 全球, NULL, NULL, '线上（Devpost平台）', '["AI Agent", "医疗", "Healthcare", "机器学习", "智能体"]'::jsonb, '3', 'B', 'open', NULL, 'Agents Assemble（Devpost）', 'https://devpost.com', 'https://agents-assemble.devpost.com/', '面向全球开发者，个人或团队均可参与，需在Devpost平台注册', '具体奖金详见官网', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('amd-e2e-speedrun-hackathon-2026', 'AMD E2E SpeedRun GPU Kernel 优化黑客松', '总奖金池110万美元，聚焦GPU kernel优化与端到端推理加速', 'AMD发起的E2E SpeedRun黑客松，总奖金池高达110万美元，聚焦GPU kernel优化与端到端（E2E）推理加速。参赛者需在AMD硬件平台上优化AI推理性能，探索ROCm生态系统的极限。赛事面向全球AI/ML开发者，通过Luma平台报名。', '2026-03-17 00:00:00+00', '2026-04-30 23:59:59+00', '2026-04-20 23:59:59+00', '线上', 全球, NULL, NULL, '线上', '["GPU", "AI", "机器学习", "AMD", "ROCm", "推理优化", "kernel"]'::jsonb, '5', 'S', 'open', NULL, 'AMD', 'https://www.amd.com', 'https://luma.com/cqq4mojz', '面向全球AI/ML开发者，需具备GPU编程和深度学习框架经验', '总奖金池$1,100,000美元', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('paddlepaddle-hackathon-deepin-2026', '飞桨黑客松 Deepin 赛道 2026', '百度飞桨开源社区黑客松，聚焦Deepin系统适配与AI生态建设，丰厚奖金', '飞桨（PaddlePaddle）黑客松Deepin赛道于2026年3月30日启动，面向开发者参与飞桨框架在Deepin操作系统上的适配与优化工作。打卡任务激励：前10名完成者可获得100元价值礼品，所有完赛选手有电子证书；进阶任务奖项：每道赛题设置2名，单人奖金2000元。', '2026-03-30 00:00:00+08', '2026-05-31 23:59:59+08', '2026-05-31 23:59:59+08', '线上', 中国, NULL, NULL, '线上（飞桨开源社区平台）', '["AI", "深度学习", "开源", "飞桨", "PaddlePaddle", "Deepin", "Linux"]'::jsonb, '3', 'B', 'open', NULL, '百度飞桨（PaddlePaddle）/ Deepin', 'https://www.paddlepaddle.org.cn', 'https://www.oschina.net/news/416039', '面向开发者，需具备Python和深度学习基础，个人参赛', '打卡任务：前10名100元礼品；进阶任务：每题2名，单人奖金2000元；所有完赛选手获电子证书', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08'),
  ('solana-dev-camp-s2-2026', '2026 Solana 开发者训练营 S2（含黑客松）', '由Solar与Solana Foundation联合举办，面向华语区开发者的Solana训练营与黑客松', '2026 Solana开发者训练营Season 2由Solar和Solana Foundation共同举办，0x、Titan、MagicBlock支持，联合华语区头部的21家开发者社区和21个大学区块链协会为华语区开发者量身打造。训练营时间为2026年3月31日至5月31日，包含Dev黑客松（线上）和深圳线下开发者茶话会等活动。', '2026-03-31 00:00:00+08', '2026-05-31 23:59:59+08', '2026-04-30 23:59:59+08', '线上/深圳', 中国, NULL, NULL, '线上 + 深圳线下（具体场地待定）', '["Web3", "Solana", "区块链", "开发者", "华语区", "DeFi"]'::jsonb, '3', 'B', 'open', NULL, 'Solar / Solana Foundation', 'https://www.solar.team', 'https://luma.com/6ou80u5n', '面向华语区Solana开发者，个人或团队均可参与', '具体奖金未公开披露', '免费', FALSE, '2026-04-13 09:49:08', '2026-04-13 09:49:08');

-- ========================================
-- Table: projects
-- ========================================
-- Clear existing data
DELETE FROM projects;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('projects', 'id'), coalesce(max(id), 0) + 1, false) FROM projects;

-- Insert data
INSERT INTO projects (id, title, short_desc, long_desc, like_count, rank_score, team_member_text, tags_json, is_awarded, award_text, images, demo_url, github_url, website_url, related_hackathon_id, author_id, status, hidden, created_at, updated_at) VALUES
  ('p1', 'AI Director Agent System', '基于agent+workflow环境的电影导演工作站', NULL, 157, 1, 'Beans', '["#AI","#Agent","#Workflow"]'::jsonb, TRUE, '最具创意奖', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p2', 'Career888', '帮dd司机找工作（bishi) 基于飞书的自动化岗位投递系统（真）', NULL, 142, 2, 'Career888', '["#AI","#Feishu","#Job"]'::jsonb, TRUE, '最佳实用奖', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p3', '水獭星球', 'AI-native儿童创意学习平台+智能配件', NULL, 128, 3, '水獭星球', '["#AI","#Education","#Hardware"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p4', 'Vizard', '高质量Manim动画的"技术平权"，迈向"超级个体"的创作工具', NULL, 115, 4, 'Vizard', '["#AI","#Animation","#Tool"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p5', 'Beiketown', '基于OpenClaw多层Agent架构设计的校园开放世界像素风社交平台', NULL, 108, 5, 'Beiketown', '["#OpenClaw","#Social","#Metaverse"]'::jsonb, TRUE, '最佳技术奖', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p6', '第一枚符号/The first symbol', '一个AI-native游戏，你将和一只 AI 龙虾搭档，把世界从 01 重新进化成语言、符号与生命。', NULL, 99, 6, '代码虾', '["#AI","#Game","#Philosophy"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p7', 'Claworld', '这是一个属于龙虾的世界', NULL, 93, 7, '相非相', '["#OpenClaw","#A2A","#UGC"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p8', '灵伴LingSoul-儿童医疗AI陪护玩偶', '基于终端传录和OpenClaw调动，实现在玩偶中语音互动、视觉监护、主动陪护的儿童智能陪伴', NULL, 88, 8, '从0.2开始的硬件开发', '["#Hardware","#AI","#Healthcare"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p9', 'Aociety', 'AI驱动的社会模拟RPG，36位NPC基于动机与系统数值自主行动', NULL, 82, 9, 'Aociety', '["#AI","#Game","#RPG"]'::jsonb, TRUE, '最佳游戏设计奖', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p10', 'Mira', '世界上第一个实时感知、主动照顾的AI伴侣', NULL, 157, 10, 'Mira', '["#AI","#Healthcare","#SmartHome"]'::jsonb, TRUE, '最具创新奖', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p11', 'ClawSight', '个人Bloomberg信息终端', NULL, 76, 11, 'ClawSight', '["#AI","#Finance","#Data"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p12', 'GeneticFlowAgent: Research Evolution Navigator', '通过自动化分析文献数据，构建研究方向演化地图，为研究者提供个性化叙事分析', NULL, 73, 12, '科研塞尔达', '["#AI","#Research","#Academic"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p13', 'MomoClaw', '家庭桌面具身智能开源平台', NULL, 69, 13, 'MomoCLAW', '["#Hardware","#OpenClaw","#Robotics"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p14', 'AI桌游DM', '用 AI 当地下城主 + 机械臂当"DM的手"，跑一场沉浸式柯南《贝克街的亡灵》推理剧本', NULL, 86, 14, '虾虾侦探社', '["#AI","#Game","#Hardware"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p15', 'AIHost', '用 AI 做活动主持人，解放人类', NULL, 80, 15, 'AIHost', '["#AI","#Event","#Automation"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p16', 'Other Me', '另一个时空的自己', NULL, 65, 16, 'Ctrl Z', '["#AI","#Metaverse","#Social"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p17', 'clawdpaper', '基于OpenClaw和GPT5.4的multi agent AI 论文合伙人系统', NULL, 92, 17, 'clawdpaper', '["#OpenClaw","#AI","#Academic"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p18', 'OpenDairy', '人类的记忆最重要，我们做帮你早记录早享受的基建', NULL, 59, 18, '人类的虾脑', '["#AI","#Memory","#Diary"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p19', 'RemoteLab - 面向超级个体的 AI IDE', '面向超级个体的 AI IDE', NULL, 77, 19, '流程宇宙', '["#AI","#IDE","#Tool"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p20', '龙虾勇士', '由OpenClaw驱动的3D AI智能体丧尸生存游戏，用语音指挥你的AI战友', NULL, 135, 20, '龙虾勇士队', '["#OpenClaw","#Game","#3D","#Voice"]'::jsonb, TRUE, '最佳娱乐奖', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p21', 'Multiverse', '合上书本，故事仍在继续...', NULL, 70, 21, 'Multiver', '["#AI","#Reading","#Interactive"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p22', '先贤智囊团', '借用华夏先贤的智慧为现代AI企业赋能', NULL, 56, 22, '自然醒', '["#AI","#Wisdom","#Enterprise"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p23', 'PawsX宠友宝', '一款帮助养宠人快速找到宠物友好地点的LBS小程序，从深圳前海起步', NULL, 63, 23, 'Paws', '["#LBS","#Pet","#Social"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p24', '时光', '用一张照片和一段声音，把这一刻留住，发给我在意的人', NULL, 74, 24, '回声', '["#Photo","#Audio","#Memory"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p25', '医保保 YIBobo', 'AI决策，保险兜底—— 全球首个责任兜底型AI医疗系统', NULL, 145, 25, '医保保', '["#AI","#Healthcare","#Insurance"]'::jsonb, TRUE, '最佳社会影响奖', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58'),
  ('p26', 'NotePassing', '基于 BLE 发现的近距离匿名社交 App', NULL, 59, 26, '海盐苏打饼干404not found', '["#Bluetooth","#Social","#LBS"]'::jsonb, FALSE, '', NULL, NULL, NULL, NULL, NULL, NULL, 'published', FALSE, '2026-04-07 17:21:58', '2026-04-07 17:21:58');

-- ========================================
-- Table: stories
-- ========================================
-- Clear existing data
DELETE FROM stories;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('stories', 'id'), coalesce(max(id), 0) + 1, false) FROM stories;

-- Insert data
INSERT INTO stories (id, slug, title, summary, source, source_url, author_name, content, tags_json, published_at, like_count, status, hidden, created_at, updated_at) VALUES
  ('story_001', 'a16z-where-enterprises-adopting-ai-2026', 'Where Enterprises are Actually Adopting AI', 'a16z 基于内部数据与数百次企业高管访谈，首次披露企业级 AI 落地的硬数据：财富 500 强中已有 29% 成为头部 AI 初创公司的付费客户，全球 2000 强中这一比例为 19%。落地最快的三大场景依次为编程、客服与搜索，科技、法律和医疗行业领跑。文章深入分析了各场景的商业逻辑，并指出编程是 AI 落地的数量级领先用例，其影响将向上游渗透至所有软件领域。', 'a16z', 'https://a16z.com/where-enterprises-are-actually-adopting-ai/', 'Kimberly Tan', 'a16z 基于对数千家企业的对话与内部数据，汇总出迄今最具说服力的企业 AI 落地报告。核心数据显示，财富 500 强中 29%、全球 2000 强中 19% 已成为头部 AI 初创公司的正式付费客户——这意味着企业已完成从 POC 到生产部署的完整转化，而非仅停留在试点阶段。

**编程：数量级领先的第一用例**
编程是迄今最主导的 AI 应用场景，领先幅度接近一个数量级。Cursor 的爆炸式增长、Claude Code 与 Codex 的超高速扩张印证了这一点。代码天然适合 AI：数据密集、文本形态、语法精确且可验证，形成紧密的反馈闭环。顶尖工程师借助 AI 编程工具生产力提升 10–20 倍，ROI 极为清晰。

**客服：另一极的高价值场景**
客服与编程形成"哑铃"两端。AI 在客服领域表现卓越，原因在于：任务边界清晰（如退款处理）、SOP 文档完备、KPI 可量化（工单量、CSAT、解决率），且天然存在"转人工"兜底机制，降低了企业试错风险。Decagon、Sierra 等公司的快速增长印证了这一逻辑。

**搜索：宽赛道催生多个独立大公司**
企业内部信息检索痛点长期存在，Glean 以此为核心迅速规模化；Harvey 从法律搜索切入，OpenEvidence 从医疗搜索切入，各自成长为独立的大型 AI 企业。

**行业分布：科技、法律、医疗领跑**
科技行业毫无悬念地率先采用；法律行业出人意料地成为早期行动者——AI 在解析密集文本、推理大量文件方面的能力与律师日常工作高度契合，Harvey 在成立三年内实现约 2 亿美元 ARR；医疗行业则通过医疗抄录（Abridge、Ambience）、医疗搜索（OpenEvidence）和后台自动化（Tennr）绕开 EHR 系统壁垒，实现快速规模化。

**结论**
AI 在企业的落地速度远超历史上任何一代技术。编程作为所有软件的上游，其 AI 化加速将进一步降低其他领域的建设门槛，但也使构建持久竞争优势变得更加迫切。', '["AI", "企业AI", "AI落地", "编程AI", "客服AI", "VC观点", "a16z", "Fortune500", "AI ROI"]'::jsonb, '2026-04-08 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_002', 'sequoia-from-hierarchy-to-intelligence-2026', 'From Hierarchy to Intelligence', 'Sequoia Capital 合伙人 Roelof Botha 与 Block CEO Jack Dorsey 联合撰文，提出 AI 时代企业组织设计的全新范式：从层级制转向"智能体"。文章认为，大多数公司将 AI 视为生产力工具，而 Block 正在尝试将整个公司构建为一个"迷你 AGI"——通过公司世界模型与高质量客户信号的结合，让 AI 承担传统管理层的协调职能，以速度作为复利竞争优势。', 'Sequoia Capital', 'https://sequoiacap.com/article/from-hierarchy-to-intelligence/', 'Jack Dorsey, Roelof Botha', 'Sequoia Capital 合伙人 Roelof Botha 与 Block（前 Square）CEO Jack Dorsey 联合发表这篇深度文章，探讨 AI 如何从根本上重塑企业组织架构。

**核心论点：从层级到智能**
大多数企业目前的做法是给每个人配备一个 AI 副驾驶（Copilot），这只是让现有结构运转得稍微更好，而非改变结构本身。Block 的目标截然不同：将公司构建为一个"智能体"（intelligence），或称"迷你 AGI"。

**层级制的历史局限**
层级制的本质是信息中继——管理者的核心职能是了解团队动态并在层级间传递上下文。Haier 的人单合一模式、平台型组织、"数据驱动"管理等，都是突破层级制的历史尝试，但它们缺乏一种能够真正执行协调职能的技术。AI 就是这种技术。

**两个必要条件：世界模型 + 高质量信号**
Block 是远程优先公司，所有工作都产生可机读的数字化痕迹（决策、讨论、代码、设计、计划）。这些成为构建"公司世界模型"的原材料——AI 可以持续维护整个业务的实时图景，替代传统管理层的信息传递功能。

另一个关键是高质量的客户信号。Block 同时看到买方（Cash App）和卖方（Square）的数百万笔交易，每一笔交易都是关于用户真实生活的事实。这种"诚实信号"使客户世界模型具备罕见的深度，形成"更多交易→更丰富信号→更好模型→更多交易"的正向飞轮。

**速度作为复利竞争优势**
Sequoia 认为速度是初创公司成功的最佳预测指标。当 AI 能够承担协调职能时，决策速度将成为可复利的竞争优势，而非一次性的效率提升。

**对创业者的启示**
这篇文章代表了 Sequoia 对 AI 原生公司组织设计的最新思考：赢家不是用 AI 做更多事情的公司，而是用 AI 重新设计"如何一起工作"的公司。', '["AI", "组织设计", "AI原生公司", "Sequoia", "Block", "企业管理", "AGI", "VC观点", "未来工作"]'::jsonb, '2026-03-31 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_003', 'bvp-ai-infrastructure-roadmap-five-frontiers-2026', 'AI Infrastructure Roadmap: Five Frontiers for 2026', 'Bessemer Venture Partners 发布 2026 年 AI 基础设施路线图，指出第一代 AI 基础设施（专注于模型规模与训练效率）已完成使命，下一代将聚焦于让 AI 真正进入现实世界运作。BVP 识别出五大前沿方向：Harness 基础设施、持续学习系统、强化学习平台、推理拐点与世界模型，每一方向都在解决模型规模化之外的结构性瓶颈。', 'Bessemer Venture Partners', 'https://www.bvp.com/atlas/ai-infrastructure-roadmap-five-frontiers-for-2026', 'Janelle Teng Wade, Lance Co Ting Keh, Talia Goldberg, David Cowan, Grace Ma, Bhavik Nagda, Brandon Nydick, Bar Weiner', 'BVP 在这份路线图中明确指出：第一代 AI 基础设施以"模型即产品"为核心，追求更大权重、更多数据和更好基准分数，催生了基础模型、算力、训练技术和数据运营等领域的巨头。但随着大型实验室从追求基准转向设计能与现实世界交互的 AI，企业也从 POC 毕业到生产部署，原有基础设施已无法支撑下一阶段。

**前沿一：Harness 基础设施**
随着 AI 部署从单一模型转向复合系统，"驾驭"模型的基础设施变得比以往更重要。核心挑战包括：记忆与上下文管理（企业 AI 系统普遍存在"组织失忆"问题，基础 RAG 已不足够）；以及评估与可观测性（估计 78% 的 AI 失败是不可见的——AI 给出错误答案但用户接受了，传统监控无法捕捉）。

**前沿二：持续学习系统**
当前模型面临根本约束：部署后权重冻结，无法真正学习。持续学习使 AI 能够跨任务积累知识，在不遗忘旧能力的同时习得新技能。架构创新方向包括：Learning Machine（推理时持续学习）、Core Automation（重新设计 Transformer 架构）、TTT-E2E（测试时训练）。

**前沿三：强化学习平台**
强化学习正从研究工具转变为生产基础设施，需要专门的平台支持大规模 RL 训练、评估和部署。

**前沿四：推理拐点**
随着模型能力趋于商品化，推理效率成为新的竞争焦点。Always-on 的 AI Agent 将推理消耗提升至标准对话的 10–50 倍，GPU 需求已不再只是训练故事，推理驱动的增长正在成为主要向量。

**前沿五：世界模型**
世界模型使 AI 能够预测物理世界的因果关系，是具身智能、自动驾驶和机器人技术的核心基础设施。BVP 认为这是将 AI 从数字世界引入物理世界的关键一步。', '["AI基础设施", "BVP", "Bessemer", "持续学习", "AI Agent", "推理", "世界模型", "VC观点", "AI投资"]'::jsonb, '2026-03-30 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_004', 'bvp-securing-ai-agents-cybersecurity-2026', 'Securing AI Agents: The Defining Cybersecurity Challenge of 2026', 'Bessemer Venture Partners 深度分析 AI Agent 安全问题，指出这已成为 2026 年最核心的网络安全挑战。48% 的网络安全专业人员将自主 AI 系统列为最危险的攻击向量，影子 AI 安全事件平均损失达 463 万美元。BVP 提出三阶段安全框架（可见性→配置→运行时保护），并给出 CISO 的五项行动建议。', 'Bessemer Venture Partners', 'https://www.bvp.com/atlas/securing-ai-agents-the-defining-cybersecurity-challenge-of-2026', 'Amit Karp, Mike Droesch, David Cowan, Elliott Robinson, Yael Schiff', 'AI Agent 正在从实验性演示快速进入生产级企业基础设施。微软、谷歌、Anthropic 和 Salesforce 均在部署跨应用和数据操作的自主 AI 系统。Gartner 预测，到 2026 年 40% 的企业应用将嵌入特定任务 AI Agent，而 2025 年这一比例仅为 5%。

**核心矛盾：能力与暴露同步扩大**
AI Agent 的自主性——执行多步骤工作流、协调工具、访问数据库、发送邮件、修改代码——正是让它们有价值的特质，也恰恰是它们被攻破时最危险的特质。Agent 不是工具，而是行动者，保护行动者是一个根本不同的安全问题。

**威胁格局：熟悉的威胁，陌生的速度**
OWASP 最新分析指出，AI Agent 主要放大了现有漏洞而非引入全新威胁——凭证盗窃、权限提升、数据泄露。但爆炸半径和速度已发生质变：Agent 以机器速度穿越系统、泄露数据、提升权限，在人类分析师响应之前已造成损害。

**四层攻击面**
端点层（Cursor、GitHub Copilot 等编程 Agent 运行处）、API 与 MCP 网关层（Agent 调用工具和交换指令处）、SaaS 平台层（Agent 嵌入核心业务工作流处）、身份层（凭证和访问权限被授予、积累且往往未被审查处）。

**三阶段安全框架**
第一阶段：可见性——建立 AI Agent 清单，了解哪些 Agent 在运行、访问什么、具有哪些权限。第二阶段：配置——实施最小权限原则，审查并收紧 Agent 权限配置。第三阶段：运行时保护——部署实时监控，检测异常行为并在损害发生前阻断。

**BVP 的投资判断**
Agent 安全是 2026 年最确定的网络安全投资主题之一，现有安全工具均为人类行为设计，无法应对非确定性的 Agent 行为，专用安全平台的市场窗口已经打开。', '["AI安全", "AI Agent", "网络安全", "BVP", "Bessemer", "CISO", "企业安全", "VC观点"]'::jsonb, '2026-03-24 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_005', 'sequoia-ai-kill-software-tools-becoming-work-2026', 'Sequoia: AI Will Kill Software Tools By Becoming The Work', 'Sequoia Capital 提出颠覆性论断：下一个万亿美元公司不会销售工具，而会直接销售成果。AI 正在将软件从"辅助工作的工具"转变为"工作本身"，服务业将成为 AI 价值捕获的主战场。Sequoia 合伙人 Julien Bek 认为，最聪明的 AI 公司正在伪装成服务公司，以软件的边际成本交付服务业的全部价值。', 'Sequoia Capital', 'https://sequoiacap.com/article/services-the-new-software/', 'Julien Bek', 'Sequoia Capital 合伙人 Julien Bek 在这篇引发广泛讨论的文章中提出：传统软件工具的时代正在终结，AI 将通过"成为工作本身"来取代工具。

**核心框架：从工具到成果**
传统 SaaS 的商业模式是：销售工具→客户用工具完成工作→收取订阅费。AI 时代的新模式是：AI 直接完成工作→按成果收费。这意味着价值捕获点从"工具许可"转移到"工作成果"。

**服务业：6:1 的市场机会**
全球服务业规模约为软件业的 6 倍。如果 AI 能以软件的边际成本交付服务业的工作成果，那么 AI 公司的潜在市场将远超历史上任何一代软件公司。Sequoia 认为，下一个万亿美元公司将是一家"伪装成服务公司的软件公司"。

**AI 融资数据印证这一趋势**
2025 年全球 AI 融资达 2030 亿美元，同比增长 75%，其中基础模型公司吸收了 40% 的资金。但 Sequoia 的论点指向更上层：真正的价值不在模型层，而在能够将模型能力转化为可交付成果的应用层。

**对创业者的战略含义**
Sequoia 建议创业者重新审视自己的商业模式：不要问"我能卖什么工具"，而要问"我能替客户完成什么工作"。能够端到端交付成果、承担结果责任的公司，将比仅提供工具的公司拥有更强的定价权和更高的客户粘性。

**市场反应**
这一论断已引发广泛讨论，多家 VC 机构开始重新评估其 AI 投资组合中工具类公司与成果类公司的比例。', '["AI", "SaaS", "AI商业模式", "Sequoia", "服务业", "VC观点", "AI投资", "万亿市场"]'::jsonb, '2026-04-01 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_006', 'deepmind-protecting-people-harmful-manipulation-2026', 'Protecting People from Harmful Manipulation', 'Google DeepMind 发布新研究成果与评估框架，专门衡量 AI 实施有害操控的潜力。研究涉及英国、美国、印度逾 1 万名参与者，聚焦金融和健康两大高风险领域，区分了"有益说服"与"有害操控"的边界，并将成果纳入 Frontier Safety Framework，为 AI 安全评估提供可量化的操控风险指标。', 'Google DeepMind', 'https://deepmind.google/blog/protecting-people-from-harmful-manipulation/', 'Helen King, Canfer Akbulut, Rasmi Elasmar 等 20 位研究者', 'Google DeepMind 在这项研究中将"有害操控"定义为：以负面和欺骗性方式改变人类思想和行为的 AI 行为。研究的核心贡献在于建立了一套可量化的评估框架，同时衡量 AI 操控的"效力"（efficacy）和"倾向"（propensity）。

**研究规模与方法**
九项独立研究，超过 1 万名参与者，覆盖英国、美国和印度三个国家，聚焦金融（如投资建议、保险销售）和健康（如医疗建议、健康产品推销）两大高风险领域。

**关键区分：说服 vs. 操控**
研究明确区分了两类 AI 影响行为：有益说服（基于真实信息、透明推理，帮助用户做出更好决策）与有害操控（利用认知偏见、情感弱点或虚假信息，引导用户做出损害自身利益的决策）。这一区分对 AI 治理框架的设计具有重要意义。

**纳入 Frontier Safety Framework**
这项研究的成果已被纳入 DeepMind 的 Frontier Safety Framework，成为评估前沿模型安全性的标准化指标之一。这意味着未来 DeepMind 在发布新模型前，将对操控风险进行系统性评估。

**对行业的影响**
随着 AI 在金融顾问、健康助手等高风险场景中的应用日益普及，操控风险评估将成为 AI 安全合规的必要环节。DeepMind 的这套框架为行业提供了可参考的方法论基础。', '["AI安全", "AI伦理", "DeepMind", "有害操控", "AI治理", "Frontier Safety", "机器学习", "Gemini"]'::jsonb, '2026-03-26 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_007', 'anthropic-responsible-scaling-policy-2026', 'Anthropic Responsible Scaling Policy: 2026 Update', 'Anthropic 于 2026 年 4 月发布更新版《负责任扩展政策》（RSP），这是其管理前沿 AI 系统灾难性风险的自愿性框架。新版本明确区分了 Anthropic 自身承诺与对整个 AI 行业的建议，正面回应了"集体行动问题"——若一家公司为安全暂停而其他公司不做同样限制，结果可能是更不安全的世界。新版本还引入了"前沿安全路线图"和"风险报告"两项新机制。', 'Anthropic', 'https://www.anthropic.com/responsible-scaling-policy', 'Anthropic', 'Anthropic 的《负责任扩展政策》（RSP）是该公司管理先进 AI 系统灾难性风险的核心治理文件。2026 年 4 月生效的新版本在以下几个维度进行了重要更新：

**区分自身承诺与行业建议**
新版 RSP 的最重要变化是明确区分了两类内容：Anthropic 的直接承诺（公司将切实执行的措施）与对整个 AI 行业的建议（更宏观的期望，需要行业协调或监管机构推动）。这一区分直接回应了"集体行动问题"——如果 Anthropic 单方面为安全暂停，而其他公司继续推进，最终结果可能是让最不负责任的行动者主导 AI 发展节奏。

**两项新机制：前沿安全路线图 + 风险报告**
前沿安全路线图是 Anthropic 在安全、对齐、防护措施和政策四个核心领域设定的公开目标，作为透明基准供外界评估进展。风险报告将提供关于 Anthropic 模型安全状况的详细公开信息，超越简单的能力描述，全面评估风险（模型能力 × 威胁模型 × 现有缓解措施的有效性），并接受独立第三方审查。

**能力阈值与对应缓解措施**
RSP 包含一张映射表，将不同 AI 能力阈值与对应的缓解策略相对应。例如，对于能够协助生产非新型化学或生物武器的 AI 系统，Anthropic 承诺维持或改进 ASL-3 保护措施（分类器防护、访问控制、持续红队测试）；行业层面的建议则是要求开发者提供强有力的论据，证明其系统不会显著增加此类灾难性伤害的可能性。

**治理哲学**
Anthropic 认为，实施这些建议的最佳方式是通过第三方治理（国家监管机构或独立标准制定组织），以确保一致性并避免安全标准的"竞次"效应。', '["AI安全", "AI治理", "Anthropic", "负责任扩展", "RSP", "AI政策", "前沿AI", "灾难性风险"]'::jsonb, '2026-04-02 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_008', 'openai-industrial-policy-intelligence-age-2026', 'Industrial Policy for the Intelligence Age', 'OpenAI 提出面向智能时代的新产业政策框架，核心是"以人为本"的政策理念，旨在确保先进 AI 惠及所有人。这批政策构想聚焦于扩大机会、共享繁荣、构建韧性制度，OpenAI 同步设立研究奖学金（最高 10 万美元）和 API 积分（最高 100 万美元），并将于 2026 年 5 月在华盛顿特区开设 OpenAI Workshop，推动政策讨论。', 'OpenAI', 'https://openai.com/index/industrial-policy-for-the-intelligence-age/', 'OpenAI', '随着 AI 向超级智能演进，渐进式政策更新已不足够。OpenAI 在这份文件中提出了一系列"以人为本"的政策构想，作为讨论起点而非最终方案，邀请各方在民主进程中完善、挑战或选择。

**政策框架的三大支柱**
扩大机会：确保 AI 能力不因经济或地理障碍而集中于少数人，推动 AI 工具的广泛可及性。共享繁荣：探索 AI 生产力红利的分配机制，避免财富进一步集中。构建韧性制度：设计能够适应 AI 快速发展的监管和治理框架，防止现有制度被技术变革所颠覆。

**配套行动**
OpenAI 同步推出三项配套行动：开放政策反馈渠道（newindustrialpolicy@openai.com）；设立研究奖学金和专项研究资助（最高 10 万美元奖学金 + 最高 100 万美元 API 积分）；2026 年 5 月在华盛顿特区开设 OpenAI Workshop，作为政策讨论的实体空间。

**背景与意义**
这份文件的发布时机值得关注：OpenAI 正面临来自监管机构、竞争对手和公众的多重压力，主动提出产业政策框架既是塑造监管叙事的战略举措，也反映了 OpenAI 对自身社会责任的认知升级。文件明确承认，在超级智能时代，技术公司不能仅专注于技术开发，还必须参与塑造技术部署的社会和政治环境。', '["AI政策", "OpenAI", "产业政策", "超级智能", "AI治理", "AI监管", "社会影响"]'::jsonb, '2026-04-06 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_009', 'techcrunch-startup-funding-record-q1-2026', 'Startup Funding Shatters All Records in Q1 2026', '2026 年第一季度全球创业融资达到 2970 亿美元，打破历史所有记录，较上一季度的 1180 亿美元增长 2.5 倍。这一单季融资额超过了 2019 年以前任何一个完整年度的全球风险投资总额。四笔巨额交易（OpenAI 1220 亿、Anthropic 300 亿、xAI 200 亿、Waymo 160 亿）合计 1880 亿美元，占季度总额的 63%。', 'TechCrunch', 'https://techcrunch.com/2026/04/01/startup-funding-shatters-all-records-in-q1/', 'Marina Temkin', '根据 Crunchbase 最新数据，2026 年第一季度全球创业融资达到 2970 亿美元，以 2.5 倍的幅度超越上一季度，并超过 2019 年以前任何一个完整年度的全球风险投资总额。

**四笔改变历史的巨额融资**
本季度的融资记录由四笔史诗级交易驱动：OpenAI 以 8520 亿美元估值完成 1220 亿美元融资，打破其此前保持的最大融资轮记录（2025 年的 400 亿美元）；Anthropic 完成 300 亿美元融资，估值达 3800 亿美元，成为有史以来第三大风险投资轮；xAI 完成 200 亿美元融资；Waymo 完成 160 亿美元融资。这四笔交易合计 1880 亿美元，占季度总额的 63% 以上。

**AI 公司主导风险投资格局**
AI 公司在本季度吸收了约 81% 的全球风险投资资金（约 2420 亿美元），较一年前的 55% 大幅提升。这一数据意味着 AI 已不再是风险投资的一个赛道，而是成为整个市场本身。

**早期市场同样火热**
尽管四笔巨额交易主导了总量，但早期市场同样显示出强劲势头。投资者和创始人反映，种子阶段 AI 初创公司正在以历史上最早的阶段获得最大规模的融资，估值也在持续攀升。

**市场隐忧**
如此高度的资本集中引发了部分观察者的担忧：当 63% 的季度融资流向四家公司时，中小型 AI 初创公司的融资环境实际上可能在恶化。此外，这种融资节奏是否可持续，以及是否存在泡沫风险，也是市场广泛讨论的话题。', '["风险投资", "AI融资", "OpenAI", "Anthropic", "xAI", "Waymo", "创业融资", "Q1 2026", "TechCrunch"]'::jsonb, '2026-04-01 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_010', 'kpmg-ai-agent-deployment-execution-differentiator-2026', 'Investment and AI Agent Deployment Surge as Execution Becomes the Differentiator', 'KPMG 发布 2026 年第一季度 AI 脉搏调查（首次扩展为全球版本，覆盖 20 个国家）。核心发现：企业 AI 支出预计在未来 12 个月达到平均 2.07 亿美元，较去年同期近乎翻倍；54% 的企业已在积极部署 AI Agent（2024 年仅为 12%）；但 65% 的企业面临用例规模化困难，62% 存在技能缺口，执行力已取代技术能力成为 AI 价值实现的核心瓶颈。', 'KPMG', 'https://kpmg.com/us/en/media/news/q1-ai-pulse2026.html', 'Steve Chase, Rahsaan Shears', 'KPMG 本季度首次将 AI 脉搏调查扩展为全球版本，覆盖 20 个国家的 2110 位 C 级高管和业务负责人（其中 75% 来自年收入超 10 亿美元的企业）。

**AI 投资加速：近乎翻倍**
美国大型企业预计在未来 12 个月平均投入 2.07 亿美元用于 AI，较去年同期近乎翻倍。全球平均水平为 1.86 亿美元，亚太地区最高（2.45 亿美元）。

**AI Agent 部署越过临界点**
AI Agent 的部署比例从 2024 年的 12% 跃升至当前的 54%，两年间增长超过 4 倍。运营部门（79%）和技术部门（78%）领跑部署，但 Agent 正在承担跨职能的更广泛责任：73% 的企业使用 AI Agent 自动化跨职能工作流，53% 依赖 Agent 在团队间路由信息和决策。

**执行力成为核心瓶颈**
尽管投资和部署都在加速，但 65% 的企业面临用例规模化困难（较上季度的 33% 大幅上升），62% 存在技能缺口（较上季度的 25% 大幅上升）。这表明 AI 的价值实现已从"技术可行性"阶段进入"组织执行力"阶段。

**人才战略重塑**
87% 的领导者将现有员工的技能提升列为首要任务（高于招聘和职位重设计）。对于初级岗位，适应性和持续学习能力（83%）已超越技术编程技能（67%）成为最受重视的素质。

**区域差异**
美国倾向于人机协作模型，欧洲强调人类优先方法，亚太地区更倾向于 Agent 优先的运营模式——监管环境、劳动力动态等因素正在塑造各地区 AI 落地方式的差异。', '["AI Agent", "企业AI", "KPMG", "AI投资", "AI执行力", "技能缺口", "AI治理", "全球调查"]'::jsonb, '2026-03-31 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_011', 'techbuzz-china-openclaw-ai-agent-explosion-2026', 'The Hundred Shrimp War: OpenClaw and China''s AI Agent Explosion', 'TechBuzz China 深度分析 OpenClaw 在中国引发的 AI Agent 浪潮。这个由奥地利开发者 Peter Steinberger 在 2025 年底作为副业构建的开源框架，在 2026 年 1 月最后一周积累了 10 万 GitHub Stars（React 用了 8 年，Linux 用了 12 年）。到 2026 年 4 月初，Stars 数已达约 35 万。文章揭示了 OpenClaw 爆红背后的中国市场独特逻辑：框架层已免费，衍生层正在趋向免费，真正的钱流向算力和 Token 供应商——而中国供应商在这场竞争中具有结构性优势。', 'TechBuzz China', 'https://techbuzzchina.substack.com/p/the-hundred-shrimp-war-openclaw-and', 'TechBuzz China', 'OpenClaw 是一个开源框架，将大型语言模型转化为 Agent：能够读取文件、控制浏览器、发送消息、预订旅行、链式执行任务，并在无人干预的情况下持续运行。其模型无关的设计（用户可以像切换运营商一样切换 AI 模型提供商）是最关键的架构选择。

**中国市场的独特爆发**
OpenClaw 在中国的采用蔓延到了物理世界——这是 AI 产品罕见的现象。近千人在腾讯深圳总部门外排队等待免费安装帮助；中国电商平台上，付费安装服务一夜涌现，部分供应商收费 1000 元（约 140 美元）上门服务。当人们愿意花一天工资请陌生人安装免费软件时，需求显然是真实的。

**实际使用场景**
小企业主配置 Agent 在 1688 上通宵监控供应商价格并在工作日开始前更新 ERP 采购订单；开发者让 Agent 审查 PR、运行 Claude Code 并在他们去健身房时自主提交代码；独立创业者用 Agent 起草小红书帖子和编辑 AI 日报。这些都是普通白领任务，现在被委托给通宵运行的软件。

**基础设施冲击**
GPU 租赁价格在一个月内上涨 25–30%，英伟达 H200 的交货时间延伸至 2027 年中。因为 OpenClaw Agent 每 30 分钟签到一次并持续链式执行任务，消耗的算力是标准对话的 10–50 倍。GPU 需求已不再只是训练故事，推理驱动的增长正成为主要向量。

**"百虾大战"的商业逻辑**
文章的核心论点：框架层已经免费，衍生层（各种基于 OpenClaw 的工具和服务）正在趋向免费，真正的钱流向算力和 Token 供应商。在这场竞争中，中国供应商（Zhipu、MiniMax 等）具有结构性优势——更低的算力成本、更本土化的模型，以及已经在香港上市的资本化路径。', '["AI Agent", "OpenClaw", "中国AI", "开源AI", "算力", "TechBuzz China", "AI创业", "GPU需求"]'::jsonb, '2026-04-12 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_012', 'china-ai-development-trends-opportunities-2026', '中国人工智能发展现状、趋势与未来产业机遇', '国家数据局局长刘烈宏在 2026 年中国发展高层论坛年会上发表重磅演讲，系统总结人工智能演进的五大核心新趋势，并预判"十五五"末期我国人工智能相关产业规模将突破 10 万亿元。五大趋势包括：智能体驱动大模型应用爆发、高质量数据集成为决胜关键、具身智能开启全新赛道、Token 成为智能时代价值锚点、安全合规成为 AI 发展底线。', '新浪财经', 'https://finance.sina.com.cn/wm/2026-04-09/doc-inhtxcuv5808714.shtml', '格上私募圈', '在 2026 年中国发展高层论坛年会上，国家数据局局长刘烈宏发表了关于中国人工智能发展现状与趋势的权威演讲，以下是五大核心趋势的详细解读：

**趋势一：智能体促使大模型应用爆发**
大模型的核心价值正在从"对话交互"转向"决策执行"。智能体通过连接外部工具、自主规划任务、闭环执行流程，突破了大模型的应用边界。国内企业探索出"开源框架 + 中国模型 + 全栈数据安全"的特色发展路径，使智能体不仅成为高效执行者，还成为风险预警者和方案解决者。

**趋势二：高质量数据集成为决胜关键**
从通用大模型向行业大模型纵深拓展的趋势日益明显。在金融风控、医疗诊断、工业制造、农业生产等领域，只有凭借行业专属高质量数据训练的大模型，才能切实解决实际问题。谁掌握了高质量行业数据，谁就掌握了 AI 落地的核心竞争力。

**趋势三：具身智能开启全新赛道**
AI 正在历经从数字世界模拟向与物理世界深度交互的范式跃迁。具身智能将 AI 与机器人本体、传感器、控制系统深度融合，实现"感知-决策-执行"完整闭环，在工业制造、仓储物流、特种作业等领域展现出实际能力，正加快从实验性部署向规模化生产应用转变。

**趋势四：Token 成为智能时代价值锚点**
Token（词元）是连接技术供给与商业需求的计量单位。2024 年初我国每日词元调用量仅为 1000 亿，2025 年底跃升至 100 万亿，2026 年 3 月突破 140 万亿——两年间增长超过千倍。这标志着 AI 领域"数据供给-价值释放-商业变现"的良性循环已初步形成。

**趋势五：安全合规成为 AI 发展底线**
AI 深度进入生产生活关键流程之际，安全合规已成为核心治理焦点。必须坚守"最小权限、主动防御、持续审计"原则，构建全栈数据安全解决方案，协同 AI 提供者、使用者和维护者共同筑牢安全防线。

**展望：10 万亿产业规模**
到"十五五"结束时，我国人工智能关联产业规模将突破 10 万亿元。2026 年是国家明确的"数据价值释放年"，数据要素与人工智能的深度融合将成为驱动数字经济高质量发展的核心动力。', '["中国AI", "人工智能", "智能体", "具身智能", "Token经济", "AI政策", "产业规模", "数据要素"]'::jsonb, '2026-04-09 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_013', 'mit-tech-review-ai-small-sellers-alibaba-accio-2026', 'AI is Changing How Small Online Sellers Decide What to Make', 'MIT Technology Review 报道 AI 工具如何改变小型网络卖家的选品和供应链决策。阿里巴巴旗下 AI 产品选品工具 Accio 在 2026 年 3 月突破 1000 万月活用户，约占阿里巴巴用户的五分之一。文章通过多个真实案例展示了 AI 如何将从产品创意到上架的周期从数月压缩至数周，同时探讨了 AI 在电商生态中引发的透明度和公平性问题。', 'MIT Technology Review', 'https://www.technologyreview.com/2026/04/06/1135118/ai-online-seller-alibaba-accio/', 'Caiwei Chen', '对于美国小型企业主而言，决定卖什么、在哪里生产传统上是一个耗时数月的劳动密集型过程。现在，这项工作越来越多地由 AI 工具完成，其中 Accio 是最具代表性的案例。

**Accio 的实际效果**
小型网络商人 Mike McClary 使用 Accio 重新设计了一款手电筒产品。Accio 建议将其做得更小、亮度降低、改用电池供电，并找到了宁波一家制造商，将制造成本从每件 17 美元降至约 2.5 美元。McClary 随后自行联系供应商，一个月内新版本手电筒重新上架。

**规模与技术**
Accio 于 2024 年推出，2026 年 3 月月活用户突破 1000 万，约占阿里巴巴用户的五分之一。其界面类似 ChatGPT，用户可以输入问题并获得图表、链接、视觉内容和追问。Accio 基于多个前沿模型（包括阿里巴巴的 Qwen 系列），并在 26 年专有交易数据上进行训练。

**制造商的适应**
制造商也在适应 AI 驱动的平台。一家化妆品包装公司的 Sally Li 现在在阿里巴巴上写更详细的产品描述，认为这使商品对 AI 更可见。这引发了关于 AI 如何改变供应链信息生态的新问题。

**局限性与透明度挑战**
Accio 在产品创意方面表现强劲，但在营销方面帮助有限。买家仍需质疑其建议，因为部分建议可能过于通用。斯坦福人机中心研究员 Jiaxin Pei 强调，AI Agent 需要透明运作，开发者应披露数据收集和激励机制，以确保公平的市场环境。', '["AI电商", "供应链AI", "阿里巴巴", "Accio", "小企业", "MIT Technology Review", "产品选品"]'::jsonb, '2026-04-06 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_014', 'benedict-evans-how-will-openai-compete-2026', 'How Will OpenAI Compete?', '科技分析师 Benedict Evans 深度剖析 OpenAI 的战略困境：没有独特技术、用户基础宽而浅（80% 的用户每天发送不足 3 条消息）、缺乏网络效应、竞争对手拥有更强的分发能力。文章提出 OpenAI 面临的四个根本性战略问题，并将其与 Netscape 的历史命运进行类比，探讨 AI 时代"平台优势"的本质。', 'Benedict Evans', 'https://www.ben-evans.com/benedictevans/2026/2/19/how-will-openai-compete-nkg2x', 'Benedict Evans', 'Benedict Evans 在这篇深度分析文章中，对 OpenAI 的战略地位提出了尖锐质疑，识别出四个根本性战略问题：

**问题一：没有独特技术**
目前约有六家组织在持续发布具有竞争力的前沿模型，每隔几周就相互超越。没有任何已知机制能让某一家公司获得其他人永远无法追赶的领先优势——不存在类似 Windows 网络效应、Google 搜索飞轮或 iOS 生态系统那样的赢家通吃机制。

**问题二：用户基础宽而浅，缺乏粘性**
OpenAI 拥有 8–9 亿用户，但 80% 的用户在 2025 年全年发送消息不足 1000 条，平均每天不足 3 次提示。只有 5% 的用户付费。这种"一英里宽、一英寸深"的参与度意味着 ChatGPT 尚未真正改变大多数用户的日常生活——用户存在"能力差距"，不知道如何充分利用 AI。

**问题三：竞争对手拥有分发优势**
Google 和 Meta 正在利用其庞大的用户分发渠道快速抢占市场份额，产品在普通用户眼中几乎无差别。这与 Netscape 的历史命运高度相似——微软利用分发优势进入了产品本身难以区分的市场。

**问题四：无法控制产品路线图**
当你是 AI 实验室的产品负责人时，你不控制自己的路线图。你早上打开邮件，发现实验室研究出了新东西，你的工作是把它变成一个按钮。真正的战略决策发生在别处。

**Evans 的结论**
OpenAI 目前的最佳策略可能是：在"音乐停止"之前，用其纸面价值换取更持久的战略地位。但真正的价值捕获将来自尚未被发明的新体验，而没有人能预先规划这些体验将由谁创造。', '["OpenAI", "AI战略", "竞争分析", "Benedict Evans", "AI商业模式", "LLM", "AI市场"]'::jsonb, '2026-02-19 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_015', 'ey-ai-trends-2026-sovereignty-agent-economy-regulation', 'AI Trends 2026: Between Sovereignty, Agent Economy and Regulatory Turning Point', 'EY 瑞士识别出 2026 年 AI 领域的三大核心趋势：Agent 革命（AI Agent 从实验走向生产部署）、主权 AI（各国和地区构建本土 AI 基础设施以减少对外依赖）、物理 AI（AI 控制机器人和设备，在制造和物流领域创造竞争优势）。文章同时强调了适应性 AI 战略和治理框架的重要性，指出欧洲目前仅占全球 AI 算力的 5–10%，而美国占 60–75%。', 'EY Switzerland', 'https://www.ey.com/en_ch/newsroom/2026/03/ai-trends-2026-between-sovereignty-agent-economy-and-regulatory-turning-point', 'Daniele Müller', 'EY 瑞士在这份报告中识别出 2026 年 AI 领域的三大结构性趋势，并为企业提供了应对策略建议。

**趋势一：Agent 革命**
AI Agent 正在从实验阶段转向生产部署。以 GitHub 为例，2025 年底约一半的程序代码已通过 AI 工具编写。然而，从演示到可靠生产环境的转变面临挑战，特别是大型语言模型输出的不确定性。企业需要结构化的编排体系，专注于安全性、测试环境、事件管理和稳定部署流程——类似传统软件开发的成熟实践。

**趋势二：主权 AI**
主权 AI 是指各国和地区开发本土 AI 模型和基础设施，以减少对外国供应商的依赖。目前许多瑞士企业依赖美国模型，这引发了关于数据处理位置、模型控制和架构稳健性的担忧。欧洲目前仅占全球 AI 算力的 5–10%，而美国占 60–75%。这一差距正在推动欧洲各国政府和企业加大 AI 基础设施投资。

**趋势三：物理 AI**
物理 AI 是指使用 AI 控制机器人和设备，通常在完全模拟的数字环境（数字孪生）中训练后再部署到物理环境。利用物理 AI 的企业正在积累竞争对手难以复制的宝贵运营数据——因为这些数据来自真实生产环境，无法通过购买或模拟完全替代。

**治理框架的紧迫性**
许多企业虽然在积极探索 AI，但缺乏必要的组织基础（清晰战略和治理框架）。在瑞士银行业，78% 的机构正在积极引入 AI，但监管环境快速演变，健全的治理结构已成为规模化 AI 部署的前提条件。', '["AI趋势", "主权AI", "物理AI", "AI Agent", "AI治理", "EY", "欧洲AI", "AI监管"]'::jsonb, '2026-03-19 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_016', 'lenny-newsletter-product-job-market-early-2026', 'State of the Product Job Market in Early 2026', 'Lenny Rachitsky 发布第四期《产品职位市场状况》报告，呈现出迄今最乐观的信号：PM 职位数量达到三年多来最高水平（较 2023 年初增长 75%）；AI 没有减缓对软件工程师的需求（全球超过 6.7 万个工程职位空缺）；AI 相关职位"绝对爆炸式增长"；旧金山湾区重要性持续上升（超过 23% 的 PM 职位在湾区）；远程工作机会持续减少。', 'Lenny''s Newsletter', 'https://www.lennysnewsletter.com/p/state-of-the-product-job-market-in-ee9', 'Lenny Rachitsky', '这是 Lenny Rachitsky 第四次发布《产品职位市场状况》报告，也是迄今最乐观的一期。报告通过硬数据反驳了"AI 正在消灭科技工作"的普遍叙事，揭示了七大关键趋势：

**趋势一：PM 职位三年多来最高**
PM 职位数量较 2023 年初增长 75%，较 2026 年初增长近 20%。这表明产品管理需求正在强劲复苏，而非被 AI 取代。

**趋势二：AI 没有减缓工程师需求**
全球超过 6.7 万个工程职位空缺，工程职位增长速度实际上在加速。无论是 AI 直接创造了更多职位，还是没有 AI 增长会更高，趋势都是正向的。

**趋势三：AI 职位绝对爆炸**
AI 职位类别包括 AI 驱动公司（OpenAI、Anthropic 等）的职位，以及非 AI 公司的 AI 专属职位（如 Figma 的 AI PM）。对 AI 工程师和 AI PM 的需求尤其旺盛。

**趋势四：设计职位陷入停滞**
与 PM 和工程不同，设计职位自 2023 年初以来基本持平，绝对数量约为 5700 个。这可能与 AI 使工程师能够更快推进有关，减少了对传统设计流程的依赖。

**趋势五：湾区重要性上升**
超过 20% 的工程和设计职位、超过 23% 的 PM 职位位于湾区，且比例持续上升。三分之一的 AI 职位在湾区，巩固了其作为 AI 创新中心的地位。

**趋势六：远程机会持续减少**
PM、工程和设计的远程职位比例自 2023 年初以来持续下降，显示出向办公室或混合模式的回归。

**趋势七：整体科技就业持续增长**
尽管裁员新闻不断，科技职位总数仍在增长。科技招聘人员需求激增是持续高招聘需求的领先指标。', '["科技就业", "产品经理", "AI职位", "软件工程", "湾区", "远程工作", "Lenny Rachitsky", "职场趋势"]'::jsonb, '2026-03-24 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_017', 'deepseek-v4-trillion-parameter-huawei-ascend-2026', 'DeepSeek V4：万亿参数模型即将发布，首次深度适配华为昇腾', 'DeepSeek 创始人梁文锋内部透露，新一代旗舰大模型 DeepSeek V4 将于 2026 年 4 月下旬发布。该模型将达万亿参数、百万级上下文窗口，并首次深度适配华为昇腾等国产算力，彻底摆脱对英伟达 GPU 的依赖。采用混合专家（MoE）架构，实际激活参数仅 320–370 亿，保持推理成本不升反降。这一技术路线将对全球 AI 供应链格局产生深远影响。', '每日经济新闻', 'https://www.nbd.com.cn/articles/2026-04-13/4336217.html', '每日经济新闻', 'DeepSeek V4 是深度求索即将发布的新一代旗舰大模型，预计于 2026 年 4 月下旬正式亮相。以下是目前已知的关键技术细节：

**架构：万亿参数 MoE**
V4 采用混合专家（Mixture of Experts）架构，总参数量约达 1 万亿，但任何单一任务仅激活 320–370 亿参数。这种设计使模型在保持顶尖能力的同时，将推理成本控制在合理范围内——训练成本据报道仅为 600 万美元，使用 2048 块英伟达 H800 芯片完成训练。

**关键创新：Engram 条件记忆架构**
V4 引入了 Engram 条件记忆架构，支持 100 万 Token 超长上下文窗口，写程式与推理测试成绩直逼顶尖闭源模型。

**历史性转变：首次深度适配华为昇腾**
V4 最具战略意义的变化是首次深度适配华为昇腾 950PR 芯片，彻底摆脱对英伟达 GPU 的依赖。华为计划 2026 年生产约 60 万块昇腾 910C 芯片（较 2025 年翻倍），并将昇腾总产能提升至 160 万块。

**对全球 AI 供应链的影响**
这一技术路线的战略含义极为深远：如果中国顶尖 AI 模型能够在国产芯片上高效运行，美国出口管制对中国 AI 发展的限制效果将大幅削弱。多家中国科技巨头（阿里巴巴、字节跳动、腾讯）已为 V4 发布做好准备，预计将迅速跟进适配。

**市场预期**
中信证券认为 V4 有望提升模型效率，带来新投资机遇，建议关注国产 AI 基础设施（AI Infra）受益标的，国产 AI Infra 与国产模型正在相向而行。', '["DeepSeek", "V4", "大模型", "华为昇腾", "MoE", "中国AI", "AI芯片", "AI供应链"]'::jsonb, '2026-04-13 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09'),
  ('story_018', 'fortune-china-token-economy-ai-boom-2026', 'China''s Token Economy: AI Boom, Big Tech, and Startups', 'Fortune 深度报道中国正在构建以开源模型和真实世界 AI 应用为支撑的"Token 经济"。字节跳动旗下 Doubao 成为中国使用最广泛的 AI 应用（春节期间日活用户突破 1 亿）；中国在全球 AI 模型使用排行榜上占据前 9 名中的 6 席；多家中国 AI 公司在香港完成上市；同时美国出口管制仍在制约中国获取最先进芯片。', 'Fortune', 'https://fortune.com/2026/04/12/china-token-economy-ai-boom-big-tech-startups/', 'Fortune', '中国正在以开源模型和真实世界 AI 应用为核心，构建一套独特的"Token 经济"体系。这一体系的核心特征是：以极低成本提供强大模型能力，通过海量应用积累 Token 消耗，形成数据飞轮。

**Doubao：中国 AI 应用第一**
字节跳动旗下的 Doubao（豆包）已成为中国使用最广泛的 AI 应用，在 2026 年春节假期期间日活用户突破 1 亿。这一数字使其成为全球增长最快的 AI 消费应用之一。

**中国模型的全球竞争力**
根据 OpenRouter 的数据，在 2026 年 3 月 30 日至 4 月 5 日的全球 AI 模型使用排行榜中，中国占据前 9 名中的 6 席。这一数据直接反映了中国开源模型在全球开发者社区的影响力。

**资本市场：香港成为中国 AI 上市首选地**
Zhipu（智谱）和 MiniMax 在 2026 年 1 月相继在香港上市，成为全球首批上市的纯 AI 模型公司，市值均约达 400 亿美元。香港正在成为中国 AI 公司寻求国际资本的首选市场。

**出口管制的持续制约**
尽管中国 AI 取得了显著进展，美国出口管制仍在制约中国获取最先进芯片。DeepSeek V4 转向华为昇腾芯片的战略选择，正是在这一背景下的主动应对。

**开源战略的双重效应**
中国 AI 实验室普遍采用开源策略，既降低了开发者的使用门槛（零成本接入），也通过广泛部署积累了大量真实使用数据，形成与闭源模型不同的竞争优势路径。', '["中国AI", "Token经济", "Doubao", "字节跳动", "开源AI", "AI应用", "香港上市", "AI竞争"]'::jsonb, '2026-04-12 00:00:00+00', 0, 'published', FALSE, '2026-04-13 09:49:09', '2026-04-13 09:49:09');

-- ========================================
-- Table: likes
-- ========================================
-- Clear existing data
DELETE FROM likes;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('likes', 'id'), coalesce(max(id), 0) + 1, false) FROM likes;

-- Insert data
INSERT INTO likes (id, user_id, target_type, target_id, created_at) VALUES
  ('l_1775614768051_1lanbg0mk', 'u1', 'story', 's1', '2026-04-08 02:19:28'),
  ('l_1775620442261_4gccqqjl8', 'u1', 'project', 'p6', '2026-04-08 03:54:02'),
  ('l_1775620442817_mcl0bkn71', 'u1', 'project', 'p7', '2026-04-08 03:54:02'),
  ('l_1775620443881_m27v5kpds', 'u1', 'project', 'p8', '2026-04-08 03:54:03'),
  ('l_1775620444690_m5n3nrk4c', 'u1', 'project', 'p9', '2026-04-08 03:54:04'),
  ('l_1775620444991_sqdxjwxnj', 'u1', 'project', 'p10', '2026-04-08 03:54:04'),
  ('l_1775620445737_4uub9f3lx', 'u1', 'project', 'p11', '2026-04-08 03:54:05'),
  ('l_1775620447323_ua2un7hpx', 'u1', 'project', 'p12', '2026-04-08 03:54:07'),
  ('l_1775620448181_9azx7wlhw', 'u1', 'project', 'p13', '2026-04-08 03:54:08'),
  ('l_1775620448539_nec3pfu0x', 'u1', 'project', 'p14', '2026-04-08 03:54:08'),
  ('l_1775620449332_53d4za8mh', 'u1', 'project', 'p15', '2026-04-08 03:54:09'),
  ('l_1775620449623_3mozk6sye', 'u1', 'project', 'p16', '2026-04-08 03:54:09'),
  ('l_1775620450429_sxvaimm0n', 'u1', 'project', 'p17', '2026-04-08 03:54:10'),
  ('l_1775620450806_wq4ecb9zs', 'u1', 'project', 'p18', '2026-04-08 03:54:10'),
  ('l_1775620452322_bes95a7sm', 'u1', 'project', 'p19', '2026-04-08 03:54:12'),
  ('l_1775620452713_s74ycdlb7', 'u1', 'project', 'p20', '2026-04-08 03:54:12'),
  ('l_1775620453765_9gozruhm3', 'u1', 'project', 'p21', '2026-04-08 03:54:13'),
  ('l_1775620454097_ave5v6al4', 'u1', 'project', 'p22', '2026-04-08 03:54:14'),
  ('l_1775620454932_yp3dmouka', 'u1', 'project', 'p23', '2026-04-08 03:54:14'),
  ('l_1775620455235_9i0tqlgol', 'u1', 'project', 'p24', '2026-04-08 03:54:15'),
  ('l_1775631271825_6unxp44tr', 'u_1775630509451_k18ngjsga', 'project', 'p1', '2026-04-08 06:54:31');

-- ========================================
-- Table: badges
-- ========================================
-- Clear existing data
DELETE FROM badges;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('badges', 'id'), coalesce(max(id), 0) + 1, false) FROM badges;

-- Insert data
INSERT INTO badges (id, badge_code, badge_name, badge_name_en, badge_type, badge_desc, badge_desc_en, icon_url, rule_desc, rule_desc_en, source_type, created_at) VALUES
  ('badge1', 'GOLD_MEDAL', '金牌', 'Gold Medal', 'award', '在黑客松中获得金牌奖项', 'Awarded gold medal in a hackathon', '', '在黑客松中获得第一名', 'Get 1st place in a hackathon', 'hackathon', '2026-04-07 17:21:58'),
  ('badge2', 'SERIAL_BUILDER', '连续构建者', 'Serial Builder', 'milestone', '发布5个以上项目', 'Published 5+ projects', '', '发布5个以上项目', 'Publish 5+ projects', 'work', '2026-04-07 17:21:58'),
  ('badge3', 'COMMUNITY_LEADER', '社区领袖', 'Community Leader', 'community', '在社区中做出重大贡献', 'Made significant contributions to the community', '', '获得100个以上点赞', 'Receive 100+ likes', 'activity', '2026-04-07 17:21:58'),
  ('badge4', 'GLOBAL_NOMAD', '全球游牧者', 'Global Nomad', 'milestone', '参加3个以上不同国家的黑客松', 'Participated in hackathons across 3+ countries', '', '参加3个以上不同国家的黑客松', 'Participate in hackathons across 3+ countries', 'hackathon', '2026-04-07 17:21:58');

-- ========================================
-- Table: user_badges
-- ========================================
-- Clear existing data
DELETE FROM user_badges;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('user_badges', 'id'), coalesce(max(id), 0) + 1, false) FROM user_badges;

-- Insert data
INSERT INTO user_badges (id, user_id, badge_id, status, earned_at, verified_at, created_at) VALUES
  ('ub_1775582518926_islwo908z', 'u1', 'badge1', 'verified', NULL, NULL, '2026-04-07 17:21:58'),
  ('ub_1775582518926_ekatau4e9', 'u1', 'badge2', 'approved', NULL, '2026-04-08 09:40:45', '2026-04-07 17:21:58');

-- ========================================
-- Table: sessions
-- ========================================
-- Clear existing data
DELETE FROM sessions;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('sessions', 'id'), coalesce(max(id), 0) + 1, false) FROM sessions;

-- Insert data
INSERT INTO sessions (id, user_id, token, expires_at, created_at) VALUES
  ('s_1775735969207_onqp2gljf', 'u_1775735969135_rr0t8z5j3', 'd2f7af1f189f1aae4d7ad78e41df7d4808bb20329fd7960b867628e0438529e3', '2026-05-09T11:59:29.207Z', '2026-04-09 11:59:29');

-- ========================================
-- Table: admin_users
-- ========================================
-- Clear existing data
DELETE FROM admin_users;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('admin_users', 'id'), coalesce(max(id), 0) + 1, false) FROM admin_users;

-- Insert data
INSERT INTO admin_users (id, username, password_hash, email, is_active, last_login_at, created_at, updated_at) VALUES
  ('admin_1775622580077', 'wjj', '4b4950e729ca44a14d0b27eb61de1da8b59d489388aae69435009ce5b759c6ee', 'admin@hackuni.com', TRUE, '2026-04-08T09:37:08.573Z', '2026-04-08 04:29:40', '2026-04-08 04:29:40');

-- ========================================
-- Table: admin_sessions
-- ========================================
-- Clear existing data
DELETE FROM admin_sessions;

-- Reset sequences
SELECT setval(pg_get_serial_sequence('admin_sessions', 'id'), coalesce(max(id), 0) + 1, false) FROM admin_sessions;

-- Insert data
INSERT INTO admin_sessions (id, admin_user_id, token, expires_at, created_at) VALUES
  ('admin_session_1775622580078_37dce5c549bcdc2f', 'admin_1775622580077', '5cc9d55df02f8e187c81b3db40fbe712f590c797b13c13d3d9b96a1a29838708', '2026-04-09T04:29:40.078Z', '2026-04-08 04:29:40'),
  ('admin_session_1775622585530_bcfc054a9fa45e53', 'admin_1775622580077', '271c283f57fc2ede8c15a4146fd0a7e355c624ea98c504fcb01e2ebe4b27b30e', '2026-04-09T04:29:45.530Z', '2026-04-08 04:29:45'),
  ('admin_session_1775623236641_a319be64dc5cd5d4', 'admin_1775622580077', 'd23ae954a2dd41f1807e8b9ac1f750815b7c33be586787deef31bf966c69ae35', '2026-04-09T04:40:36.640Z', '2026-04-08 04:40:36'),
  ('admin_session_1775641028572_63948768731dc2f5', 'admin_1775622580077', 'f4129e161d5be2f24371d57cb7629e604f86ce899d66ae09e041965b517d73a6', '2026-04-09T09:37:08.572Z', '2026-04-08 09:37:08');

COMMIT;
