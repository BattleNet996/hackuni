20260402 讨论
- 观猹
- 极客：web3
- 链路点一点
- 对：开发者增强影响力
- 定义为大学，定义为激发灵感，启动人心
- 2008：Business insight，tech crunch（36kr）：采编，写稿，等 
- 推动人发展出先进生产力
这个时代，平等惩罚每个平庸的人，平庸的人不知道发生什么就被边缘化了
为了，一件事在一个人闭环（澳龙）
明星员工，会成为公司非常大的价值
生态贡献者，价值在流动（builder，平台，受影响的）
why：
其他黑客松大多都是炒一个是就断了，如果能一直把事情串起来（？）
Adventure hackthon 一年一场，对 builder 有好处，青少年教育
一线打品牌，下沉做公益，中间赚钱
线下和线上：很多人都有一堵墙打不穿，需要物理去打破（人与人，信息与信息）
李继刚：AI Native的评价指标，token 消耗量 / 打断 AI 的次数


1. 产品目标概述

黑客松大学不是单纯的活动信息平台，而是一个围绕 黑客松事件 / 用户行动 / 作品沉淀 / 徽章认证 / 社区内容 / 社会背书 建立起来的产品系统。核心目标分三层：发现层：发现全球黑客松、发现有趣的人和作品；沉淀层：把参赛经历、作品、成绩、社区行为沉淀成长期资产；认证层：形成徽章、评分、排行榜、可信档案，逐步成为行业标准。
MVP 阶段优先实现：发现黑客松 / 浏览作品与内容 / 搭建用户档案 / 记录黑客松经历 / 支持作品发布 / 支持徽章展示与申请 / 提供基础后台运营能力。复杂的推荐算法、深度风控、复杂社交关系和多级审核流都暂缓。

---
1. 首页展示模块
1.1 模块定位
首页是产品的世界观入口，用视觉和交互传达：“全球各地的 Outlier 正在发生连接，黑客松是这个时代的创造现场。”它既承担品牌展示，也承担流量分发和快速导航。
1.2 前台功能
1）全球黑客松地球
- 首页中心是一颗可旋转的 3D 地球，3D WebGL 球体
- 地球上按地点打点展示全球黑客松
- 支持拖拽旋转、缩放、自动缓慢自转
- 鼠标悬停/点击点位时，右侧或浮层展示该黑客松信息卡片：
  - 黑客松标题
  - 海报缩略图
  - 时间
  - 城市 / 国家
  - 主办方
  - 标签（AI / Hardware / Social / Web3 / Design 等）
  - 黑客松等级
  - 点击进入详情页

2）首页辅助展示区
 MVP 实现建议：这些内容都可以通过数据库查询 + 简单排序规则生成，不需要独立推荐系统。
- Featured Hackathons：精选活动卡片，跳转活动详情；
- Trending Projects：近期热门作品，默认按点赞数或热度排序；
- GOAT Builders：近期高热度用户，依据作品点赞数 / 徽章数 / 活跃度生成；
- Latest Stories：最新 Blog / News；
- 氛围指标：近期获得徽章人数 / 近期新增作品数 / 全球覆盖城市数。

1.3 关键设计要求
- 视觉风格：黑白、未来感、极简但有“异想天开”的气质
- 动效丝滑，不能像普通地图网站
- 地球要更像“创造者星图”，而不是工具地图
- 黑客松活动在地图上也是立体的素材

1.4 依赖数据
- Hackathon 基础表
- Hackathon 地点地理编码
- 黑客松等级评分数据
- 标签体系数据

---
2. 黑客松模块
2.1 模块定位
黑客松模块是“全球黑客松数据库 + 活动详情档案库”，负责承接首页流量，并作为用户经历绑定、作品绑定、徽章绑定的核心基础实体。
2.2 前台功能
1）黑客松列表页
MVP 实现建议：搜索支持标题和主办方关键词；地区筛选支持国家或大区；排序优先支持“时间最近和按点赞数排序 ”。
展示形式类似 Luma / 活动发现页：
- 时间
- 活动海报缩略图
- 标题
- 主办方
- 地点：城市 / 国家 / 线上线下
- 简短简介
- 黑客松标签
- 黑客松等级
- 报名状态（未开始 / 报名中 / 已截止 / 已结束）
- 点赞数（用户可以点赞，视作打分）
[图片]
支持：
- 搜索
- 标签筛选
- 地区筛选
- 时间筛选
- 排序

