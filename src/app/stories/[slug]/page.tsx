'use client';
import React from 'react';
import Link from 'next/link';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLike } from '@/contexts/LikeContext';
import { useComment } from '@/contexts/CommentContext';
import { useAuth } from '@/contexts/AuthContext';

interface StoryDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string | null;
  source: string | null;
  source_url: string | null;
  author_name: string;
  tags_json: string[];
  published_at: string;
  like_count?: number;
}

interface StoryComment {
  id: string;
  author_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
}

export default function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { isStoryLiked, toggleLikeStory, getStoryLikes } = useLike();
  const { getStoryComments, addComment } = useComment();
  const [story, setStory] = React.useState<StoryDetail | null>(null);
  const [comments, setComments] = React.useState<StoryComment[]>([]);
  const [commentText, setCommentText] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isActive = true;

    void params.then(async ({ slug }) => {
      try {
        const response = await fetch(`/api/stories/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to fetch story');
        }

        if (!isActive) return;

        setStory(data.data);
        const fetchedComments = await getStoryComments(data.data.id);
        if (isActive) {
          setComments([...(fetchedComments as StoryComment[])]);
        }
      } catch (error) {
        console.error('Failed to fetch story detail:', error);
        if (isActive) {
          setStory(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, [getStoryComments, params]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!story || !commentText.trim()) return;

    if (!user) {
      alert(language === 'zh' ? '请先登录后再评论' : 'Please login before commenting');
      return;
    }

    try {
      await addComment({
        story_id: story.id,
        content: commentText.trim(),
      });
      const updatedComments = await getStoryComments(story.id);
      setComments([...(updatedComments as StoryComment[])]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert(language === 'zh' ? '评论提交失败，请稍后再试' : 'Failed to submit comment');
    }
  };

  if (loading) {
    return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; LOADING_STORY...</main>;
  }

  if (!story) {
    return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; ERROR_404_NOT_FOUND_</main>;
  }

  const storyLikes = getStoryLikes(story.id) ?? story.like_count ?? 0;

  return (
    <main>
      <div style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-base)',
        padding: 'var(--sp-8) var(--sp-6)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
            {story.tags_json.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: '0 0 var(--sp-4) 0', lineHeight: 1.1 }}>
            {story.title}
          </h1>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: `url(https://picsum.photos/seed/${story.author_name}/64/64) center/cover`,
                borderRadius: 'var(--radius-sm)'
              }} />
              <span>{t('stories.by')}: @{story.author_name.replace(/\s+/g, '_').toUpperCase()}</span>
            </div>
            <span>&gt; {new Date(story.published_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '900px', margin: '0 auto' }}>
        <div className="divider-dashed" style={{ margin: 'var(--sp-6) 0' }} />

        {story.source && (
          <div style={{
            marginBottom: 'var(--sp-6)',
            padding: 'var(--sp-4)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              // SOURCE
            </div>
            {story.source_url ? (
              <a
                href={story.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-coral)', textDecoration: 'none', fontSize: '14px' }}
              >
                {story.source} ↗
              </a>
            ) : (
              <div style={{ color: 'var(--text-main)', fontSize: '14px' }}>{story.source}</div>
            )}
          </div>
        )}

        <article style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.8, color: 'var(--text-main)' }}>
          <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: 'var(--sp-5)' }}>
            {story.summary}
          </p>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {story.content || story.summary}
          </div>
        </article>

        <div className="divider-dashed" style={{ margin: 'var(--sp-8) 0 var(--sp-5)' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)', flexWrap: 'wrap' }}>
          <Button
            variant={isStoryLiked(story.id) ? 'upvote-active' : 'upvote'}
            onClick={() => toggleLikeStory(story.id)}
            style={{ cursor: 'pointer' }}
          >
            ▲ {storyLikes} {t('stories.opinions')}
          </Button>
          <Button
            variant="ghost"
            onClick={handleShare}
            style={{ cursor: 'pointer' }}
          >
            {copied ? (language === 'zh' ? '链接已复制 ✓' : 'Link copied ✓') : t('common.share')}
          </Button>
        </div>

        <div>
          <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginBottom: 'var(--sp-4)' }}>
            {t('stories.comments')} ({comments.length})
          </h3>

          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder={language === 'zh' ? '分享你的想法...' : 'Share your thoughts...'}
              style={{
                width: '100%',
                minHeight: '100px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--sp-3)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--text-main)',
                resize: 'vertical'
              }}
            />
            <div style={{ marginTop: 'var(--sp-2)', textAlign: 'right' }}>
              <Button
                variant="primary"
                onClick={handleSubmitComment}
                style={{ cursor: 'pointer' }}
                disabled={!commentText.trim()}
              >
                {t('common.submit')}
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {comments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--sp-8)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px'
              }}>
                {language === 'zh' ? '暂无评论，成为第一个评论者！' : 'No comments yet. Be the first to comment!'}
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-base)',
                  padding: 'var(--sp-4)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `url(https://picsum.photos/seed/${comment.author_id || comment.author_name}/80/80) center/cover`,
                      borderRadius: '50%',
                      border: '1px solid var(--border-base)',
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
                        {comment.author_id ? (
                          <Link href={`/profile/${comment.author_id}`} style={{ textDecoration: 'none' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--brand-coral)' }}>
                              @{comment.author_name}
                            </span>
                          </Link>
                        ) : (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--brand-coral)' }}>
                            @{comment.author_name}
                          </span>
                        )}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-main)' }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
