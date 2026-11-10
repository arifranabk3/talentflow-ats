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
  applied: { label: 'Application Received', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  screening: { label: 'Recruiter Screening', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  interview: { label: 'Interview Scheduled', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  offered: { label: 'Offer Extended', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  hired: { label: 'Offer Accepted / Hired', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  rejected: { label: 'Application Closed', color: 'bg-slate-100 text-slate-600 border-slate-200' },
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            My Career Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Submitted Applications
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time status tracking, feedback loops, and interview invitations across all applied positions.
          </p>
        </div>

        {/* Action success alert */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-slate-500 hover:text-slate-800 text-xs font-semibold">
              Dismiss
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && applications.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 font-display">No applications submitted yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Explore verified openings and apply to high-impact opportunities.</p>
            <Link
              to="/browse-jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 shadow-soft-sm transition-all"
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
                color: 'bg-slate-100 text-slate-600 border-slate-200',
              };
              const isTerminal = app.status === 'hired' || app.status === 'rejected';

              return (
                <div
                  key={app._id}
                  className="bg-white border border-slate-200 hover:border-teal-400 rounded-2xl p-6 transition-all shadow-soft-sm hover:shadow-soft-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageInfo.color}`}>
                          {stageInfo.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 font-display">
                        {app.jobId ? app.jobId.title : 'Position Details Pending'}
                      </h2>
                      <p className="text-xs text-slate-600 flex items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-slate-800">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {app.companyId ? app.companyId.name : 'TalentFlow Partner'}
                        </span>
                        <span>•</span>
                        <span>{app.jobId ? app.jobId.location : 'Remote'}</span>
                      </p>

                      {app.coverLetter && (
                        <p className="text-xs text-slate-600 mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 line-clamp-2 italic">
                          &ldquo;{app.coverLetter}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {!isTerminal && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          disabled={withdrawingId === app._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-all disabled:opacity-50"
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-700 shadow-soft-sm transition-all"
                      >
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
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
