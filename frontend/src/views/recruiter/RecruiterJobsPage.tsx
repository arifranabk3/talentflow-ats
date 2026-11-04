'use client';

import React, { useState } from 'react';
import { Link } from '@/utils/navigation';
import { Plus, Search, Filter, MoreHorizontal, ChevronRight, Users, MapPin, DollarSign, Calendar } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_JOBS } from '@/data/mockData';

export const RecruiterJobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filtered = MOCK_JOBS.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = departmentFilter === 'all' || job.department === departmentFilter;
    return matchSearch && matchDept;
  });

  return (
    <DashboardShell
      title="Requisition Directory"
      subtitle="Manage global job openings, requirements, and candidate inflow."
      role="recruiter"
      actions={
        <Link
          to="/recruiter/jobs/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-soft-sm shadow-[#F97316]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Job Opening</span>
        </Link>
      }
    >
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles or departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] font-medium focus:outline-none focus:border-[#F97316]"
          >
            <option value="all">All Departments</option>
            <option value="Core Infrastructure">Core Infrastructure</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Web Applications">Web Applications</option>
            <option value="Applied AI Labs">Applied AI Labs</option>
          </select>
        </div>
      </div>

      {/* Requisitions Grid */}
      <div className="space-y-4">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#F1F5F9] text-[#475569]">
                  {job.department}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  Published
                </span>
                <span className="text-[11px] text-[#94A3B8]">Opened {job.publishedAt}</span>
              </div>

              <h2 className="text-lg font-bold text-[#0F172A] hover:text-[#F97316] transition-colors">
                <Link to={`/recruiter/jobs/${job.id}`}>{job.title}</Link>
              </h2>

              <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-[#64748B] pt-1">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#94A3B8]" /> {job.location}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-[#94A3B8]" /> {job.salaryRange}</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#94A3B8]" /> {job.applicantsCount} Candidates</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#F1F5F9]">
              <Link
                to={`/recruiter/pipeline?jobId=${job.id}`}
                className="px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#0A1424] hover:text-white text-xs font-bold text-[#0F172A] transition-colors"
              >
                View Pipeline
              </Link>
              <Link
                to={`/recruiter/jobs/${job.id}/edit`}
                className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-soft-sm transition-colors"
              >
                Edit Role
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
};

