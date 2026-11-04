'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Building,
  Users,
  Shield,
  Bell,
  Sliders,
  Globe,
  Upload,
  Save,
  CheckCircle2,
  Mail,
  Key
} from 'lucide-react';

export const RecruiterSettingsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('TalentFlow Technologies Inc.');
  const [domain, setDomain] = useState('talentflow.io');
  const [portalTheme, setPortalTheme] = useState('navy');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardShell role="recruiter">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
            <Building className="w-3.5 h-3.5" />
            Workspace Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Company & Career Portal Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure employer branding, interview team permissions, and automated email templates.
          </p>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Company configuration updated successfully across all published job boards.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation Sub-Tabs */}
          <div className="space-y-2">
            <button className="w-full text-left p-3 rounded-xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Employer Profile & Branding
              </span>
            </button>
            <button className="w-full text-left p-3 rounded-xl bg-navy-900 border border-navy-800 hover:border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Hiring Team & Roles
              </span>
            </button>
            <button className="w-full text-left p-3 rounded-xl bg-navy-900 border border-navy-800 hover:border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email & Outreach Templates
              </span>
            </button>
            <button className="w-full text-left p-3 rounded-xl bg-navy-900 border border-navy-800 hover:border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                API & Webhooks
              </span>
            </button>
          </div>

          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Company Profile</h2>
                <p className="text-xs text-slate-400">Displayed on your public career portal and candidate invitation emails.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Public Career Page URL</label>
                  <div className="flex items-center">
                    <span className="bg-navy-950 border border-r-0 border-navy-800 rounded-l-lg px-3 py-2 text-xs text-slate-500">
                      https://careers.talentflow.io/
                    </span>
                    <input
                      type="text"
                      defaultValue="talentflow-tech"
                      className="flex-1 bg-navy-950 border border-navy-800 rounded-r-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center text-brand-orange font-black text-lg">
                      TF
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs font-medium text-slate-200 hover:border-slate-500"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                      Upload High-Res PNG / SVG
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Automated Stage Notifications</label>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input type="checkbox" defaultChecked className="rounded bg-navy-950 border-navy-800 text-brand-orange focus:ring-0" />
                      Email candidate automatically upon application receipt
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input type="checkbox" defaultChecked className="rounded bg-navy-950 border-navy-800 text-brand-orange focus:ring-0" />
                      Send calendar invite link once interview is confirmed
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input type="checkbox" defaultChecked className="rounded bg-navy-950 border-navy-800 text-brand-orange focus:ring-0" />
                      Send courteous rejection notification with talent community opt-in
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-navy-800 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Organization Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

