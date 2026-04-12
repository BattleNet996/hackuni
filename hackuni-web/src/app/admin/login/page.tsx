'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminLoginPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(username, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || (language === 'zh' ? '登录失败，请检查用户名和密码' : 'Login failed, please check your credentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-muted)' }}>
          {language === 'zh' ? '加载中...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-surface)',
      padding: 'var(--sp-6)',
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        borderRadius: '8px',
        padding: 'var(--sp-8)',
      }}>
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
          <h1 style={{
            fontFamily: 'var(--font-hero)',
            fontSize: 'var(--text-h1)',
            margin: '0 0 var(--sp-2) 0',
            textTransform: 'uppercase',
            color: 'var(--brand-coral)',
          }}>
            &gt; ADMIN
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            {language === 'zh' ? '管理后台登录' : 'Admin Dashboard Login'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: 'var(--sp-4)',
            padding: 'var(--sp-3)',
            background: 'rgba(255, 65, 65, 0.1)',
            border: '1px solid var(--brand-coral)',
            borderRadius: '4px',
            color: 'var(--brand-coral)',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Username */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--sp-2)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}>
              {language === 'zh' ? '用户名' : 'Username'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="wjj"
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-base)',
                borderRadius: '4px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--sp-2)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}>
              {language === 'zh' ? '密码' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-base)',
                borderRadius: '4px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: 'var(--sp-3)',
              background: isSubmitting ? 'var(--text-muted)' : 'var(--brand-coral)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {isSubmitting
              ? (language === 'zh' ? '登录中...' : 'Logging in...')
              : (language === 'zh' ? '登录' : 'Login')
            }
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 'var(--sp-6)',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          <div>
            {language === 'zh' ? '请使用管理员账号登录' : 'Please login with admin credentials'}
          </div>
        </div>
      </div>
    </div>
  );
}
