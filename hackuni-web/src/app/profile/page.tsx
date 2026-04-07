'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_HACKATHONS, MOCK_PROJECTS, MOCK_BADGES, MOCK_USER } from '@/data/mock';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProfileEditDialog } from '@/components/ui/ProfileEditDialog';
import { FootprintMap } from '@/components/FootprintMap';
import { Heatmap } from '@/components/Heatmap';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('RECORDS');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Use real user data or fall back to mock data
  const displayUser = user || MOCK_USER;

  // Mock data for visualization components
  const footprintCities = MOCK_HACKATHONS.map(h => ({
    city: h.city,
    country: h.country,
    date: h.start_time,
  }));

  const heatmapActivities = [
    ...MOCK_HACKATHONS.map(h => ({ date: h.start_time, type: 'hackathon' })),
    ...MOCK_PROJECTS.map(() => ({ date: new Date().toISOString(), type: 'project' })),
    ...Array.from({ length: 20 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      type: 'activity'
    })),
  ];

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Profile Header */}
      <div className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-6)', alignItems: 'center', marginBottom: 'var(--sp-8)' }}>
        <div style={{
          width: '180px',
          height: '180px',
          background: (displayUser as any).avatar || `url('https://picsum.photos/seed/${displayUser.id}/360/360') center/cover`,
          backgroundSize: 'cover',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--brand-coral)'
        }}>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
            <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0 }}>
              {displayUser.display_name || 'Anonymous'}
            </h1>
            <Button
              variant="ghost"
              onClick={() => setEditDialogOpen(true)}
              style={{ fontSize: '12px', padding: '4px 12px' }}
            >
              ✏️ {t('common.edit')}
            </Button>
          </div>

          {/* Academic & Work Info */}
          {((displayUser as any).school || (displayUser as any).company) && (
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
              {(displayUser as any).school && <span>🎓 {(displayUser as any).school}</span>}
              {(displayUser as any).major && <span> | {(displayUser as any).major}</span>}
              {(displayUser as any).company && <span>🏢 {(displayUser as any).company}</span>}
              {(displayUser as any).position && <span> | {(displayUser as any).position}</span>}
            </div>
          )}

          <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 0 var(--sp-3) 0' }}>
            {displayUser.bio || (language === 'zh' ? '还没有个人简介' : 'No bio yet')}
          </p>

          {/* Contact Info */}
          {displayUser.email && (
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>📧 {displayUser.email}</span>
            </div>
          )}

          {/* Looking For */}
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {(displayUser.looking_for || []).length > 0 ? (
              (displayUser.looking_for || []).map((lf: any, index: number) => (
                <span key={index} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--brand-coral)',
                  border: '1px solid var(--brand-coral)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {lf}
                </span>
              ))
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                {language === 'zh' ? '暂无状态' : 'No status'}
              </span>
            )}
          </div>
        </div>

        {/* Core Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--brand-green)' }}>{displayUser.total_hackathon_count || 0}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{t('profile.hackathons')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--brand-green)' }}>{displayUser.total_work_count || 0}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{t('profile.projects')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--brand-coral)' }}>{displayUser.total_award_count || 0}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{t('profile.awards')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--brand-coral)' }}>{displayUser.certification_count || 0}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{t('profile.certifications')}</span>
          </div>
        </div>
      </div>

      <div className="divider-dashed" style={{ margin: 'var(--sp-8) 0' }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }}>

        {/* Main Content Area */}
        <section>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)', fontFamily: 'var(--font-mono)' }}>
            {['FOOTPRINTS', 'HEATMAP', 'RECORDS', 'PORTFOLIO'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab ? 'var(--brand-coral)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab ? '2px solid var(--brand-coral)' : '2px solid transparent',
                  padding: 'var(--sp-2) 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab ? 'bold' : 'normal'
                }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', minHeight: '400px', padding: 'var(--sp-5)' }}>
            {activeTab === 'FOOTPRINTS' && (
              <div>
                <div style={{ marginBottom: 'var(--sp-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  // HACKATHON_JOURNEY_AROUND_THE_WORLD
                </div>
                <FootprintMap cities={footprintCities} />
              </div>
            )}

            {activeTab === 'HEATMAP' && (
              <Heatmap activities={heatmapActivities} />
            )}

            {activeTab === 'RECORDS' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0, marginBottom: 'var(--sp-4)' }}>
                  HACKATHON_RECORDS
                </h3>
                <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px dashed var(--border-base)' }}>
                      <th style={{ padding: 'var(--sp-2) 0' }}>{t('profile.event')}</th>
                      <th style={{ padding: 'var(--sp-2) 0' }}>{t('profile.role')}</th>
                      <th style={{ padding: 'var(--sp-2) 0' }}>{t('profile.status')}</th>
                      <th style={{ padding: 'var(--sp-2) 0' }}>AWARD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_HACKATHONS.map((h, i) => (
                      <tr key={h.id} style={{ borderBottom: '1px solid var(--bg-elevated)' }}>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <Link href={`/hackathons/${h.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                            {h.title}
                          </Link>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0', color: 'var(--text-muted)' }}>{i === 0 ? 'DEVELOPER' : 'PARTICIPANT'}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span className={i === 0 ? "status-verified" : "status-pending"}>
                            {i === 0 ? t('status.verified') : t('status.pending')}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0', color: i === 0 ? 'var(--brand-coral)' : 'var(--text-muted)' }}>
                          {i === 0 ? '🏆 GOLD' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'PORTFOLIO' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0, marginBottom: 'var(--sp-4)' }}>
                  PROJECT_PORTFOLIO
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {MOCK_PROJECTS.slice(0, 6).map(proj => (
                    <Link key={proj.id} href={`/goat-hunt/${proj.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-base)',
                        padding: 'var(--sp-3)',
                        cursor: 'pointer'
                      }} className="hover-color">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>{proj.title}</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{proj.short_desc}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-green)' }}>
                              ▲ {proj.like_count}
                            </div>
                            {proj.is_awarded && (
                              <div style={{ fontSize: '11px', color: 'var(--brand-coral)', marginTop: '2px' }}>
                                {proj.award_text}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside>
          {/* Badge Wall */}
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
              <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>{t('profile.badge_wall')}</h3>
              <Link href="/badges" style={{ fontSize: '12px', color: 'var(--brand-coral)', textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-3)' }}>
              {(MOCK_USER.badges || []).map((b: any) => {
                // Find the matching badge from MOCK_BADGES
                const matchingBadge = MOCK_BADGES.find((mb: any) => mb.badge_code === b.label);
                const badgeId = matchingBadge ? matchingBadge.id : b.id;

                return (
                  <Link key={b.id} href={`/badges/${badgeId}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: b.status === 'verified' ? 'rgba(0, 255, 65, 0.1)' : 'var(--bg-secondary)',
                      border: b.status === 'verified' ? '1px solid var(--brand-green)' : '1px solid var(--border-base)',
                      opacity: b.status === 'verified' ? 1 : 0.4,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: 'var(--sp-2)',
                      cursor: 'pointer'
                    }} className="hover-color">
                      <div style={{
                        width: '30px',
                        height: '30px',
                        background: b.status === 'verified' ? 'var(--brand-green)' : '#333',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        marginBottom: '4px'
                      }}></div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-main)' }}>{b.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <Link href="/badges">
                <Button variant="ghost" style={{ width: '100%', fontSize: '12px' }}>{t('profile.claim_badge')}</Button>
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            padding: 'var(--sp-4)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
              // CONNECT
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {(displayUser as any).twitter_url && (
                <a href={(displayUser as any).twitter_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-2)' }} className="hover-color">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>𝕏</span>
                    <span style={{ fontSize: '13px' }}>Twitter/X</span>
                  </div>
                </a>
              )}
              {(displayUser as any).github_url && (
                <a href={(displayUser as any).github_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-2)' }} className="hover-color">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>⌥</span>
                    <span style={{ fontSize: '13px' }}>GitHub</span>
                  </div>
                </a>
              )}
              {(displayUser as any).website_url && (
                <a href={(displayUser as any).website_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-2)' }} className="hover-color">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>🌐</span>
                    <span style={{ fontSize: '13px' }}>Website</span>
                  </div>
                </a>
              )}
              {!(displayUser as any).twitter_url && !(displayUser as any).github_url && !(displayUser as any).website_url && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'zh' ? '暂无外部链接' : 'No external links'}
                </div>
              )}
            </div>
          </div>
        </aside>

      </div>

      {/* Edit Profile Dialog */}
      <ProfileEditDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      />
    </main>
  );
}
