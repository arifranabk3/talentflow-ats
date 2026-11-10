'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from '@/utils/navigation';
import { Briefcase, Building2, User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PublicHeader } from '@/components/layout/PublicHeader';

export const RegisterPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('Apex Systems Engineering');
  const [fullName, setFullName] = useState('Elena Vance');
  const [email, setEmail] = useState('elena@apexsystems.example.com');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('recruiter');
    navigate('/recruiter/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col justify-between font-sans">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Company / Organization</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-soft-md transition-all flex items-center justify-center gap-2"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </main>

      <div className="py-6 text-center text-xs text-slate-400">
        © 2026 TALENTFLOW ATS. No credit card required during trial.
      </div>
    </div>
  );
};
