'use client';

import React from 'react';
import { Link } from '@/utils/navigation';
import { Briefcase, Shield, Globe, Award, Sparkles } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#070D18] border-t border-[#14284B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white font-bold">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">TALENTFLOW</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Enterprise Applicant Tracking & AI-Assisted Candidate Intelligence System. Designed for high-velocity engineering, product, and leadership hiring teams.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#F97316]">
              <Shield className="w-3.5 h-3.5" />
              <span>SOC2 Type II & GDPR Compliant</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li><Link to="/#features" className="hover:text-white transition-colors">Visual Kanban Pipelines</Link></li>
              <li><Link to="/#analytics" className="hover:text-white transition-colors">Recruiting Analytics</Link></li>
              <li><Link to="/#interviews" className="hover:text-white transition-colors">Calendar Orchestration</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Enterprise Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-4">Candidate Hub</h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li><Link to="/browse-jobs" className="hover:text-white transition-colors">Open Positions Directory</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Candidate Portal Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Join Talent Network</Link></li>
              <li><Link to="/candidate/applications" className="hover:text-white transition-colors">Track Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-4">Demo Workspaces</h4>
            <div className="space-y-2 text-xs">
              <Link to="/recruiter/dashboard" className="block p-2.5 rounded-lg bg-[#0E1C33] border border-[#14284B] text-[#94A3B8] hover:text-white hover:border-[#F97316] transition-colors">
                <span className="text-white font-semibold block">Recruiter Console</span>
                Pipeline, interviews, and candidates
              </Link>
              <Link to="/admin/dashboard" className="block p-2.5 rounded-lg bg-[#0E1C33] border border-[#14284B] text-[#94A3B8] hover:text-white hover:border-[#F97316] transition-colors">
                <span className="text-white font-semibold block">Governance & Audit</span>
                User access & company moderation
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#14284B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© 2026 TALENTFLOW Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Security Whitepaper</span>
            <span className="hover:text-white cursor-pointer">Privacy Framework</span>
            <span className="hover:text-white cursor-pointer">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

