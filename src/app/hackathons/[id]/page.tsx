'use client';
import React from 'react';
import Link from 'next/link';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchJsonWithCache, getCachedJson } from '@/lib/client-cache';

interface HackathonProject {
  id: string;
  title: string;
  short_desc: string;
  rank_score?: number | null;
  like_count?: number;
}

interface HackathonParticipant {
  id: string;
  display_name?: string;
  total_work_count?: number;
}

interface HackathonDetail {
  id: string;
  title: string;
  short_desc: string;
  description: string;
  start_time: string;
  end_time: string;
  registration_deadline: string | null;
  city: string;
  country: string;
  location_detail?: string | null;
  tags_json: string[];
  level_score: string;
  level_code: string;
  registration_status: string;
  organizer?: string | null;
  organizer_url?: string | null;
  registration_url?: string | null;
  prizes?: string | null;
  requirements?: string | null;
  fee?: string | null;
  relatedProjects: HackathonProject[];
  participants: HackathonParticipant[];
}

interface HackathonDetailResponse {
  data: HackathonDetail;
}

export default function HackathonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage();
  const [hackathon, setHackathon] = React.useState<HackathonDetail | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isActive = true;

    void params.then(async ({ id }) => {
      const cacheKey = `/api/hackathons/${id}`;
      const cachedResponse = getCachedJson<HackathonDetailResponse>(cacheKey);

      if (cachedResponse?.data && isActive) {
        setHackathon(cachedResponse.data);
        setLoading(false);
      }

      try {
        const data = await fetchJsonWithCache<HackathonDetailResponse>(cacheKey);

        if (isActive) {
          setHackathon(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch hackathon detail:', error);
        if (isActive) {
          setHackathon(null);
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

  if (loading) {
    return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; LOADING_HACKATHON...</main>;
  }

  if (!hackathon) {
    return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; ERROR_404_NOT_FOUND_</main>;
  }

  return (
    <main>
      <div style={{
        height: '350px',
        background: `url(https://picsum.photos/seed/${hackathon.id}/1280/400) center/cover`,
        borderBottom: '1px solid var(--border-base)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'var(--sp-8) var(--sp-6)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)', flexWrap: 'wrap' }}>
              {hackathon.tags_json.map((tag) => <Tag key={tag} label={tag} />)}
            </div>
            <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: '64px', margin: 0, textTransform: 'uppercase', lineHeight: 1 }}>
              {hackathon.title}
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-3)' }}>
              &gt; {hackathon.city}, {hackathon.country} _ LOCATED
            </p>
          </div>

          {hackathon.level_score && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', color: 'var(--brand-coral)', lineHeight: 1 }}>{hackathon.level_score}</div>
              {hackathon.level_code && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>{hackathon.level_code} TIER</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: 'var(--sp-6)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }}>
          <section>
            <div style={{ marginBottom: 'var(--sp-6)' }}>
              <h3 className="section-title" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0 }}>MISSION_BRIEFING</h3>
              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }} />

              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.8, color: 'var(--text-main)' }}>
                <p>{hackathon.short_desc}</p>
                <p>{hackathon.description}</p>
                <br />
                <h4 style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>// CRITICAL_INFO_</h4>
                <ul style={{ listStyleType: 'square', paddingLeft: '20px' }}>
                  <li><strong>TIME:</strong> {new Date(hackathon.start_time).toLocaleDateString()} - {new Date(hackathon.end_time).toLocaleDateString()}</li>
                  <li><strong>{t('hackathon.location')}:</strong> {hackathon.location_detail || `${hackathon.city}, ${hackathon.country}`}</li>
                  {hackathon.registration_deadline && <li><strong>REGISTRATION_DEADLINE:</strong> {new Date(hackathon.registration_deadline).toLocaleDateString()}</li>}
                  {hackathon.prizes && <li><strong>PRIZES:</strong> {hackathon.prizes}</li>}
                  {hackathon.fee && <li><strong>FEE:</strong> {hackathon.fee}</li>}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="section-title" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0 }}>PROJECTS_FROM_THIS_OP</h3>
              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }} />

              {hackathon.relatedProjects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {hackathon.relatedProjects.map((project) => (
                    <Link key={project.id} href={`/goat-hunt/${project.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-base)',
                        padding: 'var(--sp-3)',
                        display: 'flex',
                        gap: 'var(--sp-3)',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }} className="hover-color">
                        <div style={{ fontFamily: 'var(--font-hero)', fontSize: '24px', color: 'var(--brand-coral)' }}>
                          #{project.rank_score || '-'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>{project.title}</h4>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{project.short_desc}</p>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-green)' }}>
                          ▲ {project.like_count || 0}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'zh' ? '这个活动下还没有关联项目。' : 'No linked projects yet.'}
                </div>
              )}
            </div>
          </section>

          <aside>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              padding: 'var(--sp-5)',
              position: 'sticky',
              top: 'var(--sp-4)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-hero)', margin: '0 0 var(--sp-4) 0' }}>ACTION_STATUS</h3>

              <div style={{ marginBottom: 'var(--sp-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: 'var(--sp-2)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('hackathon.status')}:</span>
                  <span style={{ color: hackathon.registration_status === 'open' ? 'var(--brand-green)' : 'var(--brand-amber)' }}>{hackathon.registration_status}</span>
                </div>
              </div>

              <Button
                variant="primary"
                style={{ width: '100%', marginBottom: 'var(--sp-4)' }}
                onClick={() => hackathon.registration_url && window.open(hackathon.registration_url, '_blank')}
                disabled={!hackathon.registration_url}
              >
                {hackathon.registration_status === 'open'
                  ? (language === 'zh' ? '立即报名' : 'REGISTER NOW')
                  : (language === 'zh' ? '查看详情' : 'VIEW DETAILS')}
              </Button>

              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }} />

              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>// VERIFIED_PARTICIPANTS</h4>
              {hackathon.participants.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {hackathon.participants.map((participant) => (
                    <Link key={participant.id} href={`/profile/${participant.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        padding: 'var(--sp-2)',
                        cursor: 'pointer'
                      }} className="hover-color">
                        <div style={{
                          width: '32px', height: '32px',
                          background: `url(https://picsum.photos/seed/${participant.id}/64/64) center/cover`,
                          borderRadius: '50%',
                          border: '1px solid var(--border-base)'
                        }} />
                        <span style={{ color: 'var(--text-main)' }}>{participant.display_name || participant.id}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--brand-coral)' }}>{participant.total_work_count || 0} {t('profile.projects')}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'zh' ? '暂无可展示的参赛者信息' : 'No participant data available yet'}
                </div>
              )}

              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }} />

              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>// EXTERNAL_LINKS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                <Button
                  variant="ghost"
                  style={{ width: '100%', fontSize: '12px' }}
                  onClick={() => hackathon.organizer_url && window.open(hackathon.organizer_url, '_blank')}
                  disabled={!hackathon.organizer_url}
                >
                  {hackathon.organizer || 'Official Website'}
                </Button>
                <Button
                  variant="ghost"
                  style={{ width: '100%', fontSize: '12px' }}
                  onClick={() => hackathon.registration_url && window.open(hackathon.registration_url, '_blank')}
                  disabled={!hackathon.registration_url}
                >
                  {language === 'zh' ? '报名链接' : 'Registration Link'}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
