'use client';

import { Link } from '@/utils/navigation';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mt-3">
        The recruitment page, candidate dossier, or dashboard module you requested does not exist or has been relocated.
      </p>
      <div className="flex items-center gap-3 mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20 transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Homepage
        </Link>
        <Link
          to="/recruiter/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 border border-navy-700 text-slate-200 text-xs font-semibold hover:border-slate-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Recruiter Portal
        </Link>
      </div>
    </div>
  );
}

