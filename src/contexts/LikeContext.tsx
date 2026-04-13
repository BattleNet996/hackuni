'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '@/lib/api-client';

interface LikeContextType {
  likedProjects: Set<string>;
  likedStories: Set<string>;
  likedComments: Set<string>;
  toggleLikeProject: (id: string) => void;
  toggleLikeStory: (id: string) => void;
  toggleLikeComment: (id: string) => void;
  isProjectLiked: (id: string) => boolean;
  isStoryLiked: (id: string) => boolean;
  isCommentLiked: (id: string) => boolean;
  getProjectLikes: (id: string) => number;
  getStoryLikes: (id: string) => number;
  refreshLikeCounts: () => Promise<void>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Initialize like counts from backend API
  const [projectLikeCounts, setProjectLikeCounts] = useState<Record<string, number>>({});
  const [storyLikeCounts, setStoryLikeCounts] = useState<Record<string, number>>({});

  // Fetch like counts from backend
  const refreshLikeCounts = async () => {
    try {
      // Fetch projects and stories to get their like counts
      const [projectsRes, storiesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/stories')
      ]);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        const counts = projectsData.data?.reduce((acc: Record<string, number>, proj: any) => {
          acc[proj.id] = proj.like_count || 0;
          return acc;
        }, {}) || {};
        setProjectLikeCounts(counts);
      }

      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        const counts = storiesData.data?.reduce((acc: Record<string, number>, story: any) => {
          acc[story.id] = story.like_count || 0;
          return acc;
        }, {}) || {};
        setStoryLikeCounts(counts);
      }
    } catch (error) {
      console.error('Failed to fetch like counts:', error);
    }
  };

  useEffect(() => {
    setMounted(true);

    // Load liked items from localStorage
    const savedLikedProjects = localStorage.getItem('likedProjects');
    const savedLikedStories = localStorage.getItem('likedStories');
    const savedLikedComments = localStorage.getItem('likedComments');

    if (savedLikedProjects) setLikedProjects(new Set(JSON.parse(savedLikedProjects)));
    if (savedLikedStories) setLikedStories(new Set(JSON.parse(savedLikedStories)));
    if (savedLikedComments) setLikedComments(new Set(JSON.parse(savedLikedComments)));

    // Fetch like counts from backend
    refreshLikeCounts();
  }, []);

  useEffect(() => {
    // Persist to localStorage only on client and after mounted
    if (!mounted) return;
    localStorage.setItem('likedProjects', JSON.stringify(Array.from(likedProjects)));
  }, [likedProjects, mounted]);

  useEffect(() => {
    // Persist to localStorage only on client and after mounted
    if (!mounted) return;
    localStorage.setItem('likedStories', JSON.stringify(Array.from(likedStories)));
  }, [likedStories, mounted]);

  useEffect(() => {
    // Persist to localStorage only on client and after mounted
    if (!mounted) return;
    localStorage.setItem('likedComments', JSON.stringify(Array.from(likedComments)));
  }, [likedComments, mounted]);

  const toggleLikeProject = async (id: string) => {
    // Check if user is logged in before making the request
    if (!user) {
      console.log('[LikeContext] No user found in auth context');
      if (typeof window !== 'undefined') {
        const loginPrompt = confirm('Please login to like projects. Go to login page?');
        if (loginPrompt) {
          window.location.href = '/login';
        }
      }
      return;
    }

    console.log('[LikeContext] User logged in:', user.id, user.email);

    try {
      const response = await apiFetch('/api/likes', {
        method: 'POST',
        body: JSON.stringify({ target_type: 'project', target_id: id }),
      });

      const data = await response.json();
      console.log('[LikeContext] Response status:', response.status, data);

      if (response.ok && data.data) {
        const { liked, count } = data.data;

        setLikedProjects(prev => {
          const newSet = new Set(prev);
          if (liked) {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
          return newSet;
        });

        setProjectLikeCounts(prev => ({ ...prev, [id]: count }));
      } else if (response.status === 401) {
        // Token expired or invalid - user needs to login again
        console.warn('[LikeContext] Session expired. User needs to login again.');
        if (typeof window !== 'undefined') {
          alert('Your session has expired. Please login again.');
          // Clear local storage and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } else {
        console.error('[LikeContext] Like failed:', data.error?.message || 'Unknown error');
        alert(`Failed to like: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[LikeContext] Toggle like error:', error);
      alert('Network error. Please try again.');
    }
  };

  const toggleLikeStory = async (id: string) => {
    // Check if user is logged in before making the request
    if (!user) {
      if (typeof window !== 'undefined') {
        const loginPrompt = confirm('Please login to like stories. Go to login page?');
        if (loginPrompt) {
          window.location.href = '/login';
        }
      }
      return;
    }

    try {
      const response = await apiFetch('/api/likes', {
        method: 'POST',
        body: JSON.stringify({ target_type: 'story', target_id: id }),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        const { liked, count } = data.data;

        setLikedStories(prev => {
          const newSet = new Set(prev);
          if (liked) {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
          return newSet;
        });

        setStoryLikeCounts(prev => ({ ...prev, [id]: count }));
      } else if (response.status === 401) {
        // Token expired or invalid - user needs to login again
        console.warn('Session expired. Please login again.');
        if (typeof window !== 'undefined') {
          alert('Your session has expired. Please login again.');
          // Clear local storage and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } else {
        console.error('Like failed:', data.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Toggle like error:', error);
    }
  };

  const toggleLikeComment = (id: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isProjectLiked = (id: string) => likedProjects.has(id);
  const isStoryLiked = (id: string) => likedStories.has(id);
  const isCommentLiked = (id: string) => likedComments.has(id);

  const getProjectLikes = (id: string) => projectLikeCounts[id] || 0;
  const getStoryLikes = (id: string) => storyLikeCounts[id] || 0;

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
