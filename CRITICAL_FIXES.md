# 🔧 关键问题修复总结

## ✅ 已修复的问题

### 1. 新账号无法点赞/评论 ❌ → ✅

**根本原因**：Cookie名称不匹配

**问题详情**：
- 登录API设置的是 `auth_token` cookie
- 但以下API检查的是 `token` cookie：
  - `/api/likes/route.ts`
  - `/api/likes/unlike/route.ts`
  - `/api/comments/route.ts`
  - `/api/comments/[id]/route.ts`

**修复**：
统一所有API使用 `auth_token` cookie名称

**修复的文件**：
- ✅ `src/app/api/likes/route.ts` - 第8行
- ✅ `src/app/api/likes/unlike/route.ts` - 第8行
- ✅ `src/app/api/comments/route.ts` - 第46行
- ✅ `src/app/api/comments/[id]/route.ts` - 第12行

**测试**：
```bash
# 1. 注册新账号
# 2. 登录
# 3. 尝试点赞项目 - 应该能正常工作
# 4. 尝试评论 - 应该能正常工作
```

### 2. 移除默认Mock数据 ❌ → ✅

**问题描述**：
数据库初始化脚本会自动填充mock数据（hackathons、projects、stories等），用户不想要这些默认数据。

**解决方案**：
修改 `scripts/setup-db.ts`，使mock数据填充变为可选功能，只有明确指定 `--seed` 标志时才填充。

**修改后的行为**：
```bash
# 默认行为：只创建数据库schema，不填充数据
npm run setup-db

# 如果需要开发测试数据，明确指定 --seed
npm run setup-db -- --seed

# 重置数据库并填充数据
npm run setup-db -- --reset --seed
```

**修复的文件**：
- ✅ `scripts/setup-db.ts` - 添加 `--seed` 可选标志

## 📋 完整的Cookie名称统一

### 用户认证 APIs (`auth_token`)
- ✅ `/api/auth/login/route.ts`
- ✅ `/api/auth/register/route.ts`
- ✅ `/api/auth/logout/route.ts`
- ✅ `/api/projects/route.ts` - POST (创建项目)
- ✅ `/api/projects/[id]/route.ts` - PATCH/DELETE (更新/删除项目)
- ✅ `/api/likes/route.ts` - POST (点赞)
- ✅ `/api/likes/unlike/route.ts` - DELETE (取消点赞)
- ✅ `/api/comments/route.ts` - POST (创建评论)
- ✅ `/api/comments/[id]/route.ts` - DELETE (删除评论)

### 管理员认证 APIs (`admin_token`)
- ✅ `/api/admin/auth/*` - 所有管理员认证相关
- ✅ `/api/admin/hackathons/*`
- ✅ `/api/admin/stories/*`
- ✅ `/api/admin/projects/*`
- ✅ `/api/admin/users/*`
- ✅ `/api/admin/badges/*`
- ✅ `/api/admin/admins/*`
- ✅ `/api/admin/logs/*`
- ✅ `/api/admin/stats/*`

## 🧪 测试清单

### 点赞功能测试
- [ ] 注册新账号
- [ ] 登录
- [ ] 进入GOAT榜单页面
- [ ] 点击项目点赞按钮
- [ ] 确认点赞数增加
- [ ] 刷新页面，确认点赞状态保持
- [ ] 再次点击，取消点赞
- [ ] 确认点赞数减少

### 评论功能测试
- [ ] 进入项目详情页
- [ ] 输入评论内容
- [ ] 提交评论
- [ ] 确认评论显示
- [ ] 删除自己的评论
- [ ] 确认评论已删除

### 数据库初始化测试
- [ ] 运行 `npm run setup-db`
- [ ] 确认只创建了空表，没有mock数据
- [ ] 检查表结构正确
- [ ] 运行 `npm run setup-db -- --seed`
- [ ] 确认填充了开发测试数据
- [ ] 运行 `npm run setup-db -- --reset`
- [ ] 确认数据库被清空并重建

