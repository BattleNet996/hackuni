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

export function HackathonRecordDialog({ isOpen, onClose, hackathons, onSuccess }: HackathonRecordDialogProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = React.useState({
    hackathon_id: '',
    hackathon_title: '',
    role: '',
    project_name: '',
    project_url: '',
    award_text: '',
    proof_url: '',
    notes: '',
  });
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleHackathonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedHackathon = hackathons.find((hackathon) => hackathon.id === selectedId);

    setFormData((prev) => ({
      ...prev,
      hackathon_id: selectedId,
      hackathon_title: selectedHackathon?.title || '',
    }));
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
      const text = String(error?.message || '');
      setMessage(
        text.includes('schema migration')
          ? (language === 'zh' ? '需要先执行 Supabase 黑客松记录迁移 SQL' : 'Supabase hackathon record migration must be applied first')
          : text
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--sp-2)',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-base)',
    borderRadius: '4px',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-body)',
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
        width: 'min(720px, 100%)',
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
          <h3 style={{ margin: 0, fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)' }}>
            {language === 'zh' ? '新增黑客松记录' : 'Add Hackathon Record'}
          </h3>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
          <input style={fieldStyle} value={formData.role} placeholder={language === 'zh' ? '角色：队长 / 开发 / 设计...' : 'Role: lead / dev / design...'} onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))} />
          <input style={fieldStyle} value={formData.project_name} placeholder={language === 'zh' ? '项目名称' : 'Project name'} onChange={(e) => setFormData((prev) => ({ ...prev, project_name: e.target.value }))} />
          <input style={fieldStyle} value={formData.project_url} placeholder={language === 'zh' ? '项目链接' : 'Project URL'} onChange={(e) => setFormData((prev) => ({ ...prev, project_url: e.target.value }))} />
          <input style={fieldStyle} value={formData.award_text} placeholder={language === 'zh' ? '奖项（可选）' : 'Award (optional)'} onChange={(e) => setFormData((prev) => ({ ...prev, award_text: e.target.value }))} />
        </div>

        <input style={fieldStyle} value={formData.proof_url} placeholder={language === 'zh' ? '证明链接：项目页 / 公告 / Demo / GitHub' : 'Proof URL: project page / announcement / demo / GitHub'} onChange={(e) => setFormData((prev) => ({ ...prev, proof_url: e.target.value }))} />
        <textarea style={{ ...fieldStyle, resize: 'vertical' }} rows={4} value={formData.notes} placeholder={language === 'zh' ? '补充说明：你做了什么、为什么值得认证' : 'Notes: what you did and why it should be verified'} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} />

        {message && <div style={{ color: 'var(--brand-coral)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{message}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-3)' }}>
          <Button type="button" variant="ghost" onClick={onClose}>{language === 'zh' ? '取消' : 'Cancel'}</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (language === 'zh' ? '提交中...' : 'Submitting...') : (language === 'zh' ? '提交审核' : 'Submit for Review')}
          </Button>
        </div>
      </form>
    </div>
  );
}
