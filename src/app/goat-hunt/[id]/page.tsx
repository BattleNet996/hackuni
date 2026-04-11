'use client';
import React from 'react';
import Link from 'next/link';
import { MOCK_HACKATHONS, MOCK_BUILDERS } from '@/data/mock';
import { Tag, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EditProjectDialog } from '@/components/ui/EditProjectDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLike } from '@/contexts/LikeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function GoatItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage();
  const { isProjectLiked, toggleLikeProject, getProjectLikes } = useLike();
  const { user } = useAuth();
  const [project, setProject] = React.useState<any>(null);
  const [comments, setComments] = React.useState<any[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  React.useEffect(() => {
    params.then(resolvedParams => {
      // Fetch project from API
      fetch(`/api/projects/${resolvedParams.id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Project not found');
          }
          return res.json();
        })
        .then(data => {
          setProject(data.data);
        })
        .catch(err => {
          console.error('Failed to fetch project:', err);
          // Fallback to mock data for now
          const builder = MOCK_BUILDERS[0] as any;
          const foundProject = builder?.projects?.find((p: any) => p.id === resolvedParams.id);
          setProject(foundProject || null);
        });

      if (project) {
        setComments([
          {
            id: 1,
            author: MOCK_BUILDERS[0],
            content: "Amazing project! The architecture is brilliant.",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            author: MOCK_BUILDERS[1],
            content: "Would love to see this developed further. Great job!",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    });
  }, [params]);

  const isOwner = user && project && user.id === project.author_id;

  if (!project) return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>&gt; ERROR_404_NOT_FOUND_</main>;

  const relatedHackathon = MOCK_HACKATHONS[0];
  const teamMembers = project.team_member_text?.split(' @').filter((m: string) => m).map((m: string) => '@' + m) || [];

  return (
    <main>
      {/* Header Container */}
      <div style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-base)',
        padding: 'var(--sp-8) var(--sp-6)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-6)', alignItems: 'center' }}>
            <div style={{
              width: '160px', height: '160px',
              background: `url(https://picsum.photos/seed/${project.id}/320/320) center/cover`,
              border: '2px solid var(--brand-coral)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-2)' }}>
                <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: '48px', margin: 0 }}>
                  {project.title}
                </h1>
                {project.is_awarded && <Badge type="award" label={project.award_text} />}
              </div>
              <p style={{ fontSize: '20px', color: 'var(--text-muted)', margin: '0 0 var(--sp-4) 0' }}>
                {project.short_desc}
              </p>
              <div style={{ display: 'flex', gap: 'var(--sp-3)', fontFamily: 'var(--font-mono)' }}>
                {project.tags_json.map((tag: string) => <Tag key={tag} label={tag} />)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <Button
                variant={isProjectLiked(project.id) ? 'upvote-active' : 'upvote'}
                onClick={() => toggleLikeProject(project.id)}
                style={{ padding: '16px 32px', fontSize: '24px', cursor: 'pointer' }}
              >
                ▲ {getProjectLikes(project.id)}
              </Button>
              <Button variant="primary">VISIT DEMO</Button>
              <Button variant="ghost">GITHUB</Button>
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
        <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }}>
          {/* Main Content */}
          <section>
            {/* Media Section */}
            <div style={{
              width: '100%', height: '400px',
              background: `url(https://picsum.photos/seed/${project.id}_demo/1280/720) center/cover`,
              border: '1px solid var(--border-base)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 'var(--sp-6)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Button variant="primary" style={{ fontSize: '18px', padding: 'var(--sp-4) var(--sp-6)' }}>
                  ▶ PLAY DEMO
                </Button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="section-title" style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0 }}>README.md</h3>
              <div style={{ color: 'var(--text-main)', lineHeight: 1.8, marginBottom: 'var(--sp-6)' }}>
                <p>
                  This is a groundbreaking project that pushes the boundaries of what's possible in a hackathon setting.
                  Our team built {project.title} to address a critical gap in the {project.tags_json[0] || 'technology'} space.
                </p>
                <p>
                  The project leverages cutting-edge technologies and innovative approaches to deliver a seamless user experience.
                  Built during {relatedHackathon.title}, this prototype demonstrates the power of focused development and creative problem-solving.
                </p>
                <h4 style={{ fontFamily: 'var(--font-mono)', marginTop: 'var(--sp-4)', marginBottom: 'var(--sp-2)' }}>## Key Features</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  <li>Real-time data processing and visualization</li>
                  <li>Responsive design that works across all devices</li>
                  <li>Intuitive user interface with minimal learning curve</li>
                  <li>Scalable architecture ready for production deployment</li>
                </ul>
                <h4 style={{ fontFamily: 'var(--font-mono)', marginTop: 'var(--sp-4)', marginBottom: 'var(--sp-2)' }}>## Tech Stack</h4>
                <p>Next.js, React, TypeScript, Three.js, Tailwind CSS, Supabase</p>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginBottom: 'var(--sp-4)' }}>
                COMMENTS ({comments.length})
              </h3>

              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <textarea
                  placeholder="Share your thoughts..."
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
                  <Button variant="primary">{t('common.submit')}</Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-base)',
                    padding: 'var(--sp-3)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                      <div style={{
                        width: '32px', height: '32px',
                        background: `url(https://picsum.photos/seed/${comment.author.id}/64/64) center/cover`,
                        borderRadius: '50%',
                        flexShrink: 0
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-1)' }}>
                          <Link href={`/profile/${comment.author.id}`} style={{ textDecoration: 'none' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-coral)' }}>
                              @{comment.author.display_name}
                            </span>
                          </Link>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)' }}>{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside>
            {/* Team Section */}
            <div style={{
              border: '1px solid var(--border-base)',
              padding: 'var(--sp-4)',
              background: 'var(--bg-card)',
              marginBottom: 'var(--sp-4)'
            }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', color: 'var(--text-muted)' }}>// THE_MAKERS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {teamMembers.map((member: string) => (
                  <Link key={member} href={`/profile/${member.substring(1)}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                      padding: 'var(--sp-2)',
                      cursor: 'pointer'
                    }} className="hover-color">
                      <div style={{
                        width: '32px', height: '32px',
                        background: `url(https://picsum.photos/seed/${member}/64/64) center/cover`,
                        borderRadius: '50%',
                        border: '1px solid var(--border-base)'
                      }}></div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-main)' }}>{member}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="divider-dashed" style={{ margin: 'var(--sp-4) 0' }}></div>

              <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', color: 'var(--text-muted)' }}>// ORIGIN_POINT</h4>
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
            </div>

            {/* Awards Section */}
            {project.is_awarded && (
              <div style={{
                border: '1px solid var(--brand-coral)',
                padding: 'var(--sp-4)',
                background: 'rgba(245, 107, 82, 0.1)',
                marginBottom: 'var(--sp-4)'
              }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-2) 0', color: 'var(--brand-coral)' }}>// AWARD_WON</h4>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 'var(--sp-1)' }}>
                  {project.award_text}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {relatedHackathon.title}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div style={{
              border: '1px solid var(--border-base)',
              padding: 'var(--sp-4)',
              background: 'var(--bg-card)'
            }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', color: 'var(--text-muted)' }}>// SHARE_THIS_PROJECT</h4>
              <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                <Button variant="ghost" style={{ flex: 1, fontSize: '12px' }}>Twitter</Button>
                <Button variant="ghost" style={{ flex: 1, fontSize: '12px' }}>Copy Link</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Edit Project Dialog */}
      <EditProjectDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        project={project}
        onSuccess={() => {
          // Refresh project data
          params.then(resolvedParams => {
            fetch(`/api/projects/${resolvedParams.id}`)
              .then(res => res.json())
              .then(data => setProject(data.data));
          });
        }}
      />
    </main>
  );
}
