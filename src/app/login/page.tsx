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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailInputId = 'login-email';
  const passwordInputId = 'login-password';

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
    } catch (err: any) {
      console.error('Login error:', err);
      // Display specific error message from server or fallback message
      const errorMessage = err?.message || err?.toString();

      if (errorMessage) {
        const lowerMessage = errorMessage.toLowerCase();

        // Check for different error types
        if (lowerMessage.includes('invalid credentials') ||
            lowerMessage.includes('invalid_email') ||
            lowerMessage.includes('invalid email or password')) {
          setError(language === 'zh' ? '邮箱或密码错误' : 'Invalid email or password');
        } else if (lowerMessage.includes('user_not_found') || lowerMessage.includes('user not found')) {
          setError(language === 'zh' ? '用户不存在，请先注册' : 'User not found, please register first');
        } else if (lowerMessage.includes('account_locked') || lowerMessage.includes('account locked')) {
          setError(language === 'zh' ? '账户已被锁定，请联系管理员' : 'Account locked, please contact admin');
        } else {
          // Show the actual server message if it's short enough, otherwise fallback
          if (errorMessage.length < 100) {
            setError(errorMessage);
          } else {
            setError(language === 'zh' ? '登录失败，请重试' : 'Login failed, please try again');
          }
        }
      } else {
        setError(language === 'zh' ? '登录失败，请重试' : 'Login failed, please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: 'calc(100vh - 60px - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-6) var(--sp-4)' }}>
      <HackerCard style={{ maxWidth: '450px', width: '100%', padding: 'var(--sp-6)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-5)' }}>
          <h1 style={{
            fontFamily: 'var(--font-hero)',
            fontSize: 'var(--text-h2)',
            margin: '0 0 var(--sp-2) 0',
            color: 'var(--brand-coral)'
          }}>
            {t('auth.login.title')}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            {t('auth.login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Email Field */}
          <div>
            <label htmlFor={emailInputId} style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-2)'
            }}>
              {t('auth.email')}
            </label>
            <input
              id={emailInputId}
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
            <label htmlFor={passwordInputId} style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-2)'
            }}>
              {t('auth.password')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id={passwordInputId}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: 'var(--sp-3)',
                  paddingRight: '40px',
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '18px',
                  padding: '5px',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
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
