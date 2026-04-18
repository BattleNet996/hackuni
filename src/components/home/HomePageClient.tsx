'use client';

import Link from 'next/link';
import { ThreeGlobe } from '@/components/ThreeGlobe';
import { Button } from '@/components/ui/Button';
import { HackerCard } from '@/components/ui/HackerCard';
import { Tag, Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLike } from '@/contexts/LikeContext';
import { prefetchJsonWithCache } from '@/lib/client-cache';
import { getAvatarFallbackStyle, getPosterSurfaceStyle } from '@/lib/ui/fallback-visuals';

export interface Hackathon {
  id: string;
  title: string;
  short_desc: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  level_score: number | string;
  registration_status: string;
  tags_json: string[] | string;
}

export interface Project {
  id: string;
  title: string;
  short_desc: string;
  team_member_text: string;
  is_awarded: boolean;
  award_text?: string | null;
  like_count?: number;
  created_at?: string;
}

export interface Builder {
  id: string;
  display_name: string;
  bio: string;
  total_work_count: number;
  total_award_count: number;
}

export interface HomeStats {
  buildersConnected: number;
  projectsShipped: number;
  citiesCovered: number;
  badgesEarned: number;
}

function ensureTagsArray(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags as string[];
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

interface HomePageClientProps {
  initialStats: HomeStats;
  initialHackathons: Hackathon[];
  initialProjects: Project[];
  initialBuilders: Builder[];
}

export function HomePageClient({
  initialStats,
  initialHackathons,
  initialProjects,
  initialBuilders,
}: HomePageClientProps) {
  const { t } = useLanguage();
  const { isProjectLiked, toggleLikeProject, getProjectLikes } = useLike();

  return (
    <main style={{ position: 'relative', overflowX: 'hidden' }}>
      <div
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--sp-6) var(--sp-4)',
          position: 'relative',
        }}
      >
        <ThreeGlobe />

        <div style={{ maxWidth: '800px', pointerEvents: 'none', position: 'relative', zIndex: 10, marginRight: 'auto' }}>
          <h1
            style={{
              fontFamily: 'var(--font-hero)',
              fontSize: 'var(--text-h1)',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              textShadow: '4px 4px 0 rgba(0,0,0,0.5)',
            }}
            className="hero-title"
          >
            {t('home.hero.title')}
            <br />
            {t('home.hero.subtitle')}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              color: 'var(--text-main)',
              marginTop: 'var(--sp-3)',
              background: 'rgba(0,0,0,0.6)',
              display: 'inline-block',
              padding: '4px 8px',
            }}
          >
            {t('home.hero.tagline')}
          </p>
        </div>

        <div
          style={{
            marginTop: 'var(--sp-6)',
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-base)',
            padding: 'var(--sp-4)',
            width: '100%',
            maxWidth: 'max-content',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            pointerEvents: 'auto',
          }}
          className="metrics-dashboard"
        >
          <div style={{ marginBottom: 'var(--sp-2)', color: 'var(--text-muted)' }}>{t('home.vibe_metrics')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'var(--sp-4)', rowGap: 'var(--sp-2)' }}>
            <div>&gt; {t('home.metrics.builders')} : <span style={{ color: 'var(--brand-green)' }}>{initialStats.buildersConnected.toLocaleString()}</span></div>
            <div>&gt; {t('home.metrics.projects')} : <span style={{ color: 'var(--brand-green)' }}>{initialStats.projectsShipped.toLocaleString()}</span></div>
            <div>&gt; {t('home.metrics.cities')} : <span style={{ color: 'var(--brand-coral)' }}>{initialStats.citiesCovered.toLocaleString()}</span></div>
            <div>&gt; {t('home.metrics.badges')} : <span style={{ color: 'var(--brand-coral)' }}>{initialStats.badgesEarned.toLocaleString()}</span></div>
          </div>
          <div style={{ marginTop: 'var(--sp-2)', color: 'var(--text-muted)' }}>
            {t('home.connection_active')} <span style={{ color: 'var(--brand-coral)', animation: 'blink-border 1s infinite' }}>█</span>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 'var(--sp-6) var(--sp-4)',
          position: 'relative',
          zIndex: 10,
          background: 'var(--bg-pure)',
        }}
        className="content-shell"
      >
        <div style={{ display: 'grid' }} className="content-grid">
          <section className="content-stream">
            <div className="content-stream-head">
              <div className="content-toolbar">
                <h2 className="content-heading" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', margin: 0, textTransform: 'uppercase' }}>
                  {t('home.featured_ops')}
                </h2>
                <Link href="/hackathons"><Button variant="ghost">{t('home.view_all')}</Button></Link>
              </div>
              <div className="divider-dashed content-divider"></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }} className="content-column-list">
              {initialHackathons.map((hackathon) => (
                <Link key={hackathon.id} href={`/hackathons/${hackathon.id}`} onMouseEnter={() => prefetchJsonWithCache(`/api/hackathons/${hackathon.id}`)} style={{ textDecoration: 'none' }}>
                  <HackerCard className="responsive-flex-col desktop-row stream-card stream-hackathon" style={{ gap: 'var(--sp-3)', cursor: 'pointer' }}>
                    <div
                      style={{
                        ...getPosterSurfaceStyle(hackathon.id, { width: '104px', height: '104px' }),
                        flexShrink: 0,
                      }}
                      className="hover-color"
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 var(--sp-1) 0', fontFamily: 'var(--font-hero)', fontSize: '22px', color: 'var(--text-main)', lineHeight: 1.1 }}>
                          {hackathon.title}
                        </h3>
                        {hackathon.level_score && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--brand-coral)' }}>{hackathon.level_score}</div>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 var(--sp-2) 0', lineHeight: 1.5 }}>{hackathon.short_desc}</p>

                      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)', flexWrap: 'wrap' }}>
                        {ensureTagsArray(hackathon.tags_json).map((tag) => <Tag key={tag} label={tag} />)}
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                        <span>{t('hackathon.location')}: {hackathon.city}, {hackathon.country}</span>
                        <span style={{ color: hackathon.registration_status === t('status.registration_open') ? 'var(--brand-coral)' : 'var(--text-disabled)' }}>
                          {t('hackathon.status')}: {hackathon.registration_status}
                        </span>
                      </div>
                    </div>
                  </HackerCard>
                </Link>
              ))}
            </div>
          </section>

          <section className="content-stream">
            <div className="content-stream-head">
              <div className="content-toolbar">
                <h2 className="content-heading" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', margin: 0, textTransform: 'uppercase' }}>
                  {t('home.trending')}
                </h2>
                <Link href="/goat-hunt"><Button variant="ghost">{t('home.goats')}</Button></Link>
              </div>
              <div className="divider-dashed content-divider"></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }} className="content-column-list">
              {initialProjects.map((project, index) => {
                const displayLikes = getProjectLikes(project.id) ?? project.like_count ?? 0;

                return (
                  <Link key={project.id} href={`/goat-hunt/${project.id}`} onMouseEnter={() => prefetchJsonWithCache(`/api/projects/${project.id}`)} style={{ textDecoration: 'none' }}>
                    <HackerCard className="responsive-flex-col desktop-row stream-card" style={{ alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-3)', cursor: 'pointer' }}>
                      <div style={{ fontFamily: 'var(--font-hero)', fontSize: '28px', color: 'var(--text-muted)', width: '72px', textAlign: 'center', lineHeight: 1, whiteSpace: 'nowrap' }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-hero)', fontSize: '17px', color: 'var(--text-main)', lineHeight: 1.15 }}>{project.title}</h4>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{project.short_desc}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '11px', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--brand-coral)' }}>{project.team_member_text}</span>
                          {project.created_at && (
                            <span style={{ color: 'var(--text-muted)' }}>{new Date(project.created_at).toLocaleDateString()}</span>
                          )}
                          {project.is_awarded && project.award_text && (
                            <Badge type="award" label={project.award_text} style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }} />
                          )}
                        </div>
                      </div>
                      <div style={{ pointerEvents: 'auto' }}>
                        <Button
                          variant={isProjectLiked(project.id) ? 'upvote-active' : 'upvote'}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleLikeProject(project.id);
                          }}
                          style={{ padding: '8px', minWidth: '50px', textAlign: 'center', cursor: 'pointer' }}
                        >
                          ▲
                          <br />
                          {displayLikes}
                        </Button>
                      </div>
                    </HackerCard>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="content-stream">
            <div className="content-stream-head">
              <div className="content-toolbar">
                <h2 className="content-heading" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', margin: 0, textTransform: 'uppercase' }}>
                  &gt; {t('home.goat_builders')}
                </h2>
                <span className="toolbar-spacer" aria-hidden="true" />
              </div>
              <div className="divider-dashed content-divider"></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }} className="content-column-list">
              {initialBuilders.map((builder) => (
                <Link key={builder.id} href={`/profile/${builder.id}`} style={{ textDecoration: 'none' }}>
                  <HackerCard className="stream-card" style={{ padding: 'var(--sp-3)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                      <div
                        style={{
                          ...getAvatarFallbackStyle(builder.id, '44px'),
                          border: '2px solid var(--brand-coral)',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-hero)', fontSize: '15px', color: 'var(--text-main)' }}>{builder.display_name}</h4>
                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.45 }}>{builder.bio}</p>
                        <div style={{ display: 'flex', gap: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '10px', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--brand-green)' }}>{builder.total_work_count} {t('profile.projects')}</span>
                          <span style={{ color: 'var(--brand-coral)' }}>{builder.total_award_count} {t('profile.awards')}</span>
                        </div>
                      </div>
                    </div>
                  </HackerCard>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 769px) {
          .content-shell {
            height: calc(100vh - 72px);
            padding-top: var(--sp-5) !important;
            padding-bottom: var(--sp-5) !important;
          }
          .content-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            height: 100%;
            align-items: stretch;
            gap: var(--sp-4);
          }
          .hero-title {
            font-size: var(--text-display) !important;
          }
          .metrics-dashboard {
            width: max-content !important;
          }
          .content-heading {
            font-size: clamp(28px, 1.9vw, var(--text-h2)) !important;
            line-height: 1.05;
            word-break: keep-all;
          }
          .content-stream-head {
            display: flex;
            flex-direction: column;
            gap: var(--sp-4);
            margin-bottom: var(--sp-5);
          }
          .content-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: var(--sp-3);
            min-height: 42px;
          }
          .content-divider {
            margin: 0;
          }
          .content-stream {
            min-height: 0;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: var(--sp-4);
            border: 1px solid var(--border-base);
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 22%),
              linear-gradient(135deg, rgba(255, 122, 24, 0.08), rgba(0, 255, 65, 0.03));
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }
          .content-column-list {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding-right: 6px;
            scrollbar-width: thin;
          }
          .toolbar-spacer {
            display: inline-block;
            min-width: 84px;
            height: 32px;
            opacity: 0;
            pointer-events: none;
          }
          .stream-card {
            min-height: 0;
          }
          .stream-hackathon {
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: var(--sp-6);
          }
          .content-shell {
            height: auto;
          }
          .content-stream-head {
            margin-bottom: var(--sp-5);
          }
          .content-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: var(--sp-3);
            margin-bottom: var(--sp-4);
          }
          .content-divider {
            margin: 0;
          }
          .content-column-list {
            overflow: visible;
          }
          .content-stream {
            padding: 0;
            border: none;
            background: transparent;
            box-shadow: none;
          }
        }
      `}</style>
    </main>
  );
}
