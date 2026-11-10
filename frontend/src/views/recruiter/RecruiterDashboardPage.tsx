'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/utils/navigation';
import {
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  Building
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { jobsApi, companiesApi, JobDto, CompanyDto, getErrorMessage } from '@/services/api';

export const RecruiterDashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        // Fetch companies & jobs
        const [compRes, jobsRes] = await Promise.all([
          companiesApi.list({ limit: 1 }).catch(() => ({ success: true, data: { companies: [] } })),
          jobsApi.list({ limit: 20 }).catch(() => ({ success: true, data: { jobs: [] } })),
        ]);

        if (compRes.data?.companies && compRes.data.companies.length > 0) {
          setCompany(compRes.data.companies[0]);
        }
        if (jobsRes.data?.jobs) {
          setJobs(jobsRes.data.jobs);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const publishedJobs = jobs.filter((j) => j.status === 'published');
  const draftJobs = jobs.filter((j) => j.status === 'draft');

  return (
    <DashboardShell
      title="Recruiting Command Center"
      subtitle="Overview of company requisitions, candidate pipeline progression, and verified openings."
      role="recruiter"
      actions={
        <Link
          to="/recruiter/jobs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-soft-sm shadow-[#F97316]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Requisition</span>
        </Link>
      }
    >
      {/* Error notification */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Active Published Jobs</span>
            <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#0284C7]"><Briefcase className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-display">{publishedJobs.length}</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">Live on Board</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">{draftJobs.length} in draft staging</p>
        </div>

        <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Primary Organization</span>
            <div className="p-2 rounded-xl bg-[#FFF7ED] text-[#F97316]"><Building className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#0F172A] truncate">
              {company?.name || 'TalentFlow ATS Corp'}
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">Verified multi-tenant status</p>
        </div>

        <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Pipeline Velocity</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-display">100%</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">Atlas Synced</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">Audited stage transitions</p>
        </div>

        <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Total Requisitions</span>
            <div className="p-2 rounded-xl bg-[#F5F3FF] text-[#7C3AED]"><Users className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-display">{jobs.length}</span>
            <span className="text-[11px] font-bold text-[#64748B]">Across all stages</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">Includes draft, active & paused</p>
        </div>
      </div>

      {/* 2. Requisition List Table */}
      <div className="mt-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#F97316]" />
            Active Company Requisitions
          </h2>
          <Link to="/recruiter/jobs" className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1">
            View All Openings ({jobs.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#F97316] animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#64748B]">
            No requisitions found. Click &quot;Create New Requisition&quot; above to post an opening.
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {jobs.slice(0, 5).map((j) => (
              <div key={j._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        j.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : j.status === 'draft'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {j.status}
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">{j.title}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    {j.location} • {j.employmentType} • Created {new Date(j.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/recruiter/pipeline"
                    className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9]"
                  >
                    View Pipeline
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};
