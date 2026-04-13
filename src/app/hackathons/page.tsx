'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackerCard } from '@/components/ui/HackerCard';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function HackathonsPage() {
  const { t } = useLanguage();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHackathons() {
      try {
        const res = await fetch('/api/hackathons');
        const data = await res.json();
        if (data.data) {
          setHackathons(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch hackathons:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathons();
  }, []);

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
        {filteredHackathons.map(hack => (
          <HackerCard key={hack.id} className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-5)' }}>
            <div style={{
              width: '200px',
              height: '200px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-base)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-disabled)',
              fontFamily: 'var(--font-mono)'
            }}>
              [POSTER_IMAGE]
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Link href={`/hackathons/${hack.id}`}>
                  <h2 style={{ margin: '0 0 var(--sp-2) 0', fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', cursor: 'pointer' }}>
                    {hack.title}
                  </h2>
                </Link>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--brand-coral)' }}>{hack.level_score}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>Class: {hack.level_code}</div>
                </div>
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
        ))}
      </div>

      {filteredHackathons.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>No hackathons found.</p>
        </div>
      )}
    </main>
  );
}
