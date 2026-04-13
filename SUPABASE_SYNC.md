# 数据库同步指南

## 📊 当前状态

### 本地开发环境
- **数据库**: SQLite (database/hackuni.db)
- **状态**: ✅ 已导入最新数据
  - 17 个黑客松（包含春潮 + 16个新数据）
  - 18 条 AI 资讯

### 生产环境 (Vercel)
- **数据库**: Supabase (需要配置环境变量)
- **状态**: ⚠️ 需要同步数据

## 🚀 同步步骤

### 方案一：使用 Supabase Dashboard（推荐）

1. **登录 Supabase Dashboard**
   - 访问: https://app.supabase.com
   - 选择你的项目

2. **执行 SQL 脚本**

   在 Supabase Dashboard 的 SQL Editor 中执行以下文件：
   - `hackathons_data.sql` (黑客松数据)
   - `ai_stories_data.sql` (AI资讯数据)

3. **验证数据**
   ```sql
   -- 检查黑客松数量
   SELECT COUNT(*) FROM hackathons;

   -- 检查资讯数量
   SELECT COUNT(*) FROM stories;

   -- 查看最新黑客松
   SELECT id, title, city FROM hackathons ORDER BY created_at DESC LIMIT 5;
   ```

### 方案二：使用 Supabase CLI（自动化）

1. **安装 Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **连接到 Supabase 项目**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **执行数据迁移**
   ```bash
   # 执行黑客松数据
   supabase db execute --file hackathons_data.sql

   # 执行资讯数据
   supabase db execute --file ai_stories_data.sql
   ```

## 🔧 Vercel 环境变量配置

确保在 Vercel 项目中配置以下环境变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 配置步骤：

1. 访问 Vercel Dashboard: https://vercel.com/dashboard
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 添加上述三个环境变量
5. 重新部署项目

## ⚠️ 注意事项

### 数据库结构

确保 Supabase 中已创建以下表：

```sql
-- 黑客松表
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

-- 资讯表
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
```

## 📦 文件清单

- `hackathons_data.sql` - 16个最新黑客松数据
- `ai_stories_data.sql` - 18条AI资讯数据
- `backup_all_data.sql` - 完整数据库备份（SQLite格式）
- `database/hackuni.db` - 本地SQLite数据库（已更新）

## ✅ 完成清单

- [ ] 配置 Vercel 环境变量
- [ ] 在 Supabase 中创建表结构
- [ ] 导入 hackathons_data.sql
- [ ] 导入 ai_stories_data.sql
- [ ] 验证数据正确性
- [ ] 重新部署 Vercel 项目
- [ ] 测试生产环境 API

## 🆘 需要帮助？

如果遇到问题，检查：
1. Vercel 环境变量是否正确配置
2. Supabase 项目是否正常
3. SQL 脚本是否成功执行
4. Vercel 部署日志是否有错误
