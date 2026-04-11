'use client';
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/Button';

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'hackathon' | 'story' | 'badge';
  onSuccess?: () => void;
}

export function PublishDialog({ isOpen, onClose, type, onSuccess }: PublishDialogProps) {
  const { t, language } = useLanguage();
  const { adminUser } = useAdminAuth();
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !adminUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      let endpoint = '';
      if (type === 'hackathon') endpoint = '/api/admin/hackathons';
      else if (type === 'story') endpoint = '/api/admin/stories';
      else if (type === 'badge') endpoint = '/api/admin/badges';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(language === 'zh' ? '发布成功！' : 'Published successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
          setFormData({});
          setMessage('');
        }, 1500);
      } else {
        setMessage(data.error?.message || (language === 'zh' ? '发布失败' : 'Publish failed'));
      }
    } catch (error) {
      console.error('Publish error:', error);
      setMessage(language === 'zh' ? '发布失败，请重试' : 'Publish failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const renderForm = () => {
    if (type === 'hackathon') {
      return (
        <>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '黑客松标题' : 'Hackathon Title'} *
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
              {language === 'zh' ? '简短描述' : 'Short Description'}
            </label>
            <textarea
              name="short_desc"
              value={formData.short_desc || ''}
              onChange={handleChange}
              rows={2}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '详细描述' : 'Description'}
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '城市' : 'City'}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '国家' : 'Country'}
              </label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '开始时间' : 'Start Time'}
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '结束时间' : 'End Time'}
              </label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '组织者' : 'Organizer'}
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '报名状态' : 'Registration Status'}
              </label>
              <select
                name="registration_status"
                value={formData.registration_status || 'upcoming'}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, registration_status: e.target.value }))}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              >
                <option value="upcoming">{language === 'zh' ? '即将开始' : 'Upcoming'}</option>
                <option value="报名中">{language === 'zh' ? '报名中' : 'Open'}</option>
                <option value="closed">{language === 'zh' ? '已关闭' : 'Closed'}</option>
                <option value="completed">{language === 'zh' ? '已结束' : 'Completed'}</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '报名链接' : 'Registration URL'}
            </label>
            <input
              type="url"
              name="registration_url"
              value={formData.registration_url || ''}
              onChange={handleChange}
              placeholder="https://..."
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '海报URL' : 'Poster URL'}
            </label>
            <input
              type="url"
              name="poster_url"
              value={formData.poster_url || ''}
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, tags_json: e.target.value }))}
              placeholder={language === 'zh' ? '#AI, #Hardware, #Web3' : '#AI, #Hardware, #Web3'}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>
        </>
      );
    }

    if (type === 'story') {
      return (
        <>
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
              placeholder={language === 'zh' ? 'my-article-slug' : 'my-article-slug'}
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
              {language === 'zh' ? '来源（可选）' : 'Source (optional)'}
            </label>
            <input
              type="text"
              name="source"
              value={formData.source || ''}
              onChange={handleChange}
              placeholder={language === 'zh' ? 'Sequoia Capital' : 'Sequoia Capital'}
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
              onChange={(e) => setFormData((prev: any) => ({ ...prev, tags_json: e.target.value }))}
              placeholder="#AI, #Startup, #Community"
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>
        </>
      );
    }

    if (type === 'badge') {
      return (
        <>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '徽章代码' : 'Badge Code'}
            </label>
            <input
              type="text"
              name="badge_code"
              value={formData.badge_code || ''}
              onChange={handleChange}
              required
              placeholder="GOLD_MEDAL"
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '徽章名称（中文）' : 'Badge Name (CN)'}
              </label>
              <input
                type="text"
                name="badge_name"
                value={formData.badge_name || ''}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '徽章名称（英文）' : 'Badge Name (EN)'}
              </label>
              <input
                type="text"
                name="badge_name_en"
                value={formData.badge_name_en || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '徽章类型' : 'Badge Type'}
            </label>
            <select
              name="badge_type"
              value={formData.badge_type || 'milestone'}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, badge_type: e.target.value }))}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            >
              <option value="award">{language === 'zh' ? '奖项' : 'Award'}</option>
              <option value="milestone">{language === 'zh' ? '里程碑' : 'Milestone'}</option>
              <option value="community">{language === 'zh' ? '社区' : 'Community'}</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '描述（中文）' : 'Description (CN)'}
              </label>
              <textarea
                name="badge_desc"
                value={formData.badge_desc || ''}
                onChange={handleChange}
                rows={2}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '描述（英文）' : 'Description (EN)'}
              </label>
              <textarea
                name="badge_desc_en"
                value={formData.badge_desc_en || ''}
                onChange={handleChange}
                rows={2}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '获取规则（中文）' : 'Rule (CN)'}
              </label>
              <textarea
                name="rule_desc"
                value={formData.rule_desc || ''}
                onChange={handleChange}
                rows={2}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '获取规则（英文）' : 'Rule (EN)'}
              </label>
              <textarea
                name="rule_desc_en"
                value={formData.rule_desc_en || ''}
                onChange={handleChange}
                rows={2}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical' }}
              />
            </div>
          </div>
        </>
      );
    }
  };

  const getTitle = () => {
    if (type === 'hackathon') return language === 'zh' ? '发布黑客松' : 'Publish Hackathon';
    if (type === 'story') return language === 'zh' ? '发布文章' : 'Publish Story';
    if (type === 'badge') return language === 'zh' ? '创建徽章' : 'Create Badge';
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
        {/* Header */}
        <div style={{
          padding: 'var(--sp-4)',
          borderBottom: '1px solid var(--border-base)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)' }}>
            {getTitle()}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--sp-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-4)',
        }}>
          {renderForm()}

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

        {/* Footer */}
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
