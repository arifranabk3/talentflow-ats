'use client';

import React, { useState } from 'react';
import { Link } from '@/utils/navigation';
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { authApi, getErrorMessage } from '@/services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError(null);
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col justify-between font-sans">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-soft-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white mx-auto shadow-soft-sm">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Reset Password</h1>
            <p className="text-xs text-slate-600">We will transmit a secure recovery link to your registered work email</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-6 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-teal-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">
                Recovery instructions dispatched. If an account matches <span className="font-bold text-teal-800">{email}</span>, you will receive an encrypted reset token.
              </p>
              <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline pt-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Registered Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="recruiter@company.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-700 font-medium"
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
                    <span>Dispatching Token...</span>
                  </>
                ) : (
                  <>
                    <span>Dispatch Recovery Link</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <div className="py-6 text-center text-xs text-slate-400">
        © 2026 TALENTFLOW ATS. Protected by Enterprise SOC2 Type II Encryption.
      </div>
    </div>
  );
};
