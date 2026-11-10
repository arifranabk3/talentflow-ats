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
          to="/browse-jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to job directory
        </Link>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && job && (
          <>
            {/* Application Header Card */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 border border-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Official Application Submission
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                {job.title}
              </h1>
              <p className="text-teal-100/90 text-xs sm:text-sm mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1 font-medium text-white">
                  <Building className="w-3.5 h-3.5 text-teal-300" />
                  {companyName}
                </span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span className="uppercase text-emerald-300 font-bold text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                  {job.employmentType}
                </span>
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3 shadow-soft-sm">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Application Submitted Successfully!</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your credentials have been securely registered in the recruiter pipeline. Redirecting to your active applications board...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-sm">
                {/* Resume selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Active Resume on File</label>
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{resumeName}</div>
                        <div className="text-[11px] text-slate-500">PDF • Verified Candidate Profile Attachment</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Attached
                    </span>
                  </div>
                </div>

                {/* Cover letter */}
                <div>
                  <label htmlFor="coverLetter" className="block text-xs font-bold text-slate-700 mb-2">
                    Cover Letter & Relevant Notes (Optional)
                  </label>
                  <textarea
                    id="coverLetter"
                    rows={5}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe why you are excited about this role and how your skills align with the requirements..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected by TalentFlow Tenant Security & Compound Unique Verification</span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-soft-sm transition-all disabled:opacity-50"
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
