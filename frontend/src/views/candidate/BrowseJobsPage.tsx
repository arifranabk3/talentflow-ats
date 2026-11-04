'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_JOBS } from '@/data/mockData';
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  DollarSign,
  Filter,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from '@/utils/navigation';

export const BrowseJobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredJobs = MOCK_JOBS.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || j.department === departmentFilter;
    const matchesType = typeFilter === 'all' || j.type === typeFilter;
    return matchesSearch && matchesDept && matchesType;
  });

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
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Job title, keywords, or tech stack (e.g. React, Kubernetes)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="flex-1 bg-navy-950 border border-navy-700 text-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-orange"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Security">Security</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 bg-navy-950 border border-navy-700 text-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-orange"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing <strong className="text-white">{filteredJobs.length}</strong> available positions</span>
          <span>Updated today</span>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-navy-900 border border-navy-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-brand-orange uppercase tracking-wider">
                      {job.department}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-orange transition-colors mt-0.5">
                      <Link to={`/candidate/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {job.salary}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {job.type}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 mt-3.5 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.requirements.slice(0, 3).map((req, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-md bg-navy-950 border border-navy-800 text-slate-300">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-navy-800 flex items-center justify-between">
                <Link
                  to={`/candidate/jobs/${job.id}`}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  View Details
                </Link>
                <Link
                  to={`/candidate/apply/${job.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-orange/20"
                >
                  Apply Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

