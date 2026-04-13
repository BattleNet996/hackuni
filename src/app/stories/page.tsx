'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackerCard } from '@/components/ui/HackerCard';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLike } from '@/contexts/LikeContext';

interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  source: string;
  source_url: string;
  author_name: string;
  tags_json: string | string[];
  published_at: string;
  like_count: number;
}

export default function StoriesPage() {
  const { t, language } = useLanguage();
  const { isStoryLiked, toggleLikeStory, getStoryLikes } = useLike();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch('/api/stories');
        const data = await res.json();
        if (data.data) {
          setStories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStories();
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
  const allTags = Array.from(new Set(stories.flatMap(s => ensureTagsArray(s.tags_json))));

  // Filter stories by tag
  const filteredStories = filterTag
    ? stories.filter(story => ensureTagsArray(story.tags_json).includes(filterTag))
    : stories;

  if (isLoading) {
    return (
      <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)' }}>Loading stories...</p>
        </div>
      </main>
    );
  }

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
        <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-6)', flexWrap: 'wrap' }}>
          <Tag
            label="#All"
            style={{ background: filterTag === null ? 'var(--brand-coral)' : 'transparent', cursor: 'pointer' }}
            onClick={() => setFilterTag(null)}
          />
          {allTags.map(tag => (
            <Tag
              key={tag}
              label={`#${tag}`}
              style={{ background: filterTag === tag ? 'var(--brand-coral)' : 'transparent', cursor: 'pointer' }}
              onClick={() => setFilterTag(tag)}
            />
          ))}
        </div>
      )}

      {/* Stories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        {filteredStories.map(story => (
          <HackerCard key={story.id} style={{ padding: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
              <Link href={`/stories/${story.slug}`} style={{ flex: 1 }}>
                <h2 style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: 'var(--text-h3)',
                  margin: 0,
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}>
                  {story.title}
                </h2>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <Button
                  variant="ghost"
                  onClick={() => toggleLikeStory(story.id)}
                  style={{
                    color: isStoryLiked(story.id) ? 'var(--brand-coral)' : 'var(--text-muted)',
                    padding: 'var(--sp-1) var(--sp-2)'
                  }}
                >
                  {isStoryLiked(story.id) ? '♥' : '♡'} {getStoryLikes(story.id)}
                </Button>
              </div>
            </div>

            <p style={{
              color: 'var(--text-muted)',
              fontSize: 'var(--text-body)',
              margin: '0 0 var(--sp-3) 0',
              lineHeight: 1.6
            }}>
              {story.summary}
            </p>

            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
              {ensureTagsArray(story.tags_json).map(tag => (
                <Tag key={tag} label={tag} />
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px dashed var(--border-base)',
              paddingTop: 'var(--sp-3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}>
              <span>By {story.author_name || story.source}</span>
              <span>{new Date(story.published_at).toLocaleDateString()}</span>
            </div>
          </HackerCard>
        ))}
      </div>

      {filteredStories.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>No stories found.</p>
        </div>
      )}
    </main>
  );
}
