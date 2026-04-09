# Admin System Setup Guide

## 管理员系统设置指南

### 🚀 快速开始

#### 自动初始化

管理员系统会在第一次访问时自动初始化：
- 自动创建 `admin_users` 和 `admin_sessions` 表
- 自动添加 `is_banned` 列到 `users` 表
- 自动创建默认管理员账号

#### 登录管理后台

访问：`http://localhost:3000/admin`

使用默认管理员凭据登录（已通过安全渠道提供）

⚠️ **重要**：首次登录后请立即修改默认密码！

### 📋 功能列表

#### 管理员认证
- ✅ 独立的管理员登录系统
- ✅ HTTP-only cookie存储token
- ✅ 24小时token有效期
- ✅ 自动过期会话清理

#### 用户管理
- ✅ 查看所有用户
- ✅ 封禁/解封用户
- ✅ 删除用户
- ✅ 查看用户详细信息

#### 黑客松管理
- ✅ 添加新黑客松
- ✅ 编辑黑客松
- ✅ 删除黑客松
- ✅ 查看所有黑客松

#### 项目管理
- ✅ 查看所有项目
- ✅ 隐藏/显示项目
- ✅ 删除项目
- ✅ 查看项目统计

#### 文章管理
- ✅ 发布新文章
- ✅ 编辑文章
- ✅ 删除文章
- ✅ 查看所有文章

#### 徽章管理
- ✅ 创建新徽章
- ✅ 编辑徽章
- ✅ 删除徽章
- ✅ 查看所有徽章

### 🔒 安全特性

1. **独立认证系统**
   - 管理员账号与普通用户分离
   - 使用SHA-256密码哈希
   - 安全随机token生成

2. **会话管理**
   - HTTP-only cookies防止XSS攻击
   - 自动过期机制
   - 安全登出清理

3. **路由保护**
   - 所有/admin路由需要管理员认证
   - 自动重定向未认证用户
   - 路径检查防止循环重定向

### 📁 API端点

#### 认证
- `POST /api/admin/auth/login` - 管理员登录
- `POST /api/admin/auth/logout` - 管理员登出
- `GET /api/admin/auth/verify` - 验证token

#### 统计
- `GET /api/admin/stats` - 获取平台统计数据

#### 用户管理
- `GET /api/admin/users` - 获取所有用户
- `PATCH /api/admin/users/[id]` - 更新用户
- `DELETE /api/admin/users/[id]` - 删除用户

#### 黑客松管理
- `GET /api/admin/hackathons` - 获取所有黑客松
- `POST /api/admin/hackathons` - 创建黑客松
- `PATCH /api/admin/hackathons/[id]` - 更新黑客松
- `DELETE /api/admin/hackathons/[id]` - 删除黑客松

#### 文章管理
- `GET /api/admin/stories` - 获取所有文章
- `POST /api/admin/stories` - 创建文章
- `PATCH /api/admin/stories/[id]` - 更新文章
- `DELETE /api/admin/stories/[id]` - 删除文章

#### 徽章管理
- `GET /api/admin/badges` - 获取所有徽章
- `POST /api/admin/badges` - 创建徽章
- `PATCH /api/admin/badges/[id]` - 更新徽章
- `DELETE /api/admin/badges/[id]` - 删除徽章

#### 项目管理
- `PATCH /api/admin/projects/[id]` - 更新项目
- `DELETE /api/admin/projects/[id]` - 删除项目

#### 系统初始化
- `POST /api/admin/init` - 初始化管理员系统
- `GET /api/admin/init` - 检查初始化状态

### 🗄️ 数据库表结构

#### admin_users
```sql
CREATE TABLE admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    is_active INTEGER DEFAULT 1,
    last_login_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

#### admin_sessions
```sql
CREATE TABLE admin_sessions (
    id TEXT PRIMARY KEY,
    admin_user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);
```

### ⚙️ 自定义配置

#### 修改默认密码

登录后，建议立即修改默认密码。你可以直接在数据库中更新：

```sql
-- 使用SHA-256哈希新密码
-- 示例：将密码改为 "new_password123"
UPDATE admin_users
SET password_hash = '...'  -- 新密码的SHA-256哈希值
WHERE username = 'wjj';
```

#### 添加新的管理员

```sql
INSERT INTO admin_users (id, username, password_hash, email)
VALUES (
    'admin_' || strftime('%s', 'now'),
    'new_admin',
    '...',  -- 密码的SHA-256哈希值
    'admin@example.com'
);
```

### 🐛 故障排查

#### 无法登录
1. 检查是否已初始化系统：`GET /api/admin/init`
2. 确认数据库文件存在
3. 检查浏览器控制台的错误信息

#### API返回401错误
- 确认token在cookie中正确设置
- 检查token是否已过期（24小时有效期）
- 尝试重新登录

#### 数据库错误
- 确保 `database/hackuni.db` 文件存在
- 检查文件权限
- 重新运行初始化API

### 📝 注意事项

1. **生产环境安全**
   - ⚠️ 立即修改默认密码
   - 使用HTTPS
   - 设置更短的token有效期
   - 启用CSRF保护

2. **备份**
   - 定期备份数据库
   - 备份前测试恢复流程

3. **日志**
   - 监控管理员登录活动
   - 记录敏感操作

### 🎯 下一步

- [ ] 添加更多管理员角色
- [ ] 实现操作日志记录
- [ ] 添加双因素认证
- [ ] 创建批量操作功能
