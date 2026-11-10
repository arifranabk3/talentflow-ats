'use client';

import React from 'react';
import { Link, useLocation } from '@/utils/navigation';
import { 
  Briefcase, 
  ArrowRight, 
  Menu, 
  X,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#FAFBF9]/90 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Distinct Enterprise Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-soft-sm group-hover:bg-teal-800 transition-colors">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
                TALENTFLOW
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ATS
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">Enterprise Talent Acquisition</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/#features" 
              className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors"
            >
              Platform
            </Link>
            <Link 
              to="/browse-jobs" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/browse-jobs' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              Explore Careers
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/pricing' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              Enterprise Pricing
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard'}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 transition-all text-xs font-semibold"
              >
                <img src={user?.avatar} alt={user?.name} className="w-6 h-6 rounded-full object-cover border border-teal-300" />
                <span>{user?.name?.split(' ')[0]}'s Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-700" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-soft-sm transition-all flex items-center gap-2"
                >
                  <span>Request Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-soft-md">
          <Link
            to="/browse-jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-teal-700 py-2"
          >
            Explore Careers
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-teal-700 py-2"
          >
            Enterprise Pricing
          </Link>
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-teal-700 rounded-xl hover:bg-teal-800 transition-colors shadow-soft-sm"
            >
              Request Free Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
