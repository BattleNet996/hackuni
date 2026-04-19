'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackerCard } from '@/components/ui/HackerCard';
import { Tag, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLike } from '@/contexts/LikeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchJsonWithCache, getCachedJson, prefetchJsonWithCache } from '@/lib/client-cache';
import { getPosterSurfaceStyle } from '@/lib/ui/fallback-visuals';

interface Project {
  id: string;
  title: string;
  short_desc: string;
  is_awarded: boolean;
  award_text?: string;
  team_member_text: string;
  like_count: number;
  tags_json: string | string[];
  created_at?: string;
}

interface ProjectListResponse {
  data: Project[];
}

export default function GoatHuntPage() {
  const { t } = useLanguage();
  const { isProjectLiked, toggleLikeProject, getProjectLikes } = useLike();
  const cacheKey = '/api/projects?sort=goat';
  const cachedResponse = React.useMemo(() => getCachedJson<ProjectListResponse>(cacheKey), [cacheKey]);
  const [projects, setProjects] = useState<Project[]>(cachedResponse?.data || []);
  const [isLoading, setIsLoading] = useState(!cachedResponse);

  useEffect(() => {
    let isActive = true;

    async function fetchProjects() {
      try {
        const data = await fetchJsonWithCache<ProjectListResponse>(cacheKey);
        if (isActive && data.data) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void fetchProjects();

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

  if (isLoading) {
    return (
      <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)' }}>Loading projects...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: '64px', margin: 0, textTransform: 'uppercase' }}>
          {t('goat_hunt.title')}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
          {t('goat_hunt.subtitle')}
        </p>
        <div style={{ marginTop: 'var(--sp-4)' }}>
          <Link href="/publish">
            <Button variant="primary" style={{ cursor: 'pointer' }}>
              + {t('goat_hunt.publish_project')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {projects.map((proj, index) => {
          const projectLikes = getProjectLikes(proj.id) ?? proj.like_count ?? 0;

          return (
          <HackerCard key={proj.id} style={{ padding: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(34px, 4vw, 48px)', color: 'var(--text-disabled)', width: '96px', minWidth: '96px', textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1 }}>
                  #{index + 1}
                </div>
                <div style={{
                  ...getPosterSurfaceStyle(proj.id, { width: '80px', height: '80px' }),
                  flexShrink: 0,
                  filter: 'grayscale(80%)'
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/goat-hunt/${proj.id}`} onMouseEnter={() => prefetchJsonWithCache(`/api/projects/${proj.id}`)}>
                    <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-hero)', fontSize: '24px', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                      {proj.title}
                      {proj.is_awarded && <Badge type="award" label={proj.award_text || 'Awarded'} />}
                    </h3>
                  </Link>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <Button
                  variant="ghost"
                  onClick={() => toggleLikeProject(proj.id)}
                  style={{
                    color: isProjectLiked(proj.id) ? 'var(--brand-coral)' : 'var(--text-muted)',
                    padding: 'var(--sp-1) var(--sp-2)'
                  }}
                >
                  {isProjectLiked(proj.id) ? '♥' : '♡'} {projectLikes}
                </Button>
              </div>
            </div>

            <p style={{ margin: '0 0 var(--sp-3) 0', color: 'var(--text-muted)', lineHeight: 1.6 }}>{proj.short_desc}</p>

            <div style={{ display: 'flex', gap: 'var(--sp-3)', fontFamily: 'var(--font-mono)', fontSize: '13px', flexWrap: 'wrap', marginBottom: 'var(--sp-3)' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Team: {proj.team_member_text || 'N/A'}
              </span>
              {proj.created_at && (
                <span style={{ color: 'var(--text-muted)' }}>
                  {new Date(proj.created_at).toLocaleDateString()}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-base)', paddingTop: 'var(--sp-3)', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                {ensureTagsArray(proj.tags_json).slice(0, 3).map(tag => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
              <Link href={`/goat-hunt/${proj.id}`} onMouseEnter={() => prefetchJsonWithCache(`/api/projects/${proj.id}`)}>
                <Button variant="primary">
                  View Details →
                </Button>
              </Link>
            </div>
          </HackerCard>
        )})}
      </div>

      {projects.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>No projects yet.</p>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
            Publish something weird and ship it here.
          </p>
        </div>
      )}
    </main>
  );
}
