'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

const container = {
  minHeight: '100vh',
  padding: '2rem',
  maxWidth: '900px',
  margin: '0 auto',
};

const titleStyle = {
  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
  fontWeight: 'bold',
  marginBottom: '1rem',
  fontFamily: 'var(--font-hero)',
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
};

const subtitleStyle = {
  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
  color: 'var(--brand-coral)',
  marginBottom: '3rem',
  fontFamily: 'var(--font-mono)',
};

const sectionTitle = {
  fontSize: '1.8rem',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  fontFamily: 'var(--font-hero)',
  color: 'var(--text-main)',
};

export default function AboutPage() {
  const { language, t } = useLanguage();

  const isZh = language === 'zh';

  return (
    <div style={container}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={titleStyle}>
          {isZh ? '> AttraX' : '> AttraX'}
        </h1>
        <p style={subtitleStyle}>
          {isZh
            ? 'We Engineer the UNNECESSARY'
            : 'We Engineer the UNNECESSARY'}
        </p>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          {isZh
            ? '一个为「离群值」打造的档案库。记录那些不被主流归类的创新者、黑客松项目、和「不必要但令人惊叹」的工程作品。'
            : 'An archive for outliers. Documenting hackers, hackathon projects, and "unnecessary yet amazing" engineering works that refuse to be categorized.'}
        </p>
      </div>

      {/* What is AttraX */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={sectionTitle}>
          {isZh ? '什么是 AttraX？' : 'What is AttraX?'}
        </h2>
        <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1rem' }}>
            {isZh
              ? 'AttraX 是一个「猎奇档案库」+「人才索引」平台，专为那些在黑客松中创造「不必要但令人惊叹」工程作品的 Outlier（离群值）打造。'
              : 'AttraX is a "Curiosity Archive" + "Talent Index" platform built for Outliers who create "unnecessary yet amazing" engineering works at hackathons.'}
          </p>
          <p>
            {isZh
              ? '我们记录黑客松项目、开源作品、创新成就，并通过徽章系统和社区网络连接那些不愿意被主流归类的创新者。'
              : 'We document hackathon projects, open source works, and innovation achievements, connecting outliers who refuse to be categorized through our badge system and community network.'}
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={sectionTitle}>
          {isZh ? '核心功能' : 'Core Features'}
        </h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Feature 1 */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(245, 107, 82, 0.05)',
            borderLeft: '3px solid var(--brand-coral)',
            borderRadius: '4px'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--brand-coral)' }}>
              {isZh ? '📦 猎奇档案（Curiosity Archive）' : '📦 Curiosity Archive'}
            </h3>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              {isZh
                ? '记录和展示黑客松项目、开源作品、创新实验'
                : 'Document and showcase hackathon projects, open source works, and innovation experiments'}
            </p>
            <ul style={{ fontSize: '0.95rem', opacity: 0.8, paddingLeft: '1.5rem' }}>
              <li>{isZh ? '项目作品集展示' : 'Project portfolio showcase'}</li>
              <li>{isZh ? '技术栈记录' : 'Tech stack documentation'}</li>
              <li>{isZh ? '源码链接管理' : 'Source code links'}</li>
              <li>{isZh ? '演示视频/截图' : 'Demo videos & screenshots'}</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(0, 255, 101, 0.05)',
            borderLeft: '3px solid var(--brand-green)',
            borderRadius: '4px'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--brand-green)' }}>
              {isZh ? '🎯 人才索引（Talent Index）' : '🎯 Talent Index'}
            </h3>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              {isZh
                ? '发现和连接那些「不务正业」但才华横溢的创新者'
                : 'Discover and connect with talented outliers who think outside the box'}
            </p>
            <ul style={{ fontSize: '0.95rem', opacity: 0.8, paddingLeft: '1.5rem' }}>
              <li>{isZh ? '构建者档案' : 'Builder profiles'}</li>
              <li>{isZh ? '技能标签系统' : 'Skill tags system'}</li>
              <li>{isZh ? '黑客松足迹地图' : 'Hackathon footprint map'}</li>
              <li>{isZh ? '成就与奖项展示' : 'Achievements & awards display'}</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(102, 126, 234, 0.05)',
            borderLeft: '3px solid #667eea',
            borderRadius: '4px'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#667eea' }}>
              {isZh ? '🏆 成就系统（Achievement System）' : '🏆 Achievement System'}
            </h3>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              {isZh
                ? '通过徽章和奖项记录创新者的成长轨迹'
                : 'Track innovators\' growth journey through badges and awards'}
            </p>
            <ul style={{ fontSize: '0.95rem', opacity: 0.8, paddingLeft: '1.5rem' }}>
              <li>{isZh ? '黑客松成就徽章' : 'Hackathon achievement badges'}</li>
              <li>{isZh ? '项目里程碑' : 'Project milestones'}</li>
              <li>{isZh ? '社区贡献记录' : 'Community contribution records'}</li>
              <li>{isZh ? '技能认证系统' : 'Skill certification system'}</li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(245, 107, 82, 0.05)',
            borderLeft: '3px solid var(--brand-coral)',
            borderRadius: '4px'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--brand-coral)' }}>
              {isZh ? '🌐 社区网络（Community Network）' : '🌐 Community Network'}
            </h3>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              {isZh
                ? '连接志同道合的 Outlier，组建团队，分享知识'
                : 'Connect like-minded outliers, form teams, share knowledge'}
            </p>
            <ul style={{ fontSize: '0.95rem', opacity: 0.8, paddingLeft: '1.5rem' }}>
              <li>{isZh ? '团队组建' : 'Team formation'}</li>
              <li>{isZh ? '项目协作' : 'Project collaboration'}</li>
              <li>{isZh ? '知识分享与复盘' : 'Knowledge sharing & recaps'}</li>
              <li>{isZh ? '黑客松信息聚合' : 'Hackathon information aggregation'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why AttraX */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={sectionTitle}>
          {isZh ? '为什么存在？' : 'Why AttraX?'}
        </h2>
        <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1rem' }}>
            {isZh
              ? '在这个世界上，有一些创新者不愿意被主流归类。他们可能是学生、研究员、工程师，但更喜欢在黑客松中用 48-72 小时创造一些「不必要但令人惊叹」的东西。'
              : 'In this world, there are innovators who refuse to be categorized. They might be students, researchers, or engineers, but prefer to spend 48-72 hours at hackathons creating things that are "unnecessary yet amazing".'}
          </p>
          <p style={{ marginBottom: '1rem' }}>
            {isZh
              ? '这些项目往往被遗忘在 GitHub 的角落，黑客松结束后就没有人再提起。但它们代表了最纯粹的创造力和探索精神。'
              : 'These projects are often forgotten in corners of GitHub, never mentioned again after hackathons end. But they represent the purest creativity and spirit of exploration.'}
          </p>
          <p>
            {isZh
              ? 'AttraX 的使命就是记录这些「离群值」的作品，连接这些创新者，让「不必要」的想法得以延续和传播。'
              : 'AttraX\'s mission is to document these "outlier" works, connect these innovators, and let "unnecessary" ideas continue and spread.'}
          </p>
        </div>
      </section>

      {/* Current Status */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={sectionTitle}>
          {isZh ? '现在状态' : 'Current Status'}
        </h2>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-base)',
          padding: '2rem',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--brand-coral)', marginBottom: '0.5rem' }}>
                8+
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {isZh ? '黑客松活动记录' : 'Hackathons Recorded'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--brand-green)', marginBottom: '0.5rem' }}>
                25+
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {isZh ? '创新项目档案' : 'Innovative Projects'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
                10+
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {isZh ? '徽章与成就' : 'Badges & Achievements'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--brand-coral)', marginBottom: '0.5rem' }}>
                3000+
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {isZh ? '构建者连接' : 'Builders Connected'}
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {isZh
              ? '* 数据持续增长中 | 欢迎提交你的项目和成就'
              : '* Data growing daily | Submit your projects and achievements'}
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        padding: '3rem',
        background: 'linear-gradient(135deg, rgba(245, 107, 82, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid rgba(245, 107, 82, 0.2)'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: 'var(--text-main)'
        }}>
          {isZh ? '加入 Outlier 社区' : 'Join the Outlier Community'}
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          {isZh
            ? '如果你也是一个「离群值」，如果你也在创造那些「不必要但令人惊叹」的作品，欢迎加入 AttraX！'
            : 'If you\'re also an "outlier" creating "unnecessary yet amazing" works, welcome to AttraX!'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/hackathons">
            <button style={{
              padding: '0.75rem 2rem',
              background: 'var(--brand-coral)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = '#d64545'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'var(--brand-coral)'}
            >
              {isZh ? '浏览黑客松' : 'Browse Hackathons'}
            </button>
          </Link>
          <Link href="/goat-hunt">
            <button style={{
              padding: '0.75rem 2rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = '#5a67d8'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = '#667eea'}
            >
              {isZh ? '探索项目' : 'Explore Projects'}
            </button>
          </Link>
          <Link href="/register">
            <button style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              color: 'var(--brand-coral)',
              border: '2px solid var(--brand-coral)',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(245, 107, 82, 0.1)'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'transparent'}
            >
              {isZh ? '立即加入' : 'Join Now'}
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-base)',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'var(--text-muted)'
      }}>
        <p>
          © 2024-{new Date().getFullYear()} AttraX. {isZh ? '保留所有权利' : 'All rights reserved.'}
        </p>
        <p style={{ marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          {isZh
            ? '> We Engineer the UNNECESSARY_'
            : '> We Engineer the UNNECESSARY_'}
        </p>
      </footer>
    </div>
  );
}
