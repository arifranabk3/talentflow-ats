'use client';

import React from 'react';
import { useParams, Link } from '@/utils/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  ArrowLeft,
  Briefcase,
  Star,
  ExternalLink
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_CANDIDATES } from '@/data/mockData';

export const RecruiterCandidateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const candidate = MOCK_CANDIDATES.find((c) => c.id === id) || MOCK_CANDIDATES[0];

  return (
    <DashboardShell
      title={candidate.name}
      subtitle={`${candidate.currentRole} at ${candidate.currentCompany} • Applied for ${candidate.appliedRole}`}
      role="recruiter"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/recruiter/interviews"
            className="px-4 py-2 bg-[#0A1424] hover:bg-[#14284B] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Panel</span>
          </Link>
          <button className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-soft-sm transition-colors">
            Advance Stage →
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Dossier */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-4">
                <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">{candidate.name}</h2>
                  <p className="text-xs text-[#64748B]">{candidate.currentRole} • {candidate.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#059669] flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-teal-700" />
                  {candidate.matchScore}%
                </span>
                <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Semantic Match</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Email</span>
                <span className="text-[#0F172A] font-semibold">{candidate.email}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Phone</span>
                <span className="text-[#0F172A] font-semibold">{candidate.phone}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Experience</span>
                <span className="text-[#0F172A] font-semibold">{candidate.experienceYears} Years</span>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">Matched Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-lg text-xs font-bold bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Evaluation Scorecard */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">Team Evaluation Rubric</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F172A] block">System Architecture & Scalability</span>
                  <span className="text-[11px] text-[#64748B]">Evaluator: Alex Vance (Staff Arch)</span>
                </div>
                <span className="px-2 py-1 rounded bg-[#ECFDF5] text-[#059669] font-bold">Strong Yes (5/5)</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F172A] block">Distributed Systems Consensus</span>
                  <span className="text-[11px] text-[#64748B]">Evaluator: Devin Lee (VP Eng)</span>
                </div>
                <span className="px-2 py-1 rounded bg-[#ECFDF5] text-[#059669] font-bold">Yes (4/5)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stage Navigation & History */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-soft-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Active Stage</h3>
            <div className="p-3 bg-[#EFF6FF] text-[#0284C7] rounded-xl font-bold text-center text-sm uppercase tracking-wider border border-[#BAE6FD]">
              {candidate.stage}
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">Next Scheduled Action</span>
              <p className="text-xs text-[#0F172A] font-semibold">Technical Deep Dive Panel on Nov 4, 2:00 PM</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
};

