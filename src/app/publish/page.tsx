'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_HACKATHONS } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api-client';

export default function PublishProjectPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    title: '',
    short_desc: '',
    long_desc: '',
    demo_url: '',
    github_url: '',
    website_url: '',
    team_name: '',
    hackathon_id: '',
    award_text: '',
    is_awarded: false,
    tags_json: [] as string[],
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState('');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          short_desc: formData.short_desc,
          long_desc: formData.long_desc,
          demo_url: formData.demo_url || null,
          github_url: formData.github_url || null,
          website_url: formData.website_url || null,
          team_member_text: formData.team_name,
          hackathon_id: formData.hackathon_id || null,
          is_awarded: formData.is_awarded,
          award_text: formData.award_text || null,
          tags_json: formData.tags_json,
          images: uploadedImages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(language === 'zh' ? '发布成功！' : 'Published successfully!');
        setTimeout(() => {
          router.push('/goat-hunt');
        }, 1500);
      } else {
        setMessage(data.error?.message || (language === 'zh' ? '发布失败' : 'Failed to publish'));
      }
    } catch (error) {
      console.error('Failed to publish project:', error);
      setMessage(language === 'zh' ? '发布失败，请重试' : 'Failed to publish, please try again');
    }

    setSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const insertImageAtCursor = (imageIndex: number) => {
    const textarea = document.querySelector('textarea[name="long_desc"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.long_desc;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const placeholder = `[IMAGE:${imageIndex}]`;

    setFormData(prev => ({
      ...prev,
      long_desc: before + placeholder + after,
    }));

    // Set cursor position after the inserted image
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
      textarea.focus();
    }, 0);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Also remove references to this image in the description
      setFormData(prev => ({
        ...prev,
        long_desc: prev.long_desc.replace(new RegExp(`\\[IMAGE:${index}\\]`, 'g'), ''),
      }));
      return newImages;
    });
  };

  return (
    <main style={{ padding: 'var(--sp-6) var(--sp-4)', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', margin: 0, textTransform: 'uppercase' }}>
          &gt; {t('publish.title')}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)', fontSize: '13px' }}>
          {t('publish.subtitle')}
        </p>
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-5)' }}></div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        {/* Project Title */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {t('publish.project_title')} *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder={language === 'zh' ? '输入你的项目名称' : 'Enter your project name'}
            style={{
              width: '100%',
              padding: 'var(--sp-3)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-main)',
            }}
          />
        </div>

        {/* Short Description */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {t('publish.short_desc')} *
          </label>
          <input
            type="text"
            name="short_desc"
            value={formData.short_desc}
            onChange={handleInputChange}
            required
            placeholder={language === 'zh' ? '项目一句话总结（最多150字）' : 'One-line summary of your project (max 150 characters)'}
            maxLength={150}
            style={{
              width: '100%',
              padding: 'var(--sp-3)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-main)',
            }}
          />
        </div>

        {/* Long Description with Image Upload */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {t('publish.long_desc')} *
          </label>

          {/* Image Upload Section */}
          <div style={{ marginBottom: 'var(--sp-3)' }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                padding: 'var(--sp-2) var(--sp-3)',
                background: 'var(--bg-elevated)',
                border: '1px dashed var(--brand-coral)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--brand-coral)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--brand-coral)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-elevated)';
                e.currentTarget.style.color = 'var(--brand-coral)';
              }}
            >
              📷 {language === 'zh' ? '上传图片' : 'Upload Images'}
            </label>
            <span style={{ marginLeft: 'var(--sp-2)', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {language === 'zh' ? '支持单张或多张图片' : 'Support single or multiple images'}
            </span>
          </div>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 'var(--sp-3)',
              marginBottom: 'var(--sp-3)',
            }}>
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      border: '1px solid var(--border-base)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    #{index + 1}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--sp-1)', marginTop: 'var(--sp-1)' }}>
                    <button
                      type="button"
                      onClick={() => insertImageAtCursor(index)}
                      style={{
                        flex: 1,
                        padding: '4px',
                        fontSize: '11px',
                        background: 'var(--brand-green)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {language === 'zh' ? '插入' : 'Insert'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        flex: 1,
                        padding: '4px',
                        fontSize: '11px',
                        background: 'var(--brand-coral)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {language === 'zh' ? '删除' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <textarea
            name="long_desc"
            value={formData.long_desc}
            onChange={handleInputChange}
            required
            placeholder={language === 'zh' ? '详细描述你的项目。它解决了什么问题？你是如何构建的？\n\n点击上方"插入"按钮可以在光标位置插入图片标记，格式：[IMAGE:1]' : 'Describe your project in detail. What problem does it solve? How did you build it?\n\nClick "Insert" above to insert image markers at cursor position. Format: [IMAGE:1]'}
            rows={8}
            style={{
              width: '100%',
              padding: 'var(--sp-3)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-main)',
              resize: 'vertical',
            }}
          />
          <div style={{ marginTop: 'var(--sp-2)', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            💡 {language === 'zh' ? '提示：上传图片后点击"插入"按钮，会在光标位置插入 [IMAGE:数字] 标记，实际图片数据会被自动隐藏' : 'Tip: After uploading images, click "Insert" to add [IMAGE:number] markers at cursor position. Actual image data is hidden'}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--sp-4)' }} className="links-grid">
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              {t('publish.demo_url')}
            </label>
            <input
              type="url"
              name="demo_url"
              value={formData.demo_url}
              onChange={handleInputChange}
              placeholder="https://demo.example.com"
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--text-main)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              {t('publish.github_url')}
            </label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleInputChange}
              placeholder="https://github.com/user/repo"
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Website URL */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {t('publish.website_url')}
          </label>
          <input
            type="url"
            name="website_url"
            value={formData.website_url}
            onChange={handleInputChange}
            placeholder="https://yourproject.com"
            style={{
              width: '100%',
              padding: 'var(--sp-3)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-main)',
            }}
          />
        </div>

        {/* Team Name */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {t('publish.team_name')} *
          </label>
          <input
            type="text"
            name="team_name"
            value={formData.team_name}
            onChange={handleInputChange}
            required
            placeholder="@team_member1 @team_member2 @team_member3"
            style={{
              width: '100%',
              padding: 'var(--sp-3)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              color: 'var(--text-main)',
            }}
          />
        </div>

        {/* Related Hackathon */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {t('publish.related_hackathon')}
          </label>
          <select
            name="hackathon_id"
            value={formData.hackathon_id}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: 'var(--sp-3)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-main)',
            }}
          >
            <option value="">{language === 'zh' ? '选择黑客松（可选）' : 'Select a hackathon (optional)'}</option>
            {MOCK_HACKATHONS.map(hack => (
              <option key={hack.id} value={hack.id}>
                {hack.title} - {hack.city}
              </option>
            ))}
          </select>
        </div>

        {/* Award Information */}
        <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            name="is_awarded"
            id="is_awarded"
            checked={formData.is_awarded}
            onChange={handleInputChange}
            style={{ marginTop: '4px' }}
          />
          <div style={{ flex: 1 }}>
            <label htmlFor="is_awarded" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
              {t('publish.won_award')}
            </label>
            {formData.is_awarded && (
              <input
                type="text"
                name="award_text"
                value={formData.award_text}
                onChange={handleInputChange}
                placeholder={t('publish.award_placeholder')}
                style={{
                  width: '100%',
                  padding: 'var(--sp-3)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--text-main)',
                  marginTop: 'var(--sp-2)',
                }}
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        {message && (
          <div style={{
            padding: 'var(--sp-3)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            background: message.includes(language === 'zh' ? '成功' : 'success')
              ? 'rgba(0, 255, 65, 0.1)'
              : 'rgba(255, 65, 65, 0.1)',
            color: message.includes(language === 'zh' ? '成功' : 'success')
              ? 'var(--brand-green)'
              : 'var(--brand-coral)',
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
          }}>
            {message}
          </div>
        )}
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end', marginTop: 'var(--sp-4)', flexWrap: 'wrap' }} className="button-group">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={submitting}
            style={{ cursor: 'pointer', flex: 1, minWidth: '120px' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            style={{ cursor: submitting ? 'not-allowed' : 'pointer', flex: 1, minWidth: '120px' }}
          >
            {submitting ? t('publish.publishing') : t('common.submit')}
          </Button>
        </div>
      </form>

      <style jsx>{`
        @media (min-width: 769px) {
          .links-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .button-group {
            flex-wrap: nowrap !important;
          }
        }
      `}</style>
    </main>
  );
}
