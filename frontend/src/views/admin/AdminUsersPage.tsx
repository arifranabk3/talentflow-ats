'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Users,
  Search,
  Filter,
  Shield,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  KeyRound
} from 'lucide-react';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'candidate';
  company: string;
  status: 'active' | 'suspended' | 'invited';
  createdAt: string;
}

const INITIAL_USERS: ManagedUser[] = [
  { id: 'u1', name: 'Marcus Vance', email: 'marcus.vance@talentflow.com', role: 'recruiter', company: 'TalentFlow Tech', status: 'active', createdAt: '2026-08-12' },
  { id: 'u2', name: 'Elena Rostova', email: 'elena.rostova@example.com', role: 'candidate', company: 'Independent', status: 'active', createdAt: '2026-09-04' },
  { id: 'u3', name: 'Admin Root', email: 'admin@talentflow.com', role: 'admin', company: 'TalentFlow System', status: 'active', createdAt: '2026-01-01' },
  { id: 'u4', name: 'Sarah Lin', email: 'sarah.lin@stripe-demo.com', role: 'recruiter', company: 'Fintech Partners', status: 'active', createdAt: '2026-10-15' },
  { id: 'u5', name: 'Dave Miller', email: 'dave@flagged-user.com', role: 'candidate', company: 'Independent', status: 'suspended', createdAt: '2026-10-20' },
];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      })
    );
  };

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            Identity Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            User Accounts & RBAC Policies
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Global access controls, role assignments, multi-factor authorization, and account suspensions.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-950 border border-navy-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-navy-950 border border-navy-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-orange"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="recruiter">Recruiter</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 border-b border-navy-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : u.role === 'recruiter'
                          ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{u.company}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{u.createdAt}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          u.status === 'active'
                            ? 'text-rose-400 hover:bg-rose-500/10'
                            : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
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

