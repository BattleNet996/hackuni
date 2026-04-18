export function getPosterPalette(seed: string) {
  const palettes = [
    {
      base: 'linear-gradient(135deg, #ff7a18 0%, #24120b 46%, #00ff41 100%)',
      glow: 'radial-gradient(circle at 28% 20%, rgba(255,255,255,0.34), transparent 30%)',
    },
    {
      base: 'linear-gradient(145deg, #0a1b2f 0%, #123b4a 42%, #f5c84b 100%)',
      glow: 'radial-gradient(circle at 78% 18%, rgba(255,255,255,0.28), transparent 28%)',
    },
    {
      base: 'linear-gradient(150deg, #101010 0%, #3b1d11 45%, #ff4f2e 100%)',
      glow: 'radial-gradient(circle at 22% 82%, rgba(255,255,255,0.22), transparent 34%)',
    },
    {
      base: 'linear-gradient(135deg, #07171a 0%, #164e45 48%, #a7f070 100%)',
      glow: 'radial-gradient(circle at 72% 74%, rgba(255,255,255,0.24), transparent 32%)',
    },
  ];

  const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palettes[hash % palettes.length];
}

export function getPosterSurfaceStyle(seed: string, options?: { width?: string; height?: string }) {
  const posterPalette = getPosterPalette(seed);

  return {
    width: options?.width || '200px',
    height: options?.height || '200px',
    background: `${posterPalette.glow}, ${posterPalette.base}`,
    border: '1px solid var(--border-base)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
  };
}

export function getAvatarFallbackStyle(seed: string, size: string = '40px') {
  const palette = getPosterPalette(seed);

  return {
    width: size,
    height: size,
    background: `${palette.glow}, ${palette.base}`,
    border: '1px solid var(--border-base)',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
  };
}

export function getMetadataCardImage(seed: string) {
  const palette = getPosterPalette(seed);
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d0d0d"/>
          <stop offset="45%" stop-color="#1b1b1b"/>
          <stop offset="100%" stop-color="#101010"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#g)"/>
      <rect x="42" y="42" width="1116" height="546" rx="26" fill="${palette.base.replace(/"/g, '\'')}" opacity="0.95"/>
      <circle cx="940" cy="166" r="128" fill="rgba(255,255,255,0.11)"/>
      <circle cx="236" cy="438" r="168" fill="rgba(255,255,255,0.08)"/>
      <rect x="126" y="160" width="360" height="24" rx="12" fill="rgba(255,255,255,0.88)"/>
      <rect x="126" y="216" width="540" height="18" rx="9" fill="rgba(255,255,255,0.32)"/>
      <rect x="126" y="252" width="472" height="18" rx="9" fill="rgba(255,255,255,0.24)"/>
      <rect x="126" y="406" width="188" height="56" rx="28" fill="rgba(255,255,255,0.14)"/>
    </svg>`
  )}`;
}
