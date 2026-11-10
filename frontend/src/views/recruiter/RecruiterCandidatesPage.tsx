'use client';

import React, { useState } from 'react';
import { Link } from '@/utils/navigation';
import { Search, Filter, Sparkles, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_CANDIDATES } from '@/data/mockData';

export const RecruiterCandidatesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_CANDIDATES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardShell
      title="Candidate Directory"
      subtitle="Search, filter, and inspect applicants across all requisition pipelines."
      role="recruiter"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, skill (e.g. Go, Figma, PyTorch)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
            />
          </div>
          <span className="text-xs text-[#64748B]">{filtered.length} candidates located</span>
        </div>

        {/* Directory Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Current Organization</th>
                <th className="py-3 px-4">Applied Requisition</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Semantic Match</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-[#0F172A]">{c.name}</p>
                      <p className="text-[10px] text-[#64748B]">{c.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">{c.currentCompany} ({c.currentRole})</td>
                  <td className="py-3.5 px-4 text-[#0F172A] font-medium">{c.appliedRole}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#0284C7] border border-[#BAE6FD]">
                      {c.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-[#059669] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                      {c.matchScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/recruiter/candidates/${c.id}`}
                      className="text-xs font-bold text-teal-700 hover:underline"
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

