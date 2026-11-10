'use client';

import React from 'react';
import { Link } from '@/utils/navigation';
import { Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#F8FAFC] border-t border-slate-200 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold shadow-soft-sm">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">TALENTFLOW</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enterprise Applicant Tracking & AI-Assisted Candidate Pipeline Orchestration. Built for high-velocity engineering, product, and leadership talent acquisition.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SOC2 Type II & GDPR Compliant</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li><Link to="/#features" className="hover:text-teal-700 transition-colors">Visual Kanban Pipelines</Link></li>
              <li><Link to="/#analytics" className="hover:text-teal-700 transition-colors">Recruiting Analytics & Funnels</Link></li>
              <li><Link to="/#interviews" className="hover:text-teal-700 transition-colors">Calendar Orchestration</Link></li>
              <li><Link to="/pricing" className="hover:text-teal-700 transition-colors">Enterprise Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Candidate Hub</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li><Link to="/browse-jobs" className="hover:text-teal-700 transition-colors">Open Positions Directory</Link></li>
              <li><Link to="/login" className="hover:text-teal-700 transition-colors">Candidate Portal Login</Link></li>
              <li><Link to="/register" className="hover:text-teal-700 transition-colors">Join Talent Network</Link></li>
              <li><Link to="/candidate/applications" className="hover:text-teal-700 transition-colors">Track Application Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Demo Workspaces</h4>
            <div className="space-y-2 text-xs">
              <Link to="/recruiter/dashboard" className="block p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:shadow-soft-sm transition-all group">
                <span className="text-slate-900 font-semibold block group-hover:text-teal-700 transition-colors">Recruiter Console</span>
                <span className="text-[11px] text-slate-500">Pipeline, interviews, and candidate dossiers</span>
              </Link>
              <Link to="/admin/dashboard" className="block p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:shadow-soft-sm transition-all group">
                <span className="text-slate-900 font-semibold block group-hover:text-teal-700 transition-colors">Governance & Audit</span>
                <span className="text-[11px] text-slate-500">User access & company moderation</span>
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TALENTFLOW Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-800 cursor-pointer">Security Whitepaper</span>
            <span className="hover:text-slate-800 cursor-pointer">Privacy Framework</span>
            <span className="hover:text-slate-800 cursor-pointer">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
