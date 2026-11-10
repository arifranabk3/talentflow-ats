'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from '@/utils/navigation';
import { Briefcase, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { PublicHeader } from '@/components/layout/PublicHeader';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('recruiter');
  const [email, setEmail] = useState('recruiter@talentflow.cloud');
  const [password, setPassword] = useState('••••••••••••');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'recruiter') setEmail('recruiter@talentflow.cloud');
    else if (role === 'candidate') setEmail('candidate@talentflow.cloud');
    else if (role === 'admin') setEmail('admin@talentflow.cloud');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    if (selectedRole === 'admin') navigate('/admin/dashboard');
    else if (selectedRole === 'candidate') navigate('/candidate/dashboard');
    else navigate('/recruiter/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col justify-between font-sans">
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

          {/* Role selector pill */}
          <div className="p-1.5 bg-slate-100 rounded-2xl border border-slate-200 grid grid-cols-3 gap-1">
            {(['recruiter', 'candidate', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-2 text-xs font-semibold capitalize rounded-xl transition-all ${
                  selectedRole === r 
                    ? 'bg-teal-700 text-white shadow-soft-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

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
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-semibold text-teal-700 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-soft-md transition-all flex items-center justify-center gap-2"
            >
              <span>Access {selectedRole.toUpperCase()} Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              New organization?{' '}
              <Link to="/register" className="font-semibold text-teal-700 hover:underline">
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
