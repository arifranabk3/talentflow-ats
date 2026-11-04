'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_JOBS } from '@/data/mockData';
import { useParams, Link } from '@/utils/navigation';
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
  const job = MOCK_JOBS.find((j) => j.id === id) || MOCK_JOBS[0];

  return (
    <DashboardShell role="candidate">
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          to="/candidate/jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all openings
        </Link>

        {/* Hero Card */}
        <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {job.department}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  TalentFlow Enterprise Platform
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  {job.type}
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {job.salary}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/candidate/apply/${job.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/20 transition-all"
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
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white">About the Position</h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Core Competencies & Requirements</h2>
              <ul className="space-y-2.5">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
              <h2 className="text-base font-bold text-white">Equal Opportunity Employer</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                TalentFlow is committed to a diverse and inclusive workplace. We celebrate identity, background, and perspective. All employment decisions are decided on the basis of qualifications, merit, and business need.
              </p>
            </div>
          </div>

          {/* Quick Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm">Hiring Overview</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Job Reference</span>
                  <span className="text-white font-mono">{job.id.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Typical Response Time</span>
                  <span className="text-emerald-400 font-semibold">Under 48 hours</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Interview Format</span>
                  <span className="text-slate-300">2 Remote Technical Panels + 1 Leadership Chat</span>
                </div>
              </div>

              <div className="pt-4 border-t border-navy-800">
                <Link
                  to={`/candidate/apply/${job.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover shadow-md transition-all"
                >
                  Start Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

