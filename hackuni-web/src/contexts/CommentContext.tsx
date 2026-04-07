'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Comment {
  id: string;
  projectId: string;
  storyId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

interface CommentContextType {
  comments: Record<string, Comment[]>;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies'>) => void;
  getProjectComments: (projectId: string) => Comment[];
  getStoryComments: (storyId: string) => Comment[];
  getCommentCount: (projectId: string, storyId?: string) => number;
  likeComment: (commentId: string) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    // Load comments from localStorage (only on client)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('comments');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    // Persist comments to localStorage (only on client)
    if (typeof window === 'undefined') return;
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies'>) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    const key = comment.storyId || comment.projectId;

    setComments(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newComment],
    }));
  };

  const getProjectComments = (projectId: string): Comment[] => {
    return comments[projectId] || [];
  };

  const getStoryComments = (storyId: string): Comment[] => {
    return comments[storyId] || [];
  };

  const getCommentCount = (projectId: string, storyId?: string): number => {
    const key = storyId || projectId;
    return (comments[key] || []).length;
  };

  const likeComment = (commentId: string) => {
    setComments(prev => {
      const newComments = { ...prev };

      // Find and update the comment
      for (const key in newComments) {
        const comment = newComments[key].find(c => c.id === commentId);
        if (comment) {
          comment.likes += 1;
          break;
        }
      }

      return newComments;
    });
  };

  return (
    <CommentContext.Provider value={{
      comments,
      addComment,
      getProjectComments,
      getStoryComments,
      getCommentCount,
      likeComment,
    }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComment() {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComment must be used within a CommentProvider');
  }
  return context;
}
