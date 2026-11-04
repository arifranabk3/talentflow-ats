'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Bell,
  CheckCircle2,
  Calendar,
  MessageSquare,
  FileCheck,
  Clock,
  Trash2,
  Filter
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'interview' | 'stage' | 'message';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const CandidateNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      type: 'interview',
      title: 'Interview Confirmed: System Architecture Panel',
      message: 'Your Google Meet video session has been scheduled for tomorrow at 2:00 PM EST.',
      time: '15 minutes ago',
      read: false
    },
    {
      id: 'n2',
      type: 'stage',
      title: 'Application Advanced to Technical Review',
      message: 'TalentFlow hiring committee reviewed your profile for Lead Frontend Architect and advanced your status.',
      time: '3 hours ago',
      read: false
    },
    {
      id: 'n3',
      type: 'message',
      title: 'New message from Marcus Vance (Head of Talent)',
      message: '"Hi Elena! Your profile and architecture portfolio are stellar. Looking forward to our panel."',
      time: 'Yesterday',
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DashboardShell role="candidate">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <Bell className="w-3.5 h-3.5" />
              Real-time Alerts
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Activity & Notifications
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Interview reminders, stage progressions, and messages from hiring teams.
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-brand-orange hover:underline self-start sm:self-auto"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                n.read
                  ? 'bg-navy-900/60 border-navy-800'
                  : 'bg-navy-900 border-navy-700 shadow-md ring-1 ring-brand-orange/20'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center flex-shrink-0">
                {n.type === 'interview' && <Calendar className="w-5 h-5 text-emerald-400" />}
                {n.type === 'stage' && <FileCheck className="w-5 h-5 text-brand-orange" />}
                {n.type === 'message' && <MessageSquare className="w-5 h-5 text-blue-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-xs sm:text-sm font-bold ${n.read ? 'text-slate-300' : 'text-white'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-brand-orange flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

