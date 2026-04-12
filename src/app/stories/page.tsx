'use client';
import React from 'react';
import Link from 'next/link';
import { MOCK_STORIES } from '@/data/mock';
import { HackerCard } from '@/components/ui/HackerCard';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLike } from '@/contexts/LikeContext';
import { ensureTagsArray } from '@/lib/utils/data';

export default function StoriesPage() {
  const { t, language } = useLanguage();
  const { isStoryLiked, toggleLikeStory, getStoryLikes } = useLike();
  const [filterTag, setFilterTag] = React.useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(MOCK_STORIES.flatMap(s => s.tags_json)));

  // Filter stories by tag
  const filteredStories = filterTag
    ? MOCK_STORIES.filter(story => story.tags_json.includes(filterTag))
    : MOCK_STORIES;

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0, textTransform: 'uppercase' }}>
          &gt; {t('stories.title')}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
          {t('stories.subtitle')}
        </p>
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

      {/* Filter Tags */}
      {allTags.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-6)', display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginRight: 'var(--sp-2)' }}>
            // FILTER:
          </span>
          <button
            onClick={() => setFilterTag(null)}
            style={{
              background: filterTag === null ? 'var(--brand-coral)' : 'transparent',
              color: filterTag === null ? '#fff' : 'var(--text-muted)',
              border: filterTag === null ? 'none' : '1px solid var(--border-base)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s ease'
            }}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              style={{
                background: filterTag === tag ? 'var(--brand-coral)' : 'transparent',
                color: filterTag === tag ? '#fff' : 'var(--text-muted)',
                border: filterTag === tag ? 'none' : '1px solid var(--border-base)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s ease'
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Stories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        {filteredStories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            No stories found for this filter
          </div>
        ) : (
          filteredStories.map(story => (
            <HackerCard key={story.id} className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-5)' }}>
              <div style={{
                width: '180px',
                height: '120px',
                background: `url(https://picsum.photos/seed/${story.id}/360/240) center/cover`,
                border: '1px solid var(--border-base)',
                filter: 'grayscale(100%)',
                transition: 'filter 0.3s ease'
              }}
                className="hover-grayscale"
              >
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-green)', marginBottom: 'var(--sp-2)' }}>
                  {new Date(story.published_at).toLocaleDateString()} / {t('stories.by')} @{story.author_name.replace(' ', '_').toUpperCase()}
                </div>

                <Link href={`/stories/${story.slug}`} style={{ textDecoration: 'none' }}>
                  <h2 style={{
                    margin: '0 0 var(--sp-2) 0',
                    fontFamily: 'var(--font-hero)',
                    fontSize: 'var(--text-h2)',
                    color: 'var(--text-main)',
                    transition: 'color 0.2s ease'
                  }}
                    className="hover-color"
                  >
                    {story.title}
                  </h2>
                </Link>

                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-body)', margin: '0 0 var(--sp-3) 0', lineHeight: '1.6' }}>
                  {story.summary}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--sp-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  {ensureTagsArray(story.tags_json).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <Tag label={tag} />
                    </button>
                  ))}
                  <Button
                    variant={isStoryLiked(story.id) ? 'upvote-active' : 'upvote'}
                    onClick={() => toggleLikeStory(story.id)}
                    style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ▲ {getStoryLikes(story.id)}
                  </Button>
                </div>

                {/* Source attribution */}
                {(story as any).source && (
                  <div style={{ marginTop: 'var(--sp-2)', paddingTop: 'var(--sp-2)', borderTop: '1px dashed var(--border-base)' }}>
                    <a
                      href={(story as any).source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--brand-coral)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'color 0.2s ease'
                      }}
                      className="hover-color"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-green)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--brand-coral)'}
                    >
                      <span>📄</span>
                      <span>{(story as any).source}</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>
            </HackerCard>
          ))
        )}
      </div>

      {/* CTA Section */}
      <div style={{
        marginTop: 'var(--sp-8)',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--brand-coral)',
        padding: 'var(--sp-6)',
        textAlign: 'center',
        borderRadius: 'var(--radius-sm)'
      }}>
        <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', margin: '0 0 var(--sp-3) 0' }}>
          {t('stories.share_your_thoughts')}?
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--sp-4)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          {language === 'zh' ? '分享你的黑客松经历、项目复盘或技术见解，与社区成员交流' : 'Share your hackathon experiences, project recaps, or technical insights with the community'}
        </p>
      </div>
    </main>
  );
}
