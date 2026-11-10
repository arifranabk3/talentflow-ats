'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { jobsApi, applicationsApi, companiesApi, JobDto, ApplicationDto, getErrorMessage } from '@/services/api';
import {
  Kanban,
  Search,
  Users,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from '@/utils/navigation';

type PipelineStageKey = 'applied' | 'screening' | 'interview' | 'offered' | 'hired';

const PIPELINE_COLUMNS: { stage: PipelineStageKey; label: string; color: string; badgeBg: string }[] = [
  { stage: 'applied', label: 'Applied', color: 'border-blue-500/40', badgeBg: 'bg-blue-500/10 text-blue-400' },
  { stage: 'screening', label: 'Screening', color: 'border-amber-500/40', badgeBg: 'bg-amber-500/10 text-amber-400' },
  { stage: 'interview', label: 'Interview', color: 'border-purple-500/40', badgeBg: 'bg-purple-500/10 text-purple-400' },
  { stage: 'offered', label: 'Offer Extended', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500/10 text-emerald-400' },
  { stage: 'hired', label: 'Hired & Completed', color: 'border-brand-orange/40', badgeBg: 'bg-brand-orange/10 text-brand-orange' },
];

export const RecruiterPipelinePage: React.FC = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load recruiter company context & jobs
  useEffect(() => {
    async function init() {
      try {
        const [compRes, jobsRes] = await Promise.all([
          companiesApi.list({ limit: 1 }).catch(() => ({ success: true, data: { companies: [] } })),
          jobsApi.list({ limit: 50 }).catch(() => ({ success: true, data: { jobs: [] } })),
        ]);
        if (compRes.data?.companies && compRes.data.companies.length > 0) {
          setCompanyId(compRes.data.companies[0]._id);
        }
        if (jobsRes.data?.jobs) {
          setJobs(jobsRes.data.jobs);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
    init();
  }, []);

  const loadPipeline = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await applicationsApi.getCompanyApplications(companyId, {
        jobId: selectedJobId !== 'all' ? selectedJobId : undefined,
      });
      if (res.success && res.data?.applications) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [companyId, selectedJobId]);

  useEffect(() => {
    if (companyId) {
      loadPipeline();
    }
  }, [companyId, loadPipeline]);

  const filteredApps = applications.filter((app) => {
    const candidateName = app.candidateId ? app.candidateId.name : '';
    const jobTitle = app.jobId ? app.jobId.title : '';
    return (
      candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleStageTransition = async (appId: string, nextStage: string) => {
    try {
      setUpdatingId(appId);
      const res = await applicationsApi.updateStatus(appId, {
        status: nextStage,
        reason: `Stage transitioned to ${nextStage} from Hiring Board`,
      });
      if (res.success) {
        setActionSuccess(`Candidate successfully advanced to ${nextStage}`);
        await loadPipeline();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStage = (current: string): string | null => {
    const map: Record<string, string> = {
      applied: 'screening',
      screening: 'interview',
      interview: 'offered',
      offered: 'hired',
    };
    return map[current] || null;
  };

  const getPrevStage = (current: string): string | null => {
    const map: Record<string, string> = {
      hired: 'offered',
      offered: 'interview',
      interview: 'screening',
      screening: 'applied',
    };
    return map[current] || null;
  };

  return (
    <DashboardShell role="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <Kanban className="w-3.5 h-3.5" />
              Live Hiring Board
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recruitment Pipeline
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live multi-tenant candidate journey tracking with verified MongoDB Atlas stage transitions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-navy-900 border border-navy-700 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-orange"
            >
              <option value="all">All Requisitions ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name or role in pipeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-navy-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
          </div>
        )}

        {/* Kanban Board Columns */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {PIPELINE_COLUMNS.map((col) => {
              const columnApps = filteredApps.filter((a) => a.status === col.stage);
              return (
                <div
                  key={col.stage}
                  className="bg-navy-900 border border-navy-800 rounded-2xl p-4 flex flex-col min-w-[220px]"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-navy-800">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.badgeBg}`} />
                      {col.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-800 text-slate-300">
                      {columnApps.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columnApps.length === 0 ? (
                      <div className="text-center py-8 text-[11px] text-slate-500">No candidates in stage</div>
                    ) : (
                      columnApps.map((app) => {
                        const next = getNextStage(app.status);
                        const isUpdating = updatingId === app._id;
                        return (
                          <div
                            key={app._id}
                            className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 hover:border-slate-700 transition-all space-y-2 text-xs"
                          >
                            <div className="font-bold text-white">
                              {app.candidateId ? app.candidateId.name : 'Candidate'}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {app.jobId ? app.jobId.title : 'Position'}
                            </div>

                            {app.recruiterNotes && (
                              <p className="text-[10px] text-slate-400 bg-navy-900 p-2 rounded-lg italic line-clamp-2">
                                {app.recruiterNotes}
                              </p>
                            )}

                            <div className="pt-2 border-t border-navy-800 flex items-center justify-between">
                              <span className="text-[10px] text-slate-500">
                                {new Date(app.appliedAt).toLocaleDateString()}
                              </span>
                              {next && (
                                <button
                                  onClick={() => handleStageTransition(app._id, next)}
                                  disabled={isUpdating}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-brand-orange hover:bg-brand-orange hover:text-white text-[11px] font-bold transition-all disabled:opacity-50"
                                >
                                  {isUpdating ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <>
                                      <span>Advance</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
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
