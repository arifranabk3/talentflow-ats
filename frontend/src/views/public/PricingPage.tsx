'use client';

import React, { useState } from 'react';
import { Link } from '@/utils/navigation';
import { Check, ShieldCheck, Zap, Building2, HelpCircle } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export const PricingPage: React.FC = () => {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: 'Startup Velocity',
      price: annual ? '$149' : '$189',
      period: 'per month, billed annually',
      desc: 'Ideal for early-stage teams making up to 15 strategic hires per year.',
      popular: false,
      features: [
        'Up to 5 Active Requisitions',
        'Visual Drag & Drop Pipeline',
        'Standard Email Integration',
        'Custom Application Forms',
        'Basic Stage Telemetry',
        'Single Team Workspace',
      ],
      cta: 'Start 14-Day Free Trial',
      href: '/register',
    },
    {
      name: 'Growth Scale',
      price: annual ? '$399' : '$489',
      period: 'per month, billed annually',
      desc: 'Designed for scaling engineering and product teams hiring continuously.',
      popular: true,
      features: [
        'Unlimited Active Requisitions',
        'AI Resume Parsing & Match Scoring',
        'Multi-Calendar Orchestration (Google/Outlook)',
        'Custom Scorecards & Evaluation Rubrics',
        'Advanced Funnel Analytics & Exports',
        'Unlimited Hiring Managers & Reviewers',
        'Custom Candidate Portal Domain',
      ],
      cta: 'Get Started with Growth',
      href: '/register',
    },
    {
      name: 'Enterprise Command',
      price: 'Custom',
      period: 'annual enterprise agreement',
      desc: 'Dedicated enterprise infrastructure with bespoke compliance and security.',
      popular: false,
      features: [
        'Everything in Growth Scale',
        'Dedicated Enterprise Success Manager',
        'Custom HRIS & Payroll Integrations (Workday, BambooHR)',
        'SAML 2.0 / Okta SSO & SCIM Directory Sync',
        'Role-Based Granular Permissions & Audit Logs',
        'Custom SLA & 24/7 Priority Support',
        'Data Residency (US, EU, APAC)',
      ],
      cta: 'Contact Enterprise Sales',
      href: '/register',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Transparent Pricing</span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] font-display">
            Predictable plans for high-growth hiring teams.
          </h1>
          <p className="text-sm sm:text-base text-[#64748B]">
            No surprise per-seat fees for interviewers or hiring managers. Scale your candidate volume with complete operational clarity.
          </p>

          {/* Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!annual ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-12 h-6 rounded-full bg-[#0A1424] p-1 flex items-center transition-colors relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#F97316] transition-transform ${
                  annual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${annual ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#ECFDF5] text-[#059669]">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-3xl p-8 flex flex-col justify-between border transition-all ${
                t.popular 
                  ? 'bg-[#0A1424] text-white border-[#F97316] shadow-soft-xl relative scale-105 z-10' 
                  : 'bg-white text-[#0F172A] border-[#E2E8F0] shadow-soft-sm'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#F97316] text-white text-[11px] font-bold uppercase tracking-widest shadow-md">
                  Most Popular for Scaling Teams
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-display">{t.name}</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${t.popular ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    {t.desc}
                  </p>
                </div>

                <div className="pb-6 border-b border-current/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black font-display">{t.price}</span>
                    {t.price !== 'Custom' && <span className="text-xs font-semibold opacity-70">/ month</span>}
                  </div>
                  <p className="text-[11px] opacity-70 mt-1">{t.period}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316] block">
                    What's included:
                  </span>
                  <ul className="space-y-2.5 text-xs">
                    {t.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" />
                        <span className={t.popular ? 'text-[#CBD5E1]' : 'text-[#475569]'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  to={t.href}
                  className={`block w-full py-3.5 text-center rounded-xl font-bold text-xs transition-all ${
                    t.popular
                      ? 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-soft-md shadow-[#F97316]/30'
                      : 'bg-[#0F172A] hover:bg-[#1E293B] text-white'
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>

      <PublicFooter />
    </div>
  );
};

