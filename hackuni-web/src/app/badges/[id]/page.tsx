'use client';
import React from 'react';
import Link from 'next/link';
import { MOCK_BADGES, MOCK_USER } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BadgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage();
  const [badge, setBadge] = React.useState<any>(null);
  const [copied, setCopied] = React.useState(false);
  const [progress, setProgress] = React.useState({ current: 0, total: 5, percentage: 0 });

  React.useEffect(() => {
    params.then(resolvedParams => {
      const foundBadge = MOCK_BADGES.find(b => b.id === resolvedParams.id);
      setBadge(foundBadge);

      // Calculate progress based on badge type
      if (foundBadge && foundBadge.badge_type === 'milestone') {
        // For milestone badges, calculate based on user's completed projects
        const userCompletedProjects = MOCK_USER.projects?.length || 3;
        const requiredProjects = 5;
        const percentage = Math.min(100, Math.round((userCompletedProjects / requiredProjects) * 100));
        setProgress({
          current: userCompletedProjects,
          total: requiredProjects,
          percentage
        });
      } else {
        // For other badge types, progress is based on participation
        setProgress({ current: 1, total: 1, percentage: 0 });
      }
    });
  }, [params]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareTwitter = () => {
    const text = language === 'zh'
      ? `我刚刚在 HackUni 发现了徽章：${badge?.badge_name}！🏆`
      : `Just discovered the ${badge?.badge_name_en} badge on HackUni! 🏆`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleStartChallenge = () => {
    if (badge?.source_type === 'hackathon') {
      window.location.href = '/hackathons';
    } else if (badge?.source_type === 'work') {
      window.location.href = '/publish';
    } else {
      window.location.href = '/stories';
    }
  };

  if (!badge) return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{t('badges.error_404')}</main>;

  const isEarned = MOCK_USER.badges.some((ub: any) => ub.label === badge.badge_code);

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '900px', margin: '0 auto' }}>
      {/* Badge Hero */}
      <div style={{
        background: isEarned ? 'rgba(0, 255, 65, 0.05)' : 'var(--bg-card)',
        border: isEarned ? '2px solid var(--brand-green)' : '1px solid var(--border-base)',
        padding: 'var(--sp-8)',
        textAlign: 'center',
        marginBottom: 'var(--sp-6)',
        position: 'relative'
      }}>
        {isEarned && (
          <div style={{
            position: 'absolute',
            top: 'var(--sp-4)',
            right: 'var(--sp-4)',
            background: 'var(--brand-green)',
            color: '#000',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 'bold'
          }}>
            {t('badges.earned')}
          </div>
        )}

        {/* Large Badge Icon */}
        <div style={{
          width: '150px',
          height: '150px',
          margin: '0 auto var(--sp-6)',
          background: isEarned ? 'var(--brand-green)' : 'var(--bg-elevated)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isEarned ? '3px solid var(--brand-green)' : '2px solid var(--border-base)',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontFamily: 'var(--font-hero)', fontSize: '64px', color: isEarned ? '#000' : 'var(--text-muted)' }}>
            🏆
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-hero)',
          fontSize: '48px',
          margin: '0 0 var(--sp-3) 0',
          color: isEarned ? 'var(--brand-green)' : 'var(--text-main)'
        }}>
          {language === 'zh' ? badge.badge_name : badge.badge_name_en}
        </h1>

        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>
          {badge.badge_code} // {badge.badge_type}
        </p>

        <p style={{ fontSize: '18px', color: 'var(--text-main)', maxWidth: '600px', margin: '0 auto var(--sp-6)', lineHeight: '1.6' }}>
          {language === 'zh' ? badge.badge_desc : badge.badge_desc_en}
        </p>

        {!isEarned && (
          <Button
            variant="primary"
            onClick={handleStartChallenge}
            style={{ fontSize: '16px', padding: 'var(--sp-4) var(--sp-6)', cursor: 'pointer' }}
          >
            {t('badges.start_challenge')}
          </Button>
        )}
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }}>
        {/* Main Content */}
        <section>
          {/* How to Earn */}
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0, marginBottom: 'var(--sp-3)' }}>
              {t('badges.how_to_earn')}
            </h3>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              padding: 'var(--sp-4)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {language === 'zh' ? badge.rule_desc : badge.rule_desc_en}
              </p>
            </div>
          </div>

          {/* Progress */}
          {!isEarned && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', marginTop: 0, marginBottom: 'var(--sp-3)' }}>
                {t('badges.your_progress')}
              </h3>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                padding: 'var(--sp-4)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{t('badges.progress')}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-coral)' }}>{progress.percentage}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-elevated)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress.percentage}%`,
                    height: '100%',
                    background: 'var(--brand-coral)',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <p style={{ margin: 'var(--sp-3) 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                  {badge.badge_type === 'milestone'
                    ? t('badges.completed_projects').replace('{current}', String(progress.current)).replace('{total}', String(progress.total))
                    : t('badges.join_hackathon_hint')}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside>
          {/* Badge Type */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            padding: 'var(--sp-4)',
            marginBottom: 'var(--sp-4)'
          }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              // {t('badges.badge_type')}
            </h4>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--brand-coral)', textTransform: 'uppercase' }}>
              {badge.badge_type}
            </div>
          </div>

          {/* Source */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            padding: 'var(--sp-4)',
            marginBottom: 'var(--sp-4)'
          }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              // {t('badges.source')}
            </h4>
            <div style={{ fontSize: '14px', color: 'var(--text-main)' }}>
              {badge.source_type === 'hackathon' ? t('badges.hackathon_events') :
               badge.source_type === 'work' ? t('badges.project_submissions') :
               t('badges.community_activity')}
            </div>
          </div>

          {/* Share */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            padding: 'var(--sp-4)',
            marginBottom: 'var(--sp-4)'
          }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              // {t('badges.share')}
            </h4>
            <Button
              variant="ghost"
              onClick={handleCopyLink}
              style={{ width: '100%', fontSize: '12px', marginBottom: 'var(--sp-2)', cursor: 'pointer', position: 'relative' }}
            >
              {copied ? t('badges.link_copied') + ' ✓' : t('badges.copy_link')}
            </Button>
            <Button
              variant="ghost"
              onClick={handleShareTwitter}
              style={{ width: '100%', fontSize: '12px', cursor: 'pointer' }}
            >
              {t('badges.share_twitter')}
            </Button>
          </div>

          {/* Related Badges */}
          <div style={{ marginTop: 'var(--sp-6)' }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
              // {t('badges.related_badges')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {MOCK_BADGES.filter(b => b.badge_type === badge.badge_type && b.id !== badge.id).slice(0, 3).map(relatedBadge => (
                <Link key={relatedBadge.id} href={`/badges/${relatedBadge.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-base)',
                    padding: 'var(--sp-3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }} className="hover-color">
                    <div style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                      {language === 'zh' ? relatedBadge.badge_name : relatedBadge.badge_name_en}
                    </div>
                  </div>
                </Link>
              ))}
              {MOCK_BADGES.filter(b => b.badge_type === badge.badge_type && b.id !== badge.id).length === 0 && (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  No related badges
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
