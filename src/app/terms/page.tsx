'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const sections = {
  zh: {
    title: '用户协议',
    subtitle: '使用 AttraX 平台前，请先阅读以下条款。',
    blocks: [
      {
        title: '1. 平台定位',
        body: 'AttraX 是一个面向黑客松、项目展示、资讯分享和社区连接的数字平台。你在平台上发布、上传或提交的内容，应当是你有权使用和展示的内容。',
      },
      {
        title: '2. 账户责任',
        body: '你需要对自己的账号、登录凭证和账号下发生的行为负责。不得冒充他人、恶意注册、攻击平台或绕过权限控制。',
      },
      {
        title: '3. 用户内容',
        body: '你保留对自己上传内容的权利，但同意平台在展示、审核、索引、推荐和社区传播场景中合理使用这些内容。你提交的内容不得违法、侵权、骚扰他人或泄露他人隐私。',
      },
      {
        title: '4. 审核与处理',
        body: '平台可对项目、资讯、黑客松记录、徽章申请等内容进行审核，并可根据规则对内容进行隐藏、驳回、下架或删除。',
      },
      {
        title: '5. 服务调整',
        body: '平台可能会迭代、暂停或终止部分功能。我们会尽量保持核心服务稳定，但不承诺所有功能永久不变。',
      },
      {
        title: '6. 联系我们',
        body: '若你认为平台内容侵权、存在错误处理，或需要账户与数据协助，可通过官方渠道联系 AttraX 团队。',
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    subtitle: 'Please review these terms before using AttraX.',
    blocks: [
      {
        title: '1. Platform Scope',
        body: 'AttraX is a platform for hackathons, project publishing, stories, and community connections. You may only submit or display content you are authorized to use.',
      },
      {
        title: '2. Account Responsibility',
        body: 'You are responsible for your account, credentials, and actions taken under your account. Do not impersonate others, abuse registration, attack the platform, or bypass access controls.',
      },
      {
        title: '3. User Content',
        body: 'You keep ownership of your content, but you allow the platform to display, review, index, recommend, and reasonably distribute it within product and community contexts. Content must not be unlawful, infringing, abusive, or privacy-violating.',
      },
      {
        title: '4. Review and Moderation',
        body: 'The platform may review projects, stories, hackathon records, and badge submissions, and may hide, reject, unpublish, or remove content when necessary.',
      },
      {
        title: '5. Service Changes',
        body: 'The platform may evolve, pause, or discontinue certain features over time. We aim to keep core services stable, but do not guarantee every feature will remain unchanged forever.',
      },
      {
        title: '6. Contact',
        body: 'If you believe content is infringing, moderation was incorrect, or you need account or data assistance, please contact the AttraX team through official channels.',
      },
    ],
  },
} as const;

export default function TermsPage() {
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
        <Link href="/privacy" style={{ color: 'var(--brand-coral)', textDecoration: 'none' }}>
          {language === 'zh' ? '查看隐私协议' : 'View Privacy Policy'}
        </Link>
      </div>
    </main>
  );
}
