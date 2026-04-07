'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { HackerCard } from '@/components/ui/HackerCard';

export default function LoginPage() {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(language === 'zh' ? '请填写所有字段' : 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/profile');
    } catch (err) {
      setError(language === 'zh' ? '登录失败，请重试' : 'Login failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: 'calc(100vh - 70px - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-8) var(--sp-6)' }}>
      <HackerCard style={{ maxWidth: '450px', width: '100%', padding: 'var(--sp-8)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
          <h1 style={{
            fontFamily: 'var(--font-hero)',
            fontSize: 'var(--text-h1)',
            margin: '0 0 var(--sp-2) 0',
            color: 'var(--brand-coral)'
          }}>
            {t('auth.login.title')}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
            {t('auth.login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-2)'
            }}>
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-coral)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-base)'}
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-2)'
            }}>
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-coral)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-base)'}
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: 'var(--sp-3)',
              background: 'rgba(245, 107, 82, 0.1)',
              border: '1px solid var(--brand-coral)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--brand-coral)'
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: 'var(--sp-3)', fontSize: '14px' }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)' }}>
                <span className="spinner" />
                {language === 'zh' ? '登录中...' : 'Logging in...'}
              </span>
            ) : (
              t('auth.login.submit')
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="divider-dashed" style={{ margin: 'var(--sp-6) 0' }}></div>

        {/* Register Link */}
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>{t('auth.login.no_account')} </span>
          <Link
            href="/register"
            style={{ color: 'var(--brand-coral)', textDecoration: 'none' }}
            className="hover-color"
          >
            {t('auth.login.register_link')}
          </Link>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: 'var(--sp-4)' }}>
          <Link
            href="/"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px'
            }}
            className="hover-color"
          >
            ← {t('common.back')}
          </Link>
        </div>
      </HackerCard>

      <style>{`
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
