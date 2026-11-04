'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_APPLICATIONS, MOCK_JOBS, MOCK_CANDIDATES } from '@/data/mockData';
import { Application, PipelineStage } from '@/types';
import {
  Kanban,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Calendar,
  Star,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Building,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from '@/utils/navigation';

const PIPELINE_COLUMNS: { stage: PipelineStage; label: string; color: string; badgeBg: string }[] = [
  { stage: 'sourced', label: 'Sourced', color: 'border-blue-500/40', badgeBg: 'bg-blue-500/10 text-blue-400' },
  { stage: 'screening', label: 'Screening', color: 'border-amber-500/40', badgeBg: 'bg-amber-500/10 text-amber-400' },
  { stage: 'technical', label: 'Technical Assessment', color: 'border-purple-500/40', badgeBg: 'bg-purple-500/10 text-purple-400' },
  { stage: 'cultural', label: 'Leadership / Culture', color: 'border-cyan-500/40', badgeBg: 'bg-cyan-500/10 text-cyan-400' },
  { stage: 'offer', label: 'Offer Extended', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500/10 text-emerald-400' },
  { stage: 'hired', label: 'Hired & Closed', color: 'border-brand-orange/40', badgeBg: 'bg-brand-orange/10 text-brand-orange' },
];

export const RecruiterPipelinePage: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);

  const filteredApps = applications.filter((app) => {
    const matchesJob = selectedJobId === 'all' || app.jobId === selectedJobId;
    const matchesSearch =
      (app.candidateName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesSearch;
  });

  const moveStage = (appId: string, direction: 'next' | 'prev') => {
    const order: PipelineStage[] = ['sourced', 'screening', 'technical', 'cultural', 'offer', 'hired'];
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const currentIndex = order.indexOf(app.stage);
        const nextIndex = direction === 'next' ? Math.min(order.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
        return { ...app, stage: order[nextIndex] };
      })
    );
  };

  return (
    <DashboardShell role="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <Kanban className="w-3.5 h-3.5" />
              Live Hiring Board
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recruitment Pipeline
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Kanban-driven candidate journey tracking with automated stage transitions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-navy-800 border border-navy-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
            >
              <option value="all">All Active Openings ({MOCK_JOBS.length})</option>
              {MOCK_JOBS.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
            <Link
              to="/recruiter/candidates"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-navy-800 border border-navy-700 text-slate-200 text-sm font-medium hover:border-slate-500 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-brand-orange" />
              View Candidate List
            </Link>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-navy-900 border border-navy-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name or role in pipeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-950 border border-navy-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Avg Pipeline Velocity: <strong className="text-emerald-400">18.4 days</strong></span>
          </div>
        </div>

        {/* Kanban Horizontal Scroll Area */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1400px]">
            {PIPELINE_COLUMNS.map((col) => {
              const columnApps = filteredApps.filter((a) => a.stage === col.stage);
              return (
                <div
                  key={col.stage}
                  className="w-80 flex-shrink-0 bg-navy-900/70 border border-navy-800 rounded-2xl flex flex-col max-h-[calc(100vh-280px)]"
                >
                  {/* Column Header */}
                  <div className={`p-3.5 border-b border-navy-800 border-t-2 ${col.color} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm tracking-wide">
                        {col.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                        {columnApps.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards container */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    {columnApps.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-navy-800 rounded-xl text-slate-500 text-xs">
                        No candidates in this stage
                      </div>
                    ) : (
                      columnApps.map((app) => (
                        <div
                          key={app.id}
                          className="bg-navy-950/90 border border-navy-800 hover:border-slate-700 rounded-xl p-3.5 transition-all shadow-sm group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                to={`/recruiter/candidates/${app.candidateId}`}
                                className="font-semibold text-white hover:text-brand-orange text-sm transition-colors"
                              >
                                {app.candidateName}
                              </Link>
                              <p className="text-xs text-slate-400 mt-0.5">{app.jobTitle}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold text-white">{app.score}%</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-navy-900">
                            <span className="text-[11px] text-slate-500">
                              Applied {new Date(app.appliedDate || app.appliedAt || Date.now()).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                              <button
                                onClick={() => moveStage(app.id, 'prev')}
                                title="Move back"
                                className="p-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-300 text-[10px]"
                              >
                                ←
                              </button>
                              <button
                                onClick={() => moveStage(app.id, 'next')}
                                title="Advance candidate"
                                className="p-1 rounded bg-brand-orange/20 hover:bg-brand-orange text-brand-orange hover:text-white transition-colors text-[10px]"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};
