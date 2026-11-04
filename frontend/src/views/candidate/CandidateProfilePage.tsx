'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const [name, setName] = useState('Elena Rostova');
  const [headline, setHeadline] = useState('Senior Staff Frontend Architect & Design Systems Lead');
  const [email, setEmail] = useState('elena.rostova@example.com');
  const [location, setLocation] = useState('San Francisco, CA (Remote)');
  const [bio, setBio] = useState(
    'Specialized in architecting high-scale Next.js SaaS platforms, design tokens, micro-frontends, and accessible user interfaces.'
  );
  const [skills, setSkills] = useState('React, Next.js, TypeScript, Tailwind CSS, GraphQL, Vite, WCAG 2.2, Node.js');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardShell role="candidate">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            Profile & Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Candidate Profile & Resume
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Keep your profile current to unlock automated recruiter matches and instant 1-click applications.
          </p>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Profile and resume credentials updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Info */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-5 border-b border-navy-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                alt="Elena"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-orange"
              />
              <div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs font-medium text-slate-200 hover:border-slate-500"
                >
                  <Upload className="w-3.5 h-3.5 text-brand-orange" />
                  Change Headshot
                </button>
                <p className="text-[11px] text-slate-500 mt-1">Recommended: 400x400 JPG or PNG</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location Preference</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Core Competencies / Skills (Comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          {/* Stored Resume File Card */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-orange" />
              Primary Stored Resume
            </h2>

            <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs">Elena_Rostova_Staff_Architect_Resume.pdf</p>
                  <p className="text-[11px] text-slate-500">2.4 MB • Updated 3 days ago</p>
                </div>
              </div>

              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-medium text-slate-200 border border-navy-700"
              >
                Replace File
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-lg shadow-brand-orange/20 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Candidate Profile
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
};

