'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_JOBS } from '@/data/mockData';
import { useParams, Link, useNavigate } from '@/utils/navigation';
import {
  FileText,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Send,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Linkedin,
  Github
} from 'lucide-react';

export const CandidateApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const job = MOCK_JOBS.find((j) => j.id === id) || MOCK_JOBS[0];

  const [fullName, setFullName] = useState('Elena Rostova');
  const [email, setEmail] = useState('elena.rostova@example.com');
  const [phone, setPhone] = useState('+1 (415) 890-2194');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/elena-rostova');
  const [github, setGithub] = useState('https://github.com/erostova');
  const [coverLetter, setCoverLetter] = useState(
    'I have 8+ years architecting enterprise React and Next.js platforms with strict accessibility and sub-second performance metrics.'
  );
  const [fileName, setFileName] = useState('Elena_Rostova_Staff_Architect_Resume.pdf');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/candidate/applications');
    }, 2000);
  };

  return (
    <DashboardShell role="candidate">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to={`/candidate/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to job description
        </Link>

        {/* Application Header Card */}
        <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Official Application Form
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Applying for: {job.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {job.department} • {job.location} • Compensation: {job.salary}
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Application Submitted Successfully!</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your profile and resume have been forwarded directly to the hiring committee. Redirecting to your active applications board...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Contact details */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-brand-orange" />
                1. Personal & Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-3 pt-4 border-t border-navy-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange" />
                2. Resume / Curriculum Vitae
              </h2>

              <div className="border-2 border-dashed border-navy-700 hover:border-brand-orange rounded-2xl p-6 text-center cursor-pointer transition-colors bg-navy-950/60">
                <Upload className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">Attached: {fileName}</p>
                <p className="text-[11px] text-slate-400 mt-1">PDF, DOCX up to 10MB</p>
              </div>
            </div>

            {/* Pitch Note */}
            <div className="space-y-3 pt-4 border-t border-navy-800">
              <h2 className="text-base font-bold text-white">3. Candidate Statement / Note to Team</h2>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                placeholder="Share why you are the ideal candidate for this specific role..."
              />
            </div>

            <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Data processed under GDPR & standard hiring security protocols
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-lg shadow-brand-orange/20 transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
};

