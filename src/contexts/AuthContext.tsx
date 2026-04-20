'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar?: string;
  bio?: string;
  school?: string;
  major?: string;
  company?: string;
  position?: string;
  phone?: string;
  twitter_url?: string;
  github_url?: string;
  website_url?: string;
  coolest_thing?: string;
  current_build?: string;
  looking_for?: string[];
  total_hackathon_count?: number;
  total_work_count?: number;
  total_award_count?: number;
  badge_count?: number;
  certification_count?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string, emailVerificationToken?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        // Verify the session is still valid by checking with the server
        // Send token via multiple methods to ensure it arrives
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (savedToken) {
          (headers as any)['x-auth-token'] = savedToken;
          (headers as any)['authorization'] = `Bearer ${savedToken}`;
        }

        fetch('/api/auth/verify', {
          credentials: 'include',
          headers,
        })
          .then(res => res.json())
          .then(data => {
            if (data.data) {
              console.log('[AuthContext] Session valid, user:', data.data.id);
              setUser(data.data);
              localStorage.setItem('user', JSON.stringify(data.data));
            } else {
              // Session is invalid, clear local storage
              console.log('[AuthContext] Session invalid, clearing local storage');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setUser(null);
            }
            setIsLoading(false);
          })
          .catch(err => {
            console.error('[AuthContext] Verification failed:', err);
            // On error, still set the user from localStorage
            // but the user might encounter auth issues on API calls
            setUser(parsedUser);
            setIsLoading(false);
          });
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      const { user, token } = data.data;

      console.log('[AuthContext] Login successful:', user.id);

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token); // Keep token for potential fallback use
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName?: string, emailVerificationToken?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          display_name: displayName,
          email_verification_token: emailVerificationToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Registration failed');
      }

      const { user, token } = data.data;

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