## 🔄 如何应用修复

### 如果数据库已有数据

**选项1：清空并重建（推荐用于开发环境）**
```bash
# 重置数据库（会删除所有数据）
npm run setup-db -- --reset
```

**选项2：手动清理**
```sql
-- 删除mock数据
DELETE FROM hackathons WHERE id LIKE 'mock_%';
DELETE FROM projects WHERE id LIKE 'mock_%';
DELETE FROM stories WHERE id LIKE 'mock_%';
DELETE FROM user_badges WHERE user_id = 'mock_user_001';
DELETE FROM users WHERE id = 'mock_user_001';
-- badges可以保留，它们是静态数据
```

**选项3：直接使用（生产环境）**
- 如果已经运行过旧版本的setup-db，数据已经存在
- 新注册的用户不会受影响
- 只需要确保Cookie名称统一（已修复）

### 确认修复生效

1. **检查Cookie名称**：
   - 打开浏览器开发者工具
   - 进入 Application > Cookies
   - 登录后，应该看到名为 `auth_token` 的cookie

2. **测试点赞**：
   - 登录后点击点赞按钮
   - 打开浏览器控制台（F12）
   - 应该看到成功的API调用，没有401错误

3. **检查数据库**：
   ```bash
   # 查看项目数量
   sqlite3 database/hackuni.db "SELECT COUNT(*) FROM projects;"

   # 如果是0，说明没有填充mock数据 ✅
   # 如果大于0，可以手动清理或使用 --reset
   ```

## 📝 技术细节

### Cookie配置
```typescript
// 设置cookie (登录/注册API)
response.cookies.set('auth_token', token, {
  httpOnly: true,              // 防止XSS攻击
  secure: process.env.NODE_ENV === 'production',  // 生产环境使用HTTPS
  sameSite: 'lax',             // 防止CSRF攻击
  maxAge: 30 * 24 * 60 * 60,   // 30天有效期
  path: '/'                    // 全站有效
});
```

### API认证检查
```typescript
// 读取cookie (需要认证的API)
const token = request.cookies.get('auth_token')?.value ||
             request.headers.get('authorization')?.replace('Bearer ', '');

if (!token) {
  return NextResponse.json(
    { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
    { status: 401 }
  );
}
```

## 🎯 影响范围

### 用户影响
- ✅ 新注册用户可以正常点赞和评论
- ✅ 不影响已登录用户的功能
- ✅ Cookie统一后，所有认证功能正常工作

### 数据影响
- ✅ 新安装的项目默认不包含mock数据
- ✅ 已有数据库不受影响（除非运行 --reset）
- ✅ 开发者可以选择是否填充测试数据

## ⚠️ 注意事项

1. **Cookie清理**：
   - 如果用户在修复前已登录，可能仍有旧的 `token` cookie
   - 建议用户重新登录以获取正确的 `auth_token` cookie
   - 或者在前端清除旧的cookie

2. **数据库迁移**：
   - 不需要数据库schema迁移
   - 只需要确保使用最新的API代码

3. **开发 vs 生产**：
   - 开发环境：可以使用 `--seed` 填充测试数据
   - 生产环境：不使用 `--seed`，从空数据库开始

## 🚀 下一步

1. **测试认证流程**：
   ```bash
   # 清除旧数据（开发环境）
   npm run setup-db -- --reset

   # 启动应用
   npm run dev

   # 在浏览器中：
   # 1. 注册新账号
   # 2. 登录
   # 3. 测试点赞和评论功能
   ```

2. **监控错误日志**：
   - 查看浏览器控制台是否有401错误
   - 查看服务器日志确认认证正常工作

3. **性能优化**（可选）：
   - 考虑实现cookie刷新机制
   - 添加会话超时提醒
   - 实现"记住我"功能

---

**修复状态**：✅ 完成
**最后更新**：2025-04-09
**需要重启**：是（服务器需要重启以加载新代码）
**需要数据库迁移**：否
