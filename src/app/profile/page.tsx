'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    if (user?.id) {
      router.replace(`/profile/${user.id}`);
      return;
    }

    router.replace('/login');
  }, [isLoading, router, user?.id]);

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', marginBottom: 'var(--sp-3)' }}>
        {language === 'zh' ? '正在加载个人主页' : 'Loading profile'}
      </h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 'var(--sp-5)' }}>
        {isLoading
          ? (language === 'zh' ? '正在验证登录状态...' : 'Verifying session...')
          : (language === 'zh' ? '即将跳转到你的个人主页' : 'Redirecting to your profile')}
      </p>
      <Link href="/">
        <Button variant="ghost">{t('common.back')}</Button>
      </Link>
    </main>
  );
}
