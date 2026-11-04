'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'recruiter' | 'candidate' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  companyName?: string;
  title?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
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

const STORAGE_KEY = 'talentflow_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(DEMO_PROFILES.recruiter);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser(DEMO_PROFILES.recruiter);
    }
  }, []);

  const login = (role: UserRole) => {
    const profile = DEMO_PROFILES[role];
    setUser(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    login(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'recruiter',
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
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

