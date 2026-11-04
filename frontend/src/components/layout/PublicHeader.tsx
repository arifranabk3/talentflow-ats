'use client';

import React from 'react';
import { Link, useLocation } from '@/utils/navigation';
import { 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X,
  ShieldCheck,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#0A1424]/90 backdrop-blur-md border-b border-[#14284B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F97316] to-[#FB923C] flex items-center justify-center text-white shadow-glow-orange group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                TALENTFLOW
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30">
                  ATS
                </span>
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium tracking-wide">Enterprise Candidate Pipeline</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/#features" 
              className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors"
            >
              Platform
            </Link>
            <Link 
              to="/browse-jobs" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/browse-jobs' ? 'text-[#F97316] font-semibold' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Explore Careers
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/pricing' ? 'text-[#F97316] font-semibold' : 'text-[#94A3B8] hover:text-white'
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
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#14284B] border border-[#233757] text-white hover:border-[#F97316] transition-all"
              >
                <img src={user?.avatar} alt={user?.name} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs font-semibold">{user?.name?.split(' ')[0]}'s Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold shadow-soft-md shadow-[#F97316]/20 transition-all hover:shadow-glow-orange flex items-center gap-2"
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
              className="p-2 text-[#94A3B8] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A1424] border-b border-[#14284B] px-4 pt-3 pb-6 space-y-4">
          <Link
            to="/browse-jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#94A3B8] hover:text-white py-2"
          >
            Explore Careers
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#94A3B8] hover:text-white py-2"
          >
            Enterprise Pricing
          </Link>
          <div className="pt-4 border-t border-[#14284B] flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#14284B] rounded-xl"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#F97316] rounded-xl"
            >
              Request Free Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

