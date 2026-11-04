'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_JOBS } from '@/data/mockData';
import {
  Briefcase,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';

interface ModerationJob {
  id: string;
  title: string;
  company: string;
  department: string;
  salary: string;
  status: 'pending' | 'approved' | 'rejected';
  flagReason?: string;
}

const INITIAL_MODERATION: ModerationJob[] = [
  { id: 'mj1', title: 'Senior Solidity Smart Contract Auditor', company: 'DeFi Matrix Inc', department: 'Blockchain', salary: '$210,000 - $260,000', status: 'pending', flagReason: 'High compensation band review' },
  { id: 'mj2', title: 'Remote Data Entry Clerk - Immediate Start', company: 'Apex Global Ops', department: 'Operations', salary: '$45/hr', status: 'pending', flagReason: 'Potential duplicate spam report' },
  { id: 'mj3', title: 'Principal Infrastructure Architect', company: 'TalentFlow Tech', department: 'Engineering', salary: '$220,000 - $260,000', status: 'approved' },
  { id: 'mj4', title: 'Commission-Only Sales Rep (Unverified Domain)', company: 'Unknown LLC', department: 'Sales', salary: '$120,000', status: 'rejected', flagReason: 'Unverified company email domain' },
];

export const AdminJobModerationPage: React.FC = () => {
  const [items, setItems] = useState<ModerationJob[]>(INITIAL_MODERATION);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  };

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrity & Compliance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Job Posting Moderation
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review, approve, or reject user-submitted job openings before syndication to public boards.
          </p>
        </div>

        {/* Listings Moderation Table */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 border-b border-navy-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Opening Title</th>
                  <th className="p-4">Employer</th>
                  <th className="p-4">Compensation Band</th>
                  <th className="p-4">Flag / Trust Note</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Moderator Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {items.map((job) => (
                  <tr key={job.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{job.title}</div>
                      <div className="text-[11px] text-slate-400">{job.department}</div>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{job.company}</td>
                    <td className="p-4 font-mono text-emerald-400">{job.salary}</td>
                    <td className="p-4">
                      {job.flagReason ? (
                        <span className="text-[11px] text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          {job.flagReason}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Clean submission</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        job.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : job.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {job.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAction(job.id, 'approved')}
                            className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-colors text-xs font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(job.id, 'rejected')}
                            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Decision Logged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

