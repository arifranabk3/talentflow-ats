'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useAuth } from '@/context/AuthContext';
import { MOCK_JOBS } from '@/data/mockData';
import { useParams, Link, useLocation } from '@/utils/navigation';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CheckCircle,
  Share2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const CandidateJobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isCandidatePortal = location.pathname.startsWith('/candidate');

  const job = MOCK_JOBS.find((j) => j.id === id) || MOCK_JOBS[0];

  const content = (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/browse-jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to all openings
      </Link>

      {/* Hero Card — Corporate Deep Teal */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 border border-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {job.department}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-teal-100/90 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-teal-300" />
                TalentFlow Partner Network
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-300" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-300" />
                {job.type}
              </span>
              <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                {job.salary}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/candidate/apply/${job.id}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-soft-md transition-all"
            >
              Apply for this Role
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Role Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-soft-sm">
            <h2 className="text-base font-bold text-slate-900 font-display">About the Position</h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-soft-sm">
            <h2 className="text-base font-bold text-slate-900 font-display">Core Competencies & Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-soft-sm">
            <h2 className="text-base font-bold text-slate-900 font-display">Equal Opportunity Employer</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              TalentFlow and its partner organizations are committed to a diverse, equitable, and inclusive hiring environment. All qualified applicants will receive consideration for employment without regard to race, color, religion, gender, gender identity or expression, sexual orientation, national origin, genetics, disability, age, or veteran status.
            </p>
          </div>
        </div>

        {/* Quick Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-soft-sm">
            <h3 className="font-bold text-slate-900 text-sm font-display">Hiring Overview</h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Requisition ID</span>
                <span className="text-slate-900 font-mono font-semibold">{job.id.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Typical Response Time</span>
                <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">Under 48 hours</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Interview Format</span>
                <span className="text-slate-700">2 Remote Technical Panels + 1 Leadership Chat</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Compliance Standard</span>
                <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  SOC2 Type II & GDPR Verified
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                to={`/candidate/apply/${job.id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-soft-sm transition-all"
              >
                Start Application
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If accessed from inside candidate portal and user is authenticated
  if (isCandidatePortal && isAuthenticated) {
    return (
      <DashboardShell role="candidate">
        {content}
      </DashboardShell>
    );
  }

  // Otherwise, render with public navigation header and footer
  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col font-sans text-slate-900">
      <PublicHeader />
      <main className="flex-1 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {content}
      </main>
      <PublicFooter />
    </div>
  );
};
