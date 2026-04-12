'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer style={{
      borderTop: '1px dashed var(--border-base)',
      padding: 'var(--sp-6) var(--sp-6)',
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-caption)'
    }}>
      <div style={{ color: 'var(--text-muted)' }}>
        © 2024-{new Date().getFullYear()} AttraX. {language === 'zh' ? '保留所有权利' : 'All rights reserved.'}
      </div>
      <div style={{ display: 'flex', gap: 'var(--sp-4)', color: 'var(--text-muted)' }}>
        <Link href="https://github.com/attrax-dev" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span style={{ cursor: 'pointer' }}>GITHUB</span>
        </Link>
        <Link href="https://x.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span style={{ cursor: 'pointer' }}>X.COM</span>
        </Link>
        <Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span style={{ cursor: 'pointer' }}>{language === 'zh' ? '关于' : 'ABOUT'}</span>
        </Link>
      </div>
    </footer>
  );
}
