'use client';
import React, { useState } from 'react';
import { useComment } from '@/contexts/CommentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  storyId?: string;
}

export function CommentDialog({ isOpen, onClose, projectId, storyId }: CommentDialogProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addComment, getProjectComments, getStoryComments, likeComment } = useComment();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  // Fetch comments when dialog opens or project/story changes
  React.useEffect(() => {
    if (isOpen) {
      const fetchComments = async () => {
        try {
          const commentData = projectId
            ? await getProjectComments(projectId)
            : await getStoryComments(storyId!);
          setComments(commentData);
        } catch (error) {
          console.error('Failed to fetch comments:', error);
          setComments([]);
        }
      };

      fetchComments();
    }
  }, [isOpen, projectId, storyId, getProjectComments, getStoryComments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      alert('Please login to comment');
      return;
    }

    void addComment({
      project_id: projectId || '',
      story_id: storyId || undefined,
      content: newComment,
    });

    setNewComment('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--sp-4)',
          borderBottom: '1px solid var(--border-base)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)' }}>
            {t('common.comment')}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            ×
          </button>
        </div>

        {/* Comments List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--sp-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-3)',
        }}>
          {comments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              padding: 'var(--sp-6)',
            }}>
              {t('stories.share_your_thoughts')}
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  padding: 'var(--sp-3)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--sp-2)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'var(--brand-coral)',
                  }}>
                    {comment.author_name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                  }}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: '0 0 var(--sp-2) 0', fontSize: '14px' }}>
                  {comment.content}
                </p>
                <button
                  onClick={() => likeComment(comment.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '0',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  ♥ {comment.likes}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: 'var(--sp-4)',
            borderTop: '1px solid var(--border-base)',
            display: 'flex',
            gap: 'var(--sp-3)',
          }}
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('placeholder.comment')}
            style={{
              flex: 1,
              padding: 'var(--sp-2)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-base)',
              borderRadius: '4px',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            style={{
              padding: 'var(--sp-2) var(--sp-4)',
              background: 'var(--brand-coral)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: newComment.trim() ? 'pointer' : 'not-allowed',
              opacity: newComment.trim() ? 1 : 0.5,
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
            }}
          >
            {t('common.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
