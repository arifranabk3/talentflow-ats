'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, UserDto } from '@/services/api';

export type UserRole = 'recruiter' | 'candidate' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  companyId?: string;
  title?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrRole: string, password?: string) => Promise<{ success: boolean; error?: string }> | void;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  switchRoleDemo: (role: UserRole) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILES: Record<UserRole, AuthUser> = {
  recruiter: {
    id: 'usr-rec-01',
    name: 'Sarah Jenkins',
    email: 'sarah.j@acmetech.io',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    title: 'Head of Talent Acquisition',
    companyName: 'Acme Technologies Global',
  },
  candidate: {
    id: 'usr-cand-01',
    name: 'Marcus Chen',
    email: 'marcus.chen@stanford.alumni.edu',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    title: 'Staff Infrastructure Candidate',
  },
  admin: {
    id: 'usr-adm-01',
    name: 'Alexander Pierce',
    email: 'alexander.p@talentflow.enterprise',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    title: 'Platform Governance Officer',
  },
};

const USER_STORAGE_KEY = 'talentflow_active_user';
const TOKEN_STORAGE_KEY = 'talentflow_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load authenticated session on mount
  const refreshUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
      if (!token) {
        // Fallback to local stored profile if running in standalone preview
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(DEMO_PROFILES.recruiter);
        }
        setIsLoading(false);
        return;
      }

      // Verify session with backend API
      const res = await authApi.getMe();
      if (res.success && res.data) {
        const u = res.data;
        const authUser: AuthUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: DEMO_PROFILES[u.role]?.avatar,
        };
        setUser(authUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
      }
    } catch {
      // Clear expired credentials
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(DEMO_PROFILES.recruiter);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (emailOrRole: string, password?: string) => {
    // Demo quick role switcher support (if only 1 arg passed matching role)
    if (!password && (emailOrRole === 'recruiter' || emailOrRole === 'candidate' || emailOrRole === 'admin')) {
      switchRoleDemo(emailOrRole as UserRole);
      return { success: true };
    }

    try {
      const res = await authApi.login({ email: emailOrRole, password: password || '' });
      if (res.success && res.data?.token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
        const u = res.data.user;
        const authUser: AuthUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: DEMO_PROFILES[u.role]?.avatar,
        };
        setUser(authUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
        return { success: true };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Login failed';
      return { success: false, error: msg };
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'candidate') => {
    try {
      const res = await authApi.register({ name, email, password, role });
      if (res.success && res.data?.token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
        const u = res.data.user;
        const authUser: AuthUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: DEMO_PROFILES[u.role]?.avatar,
        };
        setUser(authUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
        return { success: true };
      }
      return { success: false, error: res.message || 'Registration failed' };
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    }
  };

  const switchRoleDemo = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole];
    setUser(profile);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'recruiter',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole: switchRoleDemo,
        switchRoleDemo,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
