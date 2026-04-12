#!/bin/bash
set -e

echo "🚀 部署到 Vercel..."

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  有未提交的更改，请先提交"
  git status
  exit 1
fi

# 推送到 GitHub（触发自动部署）
echo "📤 推送到 GitHub..."
git push origin main

echo "✅ 推送完成！"
echo ""
echo "🌐 Vercel 会自动检测并部署"
echo "📊 查看部署状态："
echo "   https://vercel.com/dashboard"
echo ""
echo "⏱️  预计 2-3 分钟后部署完成"
