'use client';

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from '@/utils/navigation';
import { Briefcase, Building2, User, Mail, Lock, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { authApi, companiesApi, getErrorMessage } from '@/services/api';
import { getSafeRedirectUrl, getDefaultDashboardForRole } from '@/utils/authRoutes';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'recruiter' | 'candidate'>('recruiter');
  const [companyName, setCompanyName] = useState('Apex Systems Engineering');
  const [fullName, setFullName] = useState('Elena Vance');
  const [email, setEmail] = useState('elena@apexsystems.example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const nextParam = searchParams?.get('next');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // 1. Call Backend Registration API
      const regRes = await authApi.register({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (regRes.success && regRes.data?.token) {
        // Store session token
        localStorage.setItem('talentflow_token', regRes.data.token);
        
        // 2. If recruiter and companyName specified, provision company
        if (role === 'recruiter' && companyName.trim()) {
          try {
            await companiesApi.create({
              name: companyName.trim(),
            });
          } catch {
            // Company creation can be completed in onboarding if duplicate slug
          }
        }

        await login(email.trim(), password);
        const destination = getSafeRedirectUrl(nextParam, getDefaultDashboardForRole(role));
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
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
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Create Workspace</h1>
            <p className="text-xs text-slate-600">Start your 14-day full access trial for your talent acquisition team</p>
          </div>

          {/* Account Role Selector */}
          <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`py-2 rounded-xl font-semibold transition-all ${
                role === 'recruiter'
                  ? 'bg-teal-700 text-white shadow-soft-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hiring Team / Recruiter
            </button>
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`py-2 rounded-xl font-semibold transition-all ${
                role === 'candidate'
                  ? 'bg-teal-700 text-white shadow-soft-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Job Seeker / Candidate
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'recruiter' && (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Acme Global Inc."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Elena Vance"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="elena@company.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
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
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <span>Initialize {role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link
                to={nextParam ? `/auth/login?next=${encodeURIComponent(nextParam)}` : '/auth/login'}
                className="font-semibold text-teal-700 hover:underline"
              >
                Sign In
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
