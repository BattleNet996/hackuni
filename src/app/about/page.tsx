'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'var(--sp-8) var(--sp-4)',
  maxWidth: '1040px',
  margin: '0 auto',
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: 'clamp(2.75rem, 7vw, 5rem)',
  fontFamily: 'var(--font-hero)',
  textTransform: 'uppercase',
  letterSpacing: '-0.03em',
  lineHeight: 0.95,
  margin: '0 0 var(--sp-3) 0',
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'clamp(1.6rem, 3vw, 2.3rem)',
  fontFamily: 'var(--font-hero)',
  lineHeight: 1.05,
};

const proseStyle: React.CSSProperties = {
  color: 'var(--text-muted)',
  lineHeight: 1.9,
  fontSize: '16px',
  margin: 0,
};

const zhContent = {
  eyebrow: '🌍 我们是谁',
  title: 'AttraX｜全球 Outlier 社区',
  lead: 'AttraX 是由清华和北大学生发起的交叉学科组织。集结跨学科领域中不愿被主流归类的创新者：Outlier，以“快乐、叛逆、自由”为精神底色，探索边界之外的可能。',
  intro: [
    'AttraX 是由清华和北大学生发起的交叉学科组织，一群拒绝被数据点定义的人。艺术家和工程师、诗人和黑客、哲学家和游戏设计师，在世界的各个角落，用不同的语言，做着同一件事：把那些「没用但很酷」的念头，变成可以触摸的作品。',
    '我们分散在清华的实验室、柏林的地下室、东京的共享厨房、旧金山的车库里。我们通过一个又一个「意外」彼此识别。',
  ],
  storyTitle: '一个典型的 Outlier 故事',
  story: [
    'OpenClaw 的创造者叫彼得·斯坦伯格（Peter Steinberger），一位来自奥地利的资深工程师。在此之前，他花了 13 年创办 PDF 处理公司 PSPDFKit，做到全球领先，并在 2021 年成功退出。',
    '之后他经历了严重的职业倦怠。旅行、治疗、寻找自我，直到 2024 年 AI 浪潮重新点燃了他的热情。他开始疯狂地 tinkering，一年做了 43 个项目。',
    '2025 年 11 月的一个周末，他用大约一小时，把 WhatsApp、Claude Code 和一些工具“粘”在一起，做出了一个能真正帮你处理事情的 AI 个人助手原型。这就是后来的 OpenClaw。',
    '当 Meta 和 OpenAI 的 CEO 亲自下场争夺他时，他选择加入 OpenAI。不是因为钱，而是因为“我想改变世界，而不是建立一家大公司”。他说，他的下一个目标，是做一个连他妈妈都能用的智能体。',
    '这是一个典型的 Outlier 故事：不循规蹈矩，不被定义，在追求效率的系统中，坚持做自己认为重要的事。',
  ],
  principlesTitle: '⚔️ 我们的核心理念',
  principles: [
    '我们不相信被定义的价值，是唯一标准。',
    '我们在乎的，是你带来了什么。',
    '在追求效率的系统里，那些非必需的、情绪化的、艺术的、不完美的东西，常常被视为 System Noise。可正是这些噪音，定义了人的不可替代。',
    '我们是那群不被规则定义的 Outlier。',
  ],
  missionTitle: '团队介绍',
  missionCards: [
    {
      title: '🎯 我们在做的事',
      body: 'AttraX 希望打造一个全球性的 Outlier 社区，通过黑客松和数字基建，让每一个「不被规则定义」的年轻人，都能在这里被看见、被连接、被背书。',
    },
    {
      title: '🛠 我们怎么实现',
      body: '让黑客松成为 Outlier 的勋章系统。用线下黑客松聚集 Outlier，用数字基建记录每一个人的创造轨迹，让“你做出来了什么”比“你来自哪里”更有说服力。',
    },
  ],
  ctaTitle: '加入 Outlier 社区',
  ctaBody: '如果你也在做那些暂时无法被主流定义、但你知道值得被做出来的东西，这里就是你的地方。',
  ctaPrimary: '浏览黑客松',
  ctaSecondary: '发布项目',
};

