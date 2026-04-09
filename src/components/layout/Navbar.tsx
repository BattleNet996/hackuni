'use client';
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--sp-4) var(--sp-6)',
      borderBottom: 'var(--border-width) solid var(--border-base)',
      background: 'var(--bg-pure)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)' }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-hero)',
          fontSize: 'var(--text-h3)',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          color: 'var(--brand-coral)'
        }}>
          HACK UNI
        </Link>
        <div className="hide-on-mobile" style={{ display: 'flex', gap: 'var(--sp-4)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          <Link href="/hackathons" style={{ color: 'var(--text-muted)' }} className="hover-color">&gt; {t('nav.hackathons')}</Link>
          <Link href="/stories" style={{ color: 'var(--text-muted)' }} className="hover-color">&gt; {t('nav.stories')}</Link>
          <Link href="/goat-hunt" style={{ color: 'var(--text-muted)' }} className="hover-color">&gt; {t('nav.goat_hunt')}</Link>
          <Link href="/badges" style={{ color: 'var(--text-muted)' }} className="hover-color">&gt; {t('nav.badges')}</Link>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
        <LanguageSwitcher />

        {user ? (
          <>
            {/* Logged in */}
            <Link href="/profile">
              <Button variant="ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>
                {t('nav.profile')}
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={logout}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {t('auth.logout')}
            </Button>
          </>
        ) : (
          <>
            {/* Not logged in */}
            <Link href="/login">
              <Button variant="ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>
                {t('auth.login.title')}
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                {t('auth.register.title')}
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
