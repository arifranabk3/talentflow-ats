'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  ShieldAlert,
  Users,
  Building,
  Briefcase,
  FileText,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Server,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { Link } from '@/utils/navigation';

export const AdminDashboardPage: React.FC = () => {
  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Platform Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Governance & Administration
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Multi-tenant system monitoring, company tier authorizations, and compliance audit trail.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Healthy • 99.98% Uptime
            </span>
          </div>
        </div>

        {/* Global KPI stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Total Organizations</span>
              <Building className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-2xl font-black text-white">418</div>
            <p className="text-[11px] text-emerald-400 mt-2">+14 enrolled this month</p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Managed User Accounts</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">12,890</div>
            <p className="text-[11px] text-slate-400 mt-2">Recruiters, hiring managers & candidates</p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Pending Moderation</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">6</div>
            <p className="text-[11px] text-amber-400/80 mt-2">Flagged job listings requiring review</p>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Security Event Stream</span>
              <Lock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">Zero Breaches</div>
            <p className="text-[11px] text-emerald-400 mt-2">SOC2 Type II & GDPR compliant</p>
          </div>
        </div>

        {/* Governance quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-slate-700 transition-all flex items-start gap-4"
          >
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-brand-orange">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">User Directory & Roles</h3>
              <p className="text-xs text-slate-400 mt-1">Manage RBAC permissions, suspend accounts, and reset MFA tokens.</p>
            </div>
          </Link>

          <Link
            to="/admin/companies"
            className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-slate-700 transition-all flex items-start gap-4"
          >
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-blue-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Tenant & Company Management</h3>
              <p className="text-xs text-slate-400 mt-1">Monitor billing tiers, active seats, and enterprise SSO connections.</p>
            </div>
          </Link>

          <Link
            to="/admin/jobs"
            className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-slate-700 transition-all flex items-start gap-4"
          >
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Job Posting Moderation</h3>
              <p className="text-xs text-slate-400 mt-1">Approve, flag, or reject public job postings violating safety guidelines.</p>
            </div>
          </Link>
        </div>

        {/* Recent Audit Stream */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recent Security & Audit Logs</h2>
            <Link to="/admin/logs" className="text-xs font-semibold text-brand-orange hover:underline">
              Inspect Full Audit Trail →
            </Link>
          </div>

          <div className="divide-y divide-navy-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Role Elevated: Admin Granted</span>
                <p className="text-slate-400 text-[11px]">User marcus.vance@talentflow.com promoted by SuperAdmin</p>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">10 mins ago</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">SAML SSO Configuration Updated</span>
                <p className="text-slate-400 text-[11px]">Tenant Acme Corp renewed Okta metadata certificate</p>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">42 mins ago</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Automated DB Backup Completed</span>
                <p className="text-slate-400 text-[11px]">Encrypted snapshot stored in talentflow-backups-east</p>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

