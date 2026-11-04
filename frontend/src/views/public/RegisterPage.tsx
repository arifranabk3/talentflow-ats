'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from '@/utils/navigation';
import { Briefcase, Building2, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PublicHeader } from '@/components/layout/PublicHeader';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [companyName, setCompanyName] = useState('Acme Global');
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [email, setEmail] = useState('sarah.j@acmetech.io');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('recruiter');
    navigate('/recruiter/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-soft-xl space-y-6">
          
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-[#0F172A] font-display">Create Workspace</h1>
            <p className="text-xs text-[#64748B]">Start your 14-day full access trial for your talent team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Company / Organization</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-soft-md shadow-[#F97316]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#E2E8F0] text-center">
            <p className="text-xs text-[#64748B]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#F97316] hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </main>

      <div className="py-6 text-center text-xs text-[#94A3B8]">
        © 2026 TALENTFLOW ATS. No credit card required during trial.
      </div>
    </div>
  );
};