2）黑客松详情页
报名状态由报名截止时间和活动时间自动计算。

展示：
- 标题
- 海报
- 活动举办时间
- 截止报名时间
- 举办地点
- 主办方
- 主办方主页 / 官网链接
- 活动长介绍
- 外链：黑客松官网链接，报名链接
- 黑客松等级评分
- 参与该活动的用户卡片

2.3 依赖数据
- Hackathon 数据表 / Hackathon 收藏表 / Hackathon 用户评分表 / User Hackathon Record 表 / Work 表

---
3. News / Blog 模块
3.1 模块定位
这是产品的内容中枢，用来讲故事、造势、做传播、教育市场。
3.2 前台功能
1）列表页
类似 Medium，默认按发布时间由近及远排序。缩略图默认取正文第一张图，没有则使用默认兜底图。
MVP 暂不做复杂排序，只做时间排序 + 置顶优先。
[图片]
每个卡片展示：
- 发布人头像
- 发布人名称
- 标题
- 摘要
- 发布时间
- 点赞数
- 评论数
- 缩略图（正文第一张图，如果没有，使用默认图片兜底）
- 标签（案例 / 访谈 / 思考 / 社区动态 / 活动复盘）

2）帖子详情页
展示：
- 标题
- 作者信息
- 发布时间
- 正文内容
- 点赞
- 评论区
- 相关黑客松卡片

3.3 后台支持
- 目前仅支持官方后台编辑和发布，暂不支持前台发布帖子
- 帖子发布（MVP 版本直接用 MD 或者 HTML 写入）
- 帖子状态管理：隐藏 / 正常 / 置顶 （通过数据库状态标签实现）
- 内容与黑客松/用户/作品关联（通过数据库外链实现）

3.4 依赖数据
- Blog 数据表 / Blog 评论表 / Blog 点赞表 / Blog 与 Hackathon 关联表 / User 表。

---

4. GOAT Hunt 模块
4.1 模块定位
这是“作品发现与社区投票系统”，类似 Product Hunt，但对象是黑客松生态中的项目、原型和 MVP。
4.2 前台功能
1）作品列表页
[图片]
展示：
- 产品 avatar
- 当前排名
- 标题
- 简介（默认提取正文前几句话）
- 点赞数
- 发布人 / 团队
- 绑定的黑客松
- 所获奖项
- 标签

当前默认按点赞数排序。简介默认提取正文前几句话，也可由用户手填 short description。

2）作品详情页
展示：
- 标题
- avatar / 封面
- 图片 / 视频
- Demo 链接
- Github 链接
- 详细描述
- 外部主页
- 团队成员
- 所获奖项
- 所属黑客松（卡片呈现）
- 点赞
- 评论
- 分享


4.3 发布支持
- 1）个人的作品发布与审核：支持前台发布页面，用户填写作品表单后提交；
- 2）支持 CLI 工具， AI Agent 可以帮用户发布，允许 AI Agent 通过标准字段上传作品
- 3）MVP 阶段作品状态分为：已发布 / 已隐藏。
为了和徽章逻辑对齐，作品发布时支持选择绑定黑客松；若绑定黑客松并填写获奖信息，可触发后续认证申请。

4.4 依赖数据
- Work 数据表 / Work 评论表 / Work 点赞表 / Work 团队成员表 / Hackathon 表 / User 表

---

5. 用户模块
5.1 模块定位
用户模块是档案系统，是整个平台最核心的资产沉淀部分。它负责把用户的身份、经历、作品、行为和徽章组织成一个长期可信的个人页面。

---
5.2 Geek Profile 基础档案页
展示：
- 头像
- 姓名 / 昵称
- 学校
- 专业
- 公司
- 职位
- 个人简介
- 联系方式（邮箱公开，手机号隐藏）
- 外部链接（X、GitHub、个人网站等）
- looking for 状态（包括 cofounder，hackthon teammate 等）
- 徽章墙
- 核心指标 Dashboard
  - 参加黑客松数
  - 获奖数
  - 上线作品数
  - 认证记录数

支持：
- 编辑 profile
- 分享个人主页

