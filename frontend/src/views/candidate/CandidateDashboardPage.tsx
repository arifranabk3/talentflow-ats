'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_APPLICATIONS, MOCK_JOBS, MOCK_INTERVIEWS } from '@/data/mockData';
import {
  FileText,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Search
} from 'lucide-react';
import { Link } from '@/utils/navigation';

export const CandidateDashboardPage: React.FC = () => {
  const activeApps = MOCK_APPLICATIONS.slice(0, 3);
  const nextInterview = MOCK_INTERVIEWS[0];

  return (
    <DashboardShell role="candidate">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Candidate Career Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Elena
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track your active job applications, upcoming panel interviews, and personalized role recommendations.
            </p>
          </div>

          <Link
            to="/candidate/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20 transition-all self-start sm:self-auto"
          >
            <Search className="w-4 h-4" />
            Explore Open Roles
          </Link>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Active Submissions</span>
              <FileText className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-2xl font-black text-white">{MOCK_APPLICATIONS.length}</div>
            <p className="text-[11px] text-slate-400 mt-2">2 under active hiring manager review</p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Next Upcoming Interview</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-white truncate">{nextInterview ? nextInterview.type : 'None'}</div>
            <p className="text-[11px] text-emerald-400 mt-2">{nextInterview?.scheduledTime || 'No panels today'}</p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Profile Completeness</span>
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">92%</div>
            <p className="text-[11px] text-slate-400 mt-2">Add Github repository for 100%</p>
          </div>
        </div>

        {/* Active Application Stages */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Application Tracker</h2>
              <p className="text-xs text-slate-400">Live progress across corporate review stages</p>
            </div>
            <Link to="/candidate/applications" className="text-xs font-semibold text-brand-orange hover:underline">
              View All ({MOCK_APPLICATIONS.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {activeApps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-white text-sm">{app.jobTitle}</h3>
                  <p className="text-xs text-slate-400">TalentFlow Core Team • Applied on {new Date(app.appliedDate || app.appliedAt || Date.now()).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                    Stage: {app.stage}
                  </span>
                  <Link
                    to="/candidate/applications"
                    className="p-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-white"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Curated Matches for Your Skillset
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_JOBS.slice(0, 2).map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white hover:text-brand-orange transition-colors">
                        <Link to={`/candidate/jobs/${job.id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{job.department} • {job.location}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {job.salary}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-3">{job.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-navy-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{job.type}</span>
                  <Link
                    to={`/candidate/apply/${job.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:text-white transition-colors"
                  >
                    1-Click Apply
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};
