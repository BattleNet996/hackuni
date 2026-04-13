# 🚀 Supabase 快速配置指南

由于网络问题无法使用 Supabase CLI，请按照以下步骤通过 Web Dashboard 完成配置。

---

## 📋 准备工作

### 已完成的配置 ✅
- [x] Vercel 项目已链接
- [x] 环境变量已配置（SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY）
- [x] 本地 SQLite 数据库有最新数据（17黑客松 + 18资讯）

### 需要完成的配置 ⏳
- [ ] 创建 Supabase 项目
- [ ] 执行数据库表结构 SQL
- [ ] 导入数据到 Supabase
- [ ] 验证生产环境

---

## 🎯 第一步：创建 Supabase 项目

### 1. 访问 Supabase
打开 https://app.supabase.com

### 2. 创建新项目
- 点击 **"New Project"**
- 填写信息：
  - **Name**: `hackuni-web`
  - **Database Password**: 设置一个强密码并保存！
  - **Region**: 选择 `Southeast Asia (Singapore)`
- 点击 **"Create new project"**
- 等待 1-2 分钟创建完成

---

## 🎯 第二步：获取凭证信息

项目创建完成后：

1. 进入 **Settings** → **API**

2. 复制以下信息（用于更新 Vercel 环境变量）：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **public anon key**: `eyJhb...`
   - **service_role key**: `eyJhb...` （⚠️ 绝不要泄露）

---

## 🎯 第三步：创建数据库表

### 1. 打开 SQL Editor
在 Supabase Dashboard 左侧菜单点击 **"SQL Editor"**

### 2. 创建表结构
复制以下 SQL 并执行（点击 **"Run"**）：

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hackathons table
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

-- Stories table
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

-- Users table
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

-- Projects table
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

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, target_type, target_id)
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_hackathons_updated_at BEFORE UPDATE ON hackathons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎯 第四步：导入数据

### 1. 导入黑客松数据
在 SQL Editor 中，打开项目目录下的 `hackathons_data.sql` 文件，复制全部内容并执行。

或者在本地执行：
```bash
cat hackathons_data.sql | pbcopy  # 复制到剪贴板
```
然后粘贴到 Supabase SQL Editor 并执行。

### 2. 导入资讯数据
同样方式打开 `ai_stories_data.sql`，复制全部内容并执行。

或者在本地执行：
```bash
cat ai_stories_data.sql | pbcopy  # 复制到剪贴板
```

### 3. 验证数据导入
执行以下 SQL 验证：

```sql
SELECT 'Hackathons:' as info, COUNT(*) as count FROM hackathons
UNION ALL
SELECT 'Stories:' as info, COUNT(*) FROM stories
UNION ALL
SELECT 'Users:' as info, COUNT(*) FROM users
UNION ALL
SELECT 'Projects:' as info, COUNT(*) FROM projects;
```

**期望结果**：
- Hackathons: 17
- Stories: 18
- Users: 0
- Projects: 0

---

## 🎯 第五步：禁用 RLS（Row Level Security）

由于 API 路由已处理权限，需要禁用 RLS：

```sql
ALTER TABLE hackathons DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
```

---

## 🎯 第六步：更新 Vercel 环境变量

如果 Supabase URL 和 Keys 与现有配置不同，需要更新：

### 方式一：通过 Vercel Dashboard
1. 访问 https://vercel.com/dashboard
2. 找到 `hackuni-web` 项目
3. 进入 **Settings** → **Environment Variables**
4. 更新以下变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. 保存后重新部署

### 方式二：通过 Vercel CLI
```bash
vercel env rm NEXT_PUBLIC_SUPABASE_URL production
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env rm SUPABASE_SERVICE_ROLE_KEY production

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 粘贴新的 URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 粘贴新的 anon key

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 粘贴新的 service_role key
```

---

## ✅ 第七步：验证部署

### 1. 检查生产环境
访问：https://hackuni-web.vercel.app/

应该看到：
- ✅ 页面正常加载
- ✅ 显示 17 个黑客松
- ✅ 显示 18 条 AI 资讯

### 2. 测试登录功能
1. 访问 `/login`
2. 注册新用户
3. 登录成功后尝试点赞
4. **不应该再出现 "session expired" 错误**

### 3. 查看部署日志
```bash
vercel logs --level error --since 1h
```

---

## 🔍 故障排查

### 问题 1：页面加载失败或显示错误
**原因**：Supabase 环境变量未正确配置

**解决**：
1. 检查 Vercel 环境变量是否完整
2. 确认 Supabase 项目已创建
3. 验证凭证信息是否正确

### 问题 2：数据没有显示
**原因**：数据库表未创建或数据未导入

**解决**：
1. 在 Supabase SQL Editor 检查表是否存在
2. 验证数据是否导入成功
3. 查看浏览器控制台错误信息

### 问题 3：登录后仍然提示 session expired
**原因**：可能是 token 传输问题

**解决**：
1. 清除浏览器 localStorage 和 cookies
2. 重新登录
3. 检查浏览器控制台网络请求

---

## 📊 配置状态总结

| 配置项 | 状态 | 说明 |
|--------|------|------|
| Vercel 项目链接 | ✅ | 已链接到 hackuni-web |
| Vercel 环境变量 | ✅ | 已配置 Supabase 相关变量 |
| 本地数据 | ✅ | 17 黑客松 + 18 资讯 |
| Supabase 项目 | ⏳ | 需要创建 |
| 数据库表 | ⏳ | 需要创建 |
| 数据导入 | ⏳ | 需要导入 |
| 生产测试 | ⏳ | 需要验证 |

---

**重要提示**：
- ✅ 本地开发继续使用 SQLite
- ✅ 生产环境使用 Supabase
- ✅ 环境变量自动切换数据库
- ✅ Session 问题已在代码层面修复

完成以上步骤后，生产环境应该可以正常运行！
