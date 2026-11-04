'use client';

import React from 'react';
import { Link } from '@/utils/navigation';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Kanban
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_JOBS, MOCK_CANDIDATES, MOCK_INTERVIEWS } from '@/data/mockData';

export const RecruiterDashboardPage: React.FC = () => {
  return (
    <DashboardShell
      title="Recruiting Command Center"
      subtitle="Overview of active requisitions, pipeline progression, and scheduled interview panels."
      role="recruiter"
      actions={
        <Link
          to="/recruiter/jobs/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-soft-sm shadow-[#F97316]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Requisition</span>
        </Link>
      }
    >
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Active Requisitions</span>
            <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#0284C7]"><Briefcase className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-display">12</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">+2 this week</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">4 urgent engineering openings</p>
        </div>

        <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Candidates in Pipeline</span>
            <div className="p-2 rounded-xl bg-[#FFF7ED] text-[#F97316]"><Users className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-display">248</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">+18% MoM</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">34 screened by AI match score &gt;90%</p>
        </div>

        <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Interviews This Week</span>
            <div className="p-2 rounded-xl bg-[#F5F3FF] text-[#7C3AED]"><Calendar className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-display">19</span>
            <span className="text-[11px] font-bold text-[#64748B]">8 completed</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">2 final executive presentations</p>
        </div>

        <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Time-to-Hire Velocity</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-display">24d</span>
            <span className="text-[11px] font-bold text-emerald-600">-6 days vs avg</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">Top quartile industry benchmark</p>
        </div>
      </div>

      {/* 2. Main 2-Column Split: Active Requisitions + Scheduled Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Requisitions List */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Active Requisitions</h2>
              <p className="text-xs text-[#64748B]">Live postings receiving qualified candidate applications</p>
            </div>
            <Link to="/recruiter/jobs" className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1">
              <span>View All ({MOCK_JOBS.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_JOBS.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#F97316]/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#F97316]">{job.department}</span>
                    <span className="text-[10px] text-[#94A3B8]">• {job.type}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#0F172A]">{job.title}</h3>
                  <p className="text-xs text-[#64748B]">{job.location} • {job.salaryRange}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-sm font-extrabold text-[#0F172A]">{job.applicantsCount}</span>
                    <p className="text-[10px] text-[#94A3B8]">Candidates</p>
                  </div>
                  <Link
                    to={`/recruiter/jobs/${job.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-[#0A1424] hover:text-white transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Interviews */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Upcoming Panels</h2>
              <p className="text-xs text-[#64748B]">Scheduled Google Meet interviews</p>
            </div>
            <Link to="/recruiter/interviews" className="text-xs font-bold text-[#F97316] hover:underline">
              Calendar
            </Link>
          </div>

          <div className="space-y-4">
            {MOCK_INTERVIEWS.map((intItem) => (
              <div key={intItem.id} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <img src={intItem.candidateAvatar} alt={intItem.candidateName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A]">{intItem.candidateName}</h3>
                    <p className="text-[11px] text-[#64748B] truncate max-w-[180px]">{intItem.role}</p>
                  </div>
                </div>

                <div className="text-xs text-[#475569] space-y-1 bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
                  <p className="font-semibold text-[#0F172A]">{intItem.date} • {intItem.time}</p>
                  <p className="text-[11px] text-[#64748B]">Panel: {intItem.interviewers.join(', ')}</p>
                </div>

                <a
                  href={intItem.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2 text-center text-xs font-bold text-white bg-[#0A1424] hover:bg-[#14284B] rounded-lg transition-colors"
                >
                  Join Meeting Room
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. High-Match Candidate Highlight Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Top Aligned Candidates</h2>
            <p className="text-xs text-[#64748B]">Semantic AI match evaluated against active job requirements</p>
          </div>
          <Link to="/recruiter/candidates" className="text-xs font-bold text-[#F97316] hover:underline">
            All Candidates
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Applied Requisition</th>
                <th className="py-3 px-4">Current Organization</th>
                <th className="py-3 px-4">Pipeline Stage</th>
                <th className="py-3 px-4">Semantic Match</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {MOCK_CANDIDATES.map((c) => (
                <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] flex items-center gap-2.5">
                    <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">{c.appliedRole}</td>
                  <td className="py-3.5 px-4 text-[#64748B]">{c.currentCompany} ({c.experienceYears}y exp)</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#0284C7] border border-[#BAE6FD]">
                      {c.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-[#059669] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                      {c.matchScore}% Match
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/recruiter/candidates/${c.id}`}
                      className="text-xs font-bold text-[#0F172A] hover:text-[#F97316] underline"
                    >
                      Inspect Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
};

