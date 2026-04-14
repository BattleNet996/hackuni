'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '@/lib/api-client';
import { fetchJsonWithCache } from '@/lib/client-cache';

interface LikeRecord {
  target_type: 'project' | 'story' | 'comment';
  target_id: string;
}

interface ToggleLikeResult {
  liked: boolean;
  count: number;
}

interface CountableProject {
  id: string;
  like_count?: number;
}

interface CountableStory {
  id: string;
  like_count?: number;
}

interface LikeContextType {
  likedProjects: Set<string>;
  likedStories: Set<string>;
  likedComments: Set<string>;
  toggleLikeProject: (id: string) => Promise<ToggleLikeResult | null>;
  toggleLikeStory: (id: string) => Promise<ToggleLikeResult | null>;
  toggleLikeComment: (id: string) => Promise<ToggleLikeResult | null>;
  isProjectLiked: (id: string) => boolean;
  isStoryLiked: (id: string) => boolean;
  isCommentLiked: (id: string) => boolean;
  getProjectLikes: (id: string) => number | undefined;
  getStoryLikes: (id: string) => number | undefined;
  refreshLikeCounts: () => Promise<void>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // Initialize like counts from backend API
  const [projectLikeCounts, setProjectLikeCounts] = useState<Record<string, number>>({});
  const [storyLikeCounts, setStoryLikeCounts] = useState<Record<string, number>>({});

  // Fetch like counts from backend
  const refreshLikeCounts = useCallback(async () => {
    try {
      // Fetch projects and stories to get their like counts
      const [projectsData, storiesData] = await Promise.all([
        fetchJsonWithCache<{ data?: CountableProject[] }>('/api/projects?limit=1000'),
        fetchJsonWithCache<{ data?: CountableStory[] }>('/api/stories?limit=1000')
      ]);

      const projectCounts = projectsData.data?.reduce((acc: Record<string, number>, proj: CountableProject) => {
        acc[proj.id] = proj.like_count || 0;
        return acc;
      }, {}) || {};
      setProjectLikeCounts(projectCounts);

      const storyCounts = storiesData.data?.reduce((acc: Record<string, number>, story: CountableStory) => {
        acc[story.id] = story.like_count || 0;
        return acc;
      }, {}) || {};
      setStoryLikeCounts(storyCounts);
    } catch (error) {
      console.error('Failed to fetch like counts:', error);
    }
  }, []);

  const clearLikedState = useCallback(() => {
    setLikedProjects(new Set());
    setLikedStories(new Set());
    setLikedComments(new Set());
  }, []);

