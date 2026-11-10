'use client';

import { Link } from '@/utils/navigation';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">Requisition Not Found</h2>
      <p className="text-slate-600 text-sm max-w-md mt-3">
        The recruitment page, candidate dossier, or requisition module you requested does not exist or has been relocated.
      </p>
      <div className="flex items-center gap-3 mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 shadow-soft-sm transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Homepage
        </Link>
        <Link
          to="/recruiter/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-soft-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Recruiter Portal
        </Link>
      </div>
    </div>
  );
}

