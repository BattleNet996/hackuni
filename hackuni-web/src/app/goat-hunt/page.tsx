'use client';
import React from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS } from '@/data/mock';
import { HackerCard } from '@/components/ui/HackerCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLike } from '@/contexts/LikeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GoatHuntPage() {
  const { t, language } = useLanguage();
  const { isProjectLiked, toggleLikeProject, getProjectLikes } = useLike();

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
        {MOCK_PROJECTS.map(proj => (
          <HackerCard key={proj.id} className="responsive-flex-col desktop-row" style={{ alignItems: 'center', gap: 'var(--sp-5)' }}>
            <div style={{ fontFamily: 'var(--font-hero)', fontSize: '48px', color: 'var(--text-disabled)', width: '60px', textAlign: 'center' }}>
              #{proj.rank_score}
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
                  {proj.is_awarded && <Badge type="award" label={proj.award_text} />}
                </h3>
              </Link>
              <p style={{ margin: '0 0 var(--sp-2) 0', color: 'var(--text-muted)' }}>{proj.short_desc}</p>
              
              <div style={{ display: 'flex', gap: 'var(--sp-3)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                <span style={{ color: 'var(--brand-coral)' }}>{proj.team_member_text}</span>
                <span className="divider-dashed" style={{ borderLeft: '1px dashed var(--border-base)', height: '14px', width: '1px' }}></span>
                <span style={{ color: 'var(--text-muted)' }}>{proj.tags_json.join(' ')}</span>
              </div>
            </div>
            
            <div>
              <Button
                variant={isProjectLiked(proj.id) ? 'upvote-active' : 'upvote'}
                onClick={() => toggleLikeProject(proj.id)}
                style={{ padding: '16px 24px', fontSize: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '24px', lineHeight: 1 }}>▲</span>
                <span style={{ marginTop: 'var(--sp-1)' }}>{getProjectLikes(proj.id)}</span>
              </Button>
            </div>
          </HackerCard>
        ))}
      </div>
    </main>
  );
}
