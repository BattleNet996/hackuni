'use client';
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '@/lib/api-client';

export interface Comment {
  id: string;
  project_id: string | null;
  story_id: string | null;
  author_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id: string | null;
  likes: number;
  replies?: Comment[];
}

interface CommentContextType {
  comments: Record<string, Comment[]>;
  addComment: (comment: { project_id?: string; story_id?: string; content: string; parent_comment_id?: string }) => Promise<void>;
  getProjectComments: (projectId: string) => Promise<Comment[]>;
  getStoryComments: (storyId: string) => Promise<Comment[]>;
  getCommentCount: (projectId: string, storyId?: string) => number;
  deleteComment: (commentId: string) => Promise<void>;
  unlike: (targetType: string, targetId: string) => Promise<void>;
  isLoading: boolean;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addComment = async (comment: { project_id?: string; story_id?: string; content: string; parent_comment_id?: string }) => {
    if (!user) {
      throw new Error('You must be logged in to comment');
    }

    setIsLoading(true);
    try {
      const response = await apiFetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify(comment),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to add comment');
      }

      const newComment: Comment = data.data;
      const key = comment.story_id ? `story_${comment.story_id}` : comment.project_id ? `project_${comment.project_id}` : null;

      if (key) {
        setComments(prev => ({
          ...prev,
          [key]: [newComment, ...(prev[key] || [])],
        }));
      }
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectComments = async (projectId: string): Promise<Comment[]> => {
    const key = `project_${projectId}`;

    // Return cached comments if available
    if (comments[key]) {
      return comments[key];
    }

    try {
      const response = await apiFetch(`/api/comments?project_id=${projectId}`);
      const data = await response.json();

      if (response.ok) {
        const commentsData: Comment[] = data.data;
        setComments(prev => ({
          ...prev,
          [key]: commentsData,
        }));
        return commentsData;
      }

      return [];
    } catch (error) {
      console.error('Get comments error:', error);
      return [];
    }
  };

  const getStoryComments = async (storyId: string): Promise<Comment[]> => {
    const key = `story_${storyId}`;

    // Return cached comments if available
    if (comments[key]) {
      return comments[key];
    }

    try {
      const response = await apiFetch(`/api/comments?story_id=${storyId}`);
      const data = await response.json();

      if (response.ok) {
        const commentsData: Comment[] = data.data;
        setComments(prev => ({
          ...prev,
          [key]: commentsData,
        }));
        return commentsData;
      }

      return [];
    } catch (error) {
      console.error('Get comments error:', error);
      return [];
    }
  };

  const getCommentCount = (projectId: string, storyId?: string): number => {
    const key = storyId ? `story_${storyId}` : `project_${projectId}`;
    return (comments[key] || []).length;
  };

  const deleteComment = async (commentId: string) => {
    if (!user) {
      throw new Error('You must be logged in to delete comments');
    }

    setIsLoading(true);
    try {
      const response = await apiFetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to delete comment');
      }

      // Remove comment from local state
      setComments(prev => {
        const newComments = { ...prev };

        for (const key in newComments) {
          newComments[key] = newComments[key].filter(c => c.id !== commentId);
          // Also remove from replies
          newComments[key] = newComments[key].map(c => ({
            ...c,
            replies: c.replies?.filter(r => r.id !== commentId) || [],
          }));
        }

        return newComments;
      });
    } catch (error) {
      console.error('Delete comment error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const unlike = async (targetType: string, targetId: string) => {
    if (!user) {
      throw new Error('You must be logged in to unlike');
    }

    try {
      const response = await apiFetch('/api/likes/unlike', {
        method: 'DELETE',
        body: JSON.stringify({ target_type: targetType, target_id: targetId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to unlike');
      }

      return data.data;
    } catch (error) {
      console.error('Unlike error:', error);
      throw error;
    }
  };

  return (
    <CommentContext.Provider value={{
      comments,
      addComment,
      getProjectComments,
      getStoryComments,
      getCommentCount,
      deleteComment,
      unlike,
      isLoading,
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
