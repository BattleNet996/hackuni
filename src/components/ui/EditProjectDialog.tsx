'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

interface Project {
  id: string;
  title: string;
  short_desc: string;
  long_desc: string | null;
  demo_url: string | null;
  github_url: string | null;
  website_url: string | null;
  team_member_text: string;
  tags_json: string[];
  is_awarded: boolean;
  award_text: string | null;
  images: string[];
  related_hackathon_id: string | null;
}

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess: () => void;
  submitUrlBase?: string;
}

export function EditProjectDialog({ isOpen, onClose, project, onSuccess, submitUrlBase = '/api/projects' }: EditProjectDialogProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        tags_json: Array.isArray(project.tags_json)
          ? project.tags_json.join(', ')
          : project.tags_json || ''
      } as any);
      setUploadedImages(project.images || []);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${submitUrlBase}/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags_json: formData.tags_json
            ? (formData.tags_json as any).toString().split(',').map((t: string) => t.trim())
            : [],
          images: uploadedImages,
          is_awarded: formData.is_awarded || false,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
        maxWidth: '800px',
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
            {language === 'zh' ? '编辑项目' : 'Edit Project'}
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
          {/* Title */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '项目标题' : 'Project Title'} *
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

          {/* Short Description */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '简短描述' : 'Short Description'} *
            </label>
            <input
              type="text"
              name="short_desc"
              value={formData.short_desc || ''}
              onChange={handleChange}
              required
              maxLength={150}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          {/* Long Description */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '详细描述' : 'Long Description'} *
            </label>
            <textarea
              name="long_desc"
              value={formData.long_desc || ''}
              onChange={handleChange}
              required
              rows={6}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.6' }}
            />
          </div>

          {/* Images */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '项目图片' : 'Project Images'}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ marginBottom: 'var(--sp-2)' }}
            />
            {uploadedImages.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: 'var(--sp-2)',
              }}>
                {uploadedImages.map((imageUrl, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={imageUrl}
                      alt={`Upload ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '80px',
                        objectFit: 'cover',
                        border: '1px solid var(--border-base)',
                        borderRadius: '4px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'var(--brand-coral)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '演示链接' : 'Demo URL'}
              </label>
              <input
                type="url"
                name="demo_url"
                value={formData.demo_url || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                GitHub URL
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '网站链接' : 'Website URL'}
            </label>
            <input
              type="url"
              name="website_url"
              value={formData.website_url || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          {/* Team Members */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '团队成员' : 'Team Members'} *
            </label>
            <input
              type="text"
              name="team_member_text"
              value={formData.team_member_text || ''}
              onChange={handleChange}
              required
              placeholder="@member1 @member2"
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '标签（逗号分隔）' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              name="tags_json"
              value={(formData.tags_json as any) || ''}
              onChange={handleChange}
              placeholder="AI, Web3, Hardware"
              style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
            />
          </div>

          {/* Award */}
          <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              name="is_awarded"
              id="edit_is_awarded"
              checked={formData.is_awarded || false}
              onChange={handleChange}
              style={{ marginTop: '4px' }}
            />
            <div style={{ flex: 1 }}>
              <label htmlFor="edit_is_awarded" style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {language === 'zh' ? '获得奖项' : 'Awarded'}
              </label>
              {(formData as any).is_awarded && (
                <input
                  type="text"
                  name="award_text"
                  value={formData.award_text || ''}
                  onChange={handleChange}
                  placeholder={language === 'zh' ? '奖项名称' : 'Award name'}
                  style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
                />
              )}
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
