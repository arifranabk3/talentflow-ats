'use client';

import React, { useState } from 'react';
import { useNavigate } from '@/utils/navigation';
import { Briefcase, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

export const RecruiterCreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Core Infrastructure');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [type, setType] = useState('Full-time');
  const [salaryRange, setSalaryRange] = useState('$190,000 - $240,000');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/recruiter/jobs');
    }, 1200);
  };

  return (
    <DashboardShell
      title="Create New Requisition"
      subtitle="Publish a new job specification to syndication networks and candidate portal."
      role="recruiter"
    >
      <div className="max-w-3xl bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-soft-sm space-y-6">
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-[#0F172A]">Requisition Published Successfully</h2>
            <p className="text-xs text-[#64748B]">Redirecting to company job directory...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                  Requisition Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff Distributed Systems Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316] font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="Core Infrastructure">Core Infrastructure</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Web Applications">Web Applications</option>
                    <option value="Applied AI Labs">Applied AI Labs</option>
                    <option value="Platform Security">Platform Security</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Employment Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Location / Office
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="San Francisco, CA (Hybrid)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Target Compensation Range
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="$190,000 - $240,000"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                  Role Description & Scope
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline the core technical challenges, impact milestones, and team charter..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => navigate('/recruiter/jobs')}
                className="px-5 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-soft-sm transition-all"
              >
                Publish Opening
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
};

