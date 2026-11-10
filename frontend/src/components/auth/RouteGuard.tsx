'use client';

import React, { useEffect } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useLocation, useNavigate } from '@/utils/navigation';
import { getRequiredRoleForPath } from '@/utils/authRoutes';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/utils/navigation';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const effectiveRequiredRole = requiredRole || getRequiredRoleForPath(pathname);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const fullPath = location.pathname + (location.search || '');
      const loginTarget = `/auth/login?next=${encodeURIComponent(fullPath)}`;
      navigate(loginTarget, { replace: true });
      return;
    }

    if (effectiveRequiredRole && user?.role !== effectiveRequiredRole) {
      navigate(`/403?required=${effectiveRequiredRole}&role=${user?.role || 'unknown'}`, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, effectiveRequiredRole, location, navigate]);

  // Loading state: strictly prevents any premature flash of protected data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-soft-sm">
            <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-slate-900">Verifying Workspace Session...</p>
            <p className="text-xs text-slate-500">Checking enterprise security and access authorizations</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated: suppress children while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Role mismatch: suppress children while redirecting
  if (effectiveRequiredRole && user?.role !== effectiveRequiredRole) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] flex flex-col items-center justify-center p-6 text-slate-900 font-sans text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4 shadow-soft-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Restricted Workspace Module</h1>
        <p className="text-xs text-slate-600 max-w-sm mt-2">
          This section requires <span className="font-semibold uppercase text-teal-800">{effectiveRequiredRole}</span> authorization. Your active role is <span className="font-semibold uppercase text-slate-800">{user?.role}</span>.
        </p>
        <div className="mt-6">
          <Link
            to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-soft-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to My Authorized Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
