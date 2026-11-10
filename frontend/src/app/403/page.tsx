'use client';

import React, { Suspense } from 'react';
import { useSearchParams, Link } from '@/utils/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, Home, Briefcase, Loader2 } from 'lucide-react';
import { getDefaultDashboardForRole } from '@/utils/authRoutes';

function ForbiddenContent() {
  const searchParams = useSearchParams();
  const { user, role } = useAuth();

  const requiredRole = searchParams?.get('required');
  const activeRole = (searchParams?.get('role') || role || user?.role || 'guest') as UserRole;
  const dashboardTarget = getDefaultDashboardForRole(user?.role || activeRole);

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col justify-between font-sans text-slate-900">
      {/* Top Header Bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-soft-sm">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900">TALENTFLOW</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Session:</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold uppercase">
              {user ? user.role : 'Unauthenticated'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Forbidden Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-soft-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto shadow-soft-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              HTTP 403 Forbidden
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your active account credentials do not possess the required permissions to access this enterprise module.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Required Authorization:</span>
              <span className="font-bold text-teal-800 uppercase px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                {requiredRole ? `${requiredRole} Role` : 'Elevated Permissions'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 font-medium">Your Current Context:</span>
              <span className="font-bold text-slate-800 uppercase px-2 py-0.5 rounded bg-slate-200/70 border border-slate-300">
                {user ? user.role : activeRole}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={dashboardTarget}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-soft-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Authorized Workspace
            </Link>
            <Link
              to="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Account
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
              <Home className="w-3.5 h-3.5" />
              TALENTFLOW Public Directory
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
        © 2026 TALENTFLOW ATS Enterprise Security. Zero Trust Access Control.
      </footer>
    </div>
  );
}

export default function ForbiddenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
        </div>
      }
    >
      <ForbiddenContent />
    </Suspense>
  );
}
