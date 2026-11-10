'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { jobsApi, applicationsApi, JobDto, ApplicationDto, getErrorMessage } from '@/services/api';
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
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Link } from '@/utils/navigation';
import { useAuth } from '@/context/AuthContext';

export const CandidateDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const [appsRes, jobsRes] = await Promise.all([
          applicationsApi.getMyApplications().catch(() => ({ success: true, data: { applications: [] } })),
          jobsApi.list({ limit: 4 }).catch(() => ({ success: true, data: { jobs: [] } })),
        ]);

        if (appsRes.data?.applications) {
          setApplications(appsRes.data.applications);
        }
        if (jobsRes.data?.jobs) {
          setRecentJobs(jobsRes.data.jobs);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const activeAppsCount = applications.filter((a) => a.status !== 'rejected').length;
  const interviewsCount = applications.filter((a) => a.status === 'interview').length;

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
              Welcome back, {user?.name || 'Elena'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track your active job applications, interview pipelines, and explore verified requisitions.
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

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Active Submissions</span>
              <FileText className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-2xl font-black text-white">{applications.length}</div>
            <p className="text-[11px] text-slate-400 mt-2">{activeAppsCount} in active review</p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Interviews Scheduled</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{interviewsCount}</div>
            <p className="text-[11px] text-emerald-400 mt-2">
              {interviewsCount > 0 ? `${interviewsCount} stage panel active` : 'No upcoming panels today'}
            </p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Profile Completeness</span>
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">100%</div>
            <p className="text-[11px] text-slate-400 mt-2">Ready for instant verified application</p>
          </div>
        </div>

        {/* Active Applications Section */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" />
              Recent Applications
            </h2>
            <Link
              to="/candidate/applications"
              className="text-xs text-brand-orange font-bold hover:underline inline-flex items-center gap-1"
            >
              View all ({applications.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No active applications yet. Browse published openings to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-navy-950 border border-navy-800 text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{app.jobId ? app.jobId.title : 'Position Details'}</div>
                    <div className="text-[11px] text-slate-400">
                      {app.companyId ? app.companyId.name : 'TalentFlow Partner'} • Applied{' '}
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-orange/10 text-brand-orange border border-brand-orange/20 uppercase">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Openings */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Verified Open Openings
            </h2>
            <Link
              to="/candidate/jobs"
              className="text-xs text-brand-orange font-bold hover:underline inline-flex items-center gap-1"
            >
              Browse all jobs
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentJobs.slice(0, 4).map((j) => (
              <div
                key={j._id}
                className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-white">{j.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {typeof j.companyId === 'object' ? j.companyId.name : 'TalentFlow Partner'} • {j.location}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-navy-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">{j.employmentType}</span>
                  <Link
                    to={`/candidate/apply/${j._id}`}
                    className="text-xs font-bold text-brand-orange hover:underline"
                  >
                    Apply Now →
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
