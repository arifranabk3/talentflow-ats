'use client';

import React, { useState } from 'react';
import { useParams, useNavigate } from '@/utils/navigation';
import { CheckCircle2 } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_JOBS } from '@/data/mockData';

export const RecruiterEditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const job = MOCK_JOBS.find((j) => j.id === id) || MOCK_JOBS[0];

  const [title, setTitle] = useState(job.title);
  const [salaryRange, setSalaryRange] = useState(job.salaryRange);
  const [description, setDescription] = useState(job.description);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      navigate(`/recruiter/jobs/${job.id}`);
    }, 1000);
  };

  return (
    <DashboardShell
      title={`Edit ${job.title}`}
      subtitle="Modify job requirements, compensation, and team allocation parameters."
      role="recruiter"
    >
      <div className="max-w-3xl bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-soft-sm space-y-6">
        {saved ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-[#0F172A]">Requisition Updated</h2>
            <p className="text-xs text-[#64748B]">Saved to enterprise catalog...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
};

