'use client';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { prefetchJsonWithCache } from '@/lib/client-cache';

export function Navbar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const prefetchRouteData = useCallback((href: string) => {
    router.prefetch(href);

    if (href === '/hackathons') {
      prefetchJsonWithCache('/api/hackathons');
    } else if (href === '/stories') {
      prefetchJsonWithCache('/api/stories');
    } else if (href === '/goat-hunt') {
      prefetchJsonWithCache('/api/projects?awarded=true');
    } else if (href === '/badges') {
      const badgeUrl = user?.id ? `/api/badges?user_id=${user.id}` : '/api/badges';
      prefetchJsonWithCache(badgeUrl);
    } else if (href === '/profile' && user?.id) {
      prefetchJsonWithCache(`/api/builders/${user.id}`);
    }
  }, [router, user?.id]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const warmCriticalRoutes = () => {
      prefetchRouteData('/hackathons');
      prefetchRouteData('/stories');
      prefetchRouteData('/goat-hunt');
      prefetchRouteData('/badges');
      if (user?.id) {
        prefetchRouteData('/profile');
      }
    };

    if (browserWindow.requestIdleCallback) {
      const idleId = browserWindow.requestIdleCallback(warmCriticalRoutes);
      return () => browserWindow.cancelIdleCallback?.(idleId);
    }

    const timer = window.setTimeout(warmCriticalRoutes, 600);
    return () => window.clearTimeout(timer);
  }, [prefetchRouteData, user?.id]);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--sp-3) var(--sp-4)',
      borderBottom: 'var(--border-width) solid var(--border-base)',
      background: 'var(--bg-pure)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px'
          }}
          className="mobile-menu-btn"
        >
          <span style={{
            width: '24px',
            height: '2px',
            background: 'var(--text-main)',
            transition: 'all 0.2s',
            transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }}></span>
          <span style={{
            width: '24px',
            height: '2px',
            background: 'var(--text-main)',
            transition: 'all 0.2s',
            opacity: mobileMenuOpen ? 0 : 1
          }}></span>
          <span style={{
            width: '24px',
            height: '2px',
            background: 'var(--text-main)',
            transition: 'all 0.2s',
            transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
          }}></span>
        </button>

        <Link href="/" style={{
          fontFamily: 'var(--font-hero)',
          fontSize: 'var(--text-h3)',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          color: 'var(--brand-coral)',
          textDecoration: 'none'
        }}>
          HACK UNI
        </Link>
      </div>

      {/* Desktop nav links */}
      <div className="desktop-nav" style={{ display: 'flex', gap: 'var(--sp-4)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
        <Link href="/hackathons" onMouseEnter={() => prefetchRouteData('/hackathons')} style={{ color: 'var(--text-muted)' }} className="hover-color">&gt; {t('nav.hackathons')}</Link>
        <Link href="/stories" onMouseEnter={() => prefetchRouteData('/stories')} style={{ color: 'var(--text-muted)' }} className="hover-color">&gt; {t('nav.stories')}</Link>
        <Link href="/goat-hunt" onMouseEnter={() => prefetchRouteData('/goat-hunt')} style={{ color: 'var(--text-muted)' }} className="hover-color">&gt; {t('nav.goat_hunt')}</Link>
        <Link href="/badges" onMouseEnter={() => prefetchRouteData('/badges')} style={{ color: 'var(--text-muted)' }} className="hover-color">&gt; {t('nav.badges')}</Link>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
        <LanguageSwitcher />

        <div className="desktop-auth" style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          {user ? (
            <>
              {/* Logged in */}
              <Link href="/profile" onMouseEnter={() => prefetchRouteData('/profile')}>
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
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-base)',
          padding: 'var(--sp-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-4)',
          zIndex: 99
        }} className="mobile-menu">
          <Link
            href="/hackathons"
            onMouseEnter={() => prefetchRouteData('/hackathons')}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: 'var(--sp-2)',
              textDecoration: 'none'
            }}
          >
            &gt; {t('nav.hackathons')}
          </Link>
          <Link
            href="/stories"
            onMouseEnter={() => prefetchRouteData('/stories')}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: 'var(--sp-2)',
              textDecoration: 'none'
            }}
          >
            &gt; {t('nav.stories')}
          </Link>
          <Link
            href="/goat-hunt"
            onMouseEnter={() => prefetchRouteData('/goat-hunt')}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: 'var(--sp-2)',
              textDecoration: 'none'
            }}
          >
            &gt; {t('nav.goat_hunt')}
          </Link>
          <Link
            href="/badges"
            onMouseEnter={() => prefetchRouteData('/badges')}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: 'var(--sp-2)',
              textDecoration: 'none'
            }}
          >
            &gt; {t('nav.badges')}
          </Link>
          <div style={{ borderTop: '1px solid var(--border-base)', paddingTop: 'var(--sp-4)' }}>
            {user ? (
              <>
                <Link
                  href="/profile"
                  onMouseEnter={() => prefetchRouteData('/profile')}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    padding: 'var(--sp-2)',
                    textDecoration: 'none'
                  }}
                >
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    padding: 'var(--sp-2)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    padding: 'var(--sp-2)',
                    textDecoration: 'none'
                  }}
                >
                  {t('auth.login.title')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    color: 'var(--brand-coral)',
                    fontFamily: 'var(--font-hero)',
                    fontSize: '14px',
                    padding: 'var(--sp-2)',
                    textDecoration: 'none'
                  }}
                >
                  {t('auth.register.title')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-auth {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
