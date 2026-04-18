import { supabase } from '@/lib/db/supabase-client';

type TargetType = 'project' | 'story';

export async function getLikeCountMap(
  targetType: TargetType,
  targetIds: string[]
): Promise<Record<string, number>> {
  const ids = Array.from(new Set(targetIds.filter(Boolean)));
  if (ids.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from('likes')
    .select('target_id')
    .eq('target_type', targetType)
    .in('target_id', ids);

  if (error) {
    throw error;
  }

  return (data || []).reduce((acc: Record<string, number>, row: any) => {
    acc[row.target_id] = (acc[row.target_id] || 0) + 1;
    return acc;
  }, {});
}

export async function withProjectLikeCounts<T extends { id: string; like_count?: number }>(
  projects: T[]
): Promise<T[]> {
  const likeCounts = await getLikeCountMap('project', projects.map((project) => project.id));
  return projects.map((project) => ({
    ...project,
    like_count: likeCounts[project.id] || 0,
  }));
}

export async function withStoryLikeCounts<T extends { id: string; like_count?: number }>(
  stories: T[],
  legacyStoryIdBySlug?: Record<string, string>
): Promise<T[]> {
  const storyIds = stories.map((story) => story.id);
  const legacyIds = legacyStoryIdBySlug
    ? stories
        .map((story: any) => legacyStoryIdBySlug[story.slug])
        .filter(Boolean)
    : [];

  const likeCounts = await getLikeCountMap('story', [...storyIds, ...legacyIds]);

  return stories.map((story: any) => {
    const legacyId = legacyStoryIdBySlug?.[story.slug];
    return {
      ...story,
      like_count: (likeCounts[story.id] || 0) + (legacyId ? (likeCounts[legacyId] || 0) : 0),
    };
  });
}
