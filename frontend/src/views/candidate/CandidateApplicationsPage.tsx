'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { applicationsApi, ApplicationDto, getErrorMessage } from '@/services/api';
import {
  FileText,
  Clock,
  Loader2,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Building
} from 'lucide-react';
import { Link } from '@/utils/navigation';

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  applied: { label: 'Application Received', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  screening: { label: 'Recruiter Screening', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  interview: { label: 'Interview Scheduled', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  offered: { label: 'Offer Extended', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  hired: { label: 'Offer Accepted / Hired', color: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' },
  rejected: { label: 'Application Closed', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

export const CandidateApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await applicationsApi.getMyApplications();
      if (res.success && res.data?.applications) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdraw = async (appId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }
    try {
      setWithdrawingId(appId);
      const res = await applicationsApi.withdraw(appId);
      if (res.success) {
        setActionSuccess('Application withdrawn successfully.');
        await loadApplications();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <DashboardShell role="candidate">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            My Career Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Submitted Applications
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time status tracking, feedback loops, and interview invitations across all applied positions.
          </p>
        </div>

        {/* Action success alert */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && applications.length === 0 && (
          <div className="text-center py-16 bg-navy-900 border border-navy-800 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No applications submitted yet</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">Explore open roles and apply to opportunities.</p>
            <Link
              to="/candidate/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-all"
            >
              Browse Open Roles
            </Link>
          </div>
        )}

        {/* Application Cards */}
        {!loading && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => {
              const stageInfo = STAGE_LABELS[app.status] || {
                label: app.status,
                color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
              };
              const isTerminal = app.status === 'hired' || app.status === 'rejected';

              return (
                <div
                  key={app._id}
                  className="bg-navy-900 border border-navy-800 hover:border-slate-700 rounded-2xl p-6 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageInfo.color}`}>
                          {stageInfo.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-white">
                        {app.jobId ? app.jobId.title : 'Position Details Pending'}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-500" />
                          {app.companyId ? app.companyId.name : 'TalentFlow Partner'}
                        </span>
                        <span>•</span>
                        <span>{app.jobId ? app.jobId.location : 'Remote'}</span>
                      </p>

                      {app.coverLetter && (
                        <p className="text-xs text-slate-300 mt-3 p-3 bg-navy-950 rounded-xl border border-navy-800 line-clamp-2">
                          &ldquo;{app.coverLetter}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {!isTerminal && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          disabled={withdrawingId === app._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 border border-rose-500/30 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
                        >
                          {withdrawingId === app._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          Withdraw
                        </button>
                      )}
                      <Link
                        to="/candidate/notifications"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs font-medium text-slate-200 hover:border-slate-500"
                      >
                        <Clock className="w-3.5 h-3.5 text-brand-orange" />
                        Timeline
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};
