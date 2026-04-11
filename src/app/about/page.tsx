'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const container = {
  minHeight: '100vh',
  padding: '2rem',
  maxWidth: '800px',
  margin: '0 auto',
};

const titleStyle = {
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  fontWeight: 'bold',
  marginBottom: '2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: '#667eea',
};

export default function AboutPage() {
  const { lang, t } = useLanguage();

  const isZh = lang === 'zh';

  return (
    <div style={container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <h1 style={titleStyle}>
          {isZh ? '关于 AttraX' : 'About AttraX'}
        </h1>

        {/* Introduction */}
        <section style={{ marginBottom: '3rem', lineHeight: '1.8' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            {isZh
              ? 'AttraX 是一个由极客和工程师组成的创新社区，专注于打造「不必要」但令人惊叹的工程作品。我们相信，最好的技术往往诞生于黑客松的激情时刻，那些看似「不必要」的想法，恰恰是推动技术边界的关键力量。'
              : 'AttraX is an innovative community of geeks and engineers dedicated to creating "unnecessary" yet amazing engineering works. We believe the best technology often emerges from the passionate moments of hackathons, where those seemingly "unnecessary" ideas are the key force pushing technological boundaries.'}
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            {isZh
              ? '我们的名字来源于 "Attracted"（被吸引）和 "X"（未知/无限），象征着对未知技术的无限好奇心和探索精神。每一位 AttraX 成员都是独特的技术 outlier，带着自己的技能和热情，共同构建一个让创意自由流动的生态系统。'
              : 'Our name comes from "Attracted" and "X" (unknown/infinity), symbolizing infinite curiosity and exploration spirit toward unknown technologies. Every AttraX member is a unique technical outlier, bringing their own skills and passion to co-build an ecosystem where creativity flows freely.'}
          </p>
        </section>

        {/* What We Do */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#e2e8f0'
          }}>
            {isZh ? '我们做什么' : 'What We Do'}
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(102, 126, 234, 0.1)',
              borderLeft: '3px solid #667eea',
              borderRadius: '4px'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isZh ? '🎯 参与黑客松' : '🎯 Hackathons'}
              </h3>
              <p style={{ fontSize: '1rem', opacity: 0.8 }}>
                {isZh
                  ? '定期参加全球各地的黑客松活动，从人工智能到区块链，从硬件到 Web3，我们在 48-72 小时内将想法转化为可运行的原型。'
                  : 'Regularly participate in hackathons worldwide, from AI to blockchain, from hardware to Web3, turning ideas into working prototypes in 48-72 hours.'}
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(118, 75, 162, 0.1)',
              borderLeft: '3px solid #764ba2',
              borderRadius: '4px'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isZh ? '🚀 开源项目' : '🚀 Open Source'}
              </h3>
              <p style={{ fontSize: '1rem', opacity: 0.8 }}>
                {isZh
                  ? '积极贡献开源社区，发布工具、框架和有趣的项目，分享知识，帮助他人成长。'
                  : 'Actively contribute to the open source community, publish tools, frameworks and interesting projects, share knowledge, and help others grow.'}
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(237, 100, 166, 0.1)',
              borderLeft: '3px solid #ed64a6',
              borderRadius: '4px'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isZh ? '💡 知识分享' : '💡 Knowledge Sharing'}
              </h3>
              <p style={{ fontSize: '1rem', opacity: 0.8 }}>
                {isZh
                  ? '通过博客、技术分享和代码复盘，记录我们的学习历程和工程经验，让知识产生更大的价值。'
                  : 'Through blogs, tech talks, and code reviews, we document our learning journey and engineering experience, making knowledge more valuable.'}
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(249, 115, 22, 0.1)',
              borderLeft: '3px solid #f97316',
              borderRadius: '4px'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isZh ? '🌐 构建社区' : '🌐 Build Community'}
              </h3>
              <p style={{ fontSize: '1rem', opacity: 0.8 }}>
                {isZh
                  ? '组织技术聚会、代码审查会和黑客松活动，连接志同道合的开发者，创造一个让每个人都能发光的平台。'
                  : 'Organize tech meetups, code reviews, and hackathons, connecting like-minded developers and creating a platform where everyone can shine.'}
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#e2e8f0'
          }}>
            {isZh ? '我们的价值观' : 'Our Values'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isZh ? '热情' : 'Passion'}
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {isZh
                  ? '对技术有真正的热爱，愿意投入时间探索未知的领域。'
                  : 'True passion for technology, willing to invest time exploring unknown fields.'}
              </p>
            </div>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(118, 75, 162, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(118, 75, 162, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isZh ? '创新' : 'Innovation'}
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {isZh
                  ? '敢于尝试不同的方法，不走寻常路，寻找更优的解决方案。'
                  : 'Dare to try different approaches, take unconventional paths, and seek better solutions.'}
              </p>
            </div>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(237, 100, 166, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(237, 100, 166, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isZh ? '协作' : 'Collaboration'}
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {isZh
                  ? '相信团队的力量，尊重每个人的贡献，共同创造更大的价值。'
                  : 'Believe in the power of teams, respect everyone's contribution, and create greater value together.'}
              </p>
            </div>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(249, 115, 22, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(249, 115, 22, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌟</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isZh ? '开放' : 'Openness'}
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {isZh
                  ? '保持开放的心态，接受新思想，欢迎不同的声音和观点。'
                  : 'Keep an open mind, embrace new ideas, and welcome different voices and perspectives.'}
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#e2e8f0'
          }}>
            {isZh ? '我们的故事' : 'Our Story'}
          </h2>
          <div style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              {isZh
                ? 'AttraX 始于 2024 年由一群志同道合的技术爱好者创立。最初，我们只是几个在黑客松活动中相遇的陌生人，因为对「不必要」的工程充满好奇而走到一起。在一次次通宵达旦的编码中，我们发现彼此之间有着相似的价值观和追求：不只是为了赢奖，更是为了创造、学习和连接。'
                : 'AttraX was founded in 2024 by a group of like-minded tech enthusiasts. Initially, we were just strangers who met at hackathon events, drawn together by curiosity about "unnecessary" engineering. Through countless all-night coding sessions, we discovered we shared similar values and pursuits: not just to win, but to create, learn, and connect.'}
            </p>
            <p style={{ marginBottom: '1rem' }}>
              {isZh
                ? '我们的第一个项目是一个用于展示黑客松项目作品集的平台。在开发过程中，我们意识到，「作品集」不只是展示项目的工具，更是一个连接创作者、传播知识、激发灵感的社区。于是，AttraX 逐渐从一个项目发展成为一个技术社区，吸引了越来越多的 outlier 加入。'
                : 'Our first project was a platform to showcase hackathon project portfolios. During development, we realized that a "portfolio" is not just a tool for displaying projects, but a community that connects creators, spreads knowledge, and inspires innovation. Thus, AttraX gradually evolved from a project into a tech community, attracting more outliers to join.'}
            </p>
            <p style={{ marginBottom: '1rem' }}>
              {isZh
                ? '今天，AttraX 已经成长为一个涵盖黑客松信息、项目管理、用户档案和徽章系统的综合性技术社区。我们相信，每个 outlier 都有独特的价值，每个人的「不必要」想法都可能成为下一个技术突破的种子。'
                : 'Today, AttraX has grown into a comprehensive tech community covering hackathon information, project management, user profiles, and badge systems. We believe every outlier has unique value, and every "unnecessary" idea could be the seed for the next technological breakthrough.'}
            </p>
            <p>
              {isZh
                ? '我们邀请你加入 AttraX，一起探索技术的边界，创造「不必要」但令人惊叹的工程作品。'
                : 'We invite you to join AttraX to explore technological boundaries and create "unnecessary" yet amazing engineering works together.'}
            </p>
          </div>
        </section>

        {/* Join Us */}
        <section style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#e2e8f0'
          }}>
            {isZh ? '加入我们' : 'Join Us'}
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
            {isZh
              ? '无论你是有经验的开发者，还是刚入门的技术爱好者，只要你对「不必要」的工程充满热情，欢迎加入 AttraX！'
              : 'Whether you\'re an experienced developer or a tech enthusiast just starting out, as long as you\'re passionate about "unnecessary" engineering, you\'re welcome to join AttraX!'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/hackathons"
              style={{
                padding: '0.75rem 2rem',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.background = '#764ba2'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              {isZh ? '探索黑客松' : 'Explore Hackathons'}
            </a>
            <a
              href="/goat-hunt"
              style={{
                padding: '0.75rem 2rem',
                background: '#764ba2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.background = '#667eea'}
              onMouseLeave={(e) => e.target.style.background = '#764ba2'}
            >
              {isZh ? '浏览项目' : 'Browse Projects'}
            </a>
            <a
              href="/badges"
              style={{
                padding: '0.75rem 2rem',
                background: '#ed64a6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f97316'}
              onMouseLeave={(e) => e.target.style.background = '#ed64a6'}
            >
              {isZh ? '查看徽章' : 'View Badges'}
            </a>
          </div>
        </section>

        {/* Contact */}
        <section style={{
          padding: '2rem',
          background: 'rgba(102, 126, 234, 0.05)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#e2e8f0'
          }}>
            {isZh ? '联系我们' : 'Contact Us'}
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem', opacity: 0.9 }}>
            {isZh
              ? '如果你对 AttraX 感兴趣，有合作想法，或者只是想聊聊技术，欢迎随时联系我们！'
              : 'If you\'re interested in AttraX, have collaboration ideas, or just want to chat about tech, feel free to reach out!'}
          </p>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            {isZh ? '📧 Email: contact@attrax.dev' : '📧 Email: contact@attrax.dev'}
          </p>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            {isZh ? '🌐 GitHub: https://github.com/attrax-dev' : '🌐 GitHub: https://github.com/attrax-dev'}
          </p>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            {isZh ? '💬 微信群: 加入我们的技术交流群' : '💬 WeChat: Join our tech discussion group'}
          </p>
        </section>

        {/* Footer */}
        <footer style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          fontSize: '0.9rem',
          opacity: 0.6
        }}>
          <p>
            © 2024-{new Date().getFullYear()} AttraX. {isZh ? '保留所有权利' : 'All rights reserved.'}
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            {isZh
              ? '用❤️构建 | 构建下一个不必要'
              : 'Built with ❤️ by AttraX | Build the Next Unnecessary'}
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
