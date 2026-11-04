'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_INTERVIEWS } from '@/data/mockData';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const RecruiterInterviewsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('Today');

  const interviews = MOCK_INTERVIEWS.filter((i) => {
    if (filterType === 'all') return true;
    return i.type.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <DashboardShell role="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar Coordination
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interview Schedule
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live calendar sync, video panel rooms, and evaluation scorecards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20 transition-all">
              <Plus className="w-4 h-4" />
              Schedule Panel
            </button>
          </div>
        </div>

        {/* Date Selector Banner */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-navy-950 border border-navy-800 rounded-lg p-1 text-sm">
              <button className="p-1.5 hover:text-white text-slate-400 rounded hover:bg-navy-800">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 font-semibold text-white">November 2026 • Week 45</span>
              <button className="p-1.5 hover:text-white text-slate-400 rounded hover:bg-navy-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden sm:flex gap-1 bg-navy-950 p-1 rounded-lg border border-navy-800 text-xs">
              <button className="px-3 py-1 rounded bg-brand-orange text-white font-medium">Day</button>
              <button className="px-3 py-1 rounded text-slate-400 hover:text-white">Week</button>
              <button className="px-3 py-1 rounded text-slate-400 hover:text-white">Month</button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-navy-950 border border-navy-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-orange"
            >
              <option value="all">All Formats</option>
              <option value="video">Google Meet / Video</option>
              <option value="technical">Technical Pairing</option>
              <option value="panel">Hiring Manager Panel</option>
            </select>
          </div>
        </div>

        {/* Interview List / Timeline View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Scheduled Interviews ({interviews.length})
            </h2>

            {interviews.map((item) => (
              <div
                key={item.id}
                className="bg-navy-900 border border-navy-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {item.scheduledTime}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{item.candidateName}</h3>
                    <p className="text-xs text-slate-400">Target Role: <strong className="text-slate-300">{item.jobTitle}</strong></p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Interviewer: <span className="text-slate-200">{item.interviewer}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-navy-800">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Confirmed
                  </span>

                  {item.meetingLink && (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-semibold text-white transition-colors border border-navy-700"
                    >
                      <Video className="w-3.5 h-3.5 text-brand-orange" />
                      Launch Call
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Schedule Panel Sidebar */}
          <div className="space-y-4">
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
              <h3 className="font-bold text-white text-base mb-3">Interview Rooms</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Google Meet Room A</p>
                    <p className="text-slate-400">Connected to Recruiter Calendar</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Zoom Enterprise ATS</p>
                    <p className="text-slate-400">Meeting ID: 849-204-118</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-orange/10 to-navy-900 border border-brand-orange/20 rounded-2xl p-5">
              <h4 className="font-bold text-white text-sm mb-1">Standardized Rubrics</h4>
              <p className="text-xs text-slate-300 mb-3">
                Ensure interviewers submit candidate scorecards within 2 hours of panel completion.
              </p>
              <button className="text-xs font-semibold text-brand-orange hover:text-white transition-colors">
                View Evaluation Rubrics →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

