'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

interface Badge {
  id: string;
  badge_code: string;
  badge_name: string;
  badge_name_en: string;
  badge_desc: string;
  badge_desc_en: string;
  badge_type: string;
  icon_url?: string;
  rule_desc: string;
  rule_desc_en: string;
}

interface EditBadgeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
  onSuccess: () => void;
}

export function EditBadgeDialog({ isOpen, onClose, badge, onSuccess }: EditBadgeDialogProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<Partial<Badge>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (badge) {
      setFormData(badge);
    }
  }, [badge]);

  if (!isOpen || !badge) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/badges/${badge.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
            {language === 'zh' ? '编辑徽章' : 'Edit Badge'}
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
              {language === 'zh' ? '徽章代码' : 'Badge Code'}
            </label>
            <input
              type="text"
              name="badge_code"
              value={formData.badge_code || ''}
              onChange={handleChange}
              required
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
              onChange={(e) => setFormData(prev => ({ ...prev, badge_type: e.target.value }))}
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
