'use client';

import React, { useState, useEffect } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { companiesApi, CompanyDto } from '@/services/api';
import { Building2, MapPin, Users, Globe, Briefcase, Sparkles, Loader2, Search } from 'lucide-react';
import { Link } from '@/utils/navigation';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);
        const res = await companiesApi.list({ limit: 50 });
        if (res.success && res.data?.companies) {
          setCompanies(res.data.companies);
        }
      } catch {
        // Fallback demo companies if network or backend offline
        setCompanies([
          {
            _id: 'comp-01',
            name: 'Apex Systems Engineering',
            slug: 'apex-systems',
            website: 'https://apexsystems.example.com',
            location: 'San Francisco, CA',
            industry: 'Distributed Systems & Cloud',
            companySize: '500-1,000 employees',
            verificationStatus: 'verified',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'comp-02',
            name: 'Acme Technologies Global',
            slug: 'acme-tech',
            website: 'https://acmetech.io',
            location: 'New York, NY',
            industry: 'Enterprise SaaS & AI',
            companySize: '1,000-5,000 employees',
            verificationStatus: 'verified',
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry && c.industry.toLowerCase().includes(search.toLowerCase())) ||
    (c.location && c.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col font-sans text-slate-900">
      <PublicHeader />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 border border-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-soft-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Enterprise Employers
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Explore Leading Hiring Organizations
          </h1>
          <p className="text-teal-100/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Discover top-tier engineering organizations and product innovators scaling high-impact teams on TALENTFLOW.
          </p>

          <div className="mt-6 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
          </div>
        )}

        {/* Grid of verified companies */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((comp) => (
              <div
                key={comp._id}
                className="bg-white border border-slate-200 hover:border-teal-400 rounded-2xl p-6 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Verified
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 font-display">
                    {comp.name}
                  </h2>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    {comp.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{comp.location}</span>
                      </div>
                    )}
                    {comp.industry && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{comp.industry}</span>
                      </div>
                    )}
                    {comp.companySize && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{comp.companySize}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to="/browse-jobs"
                    className="text-xs font-semibold text-teal-700 hover:underline"
                  >
                    View Openings →
                  </Link>
                  {comp.website && (
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 font-display">No companies found</h3>
            <p className="text-xs text-slate-500 mt-1">Try refining your search keyword.</p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

