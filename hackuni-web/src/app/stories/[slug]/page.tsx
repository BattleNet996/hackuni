'use client';
import React from 'react';
import Link from 'next/link';
import { MOCK_STORIES, MOCK_BUILDERS } from '@/data/mock';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLike } from '@/contexts/LikeContext';

export default function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t, language } = useLanguage();
  const { isStoryLiked, toggleLikeStory, getStoryLikes } = useLike();
  const [story, setStory] = React.useState<any>(null);
  const [comments, setComments] = React.useState<any[]>([]);
  const [commentText, setCommentText] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    params.then(resolvedParams => {
      const foundStory = MOCK_STORIES.find(s => s.slug === resolvedParams.slug);
      setStory(foundStory);
      if (foundStory) {
        // Mock comments
        setComments([
          {
            id: 1,
            author: MOCK_BUILDERS[0],
            content: language === 'zh' ? "很棒的见解！真的激励我参加下一个黑客松。" : "Great insights! Really inspired me to join the next hackathon.",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            author: MOCK_BUILDERS[1],
            content: language === 'zh' ? "这正是我今天需要读的。继续加油！" : "This is exactly what I needed to read today. Keep it up!",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    });
  }, [params, language]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: {
        id: 'current-user',
        display_name: language === 'zh' ? '当前用户' : 'Current User',
      },
      content: commentText,
      created_at: new Date().toISOString(),
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  if (!story) return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; ERROR_404_NOT_FOUND_</main>;

  return (
    <main>
      {/* Hero Section */}
      <div style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-base)',
        padding: 'var(--sp-8) var(--sp-6)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
            {story.tags_json.map((tag: string) => (
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
              }}></div>
              <span>{t('stories.by')}: @{story.author_name.replace(' ', '_').toUpperCase()}</span>
            </div>
            <span>&gt; {new Date(story.published_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '900px', margin: '0 auto' }}>
        <div className="divider-dashed" style={{ margin: 'var(--sp-6) 0' }}></div>

        {/* Source attribution */}
        {story && story.source && (
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
            <a
              href={story.source_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                color: 'var(--brand-coral)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-green)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--brand-coral)'}
            >
              <span>📄</span>
              <span>{story.source}</span>
              <span>↗</span>
            </a>
          </div>
        )}

        {/* Article Content */}
        <article style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.8, color: 'var(--text-main)' }}>
          <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: 'var(--sp-5)' }}>
            {story.summary}
          </p>

          <p>
            {language === 'zh'
              ? '我们着手构建一个不仅仅是聚合数据的平台，而是真正提供黑客会欣赏的"氛围"的平台。传统平台感觉像电子表格。我们希望我们的感觉像一个地下终端。'
              : 'We set out to build a platform that didn\'t just aggregate data, but actually provided a <em>vibe</em> that hackers would appreciate. Traditional platforms feel like spreadsheets. We wanted ours to feel like an underground terminal.'}
          </p>

          {/* Simulated Quote */}
          <blockquote style={{
            margin: 'var(--sp-5) 0',
            paddingLeft: 'var(--sp-4)',
            borderLeft: '4px solid var(--brand-coral)',
            color: 'var(--text-main)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-body)'
          }}>
            "{language === 'zh'
              ? '这个时代同样惩罚所有平庸的人。如果你不突破，你就会被抛在后面。'
              : 'This era equally penalizes everyone who is mediocre. If you don\'t break out, you get left behind.'}"
            {' '}&mdash; <em>AttraX Manifesto</em>
          </blockquote>

          <p>
            {language === 'zh'
              ? '技术栈相对简单：Next.js App Router 用于渲染，纯CSS用于对间距和排版进行绝对细粒度的控制，React Three Fiber 用于将WebGL星图带回家。'
              : 'The stack was relatively straightforward: Next.js App Router for rendering, plain CSS for that absolute granular control over spacing and typography, and React Three Fiber to bring the WebGL star-map home.'}
          </p>

          {/* Simulated Code Block */}
          <pre style={{
            background: 'var(--bg-elevated)',
            padding: 'var(--sp-4)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-base)',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--brand-green)',
            overflowX: 'auto',
            marginTop: 'var(--sp-5)'
          }}>
            <code>
{`function WeEngineerTheUnnecessary() {
  const isOutlier = assessBuilder();
  if (isOutlier) {
    ignite(true);
  }
  return <CyberpunkGarage />;
}`}
            </code>
          </pre>

          <p>
            {language === 'zh'
              ? '经过48小时的不间断编码、能量饮料和创意突破，我们出现了一个真正代表在今天的技术格局中成为异类意味着什么的平台。'
              : 'After 48 hours of non-stop coding, energy drinks, and creative breakthroughs, we emerged with a platform that truly represents what it means to be an outlier in today\'s tech landscape.'}
          </p>

          <p>
            {language === 'zh'
              ? '这段旅程并不容易。我们在实时数据同步、3D渲染性能以及创建平衡赛博朋克美学和可用性的设计系统方面面临挑战。但每一个障碍都是创新的机会。'
              : 'The journey wasn\'t easy. We faced challenges with real-time data synchronization, 3D rendering performance, and creating a design system that balances cyberpunk aesthetics with usability. But every obstacle was an opportunity to innovate.'}
          </p>
        </article>

        <div className="divider-dashed" style={{ margin: 'var(--sp-8) 0 var(--sp-5)' }}></div>

        {/* Engagement Section */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)', flexWrap: 'wrap' }}>
          <Button
            variant={isStoryLiked(story.id) ? 'upvote-active' : 'upvote'}
            onClick={() => toggleLikeStory(story.id)}
            style={{ cursor: 'pointer' }}
          >
            ▲ {getStoryLikes(story.id)} {t('stories.opinions')}
          </Button>
          <Button
            variant="ghost"
            onClick={handleShare}
            style={{ cursor: 'pointer' }}
          >
            {copied ? (language === 'zh' ? '链接已复制 ✓' : 'Link copied ✓') : t('common.share')}
          </Button>
        </div>

        {/* Comments Section */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginBottom: 'var(--sp-4)' }}>
            {t('stories.comments')} ({comments.length})
          </h3>

          {/* Comment Input */}
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
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
                resize: 'vertical',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-coral)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-base)'}
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

          {/* Comments List */}
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
              comments.map(comment => (
                <div key={comment.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-base)',
                  padding: 'var(--sp-4)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.2s ease'
                }}
                  className="hover-color"
                >
                  <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `url(https://picsum.photos/seed/${comment.author.id}/80/80) center/cover`,
                      borderRadius: '50%',
                      border: '1px solid var(--border-base)',
                      flexShrink: 0
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
                        <Link href={`/profile/${comment.author.id}`} style={{ textDecoration: 'none' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--brand-coral)', transition: 'color 0.2s ease' }}
                            className="hover-color"
                          >
                            @{comment.author.display_name}
                          </span>
                        </Link>
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
