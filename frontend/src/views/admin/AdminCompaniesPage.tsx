'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Building,
  Search,
  Plus,
  ShieldCheck,
  CreditCard,
  Users,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface CompanyTenant {
  id: string;
  name: string;
  domain: string;
  tier: 'Enterprise' | 'Scale' | 'Starter';
  seats: number;
  activeJobs: number;
  status: 'Active' | 'Review' | 'Suspended';
}

const INITIAL_COMPANIES: CompanyTenant[] = [
  { id: 'c1', name: 'TalentFlow Technologies', domain: 'talentflow.io', tier: 'Enterprise', seats: 24, activeJobs: 18, status: 'Active' },
  { id: 'c2', name: 'Nexus Cloud Infrastructure', domain: 'nexuscloud.io', tier: 'Enterprise', seats: 15, activeJobs: 8, status: 'Active' },
  { id: 'c3', name: 'Fintech Velocity Partners', domain: 'velocityfin.co', tier: 'Scale', seats: 6, activeJobs: 4, status: 'Active' },
  { id: 'c4', name: 'Aether Robotics & AI', domain: 'aether-robotics.tech', tier: 'Scale', seats: 5, activeJobs: 3, status: 'Active' },
  { id: 'c5', name: 'BrightWave Studios', domain: 'brightwave.design', tier: 'Starter', seats: 2, activeJobs: 1, status: 'Active' },
];

export const AdminCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyTenant[]>(INITIAL_COMPANIES);
  const [search, setSearch] = useState('');

  const filtered = companies.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <Building className="w-3.5 h-3.5" />
              Tenant Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Company Tenants & Subscriptions
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Multi-tenant isolation, enterprise billing tiers, and seat allocations.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20 transition-all">
            <Plus className="w-4 h-4" />
            Provision New Tenant
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies by name or domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-950 border border-navy-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="bg-navy-900 border border-navy-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{comp.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{comp.domain}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  comp.tier === 'Enterprise'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
                }`}>
                  {comp.tier}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-navy-800">
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                  <span className="text-slate-500 block text-[10px]">Active Recruiter Seats</span>
                  <span className="font-bold text-white text-sm">{comp.seats} Seats</span>
                </div>
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                  <span className="text-slate-500 block text-[10px]">Live Job Postings</span>
                  <span className="font-bold text-emerald-400 text-sm">{comp.activeJobs} Published</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tenant Health 100%
                </span>
                <button className="text-xs font-semibold text-brand-orange hover:underline">
                  Configure Tenant →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

