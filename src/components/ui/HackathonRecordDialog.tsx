'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch } from '@/lib/api-client';
import { clearJsonCacheByPrefix } from '@/lib/client-cache';

interface HackathonOption {
  id: string;
  title: string;
}

interface HackathonRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hackathons: HackathonOption[];
  onSuccess: () => void;
}

const ROLE_OPTIONS = [
  { value: 'captain', zh: '队长', en: 'Captain' },
  { value: 'member', zh: '队员', en: 'Member' },
];

const CONTRIBUTION_OPTIONS = [
  { value: 'software', zh: '软件开发', en: 'Software' },
  { value: 'hardware', zh: '硬件开发', en: 'Hardware' },
  { value: 'design', zh: '设计', en: 'Design' },
  { value: 'business', zh: '商业', en: 'Business' },
  { value: 'other', zh: '其他', en: 'Other' },
];

export function HackathonRecordDialog({ isOpen, onClose, hackathons, onSuccess }: HackathonRecordDialogProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = React.useState({
    hackathon_id: '',
    hackathon_title: '',
    role: 'member',
    contribution_areas: [] as string[],
    contribution_other: '',
    project_name: '',
    project_url: '',
    award_text: '',
    proof_url: '',
    proof_image_url: '',
    notes: '',
  });
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingProof, setIsUploadingProof] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setIsSubmitting(false);
      setIsUploadingProof(false);
      setFormData({
        hackathon_id: '',
        hackathon_title: '',
        role: 'member',
        contribution_areas: [],
        contribution_other: '',
        project_name: '',
        project_url: '',
        award_text: '',
        proof_url: '',
        proof_image_url: '',
        notes: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--sp-2)',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-base)',
    borderRadius: '4px',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-body)',
  };

  const handleHackathonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedHackathon = hackathons.find((hackathon) => hackathon.id === selectedId);

    setFormData((prev) => ({
      ...prev,
      hackathon_id: selectedId,
      hackathon_title: selectedHackathon?.title || '',
    }));
  };

  const toggleContributionArea = (value: string) => {
    setFormData((prev) => {
      const exists = prev.contribution_areas.includes(value);
      const next = exists
        ? prev.contribution_areas.filter((item) => item !== value)
        : [...prev.contribution_areas, value].slice(0, 6);

      return {
        ...prev,
        contribution_areas: next,
        contribution_other: next.includes('other') ? prev.contribution_other : '',
      };
    });
  };

  const handleProofImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage(language === 'zh' ? '证明附件需为图片' : 'Proof attachment must be an image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage(language === 'zh' ? '证明附件请控制在 5MB 以内' : 'Proof attachment must be under 5MB');
      return;
    }

    setMessage('');
    setIsUploadingProof(true);

    try {
      const body = new FormData();
      body.append('file', file);

      const response = await apiFetch('/api/profile/hackathon-records/upload', {
        method: 'POST',
        body,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || (language === 'zh' ? '附件上传失败' : 'Failed to upload proof'));
      }

      setFormData((prev) => ({ ...prev, proof_image_url: data.data?.url || '' }));
    } catch (error: any) {
      setMessage(String(error?.message || (language === 'zh' ? '附件上传失败' : 'Failed to upload proof')));
    } finally {
      setIsUploadingProof(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await apiFetch('/api/profile/hackathon-records', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to submit record');
      }

      clearJsonCacheByPrefix('/api/builders');
      onSuccess();
      onClose();
    } catch (error: any) {
      setMessage(String(error?.message || (language === 'zh' ? '提交失败，请稍后重试' : 'Failed to submit record')));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.82)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--sp-4)',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: 'min(820px, 100%)',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        padding: 'var(--sp-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-4)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)' }}>
              {language === 'zh' ? '新增黑客松记录' : 'Add Hackathon Record'}
            </h3>
            <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {language === 'zh' ? '提交后进入管理员审核，通过后会标记认证并计入主页' : 'Submitted records go to admin review before verification.'}
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>x</button>
        </div>

        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
          {language === 'zh' ? '参与的黑客松' : 'Hackathon'}
          <select value={formData.hackathon_id} onChange={handleHackathonChange} required style={{ ...fieldStyle, marginTop: 'var(--sp-2)' }}>
            <option value="">{language === 'zh' ? '选择黑客松' : 'Select hackathon'}</option>
            {hackathons.map((hackathon) => (
              <option key={hackathon.id} value={hackathon.id}>{hackathon.title}</option>
            ))}
          </select>
        </label>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {language === 'zh' ? '角色' : 'Role'}
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {ROLE_OPTIONS.map((option) => {
              const active = formData.role === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: option.value }))}
                  style={{
                    padding: 'var(--sp-2) var(--sp-4)',
                    borderRadius: '999px',
                    border: `1px solid ${active ? 'var(--brand-coral)' : 'var(--border-base)'}`,
                    background: active ? 'rgba(245, 107, 82, 0.12)' : 'var(--bg-elevated)',
                    color: active ? 'var(--brand-coral)' : 'var(--text-main)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {language === 'zh' ? option.zh : option.en}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {language === 'zh' ? '职能（多选）' : 'Contribution Areas'}
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {CONTRIBUTION_OPTIONS.map((option) => {
              const active = formData.contribution_areas.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleContributionArea(option.value)}
                  style={{
                    padding: 'var(--sp-2) var(--sp-3)',
                    borderRadius: '999px',
                    border: `1px solid ${active ? 'var(--brand-green)' : 'var(--border-base)'}`,
                    background: active ? 'rgba(125, 211, 160, 0.12)' : 'var(--bg-elevated)',
                    color: active ? 'var(--brand-green)' : 'var(--text-main)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {language === 'zh' ? option.zh : option.en}
                </button>
              );
            })}
          </div>
          {formData.contribution_areas.includes('other') && (
            <input
              style={{ ...fieldStyle, marginTop: 'var(--sp-3)' }}
              value={formData.contribution_other}
              placeholder={language === 'zh' ? '其他职能，请填写' : 'Describe other contribution'}
              onChange={(e) => setFormData((prev) => ({ ...prev, contribution_other: e.target.value }))}
            />
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
          <input style={fieldStyle} value={formData.project_name} placeholder={language === 'zh' ? '项目名称' : 'Project name'} onChange={(e) => setFormData((prev) => ({ ...prev, project_name: e.target.value }))} />
          <input style={fieldStyle} value={formData.project_url} placeholder={language === 'zh' ? '项目链接（可选）' : 'Project URL (optional)'} onChange={(e) => setFormData((prev) => ({ ...prev, project_url: e.target.value }))} />
          <input style={fieldStyle} value={formData.award_text} placeholder={language === 'zh' ? '奖项（可选）' : 'Award (optional)'} onChange={(e) => setFormData((prev) => ({ ...prev, award_text: e.target.value }))} />
          <input style={fieldStyle} value={formData.proof_url} placeholder={language === 'zh' ? '证明链接（可选）' : 'Proof URL (optional)'} onChange={(e) => setFormData((prev) => ({ ...prev, proof_url: e.target.value }))} />
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            {language === 'zh' ? '奖项证明图片（可选）' : 'Proof image (optional)'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <input
              id="hackathon-proof-upload"
              type="file"
              accept="image/*"
              onChange={handleProofImageUpload}
              disabled={isUploadingProof}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="hackathon-proof-upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: 'var(--sp-2) var(--sp-4)',
                border: '1px solid var(--border-base)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                cursor: isUploadingProof ? 'not-allowed' : 'pointer',
              }}
            >
              {isUploadingProof
                ? (language === 'zh' ? '上传中...' : 'Uploading...')
                : (language === 'zh' ? '上传图片附件' : 'Upload image')}
            </label>
            {formData.proof_image_url && (
              <a href={formData.proof_image_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-coral)', fontSize: '12px' }}>
                {language === 'zh' ? '查看已上传附件' : 'Open uploaded proof'}
              </a>
            )}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {language === 'zh' ? '支持图片，最大 5MB' : 'Images up to 5MB'}
            </span>
          </div>
        </div>

        <textarea
          style={{ ...fieldStyle, resize: 'vertical' }}
          rows={4}
          value={formData.notes}
          placeholder={language === 'zh' ? '补充说明：你具体做了什么、为什么值得认证' : 'Notes: what you contributed and why it should be verified'}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
        />

        {message && <div style={{ color: 'var(--brand-coral)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{message}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-3)' }}>
          <Button type="button" variant="ghost" onClick={onClose}>{language === 'zh' ? '取消' : 'Cancel'}</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || isUploadingProof}>
            {isSubmitting ? (language === 'zh' ? '提交中...' : 'Submitting...') : (language === 'zh' ? '提交审核' : 'Submit for Review')}
          </Button>
        </div>
      </form>
    </div>
  );
}
