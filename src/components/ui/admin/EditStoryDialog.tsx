'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string | null;
  source?: string | null;
  source_url?: string | null;
  author_name: string;
  tags_json?: string | string[];
  published_at?: string;
  status?: string;
  hidden?: number | boolean;
}

interface EditStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
  onSuccess: () => void;
}

export function EditStoryDialog({ isOpen, onClose, story, onSuccess }: EditStoryDialogProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<Partial<Story>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (story) {
      setFormData({
        ...story,
        hidden: typeof story.hidden === 'boolean' ? (story.hidden ? 1 : 0) : (story.hidden || 0),
        tags_json: Array.isArray(story.tags_json)
          ? story.tags_json.join(', ')
          : story.tags_json || ''
      });
    }
  }, [story]);

  if (!isOpen || !story) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Prepare the data - keep both summary and content separate
      const submitData: any = {
        ...formData,
        tags_json: formData.tags_json ? formData.tags_json.toString().split(',').map(t => t.trim()) : [],
      };

      // Don't map content to summary - keep them separate
      // The API will handle both fields

      const response = await fetch(`/api/admin/stories/${story.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(language === 'zh' ? '更新成功！' : 'Updated successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
          setMessage('');
        }, 1000);
      } else {
        setMessage(data.error?.message || (language === 'zh' ? '更新失败' : 'Update failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '更新失败，请重试' : 'Update failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        maxWidth: '700px',
        width: '90%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: 'var(--sp-4)',
          borderBottom: '1px solid var(--border-base)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)' }}>
            {language === 'zh' ? '编辑文章' : 'Edit Story'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--sp-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-4)',
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? 'URL Slug' : 'URL Slug'}
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug || ''}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '文章标题' : 'Article Title'}
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '文章摘要' : 'Summary'}
            </label>
            <textarea
              name="summary"
              value={formData.summary || ''}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '正文内容' : 'Content'}
            </label>
            <textarea
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              rows={10}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.6' }}
              placeholder={language === 'zh' ? '在此输入文章正文内容...' : 'Enter article content here...'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '状态' : 'Status'}
              </label>
              <select
                name="status"
                value={formData.status || 'published'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              >
                <option value="published">{language === 'zh' ? '已发布' : 'Published'}</option>
                <option value="pending">{language === 'zh' ? '待审核' : 'Pending'}</option>
                <option value="hidden">{language === 'zh' ? '已隐藏' : 'Hidden'}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '隐藏' : 'Hidden'}
              </label>
              <select
                name="hidden"
                value={formData.hidden ? 1 : 0}
                onChange={(e) => setFormData(prev => ({ ...prev, hidden: parseInt(e.target.value) }))}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              >
                <option value="0">{language === 'zh' ? '显示' : 'Visible'}</option>
                <option value="1">{language === 'zh' ? '隐藏' : 'Hidden'}</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '来源（可选）' : 'Source (optional)'}
            </label>
            <input
              type="text"
              name="source"
              value={formData.source || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '来源链接（可选）' : 'Source URL (optional)'}
            </label>
            <input
              type="url"
              name="source_url"
              value={formData.source_url || ''}
              onChange={handleChange}
              placeholder="https://..."
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '标签（逗号分隔）' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              name="tags_json"
              value={formData.tags_json || ''}
              onChange={handleChange}
              placeholder="#AI, #Startup, #Community"
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          {message && (
            <div style={{
              padding: 'var(--sp-2)',
              borderRadius: '4px',
              textAlign: 'center',
              background: message.includes(language === 'zh' ? '成功' : 'success')
                ? 'rgba(0, 255, 65, 0.1)'
                : 'rgba(255, 65, 65, 0.1)',
              color: message.includes(language === 'zh' ? '成功' : 'success')
                ? 'var(--brand-green)'
                : 'var(--brand-coral)',
              fontSize: '13px'
            }}>
              {message}
            </div>
          )}
        </form>

        <div style={{
          padding: 'var(--sp-4)',
          borderTop: '1px solid var(--border-base)',
          display: 'flex',
          gap: 'var(--sp-3)',
          justifyContent: 'flex-end',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: 'var(--sp-2) var(--sp-4)',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-base)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: 'var(--sp-2) var(--sp-4)',
              background: isSubmitting ? 'var(--text-muted)' : 'var(--brand-coral)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontFamily: 'var(--font-mono)',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (language === 'zh' ? '提交中...' : 'Submitting...') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
