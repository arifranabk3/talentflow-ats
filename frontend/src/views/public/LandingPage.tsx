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
  Building2 
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { MOCK_JOBS } from '@/data/mockData';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBF9] text-slate-900 flex flex-col font-sans">
      <PublicHeader />

      {/* Hero Section — Distinct Executive Recruitment Identity */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-slate-200 bg-gradient-to-b from-[#F2F6F4] via-[#FAFBF9] to-[#FAFBF9]">
        {/* Soft Ambient Mesh Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-teal-200 text-xs font-semibold text-teal-800 shadow-soft-sm">
            <span className="flex h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Next-Gen Candidate Intelligence & Pipeline Orchestration</span>
          </div>

          <div className="max-w-4xl space-y-5">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-slate-900 font-display">
              The modern ATS built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700">
                high-velocity talent teams
              </span>{' '}
              and executive hiring.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Consolidate candidate discovery, visual Kanban pipelines, team evaluation scorecards, and calendar scheduling into one high-performance corporate command center.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              to="/recruiter/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-soft-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Recruiter Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/browse-jobs"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm shadow-soft-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Browse Open Positions</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-display">64%</p>
              <p className="text-xs text-slate-600 mt-1 font-medium">Faster Time-to-Offer</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-display">4.9 / 5.0</p>
              <p className="text-xs text-slate-600 mt-1 font-medium">Candidate Experience Score</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-display">12,000+</p>
              <p className="text-xs text-slate-600 mt-1 font-medium">Screenings Automated</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-display">100%</p>
              <p className="text-xs text-slate-600 mt-1 font-medium">SOC2 & GDPR Compliant</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Active Requisitions</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured High-Impact Roles</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Join leading engineering and design organizations hiring through TALENTFLOW.</p>
          </div>
          <Link
            to="/browse-jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>View All Requisitions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_JOBS.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm hover:shadow-soft-md hover:border-teal-500 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-100">
                    {job.department}
                  </span>
                  <span className="text-xs font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                    {job.salaryRange}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">{job.location} • {job.type}</span>
                <Link
                  to={`/jobs/${job.id}`}
                  className="px-4 py-1.5 rounded-lg bg-teal-700 text-white font-semibold text-xs hover:bg-teal-800 transition-colors shadow-soft-sm"
                >
                  View Role
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section id="features" className="py-20 bg-slate-50/80 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Platform Architecture</span>
            <h2 className="text-3xl font-bold text-slate-900">Engineered for Modern Talent Teams</h2>
            <p className="text-xs sm:text-sm text-slate-600">Eliminate resume clutter and spreadsheet bottlenecks with purpose-built corporate ATS workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-soft-sm space-y-4 hover:border-teal-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Interactive Kanban Pipelines</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag-and-drop candidates across custom hiring stages. Trigger automated notification emails and interview requests upon stage transition.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-soft-sm space-y-4 hover:border-teal-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Match & Parsing Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deep semantic matching aligns candidate experience and technical skills directly with requisition criteria with zero biased filtering.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-soft-sm space-y-4 hover:border-teal-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Velocity & Funnel Telemetry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Granular funnel analytics calculate stage drop-offs, recruiter response velocity, and cost-per-hire benchmarking across departments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-teal-700 shadow-soft-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Ready to scale hiring?</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display">Experience the TALENTFLOW advantage today.</h2>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Join thousands of hiring managers accelerating high-growth team building with zero operational friction.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              to="/auth/register"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-soft-md transition-all text-center"
            >
              Start Free 14-Day Trial
            </Link>
            <Link
              to="/recruiter/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-950/70 hover:bg-teal-950 text-white font-semibold text-sm border border-teal-600 transition-all text-center"
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
