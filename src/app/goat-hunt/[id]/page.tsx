'use client';
import React from 'react';
import Link from 'next/link';
import { Tag, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EditProjectDialog } from '@/components/ui/EditProjectDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLike } from '@/contexts/LikeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useComment } from '@/contexts/CommentContext';
import { ensureTagsArray } from '@/lib/utils/data';
import { fetchJsonWithCache, getCachedJson } from '@/lib/client-cache';

interface ProjectDetail {
  id: string;
  title: string;
  short_desc: string;
  long_desc: string | null;
  team_member_text: string;
  tags_json: string[];
  is_awarded: boolean;
  award_text: string | null;
  demo_url: string | null;
  github_url: string | null;
  website_url: string | null;
  images: string[];
  related_hackathon_id: string | null;
  author_id: string | null;
  status?: string;
  like_count?: number;
}

interface HackathonMini {
  id: string;
  title: string;
  city: string;
  country: string;
}

interface ProjectComment {
  id: string;
  author_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
}

interface ProjectDetailResponse {
  data: ProjectDetail;
}

interface HackathonMiniResponse {
  data: HackathonMini;
}

function parseTeamMembers(teamMemberText: string | undefined): string[] {
  if (!teamMemberText) return [];

  const withAtMentions = teamMemberText.match(/@?[^\s,]+/g);
  if (!withAtMentions) return [];

  return withAtMentions
    .map((member) => member.trim())
    .filter(Boolean);
}

