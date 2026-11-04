'use client';

import React from 'react';
import { Link } from '@/utils/navigation';
import { 
  Users, 
  Briefcase, 
  Kanban, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { MOCK_JOBS } from '@/data/mockData';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0A1424] text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#14284B_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F97316]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1D3B6C]/40 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14284B] border border-[#233757] text-xs font-semibold text-[#CBD5E1]">
            <span className="flex h-2 w-2 rounded-full bg-[#F97316] animate-pulse" />
            <span>Next-Gen Candidate Intelligence & Pipeline Orchestration</span>
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white font-display">
              The modern ATS built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#FB923C]">
                high-velocity engineering
              </span>{' '}
              and product hiring.
            </h1>
            <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
              Consolidate candidate discovery, visual Kanban pipelines, team evaluation scorecards, and calendar scheduling into one high-performance command center.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              to="/recruiter/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-soft-lg shadow-[#F97316]/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Recruiter Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/browse-jobs"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#14284B] hover:bg-[#1D3B6C] border border-[#233757] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Browse Open Positions</span>
              <ArrowUpRight className="w-4 h-4 text-[#94A3B8]" />
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-[#14284B]">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-display">64%</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Faster Time-to-Offer</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-display">4.9 / 5.0</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Candidate Experience Score</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-display">12,000+</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Screenings Automated</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-display">100%</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">SOC2 & GDPR Compliant</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Active Requisitions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">Featured High-Impact Roles</h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">Join leading engineering and design organizations hiring through TALENTFLOW.</p>
          </div>
          <Link
            to="/browse-jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] hover:text-[#EA580C]"
          >
            <span>View All Requisitions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_JOBS.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-soft-sm hover:shadow-soft-md hover:border-[#F97316]/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#F1F5F9] text-[#475569]">
                    {job.department}
                  </span>
                  <span className="text-xs font-bold text-[#0F172A]">{job.salaryRange}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">{job.title}</h3>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{job.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-xs">
                <span className="text-[#64748B] font-medium">{job.location} • {job.type}</span>
                <Link
                  to={`/jobs/${job.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0F172A] text-white font-semibold text-xs hover:bg-[#1E293B] transition-colors"
                >
                  View Role
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section id="features" className="py-20 bg-[#F1F5F9] border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Pillars of Excellence</span>
            <h2 className="text-3xl font-black text-[#0F172A]">Engineered for Modern Talent Teams</h2>
            <p className="text-xs sm:text-sm text-[#64748B]">Eliminate resume clutter and spreadsheet bottlenecks with purpose-built tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center font-bold">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Interactive Kanban Pipelines</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Drag-and-drop candidates across custom hiring stages. Trigger automated notification emails and interview requests upon stage transition.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#0284C7] flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">AI Match & Parsing Engine</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Deep semantic matching aligns candidate experience and technical skills directly with requisition criteria with zero biased filtering.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-soft-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Velocity & Funnel Telemetry</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Granular funnel analytics calculate stage drop-offs, recruiter response velocity, and cost-per-hire benchmarking across departments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1424] rounded-3xl p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-[#14284B] shadow-soft-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Ready to scale hiring?</span>
            <h2 className="text-2xl sm:text-4xl font-black font-display">Experience the TALENTFLOW advantage today.</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Join thousands of hiring managers accelerating high-growth team building with zero operational friction.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-md transition-all text-center"
            >
              Start Free 14-Day Trial
            </Link>
            <Link
              to="/recruiter/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#14284B] hover:bg-[#1D3B6C] text-white font-bold text-sm border border-[#233757] transition-all text-center"
            >
              Live Recruiter Preview
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

