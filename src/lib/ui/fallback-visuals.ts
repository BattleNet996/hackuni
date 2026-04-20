function hashSeed(seed: string) {
  return seed.split('').reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
}

function buildSeededPhotoUrl(seed: string, width: number, height: number, category: 'avatar' | 'project' | 'poster') {
  const hash = hashSeed(seed);

  if (category === 'avatar') {
    return `https://picsum.photos/seed/avatar_${hash}/${width}/${height}`;
  }

  if (category === 'project') {
    return `https://picsum.photos/seed/project_${hash}/${width}/${height}`;
  }

  return `https://picsum.photos/seed/poster_${hash}/${width}/${height}`;
}

export function getPosterPalette(seed: string) {
  const palettes = [
    {
      base: 'linear-gradient(135deg, #2d1f16 0%, #4d311d 48%, #c98342 100%)',
      glow: 'radial-gradient(circle at 24% 18%, rgba(255,255,255,0.14), transparent 32%)',
    },
    {
      base: 'linear-gradient(145deg, #0f1722 0%, #21384f 42%, #7bb9f0 100%)',
      glow: 'radial-gradient(circle at 78% 18%, rgba(255,255,255,0.16), transparent 30%)',
    },
    {
      base: 'linear-gradient(150deg, #1d1512 0%, #513220 45%, #ef8f59 100%)',
      glow: 'radial-gradient(circle at 22% 82%, rgba(255,255,255,0.14), transparent 34%)',
    },
    {
      base: 'linear-gradient(135deg, #13231d 0%, #235342 48%, #90d9a3 100%)',
      glow: 'radial-gradient(circle at 72% 74%, rgba(255,255,255,0.14), transparent 32%)',
    },
  ];

  const hash = hashSeed(seed);
  return palettes[hash % palettes.length];
}

export function getPosterSurfaceStyle(seed: string, options?: { width?: string; height?: string }) {
  const width = options?.width || '200px';
  const height = options?.height || '200px';
  const numericWidth = parseInt(width, 10) || 200;
  const numericHeight = parseInt(height, 10) || 200;
  const posterPalette = getPosterPalette(seed);
  const imageUrl = buildSeededPhotoUrl(seed, numericWidth * 2, numericHeight * 2, 'poster');

  return {
    width,
    height,
    backgroundImage: `${posterPalette.glow}, url(${imageUrl}), ${posterPalette.base}`,
    backgroundSize: 'cover, cover, cover',
    backgroundPosition: 'center, center, center',
    backgroundBlendMode: 'screen, normal, normal' as const,
    border: '1px solid var(--border-base)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
  };
}

export function getAvatarFallbackStyle(seed: string, size: string = '40px') {
  const numericSize = parseInt(size, 10) || 40;
  const imageUrl = buildSeededPhotoUrl(seed, numericSize * 2, numericSize * 2, 'avatar');

  return {
    width: size,
    height: size,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: '1px solid var(--border-base)',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
  };
}

export function getProjectImageFallbackStyle(seed: string, options?: { width?: string; height?: string }) {
  const width = options?.width || '160px';
  const height = options?.height || '160px';
  const numericWidth = parseInt(width, 10) || 160;
  const numericHeight = parseInt(height, 10) || 160;
  const imageUrl = buildSeededPhotoUrl(seed, numericWidth * 2, numericHeight * 2, 'project');

  return {
    width,
    height,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: '1px solid var(--border-base)',
    flexShrink: 0,
    filter: 'grayscale(12%) contrast(1.04)',
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