  const handleExpiredSession = useCallback((shouldRedirect: boolean = false) => {
    clearLikedState();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      if (shouldRedirect) {
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
      }
    }
  }, [clearLikedState]);

  const refreshUserLikes = useCallback(async () => {
    if (!user?.id) {
      clearLikedState();
      return;
    }

    try {
      const response = await apiFetch('/api/likes');
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleExpiredSession();
        }
        return;
      }

      const nextProjects = new Set<string>();
      const nextStories = new Set<string>();
      const nextComments = new Set<string>();

      (data.data || []).forEach((like: LikeRecord) => {
        if (like.target_type === 'project') {
          nextProjects.add(like.target_id);
        } else if (like.target_type === 'story') {
          nextStories.add(like.target_id);
        } else if (like.target_type === 'comment') {
          nextComments.add(like.target_id);
        }
      });

      setLikedProjects(nextProjects);
      setLikedStories(nextStories);
      setLikedComments(nextComments);
    } catch (error) {
      console.error('Failed to fetch user likes:', error);
    }
  }, [clearLikedState, handleExpiredSession, user?.id]);

  const requireLogin = (message: string) => {
    if (typeof window === 'undefined') return false;

    const loginPrompt = confirm(message);
    if (loginPrompt) {
      window.location.href = '/login';
    }
    return true;
  };

  const updateLikedSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string,
    liked: boolean
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (liked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const toggleTargetLike = async (
    targetType: 'project' | 'story' | 'comment',
    targetId: string
  ): Promise<ToggleLikeResult | null> => {
    if (!user) {
      const prompts = {
        project: 'Please login to like projects. Go to login page?',
        story: 'Please login to like stories. Go to login page?',
        comment: 'Please login to like comments. Go to login page?',
      };

      requireLogin(prompts[targetType]);
      return null;
    }

    const prevLiked =
      targetType === 'project'
        ? likedProjects.has(targetId)
        : targetType === 'story'
          ? likedStories.has(targetId)
          : likedComments.has(targetId);

    const applyOptimisticState = (liked: boolean) => {
      if (targetType === 'project') {
        updateLikedSet(setLikedProjects, targetId, liked);
        setProjectLikeCounts((prev) => {
          const currentCount = prev[targetId];
          if (typeof currentCount === 'undefined') return prev;
          return {
            ...prev,
            [targetId]: Math.max(0, currentCount + (liked ? 1 : -1)),
          };
        });
      } else if (targetType === 'story') {
        updateLikedSet(setLikedStories, targetId, liked);
        setStoryLikeCounts((prev) => {
          const currentCount = prev[targetId];
          if (typeof currentCount === 'undefined') return prev;
          return {
            ...prev,
            [targetId]: Math.max(0, currentCount + (liked ? 1 : -1)),
          };
        });
      } else {
        updateLikedSet(setLikedComments, targetId, liked);
      }
    };

    applyOptimisticState(!prevLiked);

    try {
      const response = await apiFetch('/api/likes', {
        method: 'POST',
        body: JSON.stringify({ target_type: targetType, target_id: targetId }),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        const { liked, count } = data.data as ToggleLikeResult;

        if (targetType === 'project') {
          updateLikedSet(setLikedProjects, targetId, liked);
          setProjectLikeCounts((prev) => ({ ...prev, [targetId]: count }));
        } else if (targetType === 'story') {
          updateLikedSet(setLikedStories, targetId, liked);
          setStoryLikeCounts((prev) => ({ ...prev, [targetId]: count }));
        } else {
          updateLikedSet(setLikedComments, targetId, liked);
        }

        return { liked, count };
      }

      applyOptimisticState(prevLiked);

      if (response.status === 401) {
        handleExpiredSession(true);
        return null;
      }

      console.error('[LikeContext] Like failed:', data.error?.message || 'Unknown error');
      if (typeof window !== 'undefined') {
        alert(`Failed to like: ${data.error?.message || 'Unknown error'}`);
      }
      return null;
    } catch (error) {
      applyOptimisticState(prevLiked);
      console.error('[LikeContext] Toggle like error:', error);
      if (typeof window !== 'undefined') {
        alert('Network error. Please try again.');
      }
      return null;
    }
  };

  useEffect(() => {
    void refreshLikeCounts();
  }, [refreshLikeCounts]);

  useEffect(() => {
    void refreshUserLikes();
  }, [refreshUserLikes]);

  const toggleLikeProject = async (id: string) => toggleTargetLike('project', id);
  const toggleLikeStory = async (id: string) => toggleTargetLike('story', id);
  const toggleLikeComment = async (id: string) => toggleTargetLike('comment', id);

  const isProjectLiked = (id: string) => likedProjects.has(id);
  const isStoryLiked = (id: string) => likedStories.has(id);
  const isCommentLiked = (id: string) => likedComments.has(id);

  const getProjectLikes = (id: string) => projectLikeCounts[id];
  const getStoryLikes = (id: string) => storyLikeCounts[id];

  return (
    <LikeContext.Provider value={{
      likedProjects,
      likedStories,
      likedComments,
      toggleLikeProject,
      toggleLikeStory,
      toggleLikeComment,
      isProjectLiked,
      isStoryLiked,
      isCommentLiked,
      getProjectLikes,
      getStoryLikes,
      refreshLikeCounts,
    }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLike() {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error('useLike must be used within a LikeProvider');
  }
  return context;
}
