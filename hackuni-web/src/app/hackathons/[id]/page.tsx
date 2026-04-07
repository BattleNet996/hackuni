'use client';
import React from 'react';
import Link from 'next/link';
import { MOCK_HACKATHONS, MOCK_PROJECTS, MOCK_BUILDERS } from '@/data/mock';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HackathonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage();
  const [hack, setHack] = React.useState<any>(null);

  React.useEffect(() => {
    params.then(resolvedParams => {
      const foundHack = MOCK_HACKATHONS.find(h => h.id === resolvedParams.id);
      setHack(foundHack);
    });
  }, [params]);

  if (!hack) {
    return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; ERROR_404_NOT_FOUND_</main>;
  }

  // Get related projects and participants
  const relatedProjects = MOCK_PROJECTS.slice(0, 3);
  const participants = MOCK_BUILDERS.slice(0, 5);

  return (
    <main>
      {/* Hero Header */}
      <div style={{
        height: '350px',
        background: `url(https://picsum.photos/seed/${hack.id}/1280/400) center/cover`,
        borderBottom: '1px solid var(--border-base)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'var(--sp-8) var(--sp-6)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background fake poster */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
              {hack.tags_json.map((tag: string) => <Tag key={tag} label={tag} />)}
            </div>
            <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: '64px', margin: 0, textTransform: 'uppercase', lineHeight: 1 }}>
              {hack.title}
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-3)' }}>
              &gt; {hack.city}, {hack.country} _ LOCATED
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', color: 'var(--brand-coral)', lineHeight: 1 }}>{hack.level_score}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>{hack.level_code} TIER</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--sp-6)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }}>

          {/* Main Content */}
          <section>
            <div style={{ marginBottom: 'var(--sp-6)' }}>
              <h3 className="section-title" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0 }}>MISSION_BRIEFING</h3>
              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }}></div>

              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.8, color: 'var(--text-main)' }}>
                <p>{hack.short_desc}</p>
                <p>Welcome to the {hack.title}. This event gathers top-tier builders to forge the next generation of solutions. Participants will have 48 hours to form teams, build MVP prototypes, and pitch their ideas to our Outlier community.</p>
                <p>Unlike traditional hackathons, we prioritize functional prototypes and creative disruption over business plans. "We engineer the UNNECESSARY."</p>
                <br/>
                <h4 style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>// CRITICAL_INFO_</h4>
                <ul style={{ listStyleType: 'square', paddingLeft: '20px' }}>
                  <li><strong>TIME:</strong> {new Date(hack.start_time).toLocaleDateString()} - {new Date(hack.end_time).toLocaleDateString()}</li>
                  <li><strong>{t('hackathon.location')}:</strong> {hack.city}, {hack.country}</li>
                  <li><strong>REGISTRATION_DEADLINE:</strong> {new Date(hack.end_time).toLocaleDateString()}</li>
                  <li><strong>PRIZE POOL:</strong> $50,000 + Hardware provisions</li>
                </ul>
              </div>
            </div>

            {/* Related Projects */}
            <div>
              <h3 className="section-title" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0 }}>PROJECTS_FROM_THIS_OP</h3>
              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }}></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {relatedProjects.map(proj => (
                  <Link key={proj.id} href={`/goat-hunt/${proj.id}`} style={{ textDecoration: 'none' }}>
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
                        #{proj.rank_score}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>{proj.title}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{proj.short_desc}</p>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-green)' }}>
                        ▲ {proj.like_count}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar */}
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
                  <span style={{ color: hack.registration_status === t('status.registration_open') ? 'var(--brand-green)' : 'var(--brand-amber)' }}>{hack.registration_status}</span>
                </div>
              </div>

              <Button variant="primary" style={{ width: '100%', marginBottom: 'var(--sp-4)' }}>
                {hack.registration_status === t('status.registration_open') ? 'REGISTER NOW' : 'VIEW OUTCOME'}
              </Button>

              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }}></div>

              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>// VERIFIED_PARTICIPANTS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {participants.map(p => (
                  <Link key={p.id} href={`/profile/${p.id}`} style={{ textDecoration: 'none' }}>
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
                        background: `url(https://picsum.photos/seed/${p.id}/64/64) center/cover`,
                        borderRadius: '50%',
                        border: '1px solid var(--border-base)'
                      }}></div>
                      <span style={{ color: 'var(--text-main)' }}>{p.display_name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--brand-coral)' }}>{p.total_work_count} {t('profile.projects')}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }}></div>

              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>// EXTERNAL_LINKS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                <Button variant="ghost" style={{ width: '100%', fontSize: '12px' }}>Official Website</Button>
                <Button variant="ghost" style={{ width: '100%', fontSize: '12px' }}>Registration Link</Button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
