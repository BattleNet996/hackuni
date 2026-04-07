'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Mock like counts - in production this would come from an API
  const [projectLikeCounts] = useState<Record<string, number>>({});
  const [storyLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load liked items from localStorage
    const savedLikedProjects = localStorage.getItem('likedProjects');
    const savedLikedStories = localStorage.getItem('likedStories');
    const savedLikedComments = localStorage.getItem('likedComments');

    if (savedLikedProjects) setLikedProjects(new Set(JSON.parse(savedLikedProjects)));
    if (savedLikedStories) setLikedStories(new Set(JSON.parse(savedLikedStories)));
    if (savedLikedComments) setLikedComments(new Set(JSON.parse(savedLikedComments)));
  }, []);

  const toggleLikeProject = (id: string) => {
    setLikedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setProjectLikeCounts(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
      } else {
        newSet.add(id);
        setProjectLikeCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      }
      localStorage.setItem('likedProjects', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const toggleLikeStory = (id: string) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setStoryLikeCounts(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
      } else {
        newSet.add(id);
        setStoryLikeCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      }
      localStorage.setItem('likedStories', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const toggleLikeComment = (id: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      localStorage.setItem('likedComments', JSON.stringify(Array.from(newSet)));
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
