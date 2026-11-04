'use client';

import React, { useState } from 'react';
import { useParams, Link } from '@/utils/navigation';
import { Briefcase, Users, MapPin, DollarSign, Clock, CheckCircle2, ChevronRight, Share2, Edit } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_JOBS, MOCK_CANDIDATES } from '@/data/mockData';

export const RecruiterJobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const job = MOCK_JOBS.find((j) => j.id === id) || MOCK_JOBS[0];
  const applicants = MOCK_CANDIDATES.filter((c) => c.appliedRole === job.title);

  return (
    <DashboardShell
      title={job.title}
      subtitle={`Requisition #${job.id.toUpperCase()} • ${job.department} • ${job.location}`}
      role="recruiter"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to={`/recruiter/pipeline?jobId=${job.id}`}
            className="px-4 py-2 bg-[#0A1424] hover:bg-[#14284B] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Open Pipeline
          </Link>
          <Link
            to={`/recruiter/jobs/${job.id}/edit`}
            className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-soft-sm transition-colors flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Requisition</span>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Requisition Metadata & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-4">
            <h2 className="text-base font-bold text-[#0F172A]">Position Overview</h2>
            <p className="text-xs text-[#475569] leading-relaxed">{job.description}</p>
            
            <div className="pt-4 border-t border-[#F1F5F9] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F97316]">Core Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F1F5F9] text-[#0F172A]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F97316]">Requirements & Rubric</h3>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                {job.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Active Applicants for this job */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0F172A]">Recent Candidates</h2>
              <span className="text-xs text-[#64748B]">{applicants.length} in review</span>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {applicants.map((cand) => (
                <div key={cand.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={cand.avatar} alt={cand.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{cand.name}</h4>
                      <p className="text-[11px] text-[#64748B]">{cand.currentCompany} • {cand.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-600">{cand.matchScore}% Match</span>
                    <Link
                      to={`/recruiter/candidates/${cand.id}`}
                      className="text-xs font-bold text-[#F97316] hover:underline"
                    >
                      Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Requisition Parameters */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Telemetry</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Status</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">Active</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Target Compensation</span>
                <span className="font-bold text-[#0F172A]">{job.salaryRange}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Employment</span>
                <span className="font-bold text-[#0F172A]">{job.type}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Experience</span>
                <span className="font-bold text-[#0F172A]">{job.experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#64748B]">Target Openings</span>
                <span className="font-bold text-[#0F172A]">{job.openingsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

