'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { PublishDialog } from '@/components/ui/PublishDialog';
import { EditHackathonDialog } from '@/components/ui/admin/EditHackathonDialog';
import { EditStoryDialog } from '@/components/ui/admin/EditStoryDialog';
import { EditBadgeDialog } from '@/components/ui/admin/EditBadgeDialog';
import { ManageAdminsDialog } from '@/components/ui/admin/ManageAdminsDialog';
import { LogsViewerDialog } from '@/components/ui/admin/LogsViewerDialog';

interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar?: string;
  school?: string;
  company?: string;
  is_banned?: number;
  created_at: string;
}

interface Hackathon {
  id: string;
  title: string;
  city: string;
  country: string;
  start_time: string;
  end_time: string;
  registration_status: string;
  poster_url?: string;
  hidden?: number;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  like_count: number;
  status: string;
  user_id: string;
  hidden?: number;
  created_at: string;
}

interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  source?: string;
  author_name: string;
  published_at: string;
  like_count: number;
  hidden?: number;
}

interface Badge {
  id: string;
  badge_code: string;
  badge_name: string;
  badge_name_en: string;
  badge_desc: string;
  badge_desc_en: string;
  badge_type: string;
  icon_url?: string;
}

interface AdminStats {
  totalUsers: number;
  totalHackathons: number;
  totalProjects: number;
  totalStories: number;
  totalBadges: number;
  pendingReviews: number;
  pendingBadges: number;
}

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const { adminUser, logout: adminLogout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalHackathons: 0,
    totalProjects: 0,
    totalStories: 0,
    totalBadges: 0,
    pendingReviews: 0,
    pendingBadges: 0,
  });

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any>(null);

  // Dialog states
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishDialogType, setPublishDialogType] = useState<'hackathon' | 'story' | 'badge'>('hackathon');
  const [editHackathonOpen, setEditHackathonOpen] = useState(false);
  const [editStoryOpen, setEditStoryOpen] = useState(false);
  const [editBadgeOpen, setEditBadgeOpen] = useState(false);
  const [manageAdminsOpen, setManageAdminsOpen] = useState(false);
  const [logsViewerOpen, setLogsViewerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // Loading states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (response.ok) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchHackathons = async () => {
    try {
      const response = await fetch('/api/admin/hackathons');
      const data = await response.json();
      if (response.ok) {
        setHackathons(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      if (response.ok) {
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/admin/stories');
      const data = await response.json();
      if (response.ok) {
        setStories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/admin/badges');
      const data = await response.json();
      if (response.ok) {
        setBadges(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    }
  };

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews');
      const data = await response.json();
      if (response.ok) {
        setPendingReviews(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pending reviews:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'hackathons') fetchHackathons();
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'stories') fetchStories();
    if (activeTab === 'badges') fetchBadges();
    if (activeTab === 'reviews') fetchPendingReviews();
  }, [activeTab]);

  const overviewStats = [
    { label: 'metrics.total_users', value: stats.totalUsers, color: 'var(--brand-green)' },
    { label: 'metrics.total_hackathons', value: stats.totalHackathons, color: 'var(--brand-coral)' },
    { label: 'metrics.total_projects', value: stats.totalProjects, color: 'var(--brand-green)' },
    { label: 'metrics.total_stories', value: stats.totalStories, color: 'var(--brand-coral)' },
    { label: 'metrics.pending_reviews', value: stats.pendingReviews, color: 'var(--brand-amber)' },
    { label: 'metrics.pending_badges', value: stats.pendingBadges, color: 'var(--brand-amber)' },
  ];

  const navTabs = [
    { id: 'overview', label: 'admin.overview' },
    { id: 'hackathons', label: 'nav.hackathons' },
    { id: 'projects', label: 'profile.projects' },
    { id: 'stories', label: 'nav.stories' },
    { id: 'badges', label: 'nav.badges' },
    { id: 'users', label: 'admin.manage_users' },
    { id: 'admins', label: 'admin.manage_admins' },
    { id: 'reviews', label: 'admin.review_submissions' },
  ];

  // CRUD Operations
  const handleDeleteUser = async (userId: string) => {
    setConfirmAction(async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMessage(language === 'zh' ? '用户已删除' : 'User deleted');
          fetchUsers();
          fetchStats();
        } else {
          const data = await response.json();
          setMessage(data.error?.message || (language === 'zh' ? '删除失败' : 'Delete failed'));
        }
      } catch (error) {
        setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
      }
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleToggleBanUser = async (userId: string, isBanned: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_banned: isBanned ? 0 : 1 }),
      });
      if (response.ok) {
        setMessage(isBanned ? (language === 'zh' ? '用户已解封' : 'User unbanned') : (language === 'zh' ? '用户已封禁' : 'User banned'));
        fetchUsers();
      } else {
        const data = await response.json();
        setMessage(data.error?.message || (language === 'zh' ? '操作失败' : 'Operation failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
    }
  };

  const handleEditHackathon = (hack: Hackathon) => {
    setEditingItem(hack);
    setEditHackathonOpen(true);
  };

  const handleDeleteHackathon = async (hackId: string) => {
    setConfirmAction(async () => {
      try {
        const response = await fetch(`/api/admin/hackathons/${hackId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMessage(language === 'zh' ? '黑客松已删除' : 'Hackathon deleted');
          fetchHackathons();
          fetchStats();
        } else {
          const data = await response.json();
          setMessage(data.error?.message || (language === 'zh' ? '删除失败' : 'Delete failed'));
        }
      } catch (error) {
        setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
      }
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleToggleHideHackathon = async (hackId: string, hidden: number) => {
    try {
      const response = await fetch(`/api/admin/hackathons/${hackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden: hidden ? 0 : 1 }),
      });
      if (response.ok) {
        setMessage(hidden ? (language === 'zh' ? '黑客松已显示' : 'Hackathon visible') : (language === 'zh' ? '黑客松已隐藏' : 'Hackathon hidden'));
        fetchHackathons();
      } else {
        const data = await response.json();
        setMessage(data.error?.message || (language === 'zh' ? '操作失败' : 'Operation failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
    }
  };

  const handleHideProject = async (projectId: string, hidden: number) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden: hidden ? 0 : 1 }),
      });
      if (response.ok) {
        setMessage(hidden ? (language === 'zh' ? '项目已显示' : 'Project visible') : (language === 'zh' ? '项目已隐藏' : 'Project hidden'));
        fetchProjects();
      } else {
        const data = await response.json();
        setMessage(data.error?.message || (language === 'zh' ? '操作失败' : 'Operation failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setConfirmAction(async () => {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMessage(language === 'zh' ? '项目已删除' : 'Project deleted');
          fetchProjects();
          fetchStats();
        } else {
          const data = await response.json();
          setMessage(data.error?.message || (language === 'zh' ? '删除失败' : 'Delete failed'));
        }
      } catch (error) {
        setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
      }
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleEditStory = (story: Story) => {
    setEditingItem(story);
    setEditStoryOpen(true);
  };

  const handleToggleHideStory = async (storyId: string, hidden: number) => {
    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden: hidden ? 0 : 1 }),
      });
      if (response.ok) {
        setMessage(hidden ? (language === 'zh' ? '文章已显示' : 'Story visible') : (language === 'zh' ? '文章已隐藏' : 'Story hidden'));
        fetchStories();
      } else {
        const data = await response.json();
        setMessage(data.error?.message || (language === 'zh' ? '操作失败' : 'Operation failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    setConfirmAction(async () => {
      try {
        const response = await fetch(`/api/admin/stories/${storyId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMessage(language === 'zh' ? '文章已删除' : 'Story deleted');
          fetchStories();
          fetchStats();
        } else {
          const data = await response.json();
          setMessage(data.error?.message || (language === 'zh' ? '删除失败' : 'Delete failed'));
        }
      } catch (error) {
        setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
      }
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleEditBadge = (badge: Badge) => {
    setEditingItem(badge);
    setEditBadgeOpen(true);
  };

  const handleDeleteBadge = async (badgeId: string) => {
    setConfirmAction(async () => {
      try {
        const response = await fetch(`/api/admin/badges/${badgeId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMessage(language === 'zh' ? '徽章已删除' : 'Badge deleted');
          fetchBadges();
          fetchStats();
        } else {
          const data = await response.json();
          setMessage(data.error?.message || (language === 'zh' ? '删除失败' : 'Delete failed'));
        }
      } catch (error) {
        setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
      }
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleOpenPublish = (type: 'hackathon' | 'story' | 'badge') => {
    setPublishDialogType(type);
    setPublishDialogOpen(true);
  };

  const handlePublishSuccess = () => {
    setPublishDialogOpen(false);
    if (publishDialogType === 'hackathon') {
      fetchHackathons();
      fetchStats();
    } else if (publishDialogType === 'story') {
      fetchStories();
      fetchStats();
    } else if (publishDialogType === 'badge') {
      fetchBadges();
      fetchStats();
    }
    setMessage(language === 'zh' ? '发布成功！' : 'Published successfully!');
  };

  const handleEditSuccess = () => {
    setEditHackathonOpen(false);
    setEditStoryOpen(false);
    setEditBadgeOpen(false);
    setEditingItem(null);
    // Refresh current tab data
    if (activeTab === 'hackathons') fetchHackathons();
    if (activeTab === 'stories') fetchStories();
    if (activeTab === 'badges') fetchBadges();
  };

  const handleReview = async (itemId: string, type: 'project' | 'story' | 'badge', action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/reviews/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, type }),
      });

      if (response.ok) {
        setMessage(action === 'approve'
          ? (language === 'zh' ? '已批准' : 'Approved')
          : (language === 'zh' ? '已拒绝' : 'Rejected')
        );
        fetchPendingReviews();
        fetchStats();
      } else {
        const data = await response.json();
        setMessage(data.error?.message || (language === 'zh' ? '操作失败' : 'Operation failed'));
      }
    } catch (error) {
      setMessage(language === 'zh' ? '操作失败' : 'Operation failed');
    }
  };

  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0, textTransform: 'uppercase' }}>
          &gt; {t('admin.dashboard')}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
          {language === 'zh' ? '管理内容、用户和平台设置' : 'Manage content, users, and platform settings'}
        </p>
        {adminUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '12px', marginTop: 'var(--sp-1)' }}>
              {language === 'zh' ? '管理员' : 'Admin'}: {adminUser.username}
            </p>
            <Button
              variant="ghost"
              onClick={adminLogout}
              style={{ padding: '4px 12px', fontSize: '11px', cursor: 'pointer' }}
            >
              {language === 'zh' ? '退出登录' : 'Logout'}
            </Button>
          </div>
        )}
      </div>

      {message && (
        <div style={{
          padding: 'var(--sp-3)',
          marginBottom: 'var(--sp-4)',
          background: 'rgba(0, 255, 65, 0.1)',
          border: '1px solid var(--brand-green)',
          borderRadius: '4px',
          color: 'var(--brand-green)',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {message}
          <button onClick={() => setMessage('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--sp-6)' }}>
        {/* Sidebar Navigation */}
        <aside>
          <nav style={{ position: 'sticky', top: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {navTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid var(--brand-coral)' : '1px solid var(--border-base)',
                    padding: 'var(--sp-3) var(--sp-4)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: activeTab === tab.id ? 'var(--brand-coral)' : 'var(--text-main)',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-color"
                >
                  &gt; {t(tab.label).toUpperCase()}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <section>
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--sp-4)',
                marginBottom: 'var(--sp-6)'
              }}>
                {overviewStats.map(stat => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-base)',
                      padding: 'var(--sp-4)',
                      transition: 'all 0.2s ease'
                    }}
                    className="hover-color"
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                      {t(stat.label)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-hero)', fontSize: '32px', color: stat.color }}>
                      {stat.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                padding: 'var(--sp-5)',
                marginBottom: 'var(--sp-6)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: '0 0 var(--sp-4) 0', fontSize: '18px' }}>
                  {t('admin.quick_actions')}
                </h3>
                <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                  <Button variant="primary" onClick={() => handleOpenPublish('hackathon')} style={{ cursor: 'pointer' }}>
                    {t('admin.add_hackathon')}
                  </Button>
                  <Button variant="primary" onClick={() => handleOpenPublish('story')} style={{ cursor: 'pointer' }}>
                    {t('admin.create_story')}
                  </Button>
                  <Button variant="primary" onClick={() => handleOpenPublish('badge')} style={{ cursor: 'pointer' }}>
                    {language === 'zh' ? '+ 创建徽章' : '+ Create Badge'}
                  </Button>
                  <Button variant="ghost" onClick={() => setLogsViewerOpen(true)} style={{ cursor: 'pointer' }}>
                    {language === 'zh' ? '查看操作日志' : 'View Logs'}
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveTab('reviews')} style={{ cursor: 'pointer' }}>
                    {t('admin.review_submissions')} ({stats.pendingReviews})
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hackathons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理黑客松' : 'MANAGE_HACKATHONS'}
                </h3>
                <Button variant="primary" onClick={() => handleOpenPublish('hackathon')} style={{ cursor: 'pointer' }}>
                  {language === 'zh' ? '+ 添加黑客松' : t('admin.add_hackathon')}
                </Button>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '标题' : 'TITLE'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('hackathon.location')}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('hackathon.time')}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('hackathon.status')}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '状态' : 'VISIBILITY'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '操作' : 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hackathons.map(hack => (
                      <tr key={hack.id} style={{ borderBottom: '1px solid var(--bg-elevated)', transition: 'background 0.2s ease', opacity: hack.hidden ? 0.5 : 1 }} className="hover-color">
                        <td style={{ padding: 'var(--sp-3) 0' }}>{hack.title}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{hack.city}, {hack.country}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{new Date(hack.start_time).toLocaleDateString()}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span style={{ color: hack.registration_status === '报名中' ? 'var(--brand-green)' : 'var(--text-muted)' }}>
                            {hack.registration_status}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span style={{ color: hack.hidden ? 'var(--text-muted)' : 'var(--brand-green)', fontSize: '11px' }}>
                            {hack.hidden ? (language === 'zh' ? '已隐藏' : 'Hidden') : (language === 'zh' ? '可见' : 'Visible')}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                            <Button variant="ghost" onClick={() => handleEditHackathon(hack)} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {t('common.edit')}
                            </Button>
                            <Button variant="ghost" onClick={() => handleToggleHideHackathon(hack.id, hack.hidden || 0)} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {hack.hidden ? (language === 'zh' ? '显示' : 'Show') : (language === 'zh' ? '隐藏' : 'Hide')}
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteHackathon(hack.id)} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: 'var(--brand-coral)' }}>
                              {language === 'zh' ? '删除' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理项目' : 'MANAGE_PROJECTS'}
                </h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {t('metrics.pending_reviews')}: {stats.pendingReviews}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '项目' : 'PROJECT'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '作者' : 'AUTHOR'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('common.like').toUpperCase()}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '状态' : 'STATUS'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '操作' : 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(proj => (
                      <tr key={proj.id} style={{ borderBottom: '1px solid var(--bg-elevated)', transition: 'background 0.2s ease', opacity: proj.hidden ? 0.5 : 1 }} className="hover-color">
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <Link href={`/goat-hunt/${proj.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                            {proj.title}
                          </Link>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{proj.user_id}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{proj.like_count}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span style={{ color: proj.hidden ? 'var(--text-muted)' : 'var(--brand-green)' }}>
                            {proj.hidden ? (language === 'zh' ? '已隐藏' : 'Hidden') : (language === 'zh' ? '可见' : 'Visible')}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                            <Button variant="ghost" onClick={() => handleHideProject(proj.id, proj.hidden || 0)} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {proj.hidden ? (language === 'zh' ? '显示' : 'Show') : (language === 'zh' ? '隐藏' : 'Hide')}
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteProject(proj.id)} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: 'var(--brand-coral)' }}>
                              {language === 'zh' ? '删除' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理文章' : 'MANAGE_STORIES'}
                </h3>
                <Button variant="primary" onClick={() => handleOpenPublish('story')} style={{ cursor: 'pointer' }}>
                  {language === 'zh' ? '+ 发布文章' : '+ Publish Story'}
                </Button>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '标题' : 'TITLE'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '作者' : 'AUTHOR'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '来源' : 'SOURCE'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{t('common.like').toUpperCase()}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '状态' : 'VISIBILITY'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '操作' : 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map(story => (
                      <tr key={story.id} style={{ borderBottom: '1px solid var(--bg-elevated)', transition: 'background 0.2s ease', opacity: story.hidden ? 0.5 : 1 }} className="hover-color">
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <Link href={`/stories/${story.slug}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                            {story.title}
                          </Link>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{story.author_name}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{story.source || '-'}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{story.like_count}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span style={{ color: story.hidden ? 'var(--text-muted)' : 'var(--brand-green)', fontSize: '11px' }}>
                            {story.hidden ? (language === 'zh' ? '已隐藏' : 'Hidden') : (language === 'zh' ? '可见' : 'Visible')}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                            <Button variant="ghost" onClick={() => handleEditStory(story)} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {t('common.edit')}
                            </Button>
                            <Button variant="ghost" onClick={() => handleToggleHideStory(story.id, story.hidden || 0)} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                              {story.hidden ? (language === 'zh' ? '显示' : 'Show') : (language === 'zh' ? '隐藏' : 'Hide')}
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteStory(story.id)} style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: 'var(--brand-coral)' }}>
                              {language === 'zh' ? '删除' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理徽章' : 'MANAGE_BADGES'}
                </h3>
                <Button variant="primary" onClick={() => handleOpenPublish('badge')} style={{ cursor: 'pointer' }}>
                  {language === 'zh' ? '+ 创建徽章' : '+ Create Badge'}
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-4)' }}>
                {badges.map(badge => (
                  <div key={badge.id} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-base)',
                    padding: 'var(--sp-4)',
                    transition: 'all 0.2s ease'
                  }}
                    className="hover-color"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
                      <div style={{
                        width: '50px', height: '50px',
                        background: 'var(--brand-green)',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        🏆
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                          {language === 'zh' ? badge.badge_name : badge.badge_name_en}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {badge.badge_code}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
                      {language === 'zh' ? badge.badge_desc : badge.badge_desc_en}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                      <Button variant="ghost" onClick={() => handleEditBadge(badge)} style={{ flex: 1, fontSize: '11px', cursor: 'pointer' }}>
                        {t('common.edit')}
                      </Button>
                      <Button variant="ghost" onClick={() => handleDeleteBadge(badge.id)} style={{ flex: 1, fontSize: '11px', cursor: 'pointer', color: 'var(--brand-coral)' }}>
                        {language === 'zh' ? '删除' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理用户' : 'MANAGE_USERS'}
                </h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {language === 'zh' ? '总计' : 'Total'}: {users.length}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                <table style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '用户' : 'USER'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '邮箱' : 'EMAIL'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '学校/公司' : 'SCHOOL/COMPANY'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '状态' : 'STATUS'}</th>
                      <th style={{ padding: 'var(--sp-3) 0' }}>{language === 'zh' ? '操作' : 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{
                        borderBottom: '1px solid var(--bg-elevated)',
                        transition: 'background 0.2s ease',
                        opacity: u.is_banned ? 0.5 : 1
                      }} className="hover-color">
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                            <div style={{
                              width: '32px', height: '32px',
                              background: 'var(--brand-coral)',
                              borderRadius: '50%',
                              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '12px'
                            }}>
                              {u.display_name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                            </div>
                            {u.display_name || (language === 'zh' ? '未设置' : 'Not set')}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>{u.email}</td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          {u.school || u.company || '-'}
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <span style={{
                            color: u.is_banned ? 'var(--brand-coral)' : 'var(--brand-green)',
                            fontSize: '11px'
                          }}>
                            {u.is_banned ? (language === 'zh' ? '已封禁' : 'Banned') : (language === 'zh' ? '正常' : 'Active')}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--sp-3) 0' }}>
                          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                            <Button
                              variant="ghost"
                              onClick={() => handleToggleBanUser(u.id, u.is_banned || 0)}
                              style={{
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                color: u.is_banned ? 'var(--brand-green)' : 'var(--brand-coral)'
                              }}
                            >
                              {u.is_banned ? (language === 'zh' ? '解封' : 'Unban') : (language === 'zh' ? '封禁' : 'Ban')}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteUser(u.id)}
                              style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: 'var(--brand-coral)' }}
                            >
                              {language === 'zh' ? '删除' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div>
              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '管理员管理' : 'MANAGE_ADMINS'}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '13px', marginTop: 'var(--sp-2)' }}>
                  {language === 'zh' ? '管理平台管理员账号' : 'Manage platform admin accounts'}
                </p>
              </div>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                padding: 'var(--sp-8)',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: 'var(--sp-4)' }}>👥</div>
                <Button
                  variant="primary"
                  onClick={() => setManageAdminsOpen(true)}
                  style={{ cursor: 'pointer' }}
                >
                  {language === 'zh' ? '管理管理员账号' : 'Manage Admin Accounts'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: '18px' }}>
                  {language === 'zh' ? '审核提交' : 'REVIEW_SUBMISSIONS'}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '13px', marginTop: 'var(--sp-2)' }}>
                  {language === 'zh' ? '审核用户提交的项目、文章和徽章申请' : 'Review user-submitted projects, stories, and badge requests'}
                </p>
              </div>

              {!pendingReviews ? (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-base)',
                  padding: 'var(--sp-8)',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ fontSize: '16px' }}>
                    {language === 'zh' ? '加载中...' : 'Loading...'}
                  </div>
                </div>
              ) : pendingReviews.total === 0 ? (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-base)',
                  padding: 'var(--sp-8)',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: 'var(--sp-4)' }}>📋</div>
                  <div style={{ fontSize: '16px', marginBottom: 'var(--sp-2)' }}>
                    {language === 'zh' ? '暂无待审核内容' : 'No pending reviews'}
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    {language === 'zh' ? '待审核的项目和文章将显示在这里' : 'Pending projects and stories will appear here'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
                  {/* Pending Projects */}
                  {pendingReviews.projects && pendingReviews.projects.length > 0 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', fontSize: '14px', color: 'var(--brand-coral)' }}>
                        {language === 'zh' ? '待审核项目' : 'Pending Projects'} ({pendingReviews.projects.length})
                      </h4>
                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                        {pendingReviews.projects.map((project: any) => (
                          <div key={project.id} style={{
                            padding: 'var(--sp-3)',
                            borderBottom: '1px solid var(--bg-elevated)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{project.title}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {project.short_desc || (language === 'zh' ? '无描述' : 'No description')}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {language === 'zh' ? '作者' : 'Author'}: {project.author_id} | {new Date(project.created_at).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                              <Button
                                variant="ghost"
                                onClick={() => handleReview(project.id, 'project', 'approve')}
                                style={{ cursor: 'pointer', fontSize: '11px', color: 'var(--brand-green)' }}
                              >
                                {language === 'zh' ? '批准' : 'Approve'}
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => handleReview(project.id, 'project', 'reject')}
                                style={{ cursor: 'pointer', fontSize: '11px', color: 'var(--brand-coral)' }}
                              >
                                {language === 'zh' ? '拒绝' : 'Reject'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending Stories */}
                  {pendingReviews.stories && pendingReviews.stories.length > 0 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', fontSize: '14px', color: 'var(--brand-green)' }}>
                        {language === 'zh' ? '待审核文章' : 'Pending Stories'} ({pendingReviews.stories.length})
                      </h4>
                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                        {pendingReviews.stories.map((story: any) => (
                          <div key={story.id} style={{
                            padding: 'var(--sp-3)',
                            borderBottom: '1px solid var(--bg-elevated)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{story.title}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {story.summary || (language === 'zh' ? '无摘要' : 'No summary')}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {language === 'zh' ? '作者' : 'Author'}: {story.author_name} | {new Date(story.created_at).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                              <Button
                                variant="ghost"
                                onClick={() => handleReview(story.id, 'story', 'approve')}
                                style={{ cursor: 'pointer', fontSize: '11px', color: 'var(--brand-green)' }}
                              >
                                {language === 'zh' ? '批准' : 'Approve'}
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => handleReview(story.id, 'story', 'reject')}
                                style={{ cursor: 'pointer', fontSize: '11px', color: 'var(--brand-coral)' }}
                              >
                                {language === 'zh' ? '拒绝' : 'Reject'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending Badges */}
                  {pendingReviews.badges && pendingReviews.badges.length > 0 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-mono)', margin: '0 0 var(--sp-3) 0', fontSize: '14px', color: 'var(--brand-amber)' }}>
                        {language === 'zh' ? '待审核徽章' : 'Pending Badges'} ({pendingReviews.badges.length})
                      </h4>
                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', padding: 'var(--sp-4)' }}>
                        {pendingReviews.badges.map((badge: any) => (
                          <div key={badge.id} style={{
                            padding: 'var(--sp-3)',
                            borderBottom: '1px solid var(--bg-elevated)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                {badge.user_name} - {badge.badge_name}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {new Date(badge.created_at).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                              <Button
                                variant="ghost"
                                onClick={() => handleReview(badge.id, 'badge', 'approve')}
                                style={{ cursor: 'pointer', fontSize: '11px', color: 'var(--brand-green)' }}
                              >
                                {language === 'zh' ? '批准' : 'Approve'}
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => handleReview(badge.id, 'badge', 'reject')}
                                style={{ cursor: 'pointer', fontSize: '11px', color: 'var(--brand-coral)' }}
                              >
                                {language === 'zh' ? '拒绝' : 'Reject'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Publish Dialog */}
      <PublishDialog
        isOpen={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        type={publishDialogType}
        onSuccess={handlePublishSuccess}
      />

      {/* Edit Dialogs */}
      <EditHackathonDialog
        isOpen={editHackathonOpen}
        onClose={() => setEditHackathonOpen(false)}
        hackathon={editingItem}
        onSuccess={handleEditSuccess}
      />

      <EditStoryDialog
        isOpen={editStoryOpen}
        onClose={() => setEditStoryOpen(false)}
        story={editingItem}
        onSuccess={handleEditSuccess}
      />

      <EditBadgeDialog
        isOpen={editBadgeOpen}
        onClose={() => setEditBadgeOpen(false)}
        badge={editingItem}
        onSuccess={handleEditSuccess}
      />

      <ManageAdminsDialog
        isOpen={manageAdminsOpen}
        onClose={() => setManageAdminsOpen(false)}
        onSuccess={() => {
          setManageAdminsOpen(false);
          fetchStats();
        }}
      />

      <LogsViewerDialog
        isOpen={logsViewerOpen}
        onClose={() => setLogsViewerOpen(false)}
      />

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
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
            padding: 'var(--sp-6)',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3 style={{ fontFamily: 'var(--font-hero)', margin: '0 0 var(--sp-4) 0', fontSize: '18px' }}>
              {language === 'zh' ? '确认操作' : 'Confirm Action'}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--sp-6)', fontSize: '14px' }}>
              {language === 'zh' ? '此操作无法撤销，确定要继续吗？' : 'This action cannot be undone. Are you sure?'}
            </p>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
              <Button
                variant="ghost"
                onClick={() => setConfirmDialogOpen(false)}
                style={{ cursor: 'pointer' }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={confirmAction}
                style={{ cursor: 'pointer', background: 'var(--brand-coral)' }}
              >
                {language === 'zh' ? '确认' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
