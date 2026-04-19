import type { Language } from '@/lib/i18n';

function normalizeStatusText(value: string | null | undefined): string {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[|｜·•,，.。:：/\\()（）_\-]/g, '');
}

export type CanonicalHackathonStatus = 'open' | 'live' | 'ended';

export function canonicalizeHackathonStatus(value: string | null | undefined): CanonicalHackathonStatus {
  const status = normalizeStatusText(value);

  if (
    status.includes('报名中') ||
    status.includes('open') ||
    status.includes('registering') ||
    status.includes('registrationopen') ||
    status.includes('upcoming') ||
    status.includes('未开始')
  ) {
    return 'open';
  }

  if (
    status.includes('进行中') ||
    status.includes('live') ||
    status.includes('ongoing') ||
    status.includes('running')
  ) {
    return 'live';
  }

  return 'ended';
}

export function localizeHackathonStatus(value: string | null | undefined, language: Language): string {
  const canonical = canonicalizeHackathonStatus(value);

  if (language === 'zh') {
    if (canonical === 'open') return '报名中';
    if (canonical === 'live') return '进行中';
    return '已结束';
  }

  if (canonical === 'open') return 'Open';
  if (canonical === 'live') return 'Live';
  return 'Ended';
}

export function getHackathonStatusTone(value: string | null | undefined): string {
  const canonical = canonicalizeHackathonStatus(value);
  if (canonical === 'open') return 'var(--brand-coral)';
  if (canonical === 'live') return 'var(--brand-green)';
  return 'var(--text-disabled)';
}
