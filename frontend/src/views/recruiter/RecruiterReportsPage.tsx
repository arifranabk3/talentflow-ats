'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Award,
  DollarSign,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const RecruiterReportsPage: React.FC = () => {
  return (
    <DashboardShell role="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Talent Analytics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recruitment Performance & Analytics
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Funnel conversion rates, velocity metrics, source efficiency and cost-per-hire.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 border border-navy-700 text-white text-xs font-semibold hover:border-slate-500 transition-colors">
            <Download className="w-4 h-4 text-brand-orange" />
            Export Executive PDF
          </button>
        </div>

        {/* High-level KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Avg. Time to Hire</span>
              <Clock className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-2xl font-black text-white">18.4 Days</div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>4.2 days faster than Q3</span>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Offer Acceptance Rate</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">88.5%</div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+6.1% QoQ growth</span>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Total Sourced / Inbound</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">1,428</div>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
              <span>Across 18 active postings</span>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Est. Cost Per Hire</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">$2,140</div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-18% vs agency benchmarks</span>
            </div>
          </div>
        </div>

        {/* Funnel Velocity Chart (Simulated High-Fidelity SVG Bar Chart) */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Hiring Funnel Stage Conversion</h2>
              <p className="text-xs text-slate-400">Total pass-through rates from initial impression to closed hire</p>
            </div>
            <span className="text-xs text-slate-400">Past 90 Days</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">1. Applications Submitted</span>
                <span className="text-white font-bold">1,428 candidates (100%)</span>
              </div>
              <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">2. Recruiter Screening</span>
                <span className="text-white font-bold">540 passed (37.8%)</span>
              </div>
              <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">3. Technical Assessment</span>
                <span className="text-white font-bold">162 passed (11.3%)</span>
              </div>
              <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">4. Leadership & Culture Panel</span>
                <span className="text-white font-bold">48 interviewed (3.3%)</span>
              </div>
              <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '6%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">5. Offers Extended & Accepted</span>
                <span className="text-brand-orange font-bold">24 Hires (1.7% overall conversion)</span>
              </div>
              <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden">
                <div className="bg-brand-orange h-full rounded-full" style={{ width: '3.5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Source Attribution Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <h3 className="font-bold text-white text-sm mb-4">Sourcing Channel ROI</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                  <div>
                    <p className="text-xs font-semibold text-white">Direct Career Page</p>
                    <p className="text-[11px] text-slate-400">45% of hired candidates</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400">Highest Quality</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-xs font-semibold text-white">LinkedIn Talent Hub</p>
                    <p className="text-[11px] text-slate-400">32% of applications</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-300">High Volume</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <div>
                    <p className="text-xs font-semibold text-white">Employee Referrals</p>
                    <p className="text-[11px] text-slate-400">18% of hires</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400">Fastest to Close</span>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
            <h3 className="font-bold text-white text-sm mb-4">Diversity & Inclusion Metrics</h3>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Gender Representation in Final Interview</span>
                  <span className="font-bold text-white">46% Diverse</span>
                </div>
                <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full" style={{ width: '46%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Global Remote Distribution</span>
                  <span className="font-bold text-white">62% Distributed</span>
                </div>
                <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full" style={{ width: '62%' }} />
                </div>
              </div>

              <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 text-[11px] text-slate-400">
                Complies with Equal Employment Opportunity (EEO-1) standard automated reporting metrics.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

