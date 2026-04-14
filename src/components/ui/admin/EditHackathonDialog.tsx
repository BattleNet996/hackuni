'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Hackathon {
  id: string;
  title: string;
  short_desc?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  registration_deadline?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  location_detail?: string;
  tags_json?: string | string[];
  level_score?: string;
  level_code?: string;
  registration_status?: string;
  poster_url?: string;
  organizer?: string;
  organizer_url?: string;
  registration_url?: string;
  requirements?: string;
  prizes?: string;
  fee?: string;
  hidden?: number;
}

interface EditHackathonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: Hackathon | null;
  onSuccess: () => void;
}

export function EditHackathonDialog({ isOpen, onClose, hackathon, onSuccess }: EditHackathonDialogProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<Partial<Hackathon>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (hackathon) {
      setFormData({
        ...hackathon,
        tags_json: Array.isArray(hackathon.tags_json)
          ? hackathon.tags_json.join(', ')
          : hackathon.tags_json || ''
      });
    }
  }, [hackathon]);

  if (!isOpen || !hackathon) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/hackathons/${hackathon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags_json: formData.tags_json ? formData.tags_json.toString().split(',').map(t => t.trim()) : [],
        }),
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
            {language === 'zh' ? '编辑黑客松' : 'Edit Hackathon'}
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
              {language === 'zh' ? '黑客松标题' : 'Hackathon Title'}
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
              rows={6}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.6' }}
              placeholder={language === 'zh' ? '黑客松详细介绍、要求、规则等...' : 'Detailed description, requirements, rules...'}
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
                {language === 'zh' ? '评级分数' : 'Level Score'}
              </label>
              <input
                type="text"
                name="level_score"
                value={formData.level_score || ''}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '评级等级' : 'Level Code'}
              </label>
              <input
                type="text"
                name="level_code"
                value={formData.level_code || ''}
                onChange={handleChange}
                required
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
                value={formData.start_time?.substring(0, 16) || ''}
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
                value={formData.end_time?.substring(0, 16) || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '报名状态' : 'Registration Status'}
            </label>
            <select
              name="registration_status"
              value={formData.registration_status || 'upcoming'}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_status: e.target.value }))}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            >
              <option value="upcoming">{language === 'zh' ? '即将开始' : 'Upcoming'}</option>
              <option value="报名中">{language === 'zh' ? '报名中' : 'Open'}</option>
              <option value="closed">{language === 'zh' ? '已关闭' : 'Closed'}</option>
              <option value="completed">{language === 'zh' ? '已结束' : 'Completed'}</option>
            </select>
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
              placeholder="#AI, #Hardware, #Web3"
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '显示状态' : 'Visibility'}
            </label>
            <select
              name="hidden"
              value={formData.hidden || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, hidden: parseInt(e.target.value) }))}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            >
              <option value="0">{language === 'zh' ? '显示' : 'Visible'}</option>
              <option value="1">{language === 'zh' ? '隐藏' : 'Hidden'}</option>
            </select>
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
