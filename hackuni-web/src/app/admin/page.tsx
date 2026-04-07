'use client';
import React from 'react';
import Link from 'next/link';
import { MOCK_HACKATHONS, MOCK_PROJECTS, MOCK_STORIES, MOCK_BADGES } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [stats, setStats] = React.useState({
    totalUsers: 3021,
    totalHackathons: MOCK_HACKATHONS.length,
    totalProjects: MOCK_PROJECTS.length,
    totalStories: MOCK_STORIES.length,
    pendingReviews: 5,
    pendingBadges: 3,
  });

  const overviewStats = [
    { label: 'metrics.total_users', value: stats.totalUsers, color: 'var(--brand-green)' },
    { label: 'metrics.total_hackathons', value: stats.totalHackathons, color: 'var(--brand-coral)' },
    { label: 'metrics.total_projects', value: stats.totalProjects, color: 'var(--brand-green)' },
    { label: 'metrics.total_stories', value: stats.totalStories, color: 'var(--brand-coral)' },
    { label: 'metrics.pending_reviews', value: stats.pendingReviews, color: 'var(--brand-amber)' },
    { label: 'metrics.pending_badges', value: stats.pendingBadges, color: 'var(--brand-amber)' },
  ];

  const navTabs = [
    { id: 'overview', label: 'admin.overview' },
    { id: 'hackathons', label: 'nav.hackathons' },
    { id: 'projects', label: 'profile.projects' },
    { id: 'stories', label: 'nav.stories' },
    { id: 'badges', label: 'nav.badges' },
    { id: 'users', label: 'admin.manage_users' },
    { id: 'reviews', label: 'admin.review_submissions' },
  ];

  const recentActivities = [
    { action: language === 'zh' ? '新项目提交' : 'New project submitted', user: '@alice', time: language === 'zh' ? '2小时前' : '2 hours ago', type: 'project' },
    { action: language === 'zh' ? '徽章验证请求' : 'Badge verification request', user: '@bob', time: language === 'zh' ? '5小时前' : '5 hours ago', type: 'badge' },
    { action: language === 'zh' ? '新用户注册' : 'New user registered', user: '@charlie', time: language === 'zh' ? '1天前' : '1 day ago', type: 'user' },
    { action: language === 'zh' ? '故事已发布' : 'Story published', user: '@admin', time: language === 'zh' ? '2天前' : '2 days ago', type: 'story' },
  ];

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0, textTransform: 'uppercase' }}>
          &gt; {t('admin.dashboard')}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
          {language === 'zh' ? '管理内容、用户和平台设置' : 'Manage content, users, and platform settings'}
        </p>
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--sp-6)' }}>
        {/* Sidebar Navigation */}
        <aside>
          <nav style={{ position: 'sticky', top: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {navTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid var(--brand-coral)' : '1px solid var(--border-base)',
                    padding: 'var(--sp-3) var(--sp-4)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: activeTab === tab.id ? 'var(--brand-coral)' : 'var(--text-main)',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-color"
                >
                  &gt; {t(tab.label).toUpperCase()}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <section>
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--sp-4)',
                marginBottom: 'var(--sp-6)'
              }}>
                {overviewStats.map(stat => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-base)',
                      padding: 'var(--sp-4)',
                      transition: 'all 0.2s ease'
                    }}
                    className="hover-color"
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                      {t(stat.label)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: stat.color }}>
                      {stat.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                padding: 'var(--sp-5)',
                marginBottom: 'var(--sp-6)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: '0 0 var(--sp-4) 0', fontSize: '18px' }}>
                  {t('admin.quick_actions')}
                </h3>
                <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                  <Button variant="primary" style={{ cursor: 'pointer' }}>
                    {t('admin.add_hackathon')}
                  </Button>
                  <Button variant="primary" style={{ cursor: 'pointer' }}>
                    {t('admin.create_story')}
                  </Button>
                  <Button variant="ghost" style={{ cursor: 'pointer' }}>
                    {t('admin.review_submissions')} ({stats.pendingReviews})
                  </Button>
                  <Button variant="ghost" style={{ cursor: 'pointer' }}>
                    {t('admin.badge_requests')} ({stats.pendingBadges})
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                padding: 'var(--sp-5)',
              }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: '0 0 var(--sp-4) 0', fontSize: '18px' }}>
                  {t('admin.recent_activity')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {recentActivities.map((activity, i) => (
                    <div key={i} style={{
                      padding: 'var(--sp-3)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-base)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                      className="hover-color"
                    >
                      <div>
                        <div style={{ fontSize: '14px', marginBottom: '4px' }}>{activity.action}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                          {language === 'zh' ? '由' : 'by'} {activity.user}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hackathons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理黑客松' : 'MANAGE_HACKATHONS'}
                </h3>
                <Button variant="primary" style={{ cursor: 'pointer' }}>
                  {language === 'zh' ? '+ 添加黑客松' : t('admin.add_hackathon')}
                </Button>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '标题' : 'TITLE'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('hackathon.location')}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('hackathon.time')}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('hackathon.status')}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '操作' : 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_HACKATHONS.map(hack => (
                      <tr key={hack.id} style={{ borderBottom: '1px solid var(--bg-elevated)', transition: 'background 0.2s ease' }} className="hover-color">
                        <td style={{ padding: 'var(--sp-3) 0' }}>{hack.title}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{hack.city}, {hack.country}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{new Date(hack.start_time).toLocaleDateString()}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span style={{ color: hack.registration_status === '报名中' ? 'var(--brand-green)' : 'var(--text-muted)' }}>
                            {hack.registration_status}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                            <Button variant="ghost" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {t('common.edit')}
                            </Button>
                            <Button variant="ghost" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {language === 'zh' ? '隐藏' : 'Hide'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理项目' : 'MANAGE_PROJECTS'}
                </h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {t('metrics.pending_reviews')}: {stats.pendingReviews}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '项目' : 'PROJECT'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '团队' : 'TEAM'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('common.like').toUpperCase()}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('hackathon.status')}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '操作' : 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PROJECTS.map(proj => (
                      <tr key={proj.id} style={{ borderBottom: '1px solid var(--bg-elevated)', transition: 'background 0.2s ease' }} className="hover-color">
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <Link href={`/goat-hunt/${proj.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                            {proj.title}
                          </Link>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{proj.team_member_text}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{proj.like_count}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span style={{ color: 'var(--brand-green)' }}>{t('status.published')}</span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                            <Button variant="ghost" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {language === 'zh' ? '查看' : 'View'}
                            </Button>
                            <Button variant="ghost" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {language === 'zh' ? '隐藏' : 'Hide'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理徽章' : 'MANAGE_BADGES'}
                </h3>
                <Button variant="primary" style={{ cursor: 'pointer' }}>
                  {language === 'zh' ? '+ 创建徽章' : '+ Create Badge'}
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--sp-4)' }}>
                {MOCK_BADGES.map(badge => (
                  <div key={badge.id} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-base)',
                    padding: 'var(--sp-4)',
                    transition: 'all 0.2s ease'
                  }}
                    className="hover-color"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
                      <div style={{
                        width: '50px', height: '50px',
                        background: 'var(--brand-green)',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        🏆
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                          {language === 'zh' ? badge.badge_name : badge.badge_name_en}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {badge.badge_code}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
                      {language === 'zh' ? badge.badge_desc : badge.badge_desc_en}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                      <Button variant="ghost" style={{ flex: 1, fontSize: '11px', cursor: 'pointer' }}>
                        {t('common.edit')}
                      </Button>
                      <Button variant="ghost" style={{ flex: 1, fontSize: '11px', cursor: 'pointer' }}>
                        {language === 'zh' ? '查看' : 'View'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
