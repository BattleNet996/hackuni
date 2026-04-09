'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { HackerCard } from '@/components/ui/HackerCard';

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError(language === 'zh' ? '请填写所有必填字段' : 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError(language === 'zh' ? '密码长度至少为6位' : 'Password must be at least 6 characters');
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, displayName || undefined);
      router.push('/profile');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Display specific error message from server or fallback message
      const errorMessage = err?.message || err?.toString();

      if (errorMessage) {
        const lowerMessage = errorMessage.toLowerCase();

        // Check for email already exists errors (check multiple possible phrases)
        if (lowerMessage.includes('email already registered') ||
            lowerMessage.includes('email_exists') ||
            lowerMessage.includes('already exists') ||
            lowerMessage.includes('already registered')) {
          setError(language === 'zh' ? '该邮箱已被注册，请使用其他邮箱或直接登录' : 'Email already registered, please use another email or login');
        } else if (lowerMessage.includes('invalid_email') || lowerMessage.includes('invalid email')) {
          setError(language === 'zh' ? '邮箱格式不正确' : 'Invalid email format');
        } else if (lowerMessage.includes('password_too_short') || lowerMessage.includes('password must be at least')) {
          setError(language === 'zh' ? '密码长度至少为8位' : 'Password must be at least 8 characters');
        } else if (lowerMessage.includes('weak_password') || lowerMessage.includes('password is too weak')) {
          setError(language === 'zh' ? '密码强度不够，请使用更复杂的密码' : 'Password is too weak, please use a more complex password');
        } else {
          // Show the actual server message if it's short enough, otherwise fallback
          if (errorMessage.length < 100) {
            setError(errorMessage);
          } else {
            setError(language === 'zh' ? '注册失败，请重试' : 'Registration failed, please try again');
          }
        }
      } else {
        setError(language === 'zh' ? '注册失败，请重试' : 'Registration failed, please try again');
      }
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
            {t('auth.register.title')}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
            {t('auth.register.subtitle')}
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
              {t('auth.email')} <span style={{ color: 'var(--brand-coral)' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
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

          {/* Display Name Field (Optional) */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-2)'
            }}>
              {t('auth.display_name')} ({t('common.optional')})
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={language === 'zh' ? '异类构建者' : 'Outlier Builder'}
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
              {t('auth.password')} <span style={{ color: 'var(--brand-coral)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
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

          {/* Confirm Password Field */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-2)'
            }}>
              {t('auth.confirm_password')} <span style={{ color: 'var(--brand-coral)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
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

          {/* Terms Notice */}
          <div style={{
            padding: 'var(--sp-3)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            {t('auth.register.terms_notice')}
          </div>

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
                {language === 'zh' ? '注册中...' : 'Registering...'}
              </span>
            ) : (
              t('auth.register.submit')
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="divider-dashed" style={{ margin: 'var(--sp-6) 0' }}></div>

        {/* Login Link */}
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>{t('auth.register.has_account')} </span>
          <Link
            href="/login"
            style={{ color: 'var(--brand-coral)', textDecoration: 'none' }}
            className="hover-color"
          >
            {t('auth.register.login_link')}
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
