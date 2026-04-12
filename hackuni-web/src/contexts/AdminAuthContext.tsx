'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount (only once)
  useEffect(() => {
    let mounted = true;
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify');
        if (response.ok) {
          const data = await response.json();
          if (mounted && data.data) {
            setAdminUser(data.data);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    verifyAuth();
    return () => { mounted = false; };
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      setAdminUser(data.data.adminUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdminUser(null);
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify');
      if (response.ok) {
        const data = await response.json();
        setAdminUser(data.data);
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isLoading,
        isAuthenticated: !!adminUser,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
