'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { jobsApi, JobDto, getErrorMessage } from '@/services/api';
import { useParams, Link, useNavigate } from '@/utils/navigation';
import {
  FileText,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Send,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Building
} from 'lucide-react';

export const CandidateApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('Standard_Profile_Resume.pdf');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadJob() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await jobsApi.getById(id);
        if (res.success && res.data) {
          setJob(res.data);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await jobsApi.apply(id, {
        coverLetter: coverLetter.trim() || undefined,
      });
      if (res.success) {
        setSubmitted(true);
        setTimeout(() => {
          navigate('/candidate/applications');
        }, 1800);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const companyName = job && typeof job.companyId === 'object' ? job.companyId.name : 'TalentFlow Partner';

  return (
    <DashboardShell role="candidate">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/candidate/jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to job directory
        </Link>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && job && (
          <>
            {/* Application Header Card */}
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Official Application Submission
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {job.title}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {companyName}
                </span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span className="uppercase text-brand-orange font-bold text-[11px]">{job.employmentType}</span>
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Application Submitted Successfully!</h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your credentials have been securely registered in the recruiter pipeline. Redirecting to your active applications board...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-6">
                {/* Resume selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Active Resume on File</label>
                  <div className="flex items-center justify-between p-4 bg-navy-950 border border-navy-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-brand-orange/10 text-brand-orange">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{resumeName}</div>
                        <div className="text-[11px] text-slate-400">PDF • Verified Candidate Profile Attachment</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Attached
                    </span>
                  </div>
                </div>

                {/* Cover letter */}
                <div>
                  <label htmlFor="coverLetter" className="block text-xs font-bold text-slate-300 mb-2">
                    Cover Letter & Relevant Notes (Optional)
                  </label>
                  <textarea
                    id="coverLetter"
                    rows={5}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe why you are excited about this role and how your skills align with the requirements..."
                    className="w-full bg-navy-950 border border-navy-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Protected by TalentFlow Tenant Security & Compound Unique Verification</span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
};
