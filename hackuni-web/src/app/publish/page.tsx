'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_HACKATHONS } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PublishProjectPage() {
  const { t, language } = useLanguage();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success message and redirect
    alert(t('publish.success'));
    router.push('/goat-hunt');
    setSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0, textTransform: 'uppercase' }}>
          &gt; {t('publish.title')}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
          {t('publish.subtitle')}
        </p>
      </div>

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

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

        {/* Long Description */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {t('publish.long_desc')} *
          </label>
          <textarea
            name="long_desc"
            value={formData.long_desc}
            onChange={handleInputChange}
            required
            placeholder={language === 'zh' ? '详细描述你的项目。它解决了什么问题？你是如何构建的？' : 'Describe your project in detail. What problem does it solve? How did you build it?'}
            rows={6}
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
        </div>

        {/* Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
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
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end', marginTop: 'var(--sp-4)' }}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={submitting}
            style={{ cursor: 'pointer' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            style={{ cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? t('publish.publishing') : t('common.submit')}
          </Button>
        </div>
      </form>
    </main>
  );
}
