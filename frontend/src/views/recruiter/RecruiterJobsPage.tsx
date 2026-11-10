'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/utils/navigation';
import {
  Plus,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  Briefcase
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { jobsApi, JobDto, getErrorMessage } from '@/services/api';

export const RecruiterJobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await jobsApi.list({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 50,
      });
      if (res.success && res.data?.jobs) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadJobs();
    }, 300);
    return () => clearTimeout(t);
  }, [loadJobs]);

  const handlePublish = async (jobId: string) => {
    try {
      setProcessingId(jobId);
      const res = await jobsApi.publish(jobId);
      if (res.success) {
        setActionSuccess('Job opening published successfully!');
        await loadJobs();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setProcessingId(null);
    }
  };

  const handlePause = async (jobId: string) => {
    try {
      setProcessingId(jobId);
      const res = await jobsApi.pause(jobId);
      if (res.success) {
        setActionSuccess('Job opening paused.');
        await loadJobs();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setProcessingId(null);
    }
  };

  const handleClose = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to close this job? Candidate applications will be preserved.')) {
      return;
    }
    try {
      setProcessingId(jobId);
      const res = await jobsApi.close(jobId);
      if (res.success) {
        setActionSuccess('Job opening closed. Existing application history preserved.');
        await loadJobs();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardShell
      title="Requisition Directory"
      subtitle="Manage global job openings, requirements, and candidate inflow."
      role="recruiter"
      actions={
        <Link
          to="/recruiter/jobs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-soft-sm shadow-soft-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Job Opening</span>
        </Link>
      }
    >
      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-slate-600 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-teal-700"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] font-medium focus:outline-none focus:border-teal-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Requisitions List */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E2E8F0] rounded-2xl">
          <Briefcase className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">No requisitions found</h3>
          <p className="text-xs text-[#64748B] mt-1">Try clearing your filters or create a new job opening.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      job.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : job.status === 'draft'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {job.status}
                  </span>
                  <span className="text-[11px] text-[#64748B] uppercase font-bold">{job.employmentType}</span>
                  <span className="text-[11px] text-[#94A3B8]">
                    • Created {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[#0F172A]">{job.title}</h2>
                <p className="text-xs text-[#64748B] line-clamp-2">{job.description}</p>
                <div className="text-xs text-[#94A3B8]">{job.location} • {job.workplaceType}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {job.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(job._id)}
                    disabled={processingId === job._id}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Publish
                  </button>
                )}
                {job.status === 'published' && (
                  <button
                    onClick={() => handlePause(job._id)}
                    disabled={processingId === job._id}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-50"
                  >
                    Pause
                  </button>
                )}
                {job.status !== 'closed' && (
                  <button
                    onClick={() => handleClose(job._id)}
                    disabled={processingId === job._id}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100 disabled:opacity-50"
                  >
                    Close
                  </button>
                )}
                <Link
                  to="/recruiter/pipeline"
                  className="px-4 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold text-[#0F172A] hover:bg-[#F1F5F9]"
                >
                  View Pipeline
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
};
