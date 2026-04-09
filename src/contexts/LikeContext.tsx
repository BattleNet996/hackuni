'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROJECTS, MOCK_STORIES } from '@/data/mock';

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
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Initialize like counts from mock data (server and client consistent)
  const [projectLikeCounts, setProjectLikeCounts] = useState<Record<string, number>>(() => {
    return MOCK_PROJECTS.reduce((acc, proj) => ({ ...acc, [proj.id]: proj.like_count }), {});
  });

  const [storyLikeCounts, setStoryLikeCounts] = useState<Record<string, number>>(() => {
    return MOCK_STORIES.reduce((acc, story) => ({ ...acc, [story.id]: story.like_count }), {});
  });

  useEffect(() => {
    setMounted(true);

    // Load liked items from localStorage
    const savedLikedProjects = localStorage.getItem('likedProjects');
    const savedLikedStories = localStorage.getItem('likedStories');
    const savedLikedComments = localStorage.getItem('likedComments');
    const savedProjectCounts = localStorage.getItem('projectLikeCounts');
    const savedStoryCounts = localStorage.getItem('storyLikeCounts');

    if (savedLikedProjects) setLikedProjects(new Set(JSON.parse(savedLikedProjects)));
    if (savedLikedStories) setLikedStories(new Set(JSON.parse(savedLikedStories)));
    if (savedLikedComments) setLikedComments(new Set(JSON.parse(savedLikedComments)));
    if (savedProjectCounts) setProjectLikeCounts(JSON.parse(savedProjectCounts));
    if (savedStoryCounts) setStoryLikeCounts(JSON.parse(savedStoryCounts));
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

  useEffect(() => {
    // Persist like counts to localStorage only on client and after mounted
    if (!mounted) return;
    localStorage.setItem('projectLikeCounts', JSON.stringify(projectLikeCounts));
  }, [projectLikeCounts, mounted]);

  useEffect(() => {
    // Persist like counts to localStorage only on client and after mounted
    if (!mounted) return;
    localStorage.setItem('storyLikeCounts', JSON.stringify(storyLikeCounts));
  }, [storyLikeCounts, mounted]);

  const toggleLikeProject = async (id: string) => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_type: 'project', target_id: id }),
      });

      const data = await response.json();

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
      }
    } catch (error) {
      console.error('Toggle like error:', error);
    }
  };

  const toggleLikeStory = async (id: string) => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
