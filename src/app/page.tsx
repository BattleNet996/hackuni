'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThreeGlobe } from '../components/ThreeGlobe';
import { Button } from '../components/ui/Button';
import { HackerCard } from '../components/ui/HackerCard';
import { Tag, Badge } from '../components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLike } from '@/contexts/LikeContext';

// Types
interface Hackathon {
  id: string;
  title: string;
  short_desc: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  level_score: number;
  registration_status: string;
  tags_json: string | string[];
}

interface Project {
  id: string;
  title: string;
  short_desc: string;
  team_member_text: string;
  is_awarded: boolean;
  award_text?: string;
  rank_score: number;
}

interface Builder {
  id: string;
  display_name: string;
  bio: string;
  total_work_count: number;
  total_award_count: number;
}

interface Stats {
  buildersConnected: number;
  projectsShipped: number;
  citiesCovered: number;
  badgesEarned: number;
}

// Helper function to ensure tags_json is always an array
const ensureTagsArray = (tags: any): string[] => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function Home() {
  const { t } = useLanguage();
  const { isProjectLiked, toggleLikeProject, getProjectLikes } = useLike();

  // State for real data
  const [stats, setStats] = useState<Stats>({
    buildersConnected: 0,
    projectsShipped: 0,
    citiesCovered: 0,
    badgesEarned: 0
  });
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [statsRes, hackRes, projRes, buildRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/hackathons?limit=6'),
          fetch('/api/projects?limit=6'),
          fetch('/api/builders?limit=6&sort=awards')
        ]);

        const statsData = await statsRes.json();
        if (statsData.data) {
          setStats(statsData.data);
        }

        const hackData = await hackRes.json();
        if (hackData.data) {
          setHackathons(hackData.data);
        }

        const projData = await projRes.json();
        if (projData.data) {
          setProjects(projData.data);
        }

        const buildData = await buildRes.json();
        if (buildData.data) {
          setBuilders(buildData.data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Prepare hackathon data for the globe
  const hackathonMarkers = hackathons.map(h => ({
    lat: h.latitude,
    lon: h.longitude,
    title: h.title,
  }));

  // Limit to 6 items each section
  const featuredHackathons = hackathons.slice(0, 6);
  const trendingProjects = projects.slice(0, 6);
  const topBuilders = builders.slice(0, 6);

  return (
    <main style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Loading State */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 60px)',
          flexDirection: 'column',
          gap: 'var(--sp-4)'
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--text-muted)'
          }}>
            {t('common.loading') || 'Loading...'}
          </div>
        </div>
      ) : (
        <>
          {/* 3D Global component moved into the Hero div specifically */}

          {/* Hero Section (100vh) */}
          <div style={{
            minHeight: 'calc(100vh - 60px)', // Minus navbar
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'var(--sp-6) var(--sp-4)',
            position: 'relative',
          }}>
            {/* The Earth positioned to the right side */}
            <ThreeGlobe hackathons={hackathonMarkers} />

            <div style={{ maxWidth: '800px', pointerEvents: 'none', position: 'relative', zIndex: 10, marginRight: 'auto' }}>
              <h1 style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'var(--text-h1)',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                textShadow: '4px 4px 0 rgba(0,0,0,0.5)'
              }} className="hero-title">
                {t('home.hero.title')}<br/>{t('home.hero.subtitle')}
              </h1>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                color: 'var(--text-main)',
                marginTop: 'var(--sp-3)',
                background: 'rgba(0,0,0,0.6)',
                display: 'inline-block',
                padding: '4px 8px'
              }}>
                {t('home.hero.tagline')}
              </p>
            </div>

            {/* Vibe Metrics Dashboard */}
            <div style={{
              marginTop: 'var(--sp-6)',
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-base)',
              padding: 'var(--sp-4)',
              width: '100%',
              maxWidth: 'max-content',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              pointerEvents: 'auto'
            }} className="metrics-dashboard">
              <div style={{ marginBottom: 'var(--sp-2)', color: 'var(--text-muted)' }}>{t('home.vibe_metrics')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'var(--sp-4)', rowGap: 'var(--sp-2)' }}>
                <div>&gt; {t('home.metrics.builders')} : <span style={{color: 'var(--brand-green)'}}>{stats.buildersConnected.toLocaleString()}</span></div>
                <div>&gt; {t('home.metrics.projects')} : <span style={{color: 'var(--brand-green)'}}>{stats.projectsShipped.toLocaleString()}</span></div>
                <div>&gt; {t('home.metrics.cities')} : <span style={{color: 'var(--brand-coral)'}}>{stats.citiesCovered.toLocaleString()}</span></div>
                <div>&gt; {t('home.metrics.badges')} : <span style={{color: 'var(--brand-coral)'}}>{stats.badgesEarned.toLocaleString()}</span></div>
              </div>
              <div style={{ marginTop: 'var(--sp-2)', color: 'var(--text-muted)' }}>
                {t('home.connection_active')} <span style={{ color: 'var(--brand-coral)', animation: 'blink-border 1s infinite' }}>█</span>
              </div>
            </div>
          </div>

          {/* Content Streams: Responsive grid layout */}
          <div style={{
            padding: 'var(--sp-6) var(--sp-4)',
            position: 'relative',
            zIndex: 10,
            background: 'var(--bg-pure)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--sp-6)' }} className="content-grid">

              {/* Left Col: Featured Hackathons */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-4)' }}>
                  <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', margin: 0, textTransform: 'uppercase' }}>
                    {t('home.featured_ops')}
                  </h2>
                  <Link href="/hackathons"><Button variant="ghost">{t('home.view_all')}</Button></Link>
                </div>
                <div className="divider-dashed" style={{ marginBottom: 'var(--sp-5)' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                  {featuredHackathons.map(hack => (
                    <Link key={hack.id} href={`/hackathons/${hack.id}`} style={{ textDecoration: 'none' }}>
                      <HackerCard className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-4)', cursor: 'pointer' }}>
                        <div style={{
                          width: '150px', height: '150px',
                          background: `url(https://picsum.photos/seed/${hack.id}/300/300) center/cover`,
                          border: '1px solid var(--border-base)', flexShrink: 0
                        }} className="hover-color">
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: '0 0 var(--sp-2) 0', fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', color: 'var(--text-main)' }}>{hack.title}</h3>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--brand-coral)' }}>{hack.level_score}</div>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-small)', margin: '0 0 var(--sp-3) 0' }}>{hack.short_desc}</p>

                          <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                            {ensureTagsArray(hack.tags_json).map(tag => <Tag key={tag} label={tag} />)}
                          </div>

                          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                            <span>{t('hackathon.location')}: {hack.city}, {hack.country}</span>
                            <span style={{ color: hack.registration_status === t('status.registration_open') ? 'var(--brand-coral)' : 'var(--text-disabled)' }}>
                              {t('hackathon.status')}: {hack.registration_status}
                            </span>
                          </div>
                        </div>
                      </HackerCard>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Middle Col: Trending Projects */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-4)' }}>
                  <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', margin: 0, textTransform: 'uppercase' }}>
                    {t('home.trending')}
                  </h2>
                  <Link href="/goat-hunt"><Button variant="ghost">{t('home.goats')}</Button></Link>
                </div>
                <div className="divider-dashed" style={{ marginBottom: 'var(--sp-5)' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                  {trendingProjects.map(proj => (
                    <Link key={proj.id} href={`/goat-hunt/${proj.id}`} style={{ textDecoration: 'none' }}>
                      <HackerCard className="responsive-flex-col desktop-row" style={{ alignItems: 'center', gap: 'var(--sp-4)', padding: 'var(--sp-3)', cursor: 'pointer' }}>
                        <div style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--text-muted)', width: '40px', textAlign: 'center' }}>
                          {proj.rank_score}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-hero)', fontSize: '18px', color: 'var(--text-main)' }}>{proj.title}</h4>
                          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-muted)' }}>{proj.short_desc}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                            <span style={{ color: 'var(--brand-coral)' }}>{proj.team_member_text}</span>
                            {proj.is_awarded && proj.award_text && <Badge type="award" label={proj.award_text} style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }} />}
                          </div>
                        </div>
                        <div style={{ pointerEvents: 'auto' }}>
                          <Button
                            variant={isProjectLiked(proj.id) ? 'upvote-active' : 'upvote'}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleLikeProject(proj.id);
                            }}
                            style={{ padding: '8px', minWidth: '50px', textAlign: 'center', cursor: 'pointer' }}
                          >
                            ▲<br/>{getProjectLikes(proj.id)}
                          </Button>
                        </div>
                      </HackerCard>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Right Col: GOAT Builders */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-4)' }}>
                  <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', margin: 0, textTransform: 'uppercase' }}>
                    &gt; {t('home.goat_builders')}
                  </h2>
                </div>
                <div className="divider-dashed" style={{ marginBottom: 'var(--sp-5)' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                  {topBuilders.map(builder => (
                    <Link key={builder.id} href={`/profile/${builder.id}`} style={{ textDecoration: 'none' }}>
                      <HackerCard style={{ padding: 'var(--sp-3)', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                          <div style={{
                            width: '50px', height: '50px',
                            background: `url(https://picsum.photos/seed/${builder.id}/100/100) center/cover`,
                            borderRadius: '50%',
                            border: '2px solid var(--brand-coral)'
                          }}></div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-hero)', fontSize: '16px', color: 'var(--text-main)' }}>{builder.display_name}</h4>
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-muted)' }}>{builder.bio}</p>
                            <div style={{ display: 'flex', gap: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
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
        </>
      )}

      {/* Responsive styles */}
      <style jsx>{`
        @media (min-width: 769px) {
          .content-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
          .hero-title {
            font-size: var(--text-display) !important;
          }
          .metrics-dashboard {
            width: max-content !important;
          }
        }
      `}</style>
    </main>
  );
}
