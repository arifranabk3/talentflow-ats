'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { jobsApi, JobDto, getErrorMessage } from '@/services/api';
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Link } from '@/utils/navigation';

export const BrowseJobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employmentType, setEmploymentType] = useState('all');
  const [workplaceType, setWorkplaceType] = useState('all');
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await jobsApi.list({
        search: searchTerm || undefined,
        employmentType: employmentType !== 'all' ? employmentType : undefined,
        workplaceType: workplaceType !== 'all' ? workplaceType : undefined,
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
  }, [searchTerm, employmentType, workplaceType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  return (
    <DashboardShell role="candidate">
      <div className="space-y-6">
        {/* Banner — Distinct Corporate Talent Discovery */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 border border-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Opportunities
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Find Your Next Career Milestone
          </h1>
          <p className="text-teal-100/90 text-sm mt-2 max-w-2xl leading-relaxed">
            Explore active openings across engineering, product, and leadership with transparent compensation bands and direct hiring team access.
          </p>

          {/* Search Inputs */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Job title or skills (e.g. TypeScript, React)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="flex-1 bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              >
                <option value="all">All Employment Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="flex-1 bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              >
                <option value="all">All Workplace Formats</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
          </div>
        )}

        {/* Jobs List */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No published jobs found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const companyName = typeof job.companyId === 'object' ? job.companyId.name : 'TalentFlow Partner';
              const companyLoc = typeof job.companyId === 'object' ? job.companyId.location : job.location;
              return (
                <div
                  key={job._id}
                  className="bg-white border border-slate-200 hover:border-teal-500 rounded-2xl p-6 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wide">
                        {job.employmentType}
                      </span>
                      <span className="text-xs text-slate-500 capitalize font-medium">{job.workplaceType}</span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 hover:text-teal-700 transition-colors">
                      {job.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {companyName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location || companyLoc}
                      </span>
                      {job.salaryRange && (
                        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.skills.slice(0, 4).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-700 border border-slate-200 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/candidate/apply/${job._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-all shadow-soft-sm"
                    >
                      Apply Now
                    </Link>
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
