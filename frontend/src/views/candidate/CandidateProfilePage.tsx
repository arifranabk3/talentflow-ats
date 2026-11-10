'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { candidatesApi, CandidateProfileDto, getErrorMessage } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  MapPin,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Briefcase
} from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [skillsString, setSkillsString] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        const res = await candidatesApi.getMyProfile();
        if (res.success && res.data) {
          const p = res.data;
          setHeadline(p.headline || '');
          setSummary(p.summary || '');
          setLocation(p.location || '');
          setPhone(p.phone || '');
          setSkillsString(p.skills?.join(', ') || '');
          setPortfolioUrl(p.portfolioUrl || '');
          setLinkedinUrl(p.linkedinUrl || '');
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const skillsArray = skillsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await candidatesApi.updateMyProfile({
        headline,
        summary,
        location,
        phone,
        skills: skillsArray,
        portfolioUrl: portfolioUrl || '',
        linkedinUrl: linkedinUrl || '',
      });

      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell role="candidate">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            Profile & Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Candidate Profile & Career Summary
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Keep your credentials updated for verified recruiter discovery across authorized company pipelines.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
          </div>
        )}

        {/* Success Alert */}
        {saved && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Profile credentials successfully saved to TalentFlow backend!</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-4 pb-5 border-b border-navy-800">
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-lg">
                  {user?.name ? user.name[0].toUpperCase() : 'C'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{user?.name || 'Candidate User'}</h2>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="headline" className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Headline</label>
                  <input
                    id="headline"
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Staff Frontend Architect"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA (Remote)"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="summary" className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Bio & Experience Summary</label>
                <textarea
                  id="summary"
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize your engineering expertise, notable achievements, and career focus..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div>
                <label htmlFor="skillsString" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Core Skills & Technologies (Comma-separated)
                </label>
                <input
                  id="skillsString"
                  type="text"
                  value={skillsString}
                  onChange={(e) => setSkillsString(e.target.value)}
                  placeholder="React, Next.js, TypeScript, Node.js, MongoDB, Docker"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="portfolioUrl" className="block text-xs font-semibold text-slate-300 mb-1.5">Portfolio or GitHub URL</label>
                  <input
                    id="portfolioUrl"
                    type="text"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label htmlFor="linkedinUrl" className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn Profile URL</label>
                  <input
                    id="linkedinUrl"
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
};
