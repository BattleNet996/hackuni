'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface BadgeProgress {
  current: number;
  total: number;
  percentage: number;
}

interface RelatedBadge {
  id: string;
  badge_name: string;
  badge_name_en: string;
}

interface BadgeDetail {
  id: string;
  badge_code: string;
  badge_name: string;
  badge_name_en: string;
  badge_type: string;
  badge_desc: string;
  badge_desc_en: string;
  rule_desc: string;
  rule_desc_en: string;
  source_type: string;
  is_earned: boolean;
  progress: BadgeProgress | null;
  relatedBadges: RelatedBadge[];
}

export default function BadgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [badge, setBadge] = React.useState<BadgeDetail | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let isActive = true;

    void params.then(async ({ id }) => {
      try {
        const userQuery = user?.id ? `?user_id=${user.id}` : '';
        const response = await fetch(`/api/badges/${id}${userQuery}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to fetch badge');
        }

        if (isActive) {
          setBadge(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch badge detail:', error);
        if (isActive) {
          setBadge(null);
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, [params, user?.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareTwitter = () => {
    const text = language === 'zh'
      ? `我刚刚在 HackUni 发现了徽章：${badge?.badge_name}！`
      : `Just discovered the ${badge?.badge_name_en} badge on HackUni!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleStartChallenge = () => {
    if (!badge) return;

    if (badge.source_type === 'hackathon') {
      window.location.href = '/hackathons';
    } else if (badge.source_type === 'work') {
      window.location.href = '/publish';
    } else {
      window.location.href = '/stories';
    }
  };

  if (!badge) {
    return <main style={{ padding: 'var(--sp-8)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{t('badges.error_404')}</main>;
  }

  const progress = badge.progress || { current: 0, total: 5, percentage: 0 };

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        background: badge.is_earned ? 'rgba(0, 255, 65, 0.05)' : 'var(--bg-card)',
        border: badge.is_earned ? '2px solid var(--brand-green)' : '1px solid var(--border-base)',
        padding: 'var(--sp-8)',
        textAlign: 'center',
        marginBottom: 'var(--sp-6)',
        position: 'relative'
      }}>
        {badge.is_earned && (
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

        <div style={{
          width: '150px',
          height: '150px',
          margin: '0 auto var(--sp-6)',
          background: badge.is_earned ? 'var(--brand-green)' : 'var(--bg-elevated)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: badge.is_earned ? '3px solid var(--brand-green)' : '2px solid var(--border-base)'
        }}>
          <span style={{ fontFamily: 'var(--font-hero)', fontSize: '64px', color: badge.is_earned ? '#000' : 'var(--text-muted)' }}>
            🏆
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-hero)',
          fontSize: '48px',
          margin: '0 0 var(--sp-3) 0',
          color: badge.is_earned ? 'var(--brand-green)' : 'var(--text-main)'
        }}>
          {language === 'zh' ? badge.badge_name : badge.badge_name_en}
        </h1>

        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>
          {badge.badge_code} // {badge.badge_type}
        </p>

        <p style={{ fontSize: '18px', color: 'var(--text-main)', maxWidth: '600px', margin: '0 auto var(--sp-6)', lineHeight: '1.6' }}>
          {language === 'zh' ? badge.badge_desc : badge.badge_desc_en}
        </p>

        {!badge.is_earned && (
          <Button
            variant="primary"
            onClick={handleStartChallenge}
            style={{ fontSize: '16px', padding: 'var(--sp-4) var(--sp-6)', cursor: 'pointer' }}
          >
            {t('badges.start_challenge')}
          </Button>
        )}
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)' }}>
        <section>
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

          {!badge.is_earned && (
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
                    background: 'var(--brand-coral)'
                  }} />
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

        <aside>
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
              style={{ width: '100%', fontSize: '12px', marginBottom: 'var(--sp-2)', cursor: 'pointer' }}
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

          <div style={{ marginTop: 'var(--sp-6)' }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
              // {t('badges.related_badges')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {badge.relatedBadges.map((relatedBadge) => (
                <Link key={relatedBadge.id} href={`/badges/${relatedBadge.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-base)',
                    padding: 'var(--sp-3)',
                    cursor: 'pointer'
                  }} className="hover-color">
                    <div style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                      {language === 'zh' ? relatedBadge.badge_name : relatedBadge.badge_name_en}
                    </div>
                  </div>
                </Link>
              ))}
              {badge.relatedBadges.length === 0 && (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'zh' ? '暂无相关徽章' : 'No related badges'}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
