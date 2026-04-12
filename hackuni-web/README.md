# HackUni Web - 黑客松社区平台

一个现代化的黑客松社区平台，帮助发现、分享和展示黑客松项目。

## 🌟 特性

- 🌍 **全球黑客松地图** - 可视化展示全球黑客松活动
- 👥 **用户认证** - 完整的注册、登录、会话管理
- 🏆 **项目展示** - 上传和展示黑客松项目
- 💬 **互动功能** - 点赞、评论、徽章系统
- 👨‍💼 **管理后台** - 项目审核、用户管理
- 🌐 **中英双语** - 完整的多语言支持
- 📱 **响应式设计** - 完美适配各种设备

## 🛠️ 技术栈

- **前端**: Next.js 16, React 19, TypeScript
- **3D 可视化**: Three.js, React Three Fiber
- **数据库**: SQLite (开发) / Supabase (生产)
- **认证**: JWT + bcrypt
- **部署**: Vercel

## 🚀 快速开始

### 方式 1：本地开发（SQLite）

```bash
# 安装依赖
npm install

# 初始化数据库
npm run setup:db

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 方式 2：Supabase 部署（推荐）

1. **在 Supabase 中创建数据库**：
   - 打开 `supabase/schema.sql`
   - 在 Supabase SQL Editor 中执行

2. **迁移数据**（可选）：
   ```bash
   npm run migrate:supabase
   ```

3. **本地测试**：
   ```bash
   npm run dev
   ```

4. **部署到 Vercel**：
   - 推送代码到 GitHub
   - 在 Vercel 中导入项目
   - 配置环境变量（参考 `.env.example`）
   - 点击部署

详细步骤请查看：[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 📁 项目结构

```
hackuni-web/
├── src/
│   ├── app/                 # Next.js 应用目录
│   │   ├── admin/          # 管理后台
│   │   ├── api/            # API 路由
│   │   ├── goat-hunt/      # 黑客松地图
│   │   └── (auth)/         # 认证相关页面
│   ├── components/         # React 组件
│   │   └── ui/            # UI 组件
│   ├── contexts/          # React Context
│   ├── lib/               # 工具库
│   │   ├── dao/          # 数据访问层
│   │   ├── db/           # 数据库配置
│   │   └── models/       # 数据模型
│   └── styles/           # 样式文件
├── supabase/             # Supabase 配置
├── scripts/              # 工具脚本
├── database/             # SQLite 数据库（本地）
└── public/              # 静态资源
```

## 🔧 环境变量

创建 `.env.local` 文件（参考 `.env.example`）：

```env
# 使用 Supabase（生产环境推荐）
USE_SUPABASE=true

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 或使用 SQLite（本地开发）
USE_SUPABASE=false
DATABASE_PATH=./database/hackuni.db

# 应用配置
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 📚 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 构建生产版本
npm run start           # 启动生产服务器

# 数据库
npm run setup:db        # 初始化 SQLite 数据库
npm run reset:db        # 重置 SQLite 数据库

# Supabase
npm run migrate:supabase # 迁移数据到 Supabase
npm run supabase:init   # 初始化 Supabase 数据库
```

## 🧪 测试账号

开发环境自动创建的测试账号：

- **Email**: alice@example.com
- **Password**: password123

## 📖 文档

- [Supabase 迁移指南](./SUPABASE_MIGRATION_GUIDE.md) - 详细的迁移步骤
- [部署检查清单](./DEPLOYMENT_CHECKLIST.md) - 快速部署指南
- [数据库文档](./DATABASE_README.md) - 数据库结构说明
- [功能完成报告](./ADMIN_FEATURES_COMPLETE.md) - 已实现功能列表

## 🎯 核心功能

### 用户功能
- ✅ 用户注册和登录
- ✅ 个人资料管理
- ✅ 项目发布和编辑
- ✅ 点赞和评论
- ✅ 徽章系统

### 管理功能
- ✅ 管理员认证
- ✅ 项目审核
- ✅ 用户管理
- ✅ 操作日志

### 数据功能
- ✅ 黑客松列表和搜索
- ✅ 项目展示
- ✅ 3D 地球可视化
- ✅ 实时互动

## 🔐 安全性

- 密码使用 bcrypt 加密
- JWT Token 认证
- SQL 注入防护（prepared statements）
- XSS 防护（React 自动转义）
- CSRF 保护（建议生产环境添加）

## 🌍 国际化

项目支持中英双语切换：

- ✅ UI 文本翻译
- ✅ 日期本地化
- ✅ 动态语言切换

## 📊 数据库

### 本地开发（SQLite）
- 文件位置：`./database/hackuni.db`
- 支持 WAL 模式
- 事务支持

### 生产环境（Supabase）
- PostgreSQL 数据库
- 行级安全（RLS）
- 自动备份

## 🚀 部署

### 推荐方案

**Vercel + Supabase**（零成本，完全托管）

1. Vercel 托管 Next.js 前端
2. Supabase 提供数据库和认证
3. 全球 CDN 加速
4. 自动 HTTPS

### 其他方案

- **Railway** - 一体化部署
- **Vercel + Neon** - 更便宜的 PostgreSQL
- **自托管** - 使用 Docker

## 💡 开发建议

1. **本地开发时使用 SQLite**，生产环境使用 Supabase
2. **定期备份数据库**
3. **监控 API 调用次数**（Supabase 有配额限制）
4. **使用环境变量管理敏感信息**
5. **定期更新依赖**

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

## 🔗 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)

---

**当前版本**: v2.0
**最后更新**: 2025-01-10