export default function GoatItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage();
  const { isProjectLiked, toggleLikeProject, getProjectLikes } = useLike();
  const { user } = useAuth();
  const { getProjectComments, addComment } = useComment();
  const [project, setProject] = React.useState<ProjectDetail | null>(null);
  const [relatedHackathon, setRelatedHackathon] = React.useState<HackathonMini | null>(null);
  const [comments, setComments] = React.useState<ProjectComment[]>([]);
  const [commentText, setCommentText] = React.useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const refreshProject = React.useCallback(async (projectId: string) => {
    const projectData = await fetchJsonWithCache<ProjectDetailResponse>(`/api/projects/${projectId}`);

    const nextProject = {
      ...projectData.data,
      tags_json: ensureTagsArray(projectData.data.tags_json),
      images: Array.isArray(projectData.data.images) ? projectData.data.images : [],
    };

    setProject(nextProject);

    if (nextProject.related_hackathon_id) {
      try {
        const hackathonData = await fetchJsonWithCache<HackathonMiniResponse>(`/api/hackathons/${nextProject.related_hackathon_id}`);
        setRelatedHackathon({
          id: hackathonData.data.id,
          title: hackathonData.data.title,
          city: hackathonData.data.city,
          country: hackathonData.data.country,
        });
      } catch (error) {
        console.error('Failed to fetch related hackathon:', error);
        setRelatedHackathon(null);
      }
    } else {
      setRelatedHackathon(null);
    }

    const fetchedComments = await getProjectComments(projectId);
    setComments([...(fetchedComments as ProjectComment[])]);
  }, [getProjectComments]);

  React.useEffect(() => {
    let isActive = true;

    void params.then(async ({ id }) => {
      const cachedProject = getCachedJson<ProjectDetailResponse>(`/api/projects/${id}`);
      if (cachedProject?.data && isActive) {
        setProject({
          ...cachedProject.data,
          tags_json: ensureTagsArray(cachedProject.data.tags_json),
          images: Array.isArray(cachedProject.data.images) ? cachedProject.data.images : [],
        });
        setLoading(false);
      }

      try {
        await refreshProject(id);
      } catch (error) {
        console.error('Failed to fetch project detail:', error);
        if (isActive) {
          setProject(null);
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
  }, [params, refreshProject]);

  const handleSubmitComment = async () => {
    if (!project || !commentText.trim()) return;

    if (!user) {
      alert(language === 'zh' ? '请先登录后再评论' : 'Please login before commenting');
      return;
    }

    try {
      await addComment({
        project_id: project.id,
        content: commentText.trim(),
      });
      const updatedComments = await getProjectComments(project.id);
      setComments([...(updatedComments as ProjectComment[])]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to submit project comment:', error);
      alert(language === 'zh' ? '评论提交失败，请稍后再试' : 'Failed to submit comment');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      console.error('Failed to copy project link:', error);
    }
  };

  if (loading) {
    return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; LOADING_PROJECT...</main>;
  }

  if (!project) {
    return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; ERROR_404_NOT_FOUND_</main>;
  }

  const isOwner = user && user.id === project.author_id;
  const teamMembers = parseTeamMembers(project.team_member_text);
  const heroImage = project.images?.[0] || `https://picsum.photos/seed/${project.id}_demo/1280/720`;
  const projectLikes = getProjectLikes(project.id) ?? project.like_count ?? 0;

  return (
    <main>
      <div style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-base)',
        padding: 'var(--sp-8) var(--sp-6)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-6)', alignItems: 'center' }}>
            <div style={{
              width: '160px', height: '160px',
              background: `url(${project.images?.[0] || `https://picsum.photos/seed/${project.id}/320/320`}) center/cover`,
              border: '2px solid var(--brand-coral)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-2)', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: '48px', margin: 0 }}>
                  {project.title}
                </h1>
                {project.is_awarded && project.award_text && <Badge type="award" label={project.award_text} />}
                {project.status && project.status !== 'published' && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: project.status === 'pending' ? 'var(--brand-amber)' : 'var(--brand-coral)',
                    border: `1px solid ${project.status === 'pending' ? 'var(--brand-amber)' : 'var(--brand-coral)'}`,
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}>
                    {project.status === 'pending'
                      ? (language === 'zh' ? '待管理员审核' : 'Pending Review')
                      : (language === 'zh' ? '未通过审核' : project.status.toUpperCase())}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '20px', color: 'var(--text-muted)', margin: '0 0 var(--sp-4) 0' }}>
                {project.short_desc}
              </p>
              <div style={{ display: 'flex', gap: 'var(--sp-3)', fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
                {project.tags_json.map((tag) => <Tag key={tag} label={tag} />)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <Button
                variant={isProjectLiked(project.id) ? 'upvote-active' : 'upvote'}
                onClick={() => toggleLikeProject(project.id)}
                style={{ padding: '16px 32px', fontSize: '24px', cursor: 'pointer' }}
              >
                ▲ {projectLikes}
              </Button>
              <Button variant="primary" onClick={() => project.demo_url && window.open(project.demo_url, '_blank')} disabled={!project.demo_url}>
                {t('goat_hunt.visit_demo')}
              </Button>
              <Button variant="ghost" onClick={() => project.github_url && window.open(project.github_url, '_blank')} disabled={!project.github_url}>
                {t('goat_hunt.github')}
              </Button>
              {project.website_url && (
                <Button variant="ghost" onClick={() => project.website_url && window.open(project.website_url, '_blank')}>
                  Website
                </Button>
              )}
              {isOwner && (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditDialogOpen(true)}
                  style={{ fontSize: '14px' }}
                >
                  {language === 'zh' ? '编辑项目' : 'Edit Project'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }}>
          <section>
            <div style={{
              width: '100%', height: '400px',
              background: `url(${heroImage}) center/cover`,
              border: '1px solid var(--border-base)',
              marginBottom: 'var(--sp-6)',
              position: 'relative'
            }} />

            <div>
              <h3 className="section-title" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0 }}>{t('goat_hunt.readme')}</h3>
              <div style={{ color: 'var(--text-main)', lineHeight: 1.8, marginBottom: 'var(--sp-6)', whiteSpace: 'pre-wrap' }}>
                {project.long_desc || project.short_desc}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginBottom: 'var(--sp-4)' }}>
                {t('goat_hunt.comments')} ({comments.length})
              </h3>

              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder={t('stories.share_your_thoughts')}
                  style={{
                    width: '100%',
                    minHeight: '80px',
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
                  <Button variant="primary" onClick={handleSubmitComment} disabled={!commentText.trim()}>{t('common.submit')}</Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {comments.map((comment) => (
                  <div key={comment.id} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-base)',
                    padding: 'var(--sp-3)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                      <div style={{
                        width: '32px', height: '32px',
                        background: `url(https://picsum.photos/seed/${comment.author_id || comment.author_name}/64/64) center/cover`,
                        borderRadius: '50%',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-1)' }}>
                          {comment.author_id ? (
                            <Link href={`/profile/${comment.author_id}`} style={{ textDecoration: 'none' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-coral)' }}>
                                @{comment.author_name}
                              </span>
                            </Link>
                          ) : (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-coral)' }}>
                              @{comment.author_name}
                            </span>
                          )}
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)' }}>{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {language === 'zh' ? '还没有评论。' : 'No comments yet.'}
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside>
            <div style={{
              border: '1px solid var(--border-base)',
              padding: 'var(--sp-4)',
              background: 'var(--bg-card)',
              marginBottom: 'var(--sp-4)'
            }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', color: 'var(--text-muted)' }}>// {t('goat_hunt.the_makers')}</h4>
              {teamMembers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {teamMembers.map((member) => (
                    <div key={member} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                      padding: 'var(--sp-2)'
                    }}>
                      <div style={{
                        width: '32px', height: '32px',
                        background: `url(https://picsum.photos/seed/${member}/64/64) center/cover`,
                        borderRadius: '50%',
                        border: '1px solid var(--border-base)'
                      }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-main)' }}>{member}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'zh' ? '暂无团队成员信息' : 'No team members listed'}
                </div>
              )}

              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }} />

              <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', color: 'var(--text-muted)' }}>// {t('goat_hunt.origin_point')}</h4>
              {relatedHackathon ? (
                <Link href={`/hackathons/${relatedHackathon.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ cursor: 'pointer' }} className="hover-color">
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-coral)', fontSize: '14px', marginBottom: 'var(--sp-1)' }}>
                      &gt; {relatedHackathon.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {relatedHackathon.city}, {relatedHackathon.country}
                    </div>
                  </div>
                </Link>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'zh' ? '该项目暂未关联黑客松。' : 'No linked hackathon yet.'}
                </div>
              )}
            </div>

            {project.is_awarded && project.award_text && (
              <div style={{
                border: '1px solid var(--brand-coral)',
                padding: 'var(--sp-4)',
                background: 'rgba(245, 107, 82, 0.1)',
                marginBottom: 'var(--sp-4)'
              }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-2) 0', color: 'var(--brand-coral)' }}>// {t('goat_hunt.award_won')}</h4>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 'var(--sp-1)' }}>
                  {project.award_text}
                </div>
                {relatedHackathon && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {relatedHackathon.title}
                  </div>
                )}
              </div>
            )}

            <div style={{
              border: '1px solid var(--border-base)',
              padding: 'var(--sp-4)',
              background: 'var(--bg-card)'
            }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', color: 'var(--text-muted)' }}>// {t('goat_hunt.share_project')}</h4>
              <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                <Button
                  variant="ghost"
                  style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(project.title)}`, '_blank')}
                >
                  {t('goat_hunt.share_twitter')}
                </Button>
                <Button variant="ghost" style={{ flex: 1, fontSize: '12px' }} onClick={handleCopyLink}>
                  {t('goat_hunt.copy_link')}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <EditProjectDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        project={project}
        onSuccess={() => {
          if (project.id) {
            void refreshProject(project.id);
          }
        }}
      />
    </main>
  );
}
