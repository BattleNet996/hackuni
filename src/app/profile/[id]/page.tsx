'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Badge as BadgePill } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProfileEditDialog } from '@/components/ui/ProfileEditDialog';
import { HackathonRecordDialog } from '@/components/ui/HackathonRecordDialog';
import { FootprintMap } from '@/components/FootprintMap';
import { Heatmap } from '@/components/Heatmap';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchJsonWithCache, getCachedJson } from '@/lib/client-cache';
import { getAvatarFallbackStyle } from '@/lib/ui/fallback-visuals';

function toBackgroundImage(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  return value.startsWith('url(') ? value : `url(${value})`;
}

function localizeHackathonRole(value: string | null | undefined, language: string) {
  if (value === 'captain') return language === 'zh' ? '队长' : 'Captain';
  if (value === 'member') return language === 'zh' ? '队员' : 'Member';
  return value || '';
}

function localizeContributionArea(value: string, language: string) {
  if (value === 'software') return language === 'zh' ? '软件开发' : 'Software';
  if (value === 'hardware') return language === 'zh' ? '硬件开发' : 'Hardware';
  if (value === 'design') return language === 'zh' ? '设计' : 'Design';
  if (value === 'business') return language === 'zh' ? '商业' : 'Business';
  if (value === 'other') return language === 'zh' ? '其他' : 'Other';
  return value;
}

interface BuilderUser {
  id: string;
  email?: string;
  display_name?: string;
  avatar?: string;
  bio?: string;
  school?: string;
  major?: string;
  company?: string;
  position?: string;
  twitter_url?: string;
  github_url?: string;
  website_url?: string;
  looking_for?: string[];
  total_hackathon_count?: number;
  total_work_count?: number;
  total_award_count?: number;
  badge_count?: number;
  certification_count?: number;
  coolest_thing?: string;
  current_build?: string;
}

interface BuilderProject {
  id: string;
  title: string;
  short_desc: string;
  like_count: number;
  is_awarded: boolean;
  award_text?: string | null;
  status?: string;
}

interface BuilderBadge {
  id: string;
  badge_code: string;
  badge_name: string;
  badge_name_en: string;
  is_earned: boolean;
  user_badge_status: string | null;
}

interface BuilderProfileResponse {
  user: BuilderUser;
  projects: BuilderProject[];
  hackathons: Array<{
    id: string;
    hackathon_id?: string | null;
    hackathon_title: string;
    role?: string | null;
    contribution_areas?: string[];
    contribution_other?: string | null;
    linked_project_id?: string | null;
    linked_project_title?: string | null;
    team_members?: Array<{ name: string; user_id?: string; invite_url?: string; source?: string }>;
    project_name?: string | null;
    project_url?: string | null;
    award_text?: string | null;
    proof_url?: string | null;
    proof_image_url?: string | null;
    notes?: string | null;
    status: string;
    verified_at?: string | null;
    created_at: string;
  }>;
  pendingHackathonRecords?: Array<{
    id: string;
    hackathon_title: string;
    role?: string | null;
    contribution_areas?: string[];
    contribution_other?: string | null;
    linked_project_id?: string | null;
    linked_project_title?: string | null;
    team_members?: Array<{ name: string; user_id?: string; invite_url?: string; source?: string }>;
    project_name?: string | null;
    award_text?: string | null;
    proof_image_url?: string | null;
    status: string;
    created_at: string;
  }>;
  badges: BuilderBadge[];
  footprintCities: Array<{ city: string; country: string; date: string }>;
  heatmapActivities: Array<{ date: string; type: string }>;
}

