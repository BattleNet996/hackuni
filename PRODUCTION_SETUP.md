# 🚀 Supabase 生产环境配置指南

## ⚠️ 当前问题

**本地开发**: 使用 SQLite (`database/hackuni.db`)
- ✅ 已有最新数据（17黑客松 + 18资讯）
- ✅ 所有功能正常

**生产环境 (Vercel)**:
- ❌ 需要配置 Supabase（Vercel 不支持 SQLite）
- ❓ 需要同步数据到 Supabase

---

## 📝 配置步骤

### 第一步：创建 Supabase 项目

1. **访问 Supabase**
   - 打开 https://app.supabase.com
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 项目名称: `hackuni-web`
   - 数据库密码: **保存好这个密码！**
   - 区域: 选择 `Southeast Asia (Singapore)` 或离用户最近的区域
   - 点击 "Create new project"

3. **等待项目创建完成**
   - 大约需要 1-2 分钟

---

### 第二步：获取 Supabase 凭证信息

创建完成后，获取以下信息：

1. **Project URL**
   - 进入 Settings → API
   - 找到 `Project URL`
   - 格式: `https://xxxxx.supabase.co`

2. **anon public key**
   - 在同一个页面
   - 找到 `public anon key`
   - 复制这个 key

3. **service_role key**
   - 在同一个页面
   - 找到 `service_role` key
   - 点击 "Reveal" 并复制
   - ⚠️ **绝不要泄露这个 key！**

---

### 第三步：配置 Vercel 环境变量

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com/dashboard
   - 找到 `hackuni-web` 项目

2. **进入项目设置**
   - 点击项目进入 Dashboard
   - 进入 Settings → Environment Variables

3. **添加环境变量**

   添加以下三个环境变量：

   ```
   名称: NEXT_PUBLIC_SUPABASE_URL
   值: https://xxxxx.supabase.co
   环境: Production, Preview, Development (全部勾选)
   ```

   ```
   名称: NEXT_PUBLIC_SUPABASE_ANON_KEY
   值: eyJhb... (你复制的 anon key)
   环境: Production, Preview, Development (全部勾选)
   ```

   ```
   名称: SUPABASE_SERVICE_ROLE_KEY
   值: eyJhb... (你复制的 service_role key)
   环境: Production, Preview, Development (全部勾选)
   ```

4. **保存并重新部署**
   - 点击 "Save"
   - Vercel 会自动触发重新部署
   - 等待部署完成（大约 1-2 分钟）

---

### 第四步：在 Supabase 中创建数据库表

1. **打开 Supabase SQL Editor**
   - 在 Supabase Dashboard
   - 点击左侧菜单 "SQL Editor"

2. **创建表结构**

   复制以下 SQL 并执行：

```sql
-- 创建黑客松表
CREATE TABLE IF NOT EXISTS hackathons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_desc TEXT,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    city TEXT,
    country TEXT,
    latitude REAL,
    longitude REAL,
    location_detail TEXT,
    tags_json TEXT,
    level_score TEXT,
    level_code TEXT,
    registration_status TEXT,
    poster_url TEXT,
    organizer TEXT,
    organizer_url TEXT,
    registration_url TEXT,
    requirements TEXT,
    prizes TEXT,
    fee TEXT,
    hidden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建资讯表
CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    source TEXT,
    source_url TEXT,
    author_name TEXT,
    content TEXT,
    tags_json TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    like_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    hidden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    display_name TEXT,
    avatar TEXT,
    bio TEXT,
    school TEXT,
    major TEXT,
    company TEXT,
    position TEXT,
    phone TEXT,
    twitter_url TEXT,
    github_url TEXT,
    website_url TEXT,
    looking_for TEXT,
    total_hackathon_count INTEGER DEFAULT 0,
    total_work_count INTEGER DEFAULT 0,
    total_award_count INTEGER DEFAULT 0,
    badge_count INTEGER DEFAULT 0,
    certification_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_banned INTEGER DEFAULT 0
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_desc TEXT,
    long_desc TEXT,
    team_member_text TEXT,
    tags_json TEXT,
    demo_url TEXT,
    github_url TEXT,
    website_url TEXT,
    images TEXT,
    related_hackathon_id TEXT,
    is_awarded INTEGER DEFAULT 0,
    award_text TEXT,
    author_id TEXT,
    like_count INTEGER DEFAULT 0,
    rank_score REAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, target_type, target_id)
);
```

---

### 第五步：同步数据到 Supabase

1. **在 Supabase SQL Editor 中执行以下文件**

   按顺序执行：
   - `hackathons_data.sql` (16个黑客松数据)
   - `ai_stories_data.sql` (18条AI资讯数据)

2. **验证数据**

```sql
-- 检查数据数量
SELECT 'Hackathons:' as info, COUNT(*) as count FROM hackathons
UNION ALL
SELECT 'Stories:' as info, COUNT(*) FROM stories
UNION ALL
SELECT 'Users:' as info, COUNT(*) FROM users
UNION ALL
SELECT 'Projects:' as info, COUNT(*) FROM projects;
```

---

### 第六步：Row Level Security (RLS) 配置

```sql
-- 关闭 RLS（API 路由会处理权限）
ALTER TABLE hackathons DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
```

---

## ✅ 验证配置

### 1. 检查生产环境

访问: https://hackuni-web.vercel.app/

应该看到：
- ✅ 页面正常加载
- ✅ 显示真实数据
- ✅ 登录功能正常

### 2. 测试登录流程

1. 访问 `/login`
2. 输入邮箱和密码
3. 登录成功后尝试点赞项目
4. **不应该再出现 "session expired" 错误**

---

## 🔧 常见问题

### Q1: 部署后还是显示 SQLite 错误
**A**: 检查 Vercel 环境变量是否正确配置

### Q2: 登录后还是提示 session expired
**A**:
1. 清除浏览器 localStorage 和 cookies
2. 重新登录
3. 检查浏览器控制台日志

### Q3: 数据没有显示
**A**:
1. 检查 Supabase 表是否创建成功
2. 检查数据是否导入成功
3. 查看 Vercel 部署日志

---

**重要提示**:
- ✅ 本地开发使用 SQLite
- ✅ 生产环境使用 Supabase
- ✅ 环境变量自动切换数据库
