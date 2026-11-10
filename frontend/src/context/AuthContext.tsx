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
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrRole: string, password?: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  switchRoleDemo: (role: UserRole) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_PROFILES: Record<UserRole, AuthUser> = {
  recruiter: {
    id: 'usr-rec-01',
    name: 'Sarah Jenkins',
    email: 'recruiter@talentflow.cloud',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    title: 'Head of Talent Acquisition',
    companyName: 'Acme Technologies Global',
  },
  candidate: {
    id: 'usr-cand-01',
    name: 'Marcus Chen',
    email: 'candidate@talentflow.cloud',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    title: 'Staff Infrastructure Candidate',
  },
  admin: {
    id: 'usr-adm-01',
    name: 'Alexander Pierce',
    email: 'admin@talentflow.cloud',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    title: 'Platform Governance Officer',
  },
};

const USER_STORAGE_KEY = 'talentflow_active_user';
const TOKEN_STORAGE_KEY = 'talentflow_token';

function setClientAuthCookies(token: string, role: UserRole) {
  if (typeof document === 'undefined') return;
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `talentflow_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${secureFlag}`;
  document.cookie = `talentflow_role=${encodeURIComponent(role)}; path=/; max-age=604800; SameSite=Lax${secureFlag}`;
}

function clearClientAuthCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = 'talentflow_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'talentflow_role=; path=/; max-age=0; SameSite=Lax';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load authenticated session on mount
  const refreshUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
      if (!token) {
        setUser(null);
        clearClientAuthCookies();
        setIsLoading(false);
        return;
      }

      // If running on demo token
      if (token.startsWith('demo-')) {
        const demoRole = token.replace('demo-', '').replace('-token', '') as UserRole;
        if (DEMO_PROFILES[demoRole]) {
          const profile = DEMO_PROFILES[demoRole];
          setUser(profile);
          setClientAuthCookies(token, demoRole);
          setIsLoading(false);
          return;
        }
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
        setClientAuthCookies(token, u.role);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        clearClientAuthCookies();
        setUser(null);
      }
    } catch {
      // Clear expired credentials
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      clearClientAuthCookies();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (emailOrRole: string, password?: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    // Quick demo role switcher support
    if (!password && (emailOrRole === 'recruiter' || emailOrRole === 'candidate' || emailOrRole === 'admin')) {
      const targetRole = emailOrRole as UserRole;
      switchRoleDemo(targetRole);
      return { success: true, role: targetRole };
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
        setClientAuthCookies(res.data.token, u.role);
        return { success: true, role: u.role };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Login failed';
      return { success: false, error: msg };
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'candidate'): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
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
        setClientAuthCookies(res.data.token, u.role);
        return { success: true, role: u.role };
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
      clearClientAuthCookies();
      setUser(null);
    }
  };

  const switchRoleDemo = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole];
    const demoToken = `demo-${newRole}-token`;
    setUser(profile);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(TOKEN_STORAGE_KEY, demoToken);
    setClientAuthCookies(demoToken, newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
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
