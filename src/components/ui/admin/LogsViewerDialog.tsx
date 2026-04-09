'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

interface AdminLog {
  id: string;
  admin_username: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  entity_name?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
}

interface LogsViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogsViewerDialog({ isOpen, onClose }: LogsViewerDialogProps) {
  const { t, language } = useLanguage();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    action: '',
    entity_type: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen, page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (filters.action) params.append('action', filters.action);
      if (filters.entity_type) params.append('entity_type', filters.entity_type);

      const response = await fetch(`/api/admin/logs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setLogs(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionText = (action: string) => {
    const actionMap: Record<string, { zh: string; en: string }> = {
      'create': { zh: '创建', en: 'Create' },
      'update': { zh: '更新', en: 'Update' },
      'delete': { zh: '删除', en: 'Delete' },
      'ban': { zh: '封禁', en: 'Ban' },
      'unban': { zh: '解封', en: 'Unban' },
      'hide': { zh: '隐藏', en: 'Hide' },
      'show': { zh: '显示', en: 'Show' },
      'login': { zh: '登录', en: 'Login' },
      'logout': { zh: '登出', en: 'Logout' },
    };
    return actionMap[action]?.[language] || action;
  };

  const getEntityTypeText = (type?: string) => {
    if (!type) return '-';
    const typeMap: Record<string, { zh: string; en: string }> = {
      'user': { zh: '用户', en: 'User' },
      'hackathon': { zh: '黑客松', en: 'Hackathon' },
      'project': { zh: '项目', en: 'Project' },
      'story': { zh: '文章', en: 'Story' },
      'badge': { zh: '徽章', en: 'Badge' },
      'admin': { zh: '管理员', en: 'Admin' },
    };
    return typeMap[type]?.[language] || type;
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
        maxWidth: '1200px',
        width: '95%',
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
            {language === 'zh' ? '操作日志' : 'Operation Logs'}
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

        {/* Filters */}
        <div style={{
          padding: 'var(--sp-4)',
          borderBottom: '1px solid var(--border-base)',
          display: 'flex',
          gap: 'var(--sp-3)',
          flexWrap: 'wrap',
        }}>
          <select
            value={filters.action}
            onChange={(e) => {
              setFilters({ ...filters, action: e.target.value });
              setPage(1);
            }}
            style={{
              padding: 'var(--sp-2)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-base)',
              borderRadius: '4px',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            <option value="">{language === 'zh' ? '所有操作' : 'All Actions'}</option>
            <option value="create">{language === 'zh' ? '创建' : 'Create'}</option>
            <option value="update">{language === 'zh' ? '更新' : 'Update'}</option>
            <option value="delete">{language === 'zh' ? '删除' : 'Delete'}</option>
            <option value="ban">{language === 'zh' ? '封禁' : 'Ban'}</option>
            <option value="unban">{language === 'zh' ? '解封' : 'Unban'}</option>
          </select>

          <select
            value={filters.entity_type}
            onChange={(e) => {
              setFilters({ ...filters, entity_type: e.target.value });
              setPage(1);
            }}
            style={{
              padding: 'var(--sp-2)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-base)',
              borderRadius: '4px',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            <option value="">{language === 'zh' ? '所有实体' : 'All Entities'}</option>
            <option value="user">{language === 'zh' ? '用户' : 'User'}</option>
            <option value="hackathon">{language === 'zh' ? '黑客松' : 'Hackathon'}</option>
            <option value="project">{language === 'zh' ? '项目' : 'Project'}</option>
            <option value="story">{language === 'zh' ? '文章' : 'Story'}</option>
            <option value="badge">{language === 'zh' ? '徽章' : 'Badge'}</option>
            <option value="admin">{language === 'zh' ? '管理员' : 'Admin'}</option>
          </select>
        </div>

        {/* Logs List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--sp-4)',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)' }}>
              {language === 'zh' ? '加载中...' : 'Loading...'}
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)' }}>
              {language === 'zh' ? '暂无日志' : 'No logs found'}
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              padding: 'var(--sp-4)',
            }}>
              <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                    <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '时间' : 'Time'}</th>
                    <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '管理员' : 'Admin'}</th>
                    <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '操作' : 'Action'}</th>
                    <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '实体类型' : 'Entity'}</th>
                    <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '实体名称' : 'Name'}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--bg-elevated)' }}>
                      <td style={{ padding: 'var(--sp-3) 0', fontSize: '12px' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td style={{ padding: 'var(--sp-3) 0' }}>{log.admin_username}</td>
                      <td style={{ padding: 'var(--sp-3) 0' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: getActionColor(log.action),
                          color: '#fff',
                        }}>
                          {getActionText(log.action)}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--sp-3) 0' }}>{getEntityTypeText(log.entity_type)}</td>
                      <td style={{ padding: 'var(--sp-3) 0' }}>{log.entity_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: 'var(--sp-4)',
            borderTop: '1px solid var(--border-base)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--sp-3)',
          }}>
            <Button
              variant="ghost"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              {language === 'zh' ? '上一页' : 'Previous'}
            </Button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {language === 'zh' ? '第' : 'Page'} {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
            >
              {language === 'zh' ? '下一页' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function getActionColor(action: string): string {
  const colors: Record<string, string> = {
    'create': 'var(--brand-green)',
    'update': 'var(--brand-amber)',
    'delete': 'var(--brand-coral)',
    'ban': 'var(--brand-coral)',
    'unban': 'var(--brand-green)',
    'hide': 'var(--text-muted)',
    'show': 'var(--brand-green)',
    'login': 'var(--brand-green)',
    'logout': 'var(--text-muted)',
  };
  return colors[action] || 'var(--text-muted)';
}
