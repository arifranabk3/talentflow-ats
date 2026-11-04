'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_APPLICATIONS } from '@/data/mockData';
import {
  FileText,
  Clock,
  CheckCircle,
  Building,
  ArrowRight,
  ChevronRight,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Link } from '@/utils/navigation';

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  sourced: { label: 'Application Received', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  screening: { label: 'Recruiter Screening', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  technical: { label: 'Technical Assessment', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  cultural: { label: 'Leadership / Culture', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  offer: { label: 'Offer Extended', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  hired: { label: 'Hired & Completed', color: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' }
};

export const CandidateApplicationsPage: React.FC = () => {
  return (
    <DashboardShell role="candidate">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            My Career Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Submitted Applications
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time status tracking, feedback loops, and interview invitations across all applied positions.
          </p>
        </div>

        {/* Application Cards */}
        <div className="space-y-4">
          {MOCK_APPLICATIONS.map((app) => {
            const stageInfo = STAGE_LABELS[app.stage] || { label: app.stage, color: 'bg-slate-500/10 text-slate-400' };
            return (
              <div
                key={app.id}
                className="bg-navy-900 border border-navy-800 hover:border-slate-700 rounded-2xl p-6 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageInfo.color}`}>
                        {stageInfo.label}
                      </span>
                      <span className="text-xs text-slate-500">ID: {app.id.toUpperCase()}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white">{app.jobTitle}</h2>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>TalentFlow Inc.</span>
                      <span>•</span>
                      <span>Applied: {new Date(app.appliedDate || app.appliedAt || Date.now()).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/candidate/notifications"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs font-medium text-slate-200 hover:border-slate-500"
                    >
                      <Clock className="w-3.5 h-3.5 text-brand-orange" />
                      View Timeline
                    </Link>
                  </div>
                </div>

                {/* Progress Visual Tracker */}
                <div className="mt-6 pt-5 border-t border-navy-800">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                      ✓ Submitted
                    </div>
                    <div className={`p-2 rounded-lg border font-semibold ${
                      ['screening', 'technical', 'cultural', 'offer', 'hired'].includes(app.stage)
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-navy-950 border-navy-800 text-slate-500'
                    }`}>
                      Screening
                    </div>
                    <div className={`p-2 rounded-lg border font-semibold ${
                      ['technical', 'cultural', 'offer', 'hired'].includes(app.stage)
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-navy-950 border-navy-800 text-slate-500'
                    }`}>
                      Technical
                    </div>
                    <div className={`p-2 rounded-lg border font-semibold ${
                      ['cultural', 'offer', 'hired'].includes(app.stage)
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-navy-950 border-navy-800 text-slate-500'
                    }`}>
                      Leadership
                    </div>
                    <div className={`p-2 rounded-lg border font-semibold ${
                      ['offer', 'hired'].includes(app.stage)
                        ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange'
                        : 'bg-navy-950 border-navy-800 text-slate-500'
                    }`}>
                      Final Offer
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
};
