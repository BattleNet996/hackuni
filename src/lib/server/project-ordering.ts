function toTimestamp(value: string | undefined | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function sortProjectsByGoatOrder<T extends { like_count?: number; created_at?: string | null }>(projects: T[]): T[] {
  return [...projects].sort((left, right) => {
    const likeDelta = (right.like_count || 0) - (left.like_count || 0);
    if (likeDelta !== 0) return likeDelta;

    return toTimestamp(right.created_at) - toTimestamp(left.created_at);
  });
}

export function sortProjects<T extends { like_count?: number; created_at?: string | null; rank_score?: number | null }>(
  projects: T[],
  sort: string
): T[] {
  const normalizedSort = sort === 'recent' ? 'created_at' : sort;
  const next = [...projects];

  if (normalizedSort === 'goat' || normalizedSort === 'like_count') {
    return sortProjectsByGoatOrder(next);
  }

  if (normalizedSort === 'rank_score') {
    next.sort((left, right) => {
      const leftRank = typeof left.rank_score === 'number' ? left.rank_score : Number.POSITIVE_INFINITY;
      const rightRank = typeof right.rank_score === 'number' ? right.rank_score : Number.POSITIVE_INFINITY;
      if (leftRank !== rightRank) return leftRank - rightRank;

      const likeDelta = (right.like_count || 0) - (left.like_count || 0);
      if (likeDelta !== 0) return likeDelta;

      return toTimestamp(right.created_at) - toTimestamp(left.created_at);
    });
    return next;
  }

  next.sort((left, right) => {
    const createdDelta = toTimestamp(right.created_at) - toTimestamp(left.created_at);
    if (createdDelta !== 0) return createdDelta;
    return (right.like_count || 0) - (left.like_count || 0);
  });
  return next;
}
