'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from '@/utils/navigation';
import { Briefcase, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { PublicHeader } from '@/components/layout/PublicHeader';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('recruiter');
  const [email, setEmail] = useState('sarah.j@acmetech.io');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'recruiter') setEmail('sarah.j@acmetech.io');
    else if (role === 'candidate') setEmail('marcus.chen@stanford.alumni.edu');
    else setEmail('alexander.p@talentflow.enterprise');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    if (selectedRole === 'admin') navigate('/admin/dashboard');
    else if (selectedRole === 'candidate') navigate('/candidate/dashboard');
    else navigate('/recruiter/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-soft-xl space-y-6">
          
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F97316] to-[#FB923C] flex items-center justify-center text-white mx-auto mb-3 shadow-glow-orange">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] font-display">Sign In to TALENTFLOW</h1>
            <p className="text-xs text-[#64748B]">Select a role preset or enter your workspace credentials</p>
          </div>

          {/* Role selector pill */}
          <div className="p-1.5 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] grid grid-cols-3 gap-1">
            {(['recruiter', 'candidate', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-2 text-xs font-bold capitalize rounded-xl transition-all ${
                  selectedRole === r 
                    ? 'bg-[#0A1424] text-white shadow-soft-sm' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Workspace Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316] font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-semibold text-[#F97316] hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-soft-md shadow-[#F97316]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Access {selectedRole.toUpperCase()} Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#E2E8F0] text-center">
            <p className="text-xs text-[#64748B]">
              New organization?{' '}
              <Link to="/register" className="font-bold text-[#F97316] hover:underline">
                Register company account
              </Link>
            </p>
          </div>

        </div>
      </main>

      <div className="py-6 text-center text-xs text-[#94A3B8]">
        © 2026 TALENTFLOW ATS. Protected by Enterprise SOC2 Type II Encryption.
      </div>
    </div>
  );
};

