'use client';

import React, { useState } from 'react';
import { Link } from '@/utils/navigation';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-soft-xl space-y-6">
          
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-[#0F172A] font-display">Reset Password</h1>
            <p className="text-xs text-[#64748B]">We will transmit a secure recovery link to your registered work email</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">Recovery Instructions Sent</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                If an active profile exists for {email}, a one-time cryptographic reset token has been dispatched.
              </p>
              <Link
                to="/login"
                className="inline-block mt-3 text-xs font-bold text-emerald-800 hover:underline"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                  Registered Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.j@acmetech.io"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-soft-md shadow-[#F97316]/25 transition-all"
              >
                Transmit Reset Link
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <div className="py-6 text-center text-xs text-[#94A3B8]">
        © 2026 TALENTFLOW Security & Identity Governance.
      </div>
    </div>
  );
};

