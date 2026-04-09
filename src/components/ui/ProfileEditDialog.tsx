'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile } from '@/contexts/AuthContext';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditDialog({ isOpen, onClose }: ProfileEditDialogProps) {
  const { t, language } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFormData(user);
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLookingForToggle = (value: string) => {
    const currentLookingFor = formData.looking_for || [];
    const newLookingFor = currentLookingFor.includes(value)
      ? currentLookingFor.filter(v => v !== value)
      : [...currentLookingFor, value];
    setFormData(prev => ({ ...prev, looking_for: newLookingFor }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateProfile(formData);
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  const LOOKING_FOR_OPTIONS = language === 'zh'
    ? ['COFOUNDER', 'HACKATHON_TEAMMATE', 'INTERNSHIP', 'FULLTIME', 'MENTOR']
    : ['COFOUNDER', 'HACKATHON_TEAMMATE', 'INTERNSHIP', 'FULLTIME', 'MENTOR'];

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
            {language === 'zh' ? '编辑个人资料' : 'Edit Profile'}
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
          {/* Avatar Upload */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              {language === 'zh' ? '头像' : 'Avatar'}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: avatarPreview || `url(https://picsum.photos/seed/${user.id}/200/200) center/cover`,
                backgroundSize: 'cover',
                border: '2px solid var(--brand-coral)',
                borderRadius: '50%',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              }}></div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  style={{
                    display: 'inline-block',
                    padding: 'var(--sp-2) var(--sp-4)',
                    background: 'var(--brand-coral)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {language === 'zh' ? '上传头像' : 'Upload Avatar'}
                </label>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                {language === 'zh' ? '姓名 / 昵称' : 'Name'}
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                {language === 'zh' ? '邮箱（公开）' : 'Email (Public)'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                disabled
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  opacity: 0.6,
                }}
              />
            </div>
          </div>

          {/* School & Major */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                {language === 'zh' ? '学校' : 'School'}
              </label>
              <input
                type="text"
                name="school"
                value={formData.school || ''}
                onChange={handleChange}
                placeholder={language === 'zh' ? '例如：清华大学' : 'e.g., Tsinghua University'}
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                {language === 'zh' ? '专业' : 'Major'}
              </label>
              <input
                type="text"
                name="major"
                value={formData.major || ''}
                onChange={handleChange}
                placeholder={language === 'zh' ? '例如：计算机科学' : 'e.g., Computer Science'}
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
          </div>

          {/* Company & Position */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                {language === 'zh' ? '公司' : 'Company'}
              </label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                placeholder={language === 'zh' ? '例如：字节跳动' : 'e.g., ByteDance'}
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                {language === 'zh' ? '职位' : 'Position'}
              </label>
              <input
                type="text"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                placeholder={language === 'zh' ? '例如：前端工程师' : 'e.g., Frontend Engineer'}
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              {language === 'zh' ? '个人简介' : 'Bio'}
            </label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows={3}
              placeholder={language === 'zh' ? '介绍一下你自己...' : 'Tell us about yourself...'}
              style={{
                width: '100%',
                padding: 'var(--sp-2)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-base)',
                borderRadius: '4px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Contact */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              {language === 'zh' ? '手机号（隐藏）' : 'Phone (Hidden)'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+86 1XX XXXX XXXX"
              style={{
                width: '100%',
                padding: 'var(--sp-2)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-base)',
                borderRadius: '4px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          {/* External Links */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              {language === 'zh' ? '外部链接' : 'External Links'}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              <input
                type="url"
                name="twitter_url"
                value={formData.twitter_url || ''}
                onChange={handleChange}
                placeholder="https://x.com/username"
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <input
                type="url"
                name="github_url"
                value={formData.github_url || ''}
                onChange={handleChange}
                placeholder="https://github.com/username"
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <input
                type="url"
                name="website_url"
                value={formData.website_url || ''}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                style={{
                  width: '100%',
                  padding: 'var(--sp-2)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '4px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
          </div>

          {/* Looking For */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              {t('profile.looking_for')}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
              {LOOKING_FOR_OPTIONS.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleLookingForToggle(option)}
                  style={{
                    padding: 'var(--sp-1) var(--sp-3)',
                    background: (formData.looking_for || []).includes(option)
                      ? 'var(--brand-coral)'
                      : 'var(--bg-elevated)',
                    color: (formData.looking_for || []).includes(option)
                      ? '#fff'
                      : 'var(--text-muted)',
                    border: '1px solid var(--border-base)',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
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
            onClick={handleSubmit}
            style={{
              padding: 'var(--sp-2) var(--sp-4)',
              background: 'var(--brand-coral)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
