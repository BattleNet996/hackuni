'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface BadgeItem {
  id: string;
  badge_code: string;
  badge_name: string;
  badge_name_en: string;
  badge_type: string;
  badge_desc: string;
  badge_desc_en: string;
  rule_desc: string;
  rule_desc_en: string;
  is_earned: boolean;
}

interface BadgeStats {
  earnedCount: number;
  totalCount: number;
  completionRate: number;
}

export default function BadgesPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [filterType, setFilterType] = React.useState<string>('all');
  const [badges, setBadges] = React.useState<BadgeItem[]>([]);
  const [stats, setStats] = React.useState<BadgeStats | null>(null);

  React.useEffect(() => {
    let isActive = true;

    async function fetchBadges() {
      try {
        const userQuery = user?.id ? `?user_id=${user.id}` : '';
        const response = await fetch(`/api/badges${userQuery}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to fetch badges');
        }

        if (isActive) {
          setBadges(data.data || []);
          setStats(data.stats || null);
        }
      } catch (error) {
        console.error('Failed to fetch badges:', error);
        if (isActive) {
          setBadges([]);
          setStats(null);
        }
      }
    }

    void fetchBadges();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const filteredBadges = filterType === 'all'
    ? badges
    : badges.filter((badge) => badge.badge_type === filterType);

  const filterTabs = [
    { value: 'all', label: language === 'zh' ? '全部' : 'All' },
    { value: 'award', label: language === 'zh' ? '奖项' : 'Awards' },
    { value: 'milestone', label: language === 'zh' ? '里程碑' : 'Milestones' },
    { value: 'community', label: language === 'zh' ? '社区' : 'Community' },
  ];

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0, textTransform: 'uppercase' }}>
          &gt; {t('nav.badges')}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
          {language === 'zh' ? '为你的黑客松成就和社区贡献赢得徽章' : 'Earn badges for your hackathon achievements and community contributions'}
        </p>
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }} />

      <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)', justifyContent: 'center', fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: filterType === tab.value ? 'var(--brand-coral)' : 'var(--text-muted)',
              borderBottom: filterType === tab.value ? '2px solid var(--brand-coral)' : '2px solid transparent',
              padding: 'var(--sp-2) var(--sp-4)',
              cursor: 'pointer',
              fontWeight: filterType === tab.value ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        padding: 'var(--sp-5)',
        marginBottom: 'var(--sp-8)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--sp-4)',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--brand-coral)' }}>
            {stats?.earnedCount || 0}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            {t('profile.badges').toLowerCase()}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--brand-green)' }}>
            {stats?.totalCount || badges.length}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            {language === 'zh' ? '可获取总数' : 'TOTAL_AVAILABLE'}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: 'var(--brand-amber)' }}>
            {stats?.completionRate || 0}%
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            {language === 'zh' ? '完成率' : 'COMPLETION_RATE'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-5)' }}>
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            style={{
              background: badge.is_earned ? 'rgba(0, 255, 65, 0.05)' : 'var(--bg-card)',
              border: badge.is_earned ? '1px solid var(--brand-green)' : '1px solid var(--border-base)',
              padding: 'var(--sp-5)',
              opacity: badge.is_earned ? 1 : 0.7,
              position: 'relative'
            }}
            className="hover-color"
          >
            {badge.is_earned && (
              <div style={{
                position: 'absolute',
                top: 'var(--sp-3)',
                right: 'var(--sp-3)',
                background: 'var(--brand-green)',
                color: '#000',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 'bold'
              }}>
                {t('badges.earned')}
              </div>
            )}

            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto var(--sp-4)',
              background: badge.is_earned ? 'var(--brand-green)' : 'var(--bg-elevated)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: badge.is_earned ? '2px solid var(--brand-green)' : '1px solid var(--border-base)'
            }}>
              <span style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: badge.is_earned ? '#000' : 'var(--text-muted)' }}>
                🏆
              </span>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-hero)',
              fontSize: '18px',
              margin: '0 0 var(--sp-2) 0',
              textAlign: 'center',
              color: badge.is_earned ? 'var(--brand-green)' : 'var(--text-main)'
            }}>
              {language === 'zh' ? badge.badge_name : badge.badge_name_en}
            </h3>

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginBottom: 'var(--sp-3)',
              textTransform: 'uppercase'
            }}>
              {badge.badge_type}
            </p>

            <p style={{
              fontSize: '14px',
              color: 'var(--text-main)',
              lineHeight: 1.6,
              marginBottom: 'var(--sp-4)',
              textAlign: 'center'
            }}>
              {language === 'zh' ? badge.badge_desc : badge.badge_desc_en}
            </p>

            <div style={{
              background: 'var(--bg-elevated)',
              padding: 'var(--sp-3)',
              marginBottom: 'var(--sp-4)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: 'var(--sp-1)' }}>
                // {t('badges.how_to_earn')}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                {language === 'zh' ? badge.rule_desc : badge.rule_desc_en}
              </div>
            </div>

            <Link href={`/badges/${badge.id}`} style={{ textDecoration: 'none' }}>
              <Button
                variant={badge.is_earned ? 'ghost' : 'primary'}
                style={{ width: '100%', fontSize: '13px', cursor: 'pointer' }}
              >
                {badge.is_earned ? t('common.view_details') : t('common.learn_more')}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 'var(--sp-8)',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--brand-coral)',
        padding: 'var(--sp-6)',
        textAlign: 'center',
        borderRadius: 'var(--radius-sm)'
      }}>
        <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)', margin: '0 0 var(--sp-3) 0' }}>
          {t('badges.earn_first_badge')}?
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--sp-4)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          {language === 'zh' ? '参加黑客松、发布项目或为社区做贡献来开始收集徽章' : 'Join a hackathon, ship a project, or contribute to the community to start collecting badges'}
        </p>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center' }}>
          <Link href="/hackathons">
            <Button variant="primary">{t('badges.find_hackathon')}</Button>
          </Link>
          <Link href="/publish">
            <Button variant="ghost">{t('badges.publish_project')}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