const enContent = {
  eyebrow: '🌍 WHO WE ARE',
  title: 'AttraX | A Global Outlier Community',
  lead: 'AttraX is an interdisciplinary community started by students from Tsinghua and Peking University. We gather people who refuse mainstream labels and build from a spirit of joy, rebellion, and freedom.',
  intro: [
    'AttraX is for people who refuse to be reduced to data points. Artists and engineers, poets and hackers, philosophers and game designers, working in different places but pursuing the same instinct: turning weird, unnecessary, compelling ideas into tangible work.',
    'We are scattered across labs in Beijing, basements in Berlin, shared kitchens in Tokyo, and garages in San Francisco. We recognize one another through accidents, experiments, and side projects.',
  ],
  storyTitle: 'A Typical Outlier Story',
  story: [
    'Peter Steinberger, creator of OpenClaw, spent 13 years building PSPDFKit into a global leader before exiting in 2021. After burnout, travel, therapy, and a long search for meaning, the 2024 AI wave pulled him back into building.',
    'He went into full tinkering mode and built 43 projects in a year. In a weekend around November 2025, he stitched together WhatsApp, Claude Code, and a few tools to prototype an AI personal assistant that could actually get things done. That became OpenClaw.',
    'When major AI leaders tried to recruit him, he chose OpenAI not because of money, but because he wanted to change the world rather than build another large company. His goal was simple: make an agent his mother could use.',
    'That is an Outlier story. Refusing neat categories, resisting default incentives, and choosing to build what feels important.',
  ],
  principlesTitle: '⚔️ Core Beliefs',
  principles: [
    'We do not believe standardized definitions are the only measure of value.',
    'What matters is what you bring into the world.',
    'In systems obsessed with efficiency, emotional, artistic, imperfect, and non-essential things are treated as noise. But that noise is what makes people irreplaceable.',
    'We stand with the Outliers who refuse to be fully defined by rules.',
  ],
  missionTitle: 'What We Are Building',
  missionCards: [
    {
      title: '🎯 What We Do',
      body: 'AttraX is building a global Outlier community through hackathons and digital infrastructure so young people who do not fit neat templates can be seen, connected, and backed.',
    },
    {
      title: '🛠 How We Do It',
      body: 'We want hackathons to function as an Outlier badge system. Offline events gather the people; digital infrastructure records the work, so what you build matters more than where you come from.',
    },
  ],
  ctaTitle: 'Join The Outlier Community',
  ctaBody: 'If you are making things that do not yet fit the mainstream template, but still need to exist, this is for you.',
  ctaPrimary: 'Browse Hackathons',
  ctaSecondary: 'Publish Project',
};

export default function AboutPage() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const content = isZh ? zhContent : enContent;

  return (
    <main style={containerStyle}>
      <section
        style={{
          display: 'grid',
          gap: 'var(--sp-6)',
          marginBottom: 'var(--sp-8)',
          padding: 'var(--sp-6)',
          border: '1px solid var(--border-base)',
          background:
            'linear-gradient(135deg, rgba(245, 107, 82, 0.12), rgba(0, 255, 65, 0.04) 58%, rgba(255,255,255,0.02))',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--brand-coral)' }}>
          {content.eyebrow}
        </div>
        <div>
          <h1 style={heroTitleStyle}>{content.title}</h1>
          <p style={{ ...proseStyle, maxWidth: '760px', fontSize: '18px', color: 'var(--text-main)' }}>
            {content.lead}
          </p>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--sp-5)', marginBottom: 'var(--sp-8)' }}>
        {content.intro.map((paragraph) => (
          <p key={paragraph} style={proseStyle}>
            {paragraph}
          </p>
        ))}
      </section>

      <section
        style={{
          marginBottom: 'var(--sp-8)',
          padding: 'var(--sp-6)',
          border: '1px solid var(--border-base)',
          background: 'var(--bg-card)',
        }}
      >
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <h2 style={sectionTitleStyle}>{content.storyTitle}</h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
          {content.story.map((paragraph) => (
            <p key={paragraph} style={proseStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 'var(--sp-8)' }}>
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <h2 style={sectionTitleStyle}>{content.principlesTitle}</h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
          {content.principles.map((paragraph) => (
            <div
              key={paragraph}
              style={{
                padding: 'var(--sp-4) var(--sp-5)',
                borderLeft: '3px solid var(--brand-coral)',
                background: 'rgba(245, 107, 82, 0.05)',
              }}
            >
              <p style={proseStyle}>{paragraph}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 'var(--sp-8)' }}>
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <h2 style={sectionTitleStyle}>{content.missionTitle}</h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--sp-4)',
          }}
        >
          {content.missionCards.map((card) => (
            <div
              key={card.title}
              style={{
                padding: 'var(--sp-5)',
                border: '1px solid var(--border-base)',
                background: 'var(--bg-card)',
              }}
            >
              <h3 style={{ margin: '0 0 var(--sp-3) 0', fontFamily: 'var(--font-hero)', fontSize: '28px' }}>
                {card.title}
              </h3>
              <p style={proseStyle}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: 'var(--sp-6)',
          border: '1px solid rgba(245, 107, 82, 0.2)',
          background: 'linear-gradient(135deg, rgba(245, 107, 82, 0.1), rgba(255,255,255,0.02))',
        }}
      >
        <h2 style={{ ...sectionTitleStyle, marginBottom: 'var(--sp-3)' }}>{content.ctaTitle}</h2>
        <p style={{ ...proseStyle, marginBottom: 'var(--sp-5)' }}>{content.ctaBody}</p>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <Link
            href="/hackathons"
            style={{
              padding: '12px 20px',
              background: 'var(--brand-coral)',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            {content.ctaPrimary}
          </Link>
          <Link
            href="/publish"
            style={{
              padding: '12px 20px',
              border: '1px solid var(--border-base)',
              color: 'var(--text-main)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              background: 'transparent',
            }}
          >
            {content.ctaSecondary}
          </Link>
        </div>
      </section>

      <footer
        style={{
          marginTop: 'var(--sp-8)',
          paddingTop: 'var(--sp-5)',
          borderTop: '1px solid var(--border-base)',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
        }}
      >
        © 2024-{new Date().getFullYear()} AttraX. {isZh ? '保留所有权利。' : 'All rights reserved.'}
      </footer>
    </main>
  );
}
