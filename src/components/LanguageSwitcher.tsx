'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/Button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
      <button
        onClick={() => setLanguage('zh')}
        className="btn-ghost"
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          background: language === 'zh' ? 'var(--bg-elevated)' : 'transparent',
          border: language === 'zh' ? '1px solid var(--brand-coral)' : '1px solid var(--border-base)',
          color: language === 'zh' ? 'var(--brand-coral)' : 'var(--text-muted)',
        }}
      >
        中文
      </button>
      <button
        onClick={() => setLanguage('en')}
        className="btn-ghost"
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          background: language === 'en' ? 'var(--bg-elevated)' : 'transparent',
          border: language === 'en' ? '1px solid var(--brand-coral)' : '1px solid var(--border-base)',
          color: language === 'en' ? 'var(--brand-coral)' : 'var(--text-muted)',
        }}
      >
        EN
      </button>
    </div>
  );
}
