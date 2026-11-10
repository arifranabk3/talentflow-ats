'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from '@/utils/navigation';
import { Briefcase, Lock, Mail, ArrowRight, Loader2, AlertCircle, Info } from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { getSafeRedirectUrl, getDefaultDashboardForRole } from '@/utils/authRoutes';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('recruiter');
  const [email, setEmail] = useState('recruiter@talentflow.cloud');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const nextParam = searchParams?.get('next');

  // If already authenticated, redirect to requested next URL or user's authorized dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const destination = getSafeRedirectUrl(nextParam, getDefaultDashboardForRole(user.role));
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, nextParam, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'recruiter') {
      setEmail('recruiter@talentflow.cloud');
      setPassword('Password123!');
    } else if (role === 'candidate') {
      setEmail('candidate@talentflow.cloud');
      setPassword('Password123!');
    } else if (role === 'admin') {
      setEmail('admin@talentflow.cloud');
      setPassword('AdminPassword2026!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Attempt live login with backend API
      const res = await login(email.trim(), password);
      if (res && !res.success) {
        setError(res.error || 'Invalid email or password credentials.');
        return;
      }

      const finalRole = res.role || selectedRole;
      const destination = getSafeRedirectUrl(nextParam, getDefaultDashboardForRole(finalRole));
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col justify-between font-sans text-slate-900">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-soft-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white mx-auto shadow-soft-sm">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Sign In to TALENTFLOW</h1>
            <p className="text-xs text-slate-600">Select a role preset or enter your workspace credentials</p>
          </div>

          {/* Prompt if redirected from a protected route */}
          {nextParam && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-2.5 text-xs text-teal-800">
              <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>
                Please sign in to access <span className="font-semibold">{decodeURIComponent(nextParam)}</span>. You will be redirected immediately upon authentication.
              </span>
            </div>
          )}

          {/* Role selector pill */}
          <div className="p-1.5 bg-slate-100 rounded-2xl border border-slate-200 grid grid-cols-3 gap-1">
            {(['recruiter', 'candidate', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                  selectedRole === r
                    ? 'bg-teal-700 text-white shadow-soft-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Workspace Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-[11px] text-teal-700 font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-soft-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Access {selectedRole.toUpperCase()} Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              New organization?{' '}
              <Link
                to={nextParam ? `/auth/register?next=${encodeURIComponent(nextParam)}` : '/auth/register'}
                className="font-semibold text-teal-700 hover:underline"
              >
                Register company account
              </Link>
            </p>
          </div>

        </div>
      </main>

      <div className="py-6 text-center text-xs text-slate-400">
        © 2026 TALENTFLOW ATS. Protected by Enterprise SOC2 Type II Encryption.
      </div>
    </div>
  );
};
