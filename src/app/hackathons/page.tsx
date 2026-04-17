'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackerCard } from '@/components/ui/HackerCard';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchJsonWithCache, getCachedJson, prefetchJsonWithCache } from '@/lib/client-cache';

interface Hackathon {
  id: string;
  title: string;
  short_desc: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  level_score: string;
  level_code: string;
  registration_status: string;
  registration_url: string;
  tags_json: string | string[];
  start_time: string;
}

const posterPalettes = [
  {
    base: 'linear-gradient(135deg, #ff7a18 0%, #24120b 46%, #00ff41 100%)',
    glow: 'radial-gradient(circle at 28% 20%, rgba(255,255,255,0.34), transparent 30%)',
  },
  {
    base: 'linear-gradient(145deg, #0a1b2f 0%, #123b4a 42%, #f5c84b 100%)',
    glow: 'radial-gradient(circle at 78% 18%, rgba(255,255,255,0.28), transparent 28%)',
  },
  {
    base: 'linear-gradient(150deg, #101010 0%, #3b1d11 45%, #ff4f2e 100%)',
    glow: 'radial-gradient(circle at 22% 82%, rgba(255,255,255,0.22), transparent 34%)',
  },
  {
    base: 'linear-gradient(135deg, #07171a 0%, #164e45 48%, #a7f070 100%)',
    glow: 'radial-gradient(circle at 72% 74%, rgba(255,255,255,0.24), transparent 32%)',
  },
];

function getPosterPalette(id: string) {
  const hash = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return posterPalettes[hash % posterPalettes.length];
}

function getPosterInitials(title: string) {
  const cleanTitle = title.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const parts = cleanTitle.split(/\s+/).filter(Boolean);

  if (parts.length >= 2 && /^[a-z0-9]+$/i.test(parts[0])) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return cleanTitle.slice(0, 2).toUpperCase() || 'HX';
}

interface HackathonListResponse {
  data: Hackathon[];
}

export default function HackathonsPage() {
  const { t } = useLanguage();
  const cacheKey = '/api/hackathons';
  const cachedResponse = React.useMemo(() => getCachedJson<HackathonListResponse>(cacheKey), [cacheKey]);
  const [hackathons, setHackathons] = useState<Hackathon[]>(cachedResponse?.data || []);
  const [isLoading, setIsLoading] = useState(!cachedResponse);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchHackathons() {
      try {
        const data = await fetchJsonWithCache<HackathonListResponse>(cacheKey);
        if (isActive && data.data) {
          setHackathons(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch hackathons:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void fetchHackathons();

    return () => {
      isActive = false;
    };
  }, [cacheKey]);

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

  // Get all unique tags
  const allTags = Array.from(new Set(hackathons.flatMap(h => ensureTagsArray(h.tags_json))));

  // Filter hackathons by tag
  const filteredHackathons = filterTag
    ? hackathons.filter(h => ensureTagsArray(h.tags_json).includes(filterTag))
    : hackathons;

  if (isLoading) {
    return (
      <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)' }}>Loading hackathons...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-6)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0, textTransform: 'uppercase' }}>
            &gt; Hackathon_Ops
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
            Find your next battleground.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          <Tag
            label="#All"
            className="status-verified"
            style={{ background: filterTag === null ? 'var(--brand-coral)' : 'transparent', cursor: 'pointer' }}
            onClick={() => setFilterTag(null)}
          />
          {allTags.slice(0, 5).map(tag => (
            <Tag
              key={tag}
              label={`#${tag}`}
              style={{ background: filterTag === tag ? 'var(--brand-coral)' : 'transparent', cursor: 'pointer' }}
              onClick={() => setFilterTag(tag)}
            />
          ))}
        </div>
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        {filteredHackathons.map((hack, index) => {
          const posterPalette = getPosterPalette(hack.id);
          const primaryTag = ensureTagsArray(hack.tags_json)[0] || '#HACK';
          const posterInitials = getPosterInitials(hack.title);

          return (
          <HackerCard key={hack.id} className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-5)' }}>
            <div
              aria-label={`${hack.title} poster`}
              style={{
                width: '200px',
                height: '200px',
                background: `${posterPalette.glow}, ${posterPalette.base}`,
                border: '1px solid var(--border-base)',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
                opacity: 0.35,
              }} />
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                right: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '10px',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.78)',
              }}>
                <span>HACK_OP</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div style={{
                position: 'absolute',
                left: '16px',
                right: '16px',
                top: '54px',
                fontFamily: 'var(--font-hero)',
                fontSize: posterInitials.length > 2 ? '42px' : '58px',
                lineHeight: 0.88,
                letterSpacing: '-0.05em',
                textShadow: '4px 4px 0 rgba(0,0,0,0.28)',
              }}>
                {posterInitials}
              </div>
              <div style={{
                position: 'absolute',
                left: '16px',
                right: '16px',
                bottom: '44px',
                fontSize: '11px',
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.86)',
                textTransform: 'uppercase',
              }}>
                {primaryTag.replace(/^#/, '')}
              </div>
              <div style={{
                position: 'absolute',
                left: '16px',
                right: '16px',
                bottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.72)',
              }}>
                <span>{hack.city || 'GLOBAL'}</span>
                <span>{new Date(hack.start_time).getFullYear() || '2026'}</span>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Link href={`/hackathons/${hack.id}`} onMouseEnter={() => prefetchJsonWithCache(`/api/hackathons/${hack.id}`)}>
                  <h2 style={{ margin: '0 0 var(--sp-2) 0', fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', cursor: 'pointer' }}>
                    {hack.title}
                  </h2>
                </Link>
                {hack.level_score && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--brand-coral)' }}>{hack.level_score}</div>
                    {hack.level_code && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>Class: {hack.level_code}</div>
                    )}
                  </div>
                )}
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: 'var(--text-body)', margin: '0 0 var(--sp-4) 0', maxWidth: '80%' }}>
                {hack.short_desc}
              </p>

              <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                {ensureTagsArray(hack.tags_json).map(t => <Tag key={t} label={t} />)}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>&gt; LOC: {hack.city}, {hack.country}</span><br/>
                  <span>&gt; TIME: {new Date(hack.start_time).toLocaleDateString()}</span>
                </div>
                <div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    marginRight: 'var(--sp-4)',
                    color: hack.registration_status === '报名中' ? 'var(--brand-coral)' : 'var(--text-disabled)'
                  }}>
                    {hack.registration_status || 'Closed'}
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => window.open(hack.registration_url || '#', '_blank')}
                  >
                    Register &gt;
                  </Button>
                </div>
              </div>
            </div>
          </HackerCard>
        )})}
      </div>

      {filteredHackathons.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>No hackathons found.</p>
        </div>
      )}
    </main>
  );
}
