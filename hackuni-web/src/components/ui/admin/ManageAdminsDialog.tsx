'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

interface AdminUser {
  id: string;
  username: string;
  email?: string;
  is_active: number;
  last_login_at?: string;
  created_at: string;
}

interface ManageAdminsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManageAdminsDialog({ isOpen, onClose, onSuccess }: ManageAdminsDialogProps) {
  const { t, language } = useLanguage();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', email: '' });

  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
    }
  }, [isOpen]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/admins');
      const data = await response.json();
      if (response.ok) {
        setAdmins(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(language === 'zh' ? '管理员创建成功！' : 'Admin created successfully!');
        setNewAdmin({ username: '', password: '', email: '' });
        setShowCreateForm(false);
        fetchAdmins();
        setTimeout(() => {
          onSuccess();
          setMessage('');
        }, 1500);
      } else {
        setMessage(data.error?.message || (language === 'zh' ? '创建失败' : 'Create failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '创建失败，请重试' : 'Create failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (adminId: string, isActive: number) => {
    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive ? 0 : 1 }),
      });

      if (response.ok) {
        setMessage(isActive ? (language === 'zh' ? '管理员已禁用' : 'Admin disabled') : (language === 'zh' ? '管理员已启用' : 'Admin enabled'));
        fetchAdmins();
      } else {
        const data = await response.json();
        setMessage(data.error?.message || (language === 'zh' ? '操作失败' : 'Operation failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm(language === 'zh' ? '确定要删除此管理员吗？' : 'Are you sure you want to delete this admin?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(language === 'zh' ? '管理员已删除' : 'Admin deleted');
        fetchAdmins();
      } else {
        const data = await response.json();
        setMessage(data.error?.message || (language === 'zh' ? '删除失败' : 'Delete failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '删除失败' : 'Delete failed');
    }
  };

  const handleChangePassword = async (adminId: string, newPassword: string) => {
    if (!newPassword) return;

    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        setMessage(language === 'zh' ? '密码已修改' : 'Password updated');
      } else {
        const data = await response.json();
        setMessage(data.error?.message || (language === 'zh' ? '修改失败' : 'Update failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '修改失败' : 'Update failed');
    }
  };

  if (!isOpen) return null;

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
        {/* Header */}
        <div style={{
          padding: 'var(--sp-4)',
          borderBottom: '1px solid var(--border-base)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h3)' }}>
            {language === 'zh' ? '管理员管理' : 'Manage Admins'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--sp-4)',
        }}>
          {message && (
            <div style={{
              padding: 'var(--sp-3)',
              marginBottom: 'var(--sp-4)',
              borderRadius: '4px',
              textAlign: 'center',
              background: message.includes(language === 'zh' ? '成功' : 'success') || message.includes('updated') || message.includes('created') || message.includes('enabled')
                ? 'rgba(0, 255, 65, 0.1)'
                : 'rgba(255, 65, 65, 0.1)',
              color: message.includes(language === 'zh' ? '成功' : 'success') || message.includes('updated') || message.includes('created') || message.includes('enabled')
                ? 'var(--brand-green)'
                : 'var(--brand-coral)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
            }}>
              {message}
              <button
                onClick={() => setMessage('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  marginLeft: 'var(--sp-2)',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            </div>
          )}

          {!showCreateForm ? (
            <>
              <div style={{
                background: 'var(--bg-elevated)',
                padding: 'var(--sp-4)',
                marginBottom: 'var(--sp-4)',
                borderRadius: '4px',
              }}>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateForm(true)}
                  style={{ cursor: 'pointer' }}
                >
                  {language === 'zh' ? '+ 添加管理员' : '+ Add Admin'}
                </Button>
              </div>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                padding: 'var(--sp-4)',
              }}>
                <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '用户名' : 'USERNAME'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '邮箱' : 'Email'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '状态' : 'Status'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '最后登录' : 'Last Login'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '操作' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(admin => (
                      <tr key={admin.id} style={{ borderBottom: '1px solid var(--bg-elevated)' }}>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{admin.username}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{admin.email || '-'}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span style={{
                            color: admin.is_active ? 'var(--brand-green)' : 'var(--text-muted)',
                            fontSize: '11px'
                          }}>
                            {admin.is_active ? (language === 'zh' ? '启用' : 'Active') : (language === 'zh' ? '禁用' : 'Disabled')}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0', fontSize: '12px' }}>
                          {admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : (language === 'zh' ? '从未' : 'Never')}
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => {
                                const newPass = prompt(language === 'zh' ? '输入新密码:' : 'Enter new password:');
                                if (newPass) handleChangePassword(admin.id, newPass);
                              }}
                              style={{
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                background: 'transparent',
                                border: '1px solid var(--border-base)',
                                borderRadius: '4px',
                                color: 'var(--text-main)',
                              }}
                            >
                              {language === 'zh' ? '修改密码' : 'Password'}
                            </button>
                            <button
                              onClick={() => handleToggleActive(admin.id, admin.is_active)}
                              style={{
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                background: 'transparent',
                                border: '1px solid var(--border-base)',
                                borderRadius: '4px',
                                color: admin.is_active ? 'var(--brand-coral)' : 'var(--brand-green)',
                              }}
                            >
                              {admin.is_active ? (language === 'zh' ? '禁用' : 'Disable') : (language === 'zh' ? '启用' : 'Enable')}
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin.id)}
                              style={{
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                background: 'transparent',
                                border: '1px solid var(--border-base)',
                                borderRadius: '4px',
                                color: 'var(--brand-coral)',
                              }}
                            >
                              {language === 'zh' ? '删除' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateAdmin} style={{
              background: 'var(--bg-elevated)',
              padding: 'var(--sp-4)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-4)',
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  {language === 'zh' ? '用户名' : 'Username'}
                </label>
                <input
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  required
                  style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  {language === 'zh' ? '密码' : 'Password'}
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                  style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 'var(--sp-2)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  {language === 'zh' ? '邮箱（可选）' : 'Email (optional)'}
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  style={{ width: '100%', padding: 'var(--sp-2)', background: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: '4px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewAdmin({ username: '', password: '', email: '' });
                  }}
                  type="button"
                  style={{ cursor: 'pointer' }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? (language === 'zh' ? '创建中...' : 'Creating...') : (language === 'zh' ? '创建' : 'Create')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