---
5.3 用户认证与徽章模块
1）徽章列表
2）徽章详情页
- 徽章说明
- 获得时间
- 来源黑客松 / 来源行为
- 认证状态
- 徽章分享图生成

关于徽章管理逻辑：
- 一类是基于作品 + 黑客松的成就徽章，例如金奖、最佳设计等奖项；
- 一类是基于累计行为的统计徽章，例如参与 3 次挑战赛、发布 5 个项目等。

5.4 个人黑客松行动模块
这个模块可以有多种视图切换：
1）足迹视图
- 根据黑客松地点展示个人参赛轨迹
- 像“航旅纵横”的飞行路线
- 展示从一个城市到另一个城市的参赛路径
- 指标可附加总飞行距离 / 覆盖城市数 / 覆盖国家数
2）日历热力图视图
- 类似 GitHub contributions
- 深色：参加黑客松记录
- 浅色：平台活跃记录（登录、点赞都会记录）
- 点击具体日期展示对应事件
3）结构化表格视图
字段：
- 黑客松名
- 时间
- 地点
- teammate
- 名次
- 角色
- 作品链接
- 是否认证

---
5.4 个人作品 Portfolio
列表页
- 作品封面
- 标题
- 简介
- 所属黑客松
- 标签
- 点赞数
详情页
- 完整展示项目
- 与 GOAT Hunt 作品详情页复用

---
5.5 后台支持
- 以下功能 MVP 都通过数据库实现：
  - 用户资料审核（如需要）
  - 认证材料审核
  - 徽章发放与回收

5.6 依赖数据
- User 主表 / User 扩展资料表 / User 社交链接表 / User 隐私设置表 / User 徽章表 / User Hackathon Record 表 / User Work 表 / User Activity Log 表。

---
6. 认证与徽章模块
6.1 模块定位
把用户的黑客松经历、作品表现、社区行为，转化为可信、可展示、可流通的身份资产。它是平台从“信息平台”升级为“认证平台”的关键模块
6.2 前台功能
- 徽章中心：展示全部徽章及分类；徽章详情页：展示说明、来源、获取规则；徽章获取规则说明；认证申请入口。
- 入口在用户 Profile 页的徽章板块，“获取更多徽章”跳转进入徽章中心或申请页。

6.3 后台功能
- 徽章模板管理
- 发放规则管理
- 人工审核
- 主办方批量认证接口
- 徽章版本迭代

6.4 认真逻辑
用户可基于某条黑客松经历或某个作品发起认证申请；后台审核通过后，更新该经历或作品的 verify_status，同时生成 user_badge_record；若规则满足累计条件，也可由后台批量生成统计类徽章。
认证状态在前台统一展示为：待审核 / 已认证 / 已拒绝。

6.5 依赖数据
- Badge 定义表 / Badge 发放记录表 / Badge 规则表 / 认证申请表 / 审核记录表 / User Hackathon Record 表 / Work 表。

7. 后台运营模块
实现方式
MVP 版本提供一个简单的 web 后台，读取 SQLite 数据并支持增删改查即可，不追求复杂权限系统。
后台主要是 编辑 + 审核 + 查看统计。
核心功能
- 数据统计看板：用户数 / 黑客松数 / 作品数 / 帖子数 / 徽章发放数 / 近期活跃
- News / Blog 内容管理：新增 / 编辑 / 上下线 / 置顶；
- 黑客松数据管理：新增 / 编辑 / 发布 / 隐藏 / 更新时间地点标签等级；
- 作品数据管理：查看 / 审核 / 隐藏；
- 用户徽章认证审核：查看申请 / 审核结果 / 发放徽章；
- Banner 配置：Banner 内容配置


---

黑客松大学 数据文档 v0.1
下面的数据文档完全对齐上面的产品模块，尽量轻量，不做太重的拆分，但保留必要关系。

1. hackathon
用途：支撑首页地球 / 黑客松列表页 / 黑客松详情页 / 用户经历绑定 / 作品绑定。
字段：id / title / slug / short_desc / long_desc / poster_url / official_url / registration_url / organizer_name / organizer_url / start_time / end_time / registration_deadline / city / country / address_text / latitude / longitude / location_type / tags_json / level_code / level_score / score_display_text / registration_status / status / source_type / source_url / created_at / updated_at
说明：location_type=offline/online/hybrid；registration_status=未开始/报名中/已截止/已结束，可定时计算也可冗余存；tags_json 先轻量存 JSON，后续再拆标签关系表；level_code 用于标识等级，level_score 用于排序或展示。

