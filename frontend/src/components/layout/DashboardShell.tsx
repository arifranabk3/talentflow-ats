'use client';

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from '@/utils/navigation';
import { 
  Briefcase, 
  Users, 
  Kanban, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Building2, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight,
  Menu,
  X,
  FileText,
  UserCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  role: UserRole;
  actions?: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  title,
  subtitle,
  role,
  actions,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, switchRole, logout } = useAuth();

  // Navigation Items per Role
  const recruiterNav = [
    { label: 'Overview', href: '/recruiter/dashboard', icon: BarChart3 },
    { label: 'Job Openings', href: '/recruiter/jobs', icon: Briefcase },
    { label: 'Applications Pipeline', href: '/recruiter/pipeline', icon: Kanban },
    { label: 'Candidate Directory', href: '/recruiter/candidates', icon: Users },
    { label: 'Interview Calendar', href: '/recruiter/interviews', icon: Calendar },
    { label: 'Team Messages', href: '/recruiter/messages', icon: MessageSquare },
    { label: 'Reports & Funnels', href: '/recruiter/reports', icon: BarChart3 },
    { label: 'Company Settings', href: '/recruiter/settings', icon: Building2 },
  ];

  const candidateNav = [
    { label: 'Candidate Home', href: '/candidate/dashboard', icon: BarChart3 },
    { label: 'Browse Openings', href: '/browse-jobs', icon: Briefcase },
    { label: 'My Applications', href: '/candidate/applications', icon: FileText },
    { label: 'Profile & Resume', href: '/candidate/profile', icon: Users },
    { label: 'Notifications', href: '/candidate/notifications', icon: Bell },
  ];

  const adminNav = [
    { label: 'Governance Overview', href: '/admin/dashboard', icon: BarChart3 },
    { label: 'User Directory', href: '/admin/users', icon: UserCheck },
    { label: 'Company Accounts', href: '/admin/companies', icon: Building2 },
    { label: 'Job Moderation', href: '/admin/jobs', icon: Briefcase },
    { label: 'Audit Logs & Security', href: '/admin/audit', icon: ShieldCheck },
  ];

  const activeNav = role === 'admin' ? adminNav : role === 'candidate' ? candidateNav : recruiterNav;

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    if (newRole === 'admin') navigate('/admin/dashboard');
    else if (newRole === 'candidate') navigate('/candidate/dashboard');
    else navigate('/recruiter/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0A1424] text-white p-4 flex items-center justify-between border-b border-[#14284B] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center font-bold">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg">TALENTFLOW</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#94A3B8] hover:text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-[#0A1424] text-white border-r border-[#14284B] flex flex-col justify-between z-50
        transition-transform duration-200 md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F97316] to-[#FB923C] flex items-center justify-center text-white shadow-glow-orange group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                TALENTFLOW
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium tracking-wide">
                {role === 'admin' ? 'Platform Governance' : role === 'candidate' ? 'Candidate Portal' : 'Recruiting Suite'}
              </span>
            </div>
          </Link>

          {/* Role Pill Switcher */}
          <div className="p-2.5 rounded-xl bg-[#0E1C33] border border-[#14284B] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#94A3B8]">
              <span>Active Role Context</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30">
                {role}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['recruiter', 'candidate', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`py-1 text-[10px] font-bold capitalize rounded-md transition-all ${
                    role === r 
                      ? 'bg-[#F97316] text-white shadow-sm' 
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#14284B]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#64748B] px-3 mb-2">
              Menu
            </div>
            {activeNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                    ${isActive 
                      ? 'bg-[#F97316] text-white shadow-soft-sm font-bold' 
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#0E1C33]'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#14284B] bg-[#070D18]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full object-cover border border-[#233757]" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-[#94A3B8] truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-[#14284B] rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-soft-sm">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates, skills, requisition IDs, or notes..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#F97316] text-[#0F172A] placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/browse-jobs"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A] px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
            >
              <span>Public Job Board</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </Link>

            <button className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-xl hover:bg-[#F1F5F9] relative" title="Notifications">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#F97316] absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-[#E2E8F0] mx-1" />

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748B] hidden md:inline">
                {user?.companyName || 'TalentFlow Cloud'}
              </span>
              <img src={user?.avatar} alt={user?.name} className="w-7 h-7 rounded-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 space-y-8">
          
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#F97316] px-2 py-0.5 rounded bg-[#F97316]/10 border border-[#F97316]/20">
                  {role} Workspace
                </span>
                <span className="text-xs text-[#94A3B8]">• Design Preview Mode</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-[#64748B] mt-1">{subtitle}</p>}
            </div>

            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>

          {/* Actual Page Render */}
          {children}

        </main>
      </div>

    </div>
  );
};