interface BuilderProfileApiResponse {
  data: BuilderProfileResponse;
}

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('RECORDS');
  const [profileData, setProfileData] = React.useState<BuilderProfileResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [recordDialogOpen, setRecordDialogOpen] = React.useState(false);
  const [hackathonOptions, setHackathonOptions] = React.useState<Array<{ id: string; title: string }>>([]);

  const refreshProfile = React.useCallback(async () => {
    const { id } = await params;
    const data = await fetchJsonWithCache<BuilderProfileApiResponse>(`/api/builders/${id}`, { force: true });
    setProfileData(data.data);
    setLoadError(null);
  }, [params]);

  React.useEffect(() => {
    let isActive = true;

    void params.then(async ({ id }) => {
      const cacheKey = `/api/builders/${id}`;
      const cachedResponse = getCachedJson<BuilderProfileApiResponse>(cacheKey);

      if (cachedResponse?.data && isActive) {
        setProfileData(cachedResponse.data);
        setLoadError(null);
        setLoading(false);
      }

      try {
        const data = await fetchJsonWithCache<BuilderProfileApiResponse>(cacheKey);

        if (isActive) {
          setProfileData(data.data);
          setLoadError(null);
        }
      } catch (error) {
        console.error('Failed to fetch builder profile:', error);
        if (isActive) {
          setProfileData(null);
          const message = error instanceof Error ? error.message : '';
          setLoadError(message || 'LOAD_FAILED');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, [params]);

  React.useEffect(() => {
    if (!user) return;

    let isActive = true;
    fetch('/api/hackathons?limit=100')
      .then((response) => response.json())
      .then((data) => {
        if (isActive) {
          setHackathonOptions((data.data || []).map((hackathon: any) => ({
            id: hackathon.id,
            title: hackathon.title,
          })));
        }
      })
      .catch(() => {
        if (isActive) setHackathonOptions([]);
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  if (loading) {
    return (
      <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
        &gt; LOADING_USER_DATA...
      </main>
    );
  }

  if (!profileData?.user) {
    const isNotFound = loadError?.includes('Builder not found') || loadError?.includes('NOT_FOUND');
    return (
      <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
        &gt; {isNotFound ? 'ERROR_404_USER_NOT_FOUND_' : 'ERROR_PROFILE_LOAD_FAILED_'}
        <div style={{ marginTop: 'var(--sp-4)' }}>
          <Link href="/">
            <Button variant="primary">{t('common.back')}</Button>
          </Link>
        </div>
      </main>
    );
  }

  const isOwnProfile = user?.id === profileData.user.id;
  const displayUser = profileData.user;
  const footprintCities = profileData.footprintCities || [];
  const heatmapActivities = profileData.heatmapActivities || [];
  const projects = profileData.projects || [];
  const badges = profileData.badges || [];
  const hackathons = profileData.hackathons || [];
  const pendingHackathonRecords = profileData.pendingHackathonRecords || [];

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-6)', alignItems: 'center', marginBottom: 'var(--sp-8)' }}>
        <div style={{
          ...(displayUser.avatar
            ? { backgroundImage: toBackgroundImage(displayUser.avatar, 'none') }
            : getAvatarFallbackStyle(displayUser.id, '180px')),
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          border: '2px solid var(--brand-coral)'
        }} />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
            <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0 }}>
              {displayUser.display_name || 'Anonymous'}
            </h1>
            {isOwnProfile && (
              <Button
                variant="ghost"
                onClick={() => setEditDialogOpen(true)}
                style={{ fontSize: '12px', padding: '4px 12px' }}
              >
                ✏️ {t('common.edit')}
              </Button>
            )}
          </div>

          {(displayUser.school || displayUser.company) && (
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              {displayUser.school && <span>🎓 {displayUser.school}</span>}
              {displayUser.major && <span>{displayUser.major}</span>}
              {displayUser.company && <span>🏢 {displayUser.company}</span>}
              {displayUser.position && <span>{displayUser.position}</span>}
            </div>
          )}

          <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 0 var(--sp-3) 0' }}>
            {displayUser.bio || (language === 'zh' ? '还没有个人简介' : 'No bio yet')}
          </p>

          {(displayUser.coolest_thing || displayUser.current_build) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)', maxWidth: '760px' }}>
              {displayUser.coolest_thing && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-3)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-coral)', marginBottom: '4px' }}>
                    {language === 'zh' ? '做过最酷的事' : 'COOLEST_THING'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5 }}>{displayUser.coolest_thing}</div>
                </div>
              )}
              {displayUser.current_build && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-3)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-green)', marginBottom: '4px' }}>
                    {language === 'zh' ? '正在 Build' : 'CURRENT_BUILD'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5 }}>{displayUser.current_build}</div>
                </div>
              )}
            </div>
          )}

          {isOwnProfile && displayUser.email && (
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>📧 {displayUser.email}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {(displayUser.looking_for || []).length > 0 ? (
              (displayUser.looking_for || []).map((value) => (
                <span key={value} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--brand-coral)',
                  border: '1px solid var(--brand-coral)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {value}
                </span>
              ))
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                {language === 'zh' ? '暂无状态' : 'No status'}
              </span>
            )}
          </div>
        </div>

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

      <div className="divider-dashed" style={{ margin: 'var(--sp-8) 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }}>
        <section>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)', fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
            {[
              { key: 'FOOTPRINTS', label: t('profile.footprints') },
              { key: 'HEATMAP', label: t('profile.heatmap') },
              { key: 'RECORDS', label: t('profile.records') },
              { key: 'PORTFOLIO', label: t('profile.portfolio') }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab.key ? 'var(--brand-coral)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--brand-coral)' : '2px solid transparent',
                  padding: 'var(--sp-2) 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? 'bold' : 'normal'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', minHeight: '400px', padding: 'var(--sp-5)' }}>
            {activeTab === 'FOOTPRINTS' && (
              footprintCities.length > 0 ? (
                <FootprintMap cities={footprintCities} />
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)' }}>
                  {t('profile.no_footprints')}
                </div>
              )
            )}

            {activeTab === 'HEATMAP' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                <Heatmap activities={heatmapActivities} />
                {heatmapActivities.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                    {t('profile.no_heatmap')}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'RECORDS' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                  <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', margin: 0 }}>
                    {t('profile.hackathon_records')}
                  </h3>
                  {isOwnProfile && (
                    <Button variant="primary" onClick={() => setRecordDialogOpen(true)} style={{ fontSize: '12px' }}>
                      {language === 'zh' ? '+ 新增记录' : '+ Add Record'}
                    </Button>
                  )}
                </div>
                {pendingHackathonRecords.length > 0 && isOwnProfile && (
                  <div style={{ marginBottom: 'var(--sp-4)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-amber)' }}>
                    {language === 'zh' ? `你有 ${pendingHackathonRecords.length} 条记录待管理员审核。` : `${pendingHackathonRecords.length} records are pending admin review.`}
                  </div>
                )}
                {pendingHackathonRecords.length > 0 && isOwnProfile && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                    {pendingHackathonRecords.map((record) => (
                      <div key={record.id} style={{ background: 'rgba(255, 184, 77, 0.08)', border: '1px solid rgba(255, 184, 77, 0.35)', padding: 'var(--sp-3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>{record.hackathon_title}</h4>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                              {[
                                localizeHackathonRole(record.role, language),
                                ...(record.contribution_areas || []).map((value) => localizeContributionArea(value, language)),
                                ...(record.contribution_other ? [record.contribution_other] : []),
                                record.linked_project_title,
                                record.project_name,
                                record.award_text,
                              ].filter(Boolean).join(' / ') || (language === 'zh' ? '待审核' : 'Pending review')}
                            </div>
                          </div>
                          <BadgePill type="pending" label={language === 'zh' ? '待审核' : 'Pending'} />
                        </div>
                        {record.proof_image_url && (
                          <a href={record.proof_image_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 'var(--sp-2)', fontSize: '12px', color: 'var(--brand-coral)' }}>
                            {language === 'zh' ? '查看图片证明' : 'View proof image'}
                          </a>
                        )}
                        {record.team_members && record.team_members.length > 0 && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {language === 'zh' ? '团队成员' : 'Team'}: {record.team_members.map((member) => member.name).join(' / ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {hackathons.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {hackathons.map((record) => (
                      <div key={record.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', padding: 'var(--sp-3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>{record.hackathon_title}</h4>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {[
                                localizeHackathonRole(record.role, language),
                                ...(record.contribution_areas || []).map((value) => localizeContributionArea(value, language)),
                                ...(record.contribution_other ? [record.contribution_other] : []),
                                record.linked_project_title,
                                record.project_name,
                                record.award_text,
                              ].filter(Boolean).join(' / ') || (language === 'zh' ? '已认证参与' : 'Verified participation')}
                            </div>
                            {record.notes && (
                              <div style={{ fontSize: '12px', color: 'var(--text-main)', marginTop: '6px', lineHeight: 1.5 }}>
                                {record.notes}
                              </div>
                            )}
                          </div>
                          <BadgePill type="verified" label={language === 'zh' ? '已认证' : 'Verified'} />
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', marginTop: 'var(--sp-2)' }}>
                          {record.project_url && (
                            <a href={record.project_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--brand-coral)' }}>
                              {language === 'zh' ? '查看项目' : 'View project'}
                            </a>
                          )}
                          {record.proof_url && (
                            <a href={record.proof_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--brand-coral)' }}>
                              {language === 'zh' ? '查看证明链接' : 'View proof link'}
                            </a>
                          )}
                            {record.proof_image_url && (
                              <a href={record.proof_image_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--brand-coral)' }}>
                                {language === 'zh' ? '查看图片证明' : 'View proof image'}
                              </a>
                            )}
                          </div>
                        {record.team_members && record.team_members.length > 0 && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {language === 'zh' ? '团队成员' : 'Team'}: {record.team_members.map((member) => member.name).join(' / ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)' }}>
                    {language === 'zh' ? '当前还没有可公开展示的参赛记录。' : 'No public hackathon records are available yet.'}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'PORTFOLIO' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                  <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', margin: 0 }}>
                    {t('profile.project_portfolio')}
                  </h3>
                  {isOwnProfile && (
                    <Link href="/publish">
                      <Button variant="primary" style={{ fontSize: '12px' }}>{language === 'zh' ? '+ 发布作品' : '+ Add Project'}</Button>
                    </Link>
                  )}
                </div>
                {projects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {projects.map((project) => (
                      <Link key={project.id} href={`/goat-hunt/${project.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-base)',
                          padding: 'var(--sp-3)',
                          cursor: 'pointer'
                        }} className="hover-color">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-3)' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: '4px' }}>
                                <h4 style={{ margin: 0, color: 'var(--text-main)' }}>{project.title}</h4>
                                {project.status && project.status !== 'published' && (
                                  <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    color: project.status === 'pending' ? 'var(--brand-amber)' : 'var(--brand-coral)',
                                    border: `1px solid ${project.status === 'pending' ? 'var(--brand-amber)' : 'var(--brand-coral)'}`,
                                    padding: '2px 6px',
                                    borderRadius: '999px',
                                  }}>
                                    {project.status === 'pending'
                                      ? (language === 'zh' ? '待审核' : 'PENDING')
                                      : (language === 'zh' ? '未通过' : project.status.toUpperCase())}
                                  </span>
                                )}
                              </div>
                              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{project.short_desc}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-green)' }}>
                                ▲ {project.like_count}
                              </div>
                              {project.is_awarded && project.award_text && (
                                <div style={{ fontSize: '11px', color: 'var(--brand-coral)', marginTop: '2px' }}>
                                  {project.award_text}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)' }}>
                    {t('profile.no_portfolio')}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <aside>
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
              <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>{t('profile.badge_wall')}</h3>
              <Link href="/badges" style={{ fontSize: '12px', color: 'var(--brand-coral)', textDecoration: 'none' }}>
                {t('profile.view_all')} →
              </Link>
            </div>
            {badges.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-3)' }}>
                {badges.slice(0, 6).map((badge) => (
                  <Link key={badge.id} href={`/badges/${badge.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: badge.is_earned ? 'rgba(0, 255, 65, 0.1)' : 'var(--bg-secondary)',
                      border: badge.is_earned ? '1px solid var(--brand-green)' : '1px solid var(--border-base)',
                      opacity: badge.is_earned ? 1 : 0.55,
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
                        background: badge.is_earned ? 'var(--brand-green)' : '#333',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        marginBottom: '4px'
                      }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-main)' }}>{badge.badge_code}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {language === 'zh' ? '暂无徽章' : 'No badges yet'}
              </div>
            )}
            {isOwnProfile && (
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Link href="/badges">
                  <Button variant="ghost" style={{ width: '100%', fontSize: '12px' }}>{t('profile.claim_badge')}</Button>
                </Link>
              </div>
            )}
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            padding: 'var(--sp-4)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
              // CONNECT
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {displayUser.twitter_url && (
                <a href={displayUser.twitter_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-2)' }} className="hover-color">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>𝕏</span>
                    <span style={{ fontSize: '13px' }}>Twitter/X</span>
                  </div>
                </a>
              )}
              {displayUser.github_url && (
                <a href={displayUser.github_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-2)' }} className="hover-color">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>⌥</span>
                    <span style={{ fontSize: '13px' }}>GitHub</span>
                  </div>
                </a>
              )}
              {displayUser.website_url && (
                <a href={displayUser.website_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-2)' }} className="hover-color">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>🌐</span>
                    <span style={{ fontSize: '13px' }}>Website</span>
                  </div>
                </a>
              )}
              {!displayUser.twitter_url && !displayUser.github_url && !displayUser.website_url && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'zh' ? '暂无外部链接' : 'No external links'}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {isOwnProfile && (
        <ProfileEditDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSaved={refreshProfile}
        />
      )}
      {isOwnProfile && (
        <HackathonRecordDialog
          isOpen={recordDialogOpen}
          onClose={() => setRecordDialogOpen(false)}
          hackathons={hackathonOptions}
          onSuccess={() => void refreshProfile()}
        />
      )}
    </main>
  );
}