2. hackathon_favorite
用途：支撑黑客松收藏按钮。
字段：id / hackathon_id / user_id / created_at
约束：hackathon_id + user_id 唯一。

3. hackathon_review
  
用途：支撑黑客松等级评分中的“用户评分均值”与评论内容。

字段：id / hackathon_id / user_id / overall_score / review_text / status / created_at / updated_at

说明：status=normal/hidden；MVP 只做总分，不拆多维度评分。

4. post
  
用途：支撑 News / Blog 列表页与详情页。

字段：id / type / title / slug / summary / content_md / content_html / cover_url / author_user_id / tags_json / related_hackathon_id / related_work_id / related_user_id / like_count / comment_count / status / published_at / created_at / updated_at

说明：type=news/blog；status=draft/published/hidden/pinned；正文直接存 md 或 html；related_* 用于轻量关联其他模块。

5. post_like
  
用途：支撑文章点赞。

字段：id / post_id / user_id / created_at

约束：post_id + user_id 唯一。

6. post_comment
  
用途：支撑文章评论区。

字段：id / post_id / user_id / content / status / created_at / updated_at

说明：MVP 不支持评论的评论，所以不需要 parent_comment_id；status=normal/hidden/deleted。

7. work
  
用途：支撑 GOAT Hunt 列表页 / 作品详情页 / 用户作品 Portfolio / 徽章申请来源。

字段：id / title / slug / short_desc / long_desc / avatar_url / cover_url / media_json / demo_url / github_url / website_url / owner_user_id / team_name / team_intro / team_member_text / hackathon_id / award_text / is_awarded / tags_json / like_count / comment_count / share_count / rank_score / status / publish_source / created_at / updated_at

说明：media_json 可存图片/视频数组；publish_source=web/cli/agent；is_awarded 布尔值即可；团队成员先用文本字段 team_member_text 轻量承接，若需要结构化展示再补表。

8. work_member
  
用途：当作品团队需要结构化成员展示时使用；若开发资源有限可先不启用。

字段：id / work_id / user_id / role_text / is_owner / sort_order / created_at

说明：如果前期只想轻做，可先只保留 work.team_member_text，不强制用此表。

9. work_like
  
用途：支撑作品点赞 / 列表排序。

字段：id / work_id / user_id / created_at

约束：work_id + user_id 唯一。

10. work_comment
  
用途：支撑作品评论。

字段：id / work_id / user_id / content / status / created_at / updated_at

说明：同样不支持评论的评论。

11. user
  
用途：支撑用户 Profile 主信息。

字段：id / avatar_url / display_name / real_name / school / major / company / job_title / bio / email / phone / x_url / github_url / website_url / looking_for / badge_count / total_hackathon_count / total_award_count / total_work_count / total_verify_count / profile_status / created_at / updated_at

说明：邮箱公开 / 手机隐藏是产品默认逻辑；统计字段可以冗余存，便于前台快速展示；looking_for 可直接存字符串或枚举数组 JSON。

12. user_profile_ext
  
用途：支撑用户扩展资料，避免 user 主表过长。

字段：id / user_id / country / city / intro_long / skills_text / education_text / experience_text / created_at / updated_at

说明：MVP 不是必须，但你框架里已经提到扩展资料表，这里保留。

13. user_social_link
  
用途：支撑用户外部链接展示。

字段：id / user_id / platform / link_url / display_text / sort_order / created_at

说明：如果想极轻量，也可以不用这张表，直接用 user 主表里的 x_url/github_url/website_url；但保留此表更利于未来扩展其他平台。

14. user_privacy
  
用途：支撑联系方式展示规则和未来的可见性控制。

字段：id / user_id / show_email / show_phone / show_real_name / show_activity / show_portfolio / updated_at

说明：MVP 可以写默认值，但表建议保留。

15. user_hackathon_record
  
用途：支撑用户黑客松行动模块三种视图 / Profile 指标 / 认证申请来源。

字段：id / user_id / hackathon_id / role_type / rank_text / award_text / teammate_text / work_id / event_time / city / country / verify_status / proof_url / note / created_at / updated_at

