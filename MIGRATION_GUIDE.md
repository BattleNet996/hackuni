# 📦 SQLite 到 Supabase 数据迁移指南

## ✅ 已完成的工作

### 数据导出完成 ✅
所有数据已从 SQLite 成功导出为 Supabase 兼容的 SQL 文件：

**文件位置**: `supabase/migration/all_data_migration.sql`

说明：
- `supabase/migration/` 当前用于保存一次性的数据导出 SQL。
- `supabase/migrations/` 才是 Supabase CLI 识别的标准 schema migration 目录。
- 后续新增表、字段、索引这类结构变更，请放到 `supabase/migrations/` 后再执行 `supabase db push`。

**数据统计**:
- ✅ users: 3 条记录
- ✅ hackathons: 17 条记录
- ✅ projects: 26 条记录
- ✅ stories: 18 条记录
- ✅ likes: 21 条记录
- ✅ badges: 4 条记录
- ✅ user_badges: 2 条记录
- ✅ sessions: 1 条记录
- ✅ admin_users: 1 条记录
- ✅ admin_sessions: 4 条记录
- ⚠️ comments: 0 条记录
- ⚠️ admin_logs: 0 条记录

**总计**: 97 条记录

---

## 🚀 如何导入到 Supabase

### 方法一：使用 SQL Editor（推荐）

1. **打开 Supabase SQL Editor**
   - 访问 https://app.supabase.com
   - 选择你的项目
   - 点击左侧菜单 **"SQL Editor"**

2. **复制 SQL 文件内容**
   ```bash
   cat supabase/migration/all_data_migration.sql | pbcopy
   ```

3. **粘贴并执行**
   - 在 SQL Editor 中粘贴内容
   - 点击 **"Run"** 按钮
   - 等待执行完成（约 1-2 秒）

4. **验证数据**
   ```sql
   -- 检查数据统计
   SELECT 'users' as table_name, COUNT(*) as count FROM users
   UNION ALL
   SELECT 'hackathons', COUNT(*) FROM hackathons
   UNION ALL
   SELECT 'projects', COUNT(*) FROM projects
   UNION ALL
   SELECT 'stories', COUNT(*) FROM stories
   UNION ALL
   SELECT 'likes', COUNT(*) FROM likes
   UNION ALL
   SELECT 'badges', COUNT(*) FROM badges;
   ```

### 方法二：使用迁移脚本（需要配置环境变量）

如果你已经配置了 Supabase 环境变量：

1. **配置环境变量**
   ```bash
   # 确保 .env.local 包含：
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhb...
   ```

2. **运行迁移脚本**
   ```bash
   npx tsx scripts/migrate-all-data-to-supabase.ts
   ```

---

## 📋 迁移前准备

### 第一步：创建 Supabase 项目

1. 访问 https://app.supabase.com
2. 点击 **"New Project"**
3. 填写信息：
   - **Name**: `hackuni-web`
   - **Database Password**: 设置强密码并保存
   - **Region**: 选择 `Southeast Asia (Singapore)`
4. 等待项目创建完成（1-2 分钟）

### 第二步：创建数据库表

在 Supabase SQL Editor 中执行表结构脚本：

```bash
cat supabase/schema.sql | pbcopy
```

然后粘贴到 SQL Editor 并执行。

### 第三步：禁用 RLS

由于 API 路由已处理权限，需要禁用 Row Level Security：

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
```

---

## 🔍 验证迁移结果

### 检查数据完整性

执行以下 SQL 检查各表记录数：

```sql
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'hackathons', COUNT(*) FROM hackathons
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'stories', COUNT(*) FROM stories
UNION ALL
SELECT 'likes', COUNT(*) FROM likes
UNION ALL
SELECT 'badges', COUNT(*) FROM badges
UNION ALL
SELECT 'user_badges', COUNT(*) FROM user_badges
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'admin_sessions', COUNT(*) FROM admin_sessions;
```

**期望结果**:
```
table_name       | count
-----------------+-------
users            |     3
hackathons       |    17
projects         |    26
stories          |    18
likes            |    21
badges           |     4
user_badges      |     2
sessions         |     1
admin_users      |     1
admin_sessions   |     4
```

### 检查数据示例

```sql
-- 查看用户数据
SELECT id, email, display_name FROM users LIMIT 3;

-- 查看黑客松数据
SELECT id, title, city FROM hackathons LIMIT 5;

-- 查看项目数据
SELECT id, title, author_id FROM projects LIMIT 5;

-- 查看资讯数据
SELECT id, title, source FROM stories LIMIT 5;
```

---

## ⚠️ 注意事项

1. **数据覆盖**
   - 迁移脚本会先清空目标表，再插入新数据
   - 确保 Supabase 中没有重要数据需要保留

2. **外键约束**
   - 迁移顺序已考虑外键依赖
   - 不建议单独执行某个表的迁移

3. **JSON 字段**
   - SQLite 的 JSON 字段已转换为 PostgreSQL 的 JSONB 类型
   - tags_json、images、looking_for 等字段会自动转换

4. **时间戳**
   - SQLite 的 datetime 格式与 PostgreSQL 兼容
   - created_at、updated_at 等字段会正确迁移

---

## 🛠️ 故障排查

### 问题 1: SQL 执行失败

**错误**: `relation "users" does not exist`

**原因**: 数据库表未创建

**解决**: 先执行 `supabase/schema.sql` 创建表结构

### 问题 2: 外键约束错误

**错误**: `insert or update on table violates foreign key constraint`

**原因**: 数据顺序问题

**解决**: 确保按顺序执行完整的迁移 SQL，不要跳过

### 问题 3: JSON 格式错误

**错误**: `invalid input syntax for type json`

**原因**: SQLite 中的 JSON 数据格式不正确

**解决**: 检查源数据，确保 JSON 格式正确

---

## 📚 相关文档

- **QUICK_SETUP.md**: Supabase 快速配置指南
- **PRODUCTION_SETUP.md**: 生产环境详细配置
- **SUPABASE_SYNC.md**: 数据同步说明

---

## ✅ 完成检查清单

迁移完成后，请确认：

- [ ] Supabase 项目已创建
- [ ] 所有数据库表已创建
- [ ] RLS 已禁用
- [ ] 数据已成功导入（97 条记录）
- [ ] 数据验证通过
- [ ] Vercel 环境变量已配置
- [ ] 生产环境可以正常访问
- [ ] 登录功能正常
- [ ] 点赞功能正常

---

**迁移完成后，你的生产环境应该完全正常运行！** 🎉
