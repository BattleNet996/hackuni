'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const sections = {
  zh: {
    title: '隐私协议',
    subtitle: '我们尽量只收集运行平台所必需的数据。',
    blocks: [
      {
        title: '1. 我们收集什么',
        body: '我们会收集你注册、登录、发布项目、提交黑客松记录、申请徽章和使用互动功能时主动提供的数据，例如邮箱、显示名、个人资料、项目内容和评论内容。',
      },
      {
        title: '2. 我们如何使用',
        body: '这些数据主要用于账户登录、内容展示、审核流程、统计分析、社区互动以及必要的安全防护。我们不会为了与你无关的目的任意扩展使用范围。',
      },
      {
        title: '3. 可见性与公开信息',
        body: '你发布到公开页面的项目、故事、部分个人资料和经审核通过的记录会对其他用户可见。涉及敏感字段时，平台会尽量采用最小展示原则。',
      },
      {
        title: '4. 邮件与验证码',
        body: '注册验证邮件仅用于完成账户验证和安全确认。我们不会向未授权的第三方出售你的邮箱地址。',
      },
      {
        title: '5. 数据存储与安全',
        body: '我们会采取合理的技术和管理措施保护账户、会话和平台数据，但任何联网服务都不能承诺绝对零风险。',
      },
      {
        title: '6. 你的权利',
        body: '若你希望更正公开资料、删除部分内容、注销账户或了解平台存储的数据范围，可以通过官方渠道联系 AttraX 团队。',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    subtitle: 'We try to collect only the data required to operate the platform.',
    blocks: [
      {
        title: '1. What We Collect',
        body: 'We collect data you actively provide when registering, logging in, publishing projects, submitting hackathon records, applying for badges, or using interactive features such as comments and likes.',
      },
      {
        title: '2. How We Use It',
        body: 'We use this data for account access, content display, review workflows, analytics, community features, and basic platform security. We do not arbitrarily expand its use beyond those purposes.',
      },
      {
        title: '3. Visibility and Public Content',
        body: 'Projects, stories, parts of profile information, and approved records published on public pages may be visible to other users. When sensitive fields are involved, the platform aims to minimize exposure.',
      },
      {
        title: '4. Email and Verification',
        body: 'Verification emails are used only for account verification and security confirmation. We do not sell your email address to unrelated third parties.',
      },
      {
        title: '5. Storage and Security',
        body: 'We use reasonable technical and operational measures to protect account, session, and platform data, but no networked service can guarantee zero risk.',
      },
      {
        title: '6. Your Rights',
        body: 'If you want to correct profile information, remove certain content, close your account, or understand what platform data is stored, please contact the AttraX team through official channels.',
      },
    ],
  },
} as const;

export default function PrivacyPage() {
  const { language } = useLanguage();
  const content = language === 'zh' ? sections.zh : sections.en;

  return (
    <main style={{ maxWidth: '920px', margin: '0 auto', padding: 'var(--sp-8) var(--sp-4)' }}>
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)' }}>{content.title}</h1>
        <p style={{ marginTop: 'var(--sp-2)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{content.subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {content.blocks.map((block) => (
          <section key={block.title} style={{ border: '1px solid var(--border-base)', padding: 'var(--sp-5)', background: 'var(--bg-card)' }}>
            <h2 style={{ margin: '0 0 var(--sp-3) 0', fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)' }}>{block.title}</h2>
            <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--text-muted)' }}>{block.body}</p>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 'var(--sp-6)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
        <Link href="/terms" style={{ color: 'var(--brand-coral)', textDecoration: 'none' }}>
          {language === 'zh' ? '查看用户协议' : 'View Terms of Service'}
        </Link>
      </div>
    </main>
  );
}