说明：role_type=participant/finalist/winner/organizer/mentor/judge；verify_status=unverified/pending/verified/rejected；event_time 可默认取 hackathon.start_time，也允许用户单独填写；足迹视图、表格视图、徽章逻辑都从这张表取数。

16. user_activity_log
  
用途：支撑日历热力图中的“平台活跃记录”与基础统计。

字段：id / user_id / activity_type / target_type / target_id / activity_date / meta_json / created_at

说明：activity_type 可包括 login / like_post / like_work / comment_post / comment_work / publish_work / update_profile / apply_badge；前台热力图只看 activity_date 和类型即可。

17. badge_definition
  
用途：支撑徽章中心 / 徽章详情页 / 发放逻辑。

字段：id / badge_code / badge_name / badge_type / badge_desc / icon_url / cover_url / rule_desc / source_type / version / status / created_at / updated_at

说明：badge_type=award/participation/milestone/community；source_type=hackathon/work/activity/manual；rule_desc 用于前台展示“如何获取”。

18. badge_rule
  
用途：支撑后台的徽章规则管理。

字段：id / badge_id / rule_type / rule_value / rule_json / status / created_at / updated_at

说明：rule_type 可包括 hackathon_award / participation_count / publish_count / manual；MVP 不一定做自动执行，但要能存规则。

19. user_badge_record
  
用途：支撑用户徽章墙 / 徽章详情页 / Dashboard 的认证记录数。

字段：id / user_id / badge_id / source_type / source_id / source_text / verify_status / issued_at / revoked_at / created_at / updated_at

说明：source_type=hackathon/work/activity/manual；verify_status=pending/verified/rejected/revoked；source_text 用于前台展示来源名称。

20. verification_apply
  
用途：支撑认证申请入口和后台审核。

字段：id / user_id / apply_type / target_id / related_hackathon_id / related_work_id / related_badge_id / proof_url / proof_text / status / reviewer_id / review_note / created_at / updated_at

说明：apply_type=hackathon_record/work_award/badge_claim；status=pending/approved/rejected；一个申请通过后，通常会同步更新 user_hackathon_record.verify_status 或生成 user_badge_record。

21. audit_log
  
用途：支撑后台审核记录与操作留痕。

字段：id / business_type / business_id / action_type / operator_user_id / note / created_at

说明：business_type 可包括 post/work/user/badge/apply；action_type 可包括 create/update/hide/approve/reject/revoke。

22. banner_config
  
用途：支撑首页 Banner 或精选区域配置。

字段：id / title / subtitle / image_url / link_type / link_target / sort_order / status / start_time / end_time / created_at / updated_at

说明：Banner 配置是你后台模块里明确提出的需求，单独保留一张表最清晰。

23. stat_snapshot
  
用途：支撑后台数据看板和首页氛围指标。

字段：id / stat_date / new_user_count / new_work_count / new_badge_count / city_covered_count / total_hackathon_count / total_work_count / total_user_count / created_at

说明：MVP 可以通过定时任务每日写入，也可以临时 SQL 聚合；有这张表会更轻松。

⸻

模块与数据表对齐关系

首页展示模块：hackathon / work / user / post / banner_config / stat_snapshot

黑客松模块：hackathon / hackathon_favorite / hackathon_review / user_hackathon_record / work

News/Blog 模块：post / post_like / post_comment / user / hackathon

GOAT Hunt 模块：work / work_like / work_comment / work_member / user / hackathon

用户模块：user / user_profile_ext / user_social_link / user_privacy / user_hackathon_record / user_activity_log / work / user_badge_record / badge_definition

认证与徽章模块：badge_definition / badge_rule / user_badge_record / verification_apply / audit_log / user_hackathon_record / work

后台运营模块：上述全部核心表，重点使用 hackathon / post / work / user / verification_apply / user_badge_record / banner_config / stat_snapshot / audit_log

我建议你下一步立刻补的两份东西


现在这两份文档之后，最适合继续做的是：
1. 信息架构图 / 页面结构图：把页面和跳转关系画出来
2. 数据库 ER 图 / 核心表关系图：把 user、hackathon、work、badge 的关系画清楚


这样你就可以直接和设计师、前端、后端对齐了。
我下一步可以继续帮你把这套文档整理成更正式的 PRD 风格版本。
