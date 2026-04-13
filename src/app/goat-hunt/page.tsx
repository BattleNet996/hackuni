'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackerCard } from '@/components/ui/HackerCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLike } from '@/contexts/LikeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Project {
  id: string;
  title: string;
  short_desc: string;
  rank_score: number;
  is_awarded: boolean;
  award_text?: string;
  team_member_text: string;
  like_count: number;
  tags_json: string | string[];
}

export default function GoatHuntPage() {
  const { t, language } = useLanguage();
  const { isProjectLiked, toggleLikeProject, getProjectLikes } = useLike();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Fetch awarded projects only
        const res = await fetch('/api/projects?awarded=true');
        const data = await res.json();
        if (data.data) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
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

  if (isLoading) {
    return (
      <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)' }}>Loading awarded projects...</p>
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
        {projects.map((proj, index) => (
          <HackerCard key={proj.id} className="responsive-flex-col desktop-row" style={{ alignItems: 'center', gap: 'var(--sp-5)' }}>
            <div style={{ fontFamily: 'var(--font-hero)', fontSize: '48px', color: 'var(--text-disabled)', width: '60px', textAlign: 'center' }}>
              #{index + 1}
            </div>

            <div style={{
              width: '80px', height: '80px',
              background: `url(https://picsum.photos/seed/${proj.id}_icon/160/160) center/cover`,
              border: '1px solid var(--border-base)', flexShrink: 0,
              filter: 'grayscale(80%)'
            }}>
            </div>

            <div style={{ flex: 1 }}>
              <Link href={`/goat-hunt/${proj.id}`}>
                <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-hero)', fontSize: '24px', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  {proj.title}
                  {proj.is_awarded && <Badge type="award" label={proj.award_text || 'Awarded'} />}
                </h3>
              </Link>
              <p style={{ margin: '0 0 var(--sp-2) 0', color: 'var(--text-muted)' }}>{proj.short_desc}</p>

              <div style={{ display: 'flex', gap: 'var(--sp-3)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                <span style={{ color: 'var(--brand-coral)' }}>
                  ♥ {getProjectLikes(proj.id)} likes
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  Team: {proj.team_member_text || 'N/A'}
                </span>
              </div>

              <div style={{ marginTop: 'var(--sp-3)', display: 'flex', gap: 'var(--sp-2)' }}>
                {ensureTagsArray(proj.tags_json).slice(0, 3).map(tag => (
                  <Badge key={tag} type="tech" label={tag} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLikeProject(proj.id)}
                style={{ color: isProjectLiked(proj.id) ? 'var(--brand-coral)' : 'var(--text-muted)' }}
              >
                {isProjectLiked(proj.id) ? '♥ Liked' : '♡ Like'}
              </Button>
              <Link href={`/goat-hunt/${proj.id}`}>
                <Button variant="primary" size="sm">
                  View Details →
                </Button>
              </Link>
            </div>
          </HackerCard>
        ))}
      </div>

      {projects.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>No awarded projects yet.</p>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
            Be the first to publish an award-winning project!
          </p>
        </div>
      )}
    </main>
  );
}
