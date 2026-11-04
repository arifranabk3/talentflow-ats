'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  FileText,
  Search,
  Download,
  Filter,
  Shield,
  Clock,
  User,
  Key,
  Globe
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-101', actor: 'marcus.vance@talentflow.com', action: 'OFFER_LETTER_GENERATED', target: 'Candidate Elena Rostova (#CAND-1)', ipAddress: '192.168.1.45', timestamp: '2026-11-04 15:42:10 UTC', severity: 'medium' },
  { id: 'log-102', actor: 'superadmin@talentflow.com', action: 'TENANT_SEATS_EXPANDED', target: 'Tenant Nexus Cloud (15 -> 25)', ipAddress: '10.0.4.11', timestamp: '2026-11-04 14:12:00 UTC', severity: 'low' },
  { id: 'log-103', actor: 'dave@flagged-user.com', action: 'MULTIPLE_FAILED_AUTH', target: 'Endpoint /api/v1/auth/login', ipAddress: '45.132.88.19', timestamp: '2026-11-04 12:08:45 UTC', severity: 'high' },
  { id: 'log-104', actor: 'system-scheduler', action: 'PIPELINE_DATABASE_SNAPSHOT', target: 'talentflow-production-cluster', ipAddress: '127.0.0.1', timestamp: '2026-11-04 06:00:00 UTC', severity: 'low' },
  { id: 'log-105', actor: 'marcus.vance@talentflow.com', action: 'INTERVIEW_ROOM_PROVISIONED', target: 'Panel Google Meet #401', ipAddress: '192.168.1.45', timestamp: '2026-11-04 05:22:18 UTC', severity: 'low' },
];

export const AdminAuditLogsPage: React.FC = () => {
  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              Immutable Security Journal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reports & Audit Trails
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Tamper-evident logs of all system authorizations, data access, and administrative operations.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 border border-navy-700 text-white text-xs font-semibold hover:border-slate-500 transition-colors">
            <Download className="w-4 h-4 text-brand-orange" />
            Export Audit CSV (SOC2)
          </button>
        </div>

        {/* Audit Table */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 border-b border-navy-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Timestamp (UTC)</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Security Action</th>
                  <th className="p-4">Target Resource</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-400">{log.timestamp}</td>
                    <td className="p-4 font-semibold text-white">{log.actor}</td>
                    <td className="p-4">
                      <span className="font-mono text-brand-orange">{log.action}</span>
                    </td>
                    <td className="p-4 text-slate-300">{log.target}</td>
                    <td className="p-4 font-mono text-slate-500">{log.ipAddress}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.severity === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : log.severity === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {log.severity}
                      </span>
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

