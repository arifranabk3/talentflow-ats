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
        {/* Banner */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Opportunities
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find Your Next Career Milestone
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Explore active openings across engineering, product, and leadership with transparent compensation bands and direct recruiter access.
          </p>

          {/* Search Inputs */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Job title or skills (e.g. TypeScript, React)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="flex-1 bg-navy-950 border border-navy-700 text-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-orange"
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
                className="flex-1 bg-navy-950 border border-navy-700 text-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-orange"
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
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
          </div>
        )}

        {/* Jobs List */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-16 bg-navy-900 border border-navy-800 rounded-2xl">
            <Briefcase className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No published jobs found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters.</p>
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
                  className="bg-navy-900 border border-navy-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-orange/10 text-brand-orange border border-brand-orange/20 uppercase tracking-wide">
                        {job.employmentType}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">{job.workplaceType}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white hover:text-brand-orange transition-colors">
                      {job.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {companyName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location || companyLoc}
                      </span>
                      {job.salaryRange && (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{job.description}</p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.skills.slice(0, 4).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-navy-800 text-[11px] text-slate-300 border border-navy-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-5 border-t border-navy-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/candidate/apply/${job._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-all"
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
