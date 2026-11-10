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
  UserCheck 
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { isPublicRoute } from '@/utils/authRoutes';

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
    { label: 'Audit Logs & Security', href: '/admin/audit-logs', icon: ShieldCheck },
  ];

  const activeNav = role === 'admin' ? adminNav : role === 'candidate' ? candidateNav : recruiterNav;

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    if (newRole === 'admin') navigate('/admin/dashboard');
    else if (newRole === 'candidate') navigate('/candidate/dashboard');
    else navigate('/recruiter/dashboard');
  };

  const isPublic = isPublicRoute(location.pathname);

  const shellLayout = (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col md:flex-row text-slate-900 font-sans">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white text-slate-900 p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40 shadow-soft-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center font-bold text-white shadow-soft-sm">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900">TALENTFLOW</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-600 hover:text-slate-900" aria-label="Toggle Navigation">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation — Distinct Crisp Corporate Recruiter Identity */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-white text-slate-800 border-r border-slate-200 flex flex-col justify-between z-50
        transition-transform duration-200 md:translate-x-0 shadow-soft-sm
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-soft-sm group-hover:bg-teal-800 transition-colors">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                TALENTFLOW
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                {role === 'admin' ? 'Governance Portal' : role === 'candidate' ? 'Candidate Portal' : 'Recruiting Suite'}
              </span>
            </div>
          </Link>

          {/* Role Pill Switcher */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Active Context</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-teal-50 text-teal-800 border border-teal-200">
                {role}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['recruiter', 'candidate', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`py-1 text-[10px] font-semibold capitalize rounded-md transition-all ${
                    role === r 
                      ? 'bg-teal-700 text-white shadow-soft-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Management Suite
            </p>
            {activeNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                    ${isActive 
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-soft-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-teal-700" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'} alt={user?.name || 'User'} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Guest User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'guest@talentflow.cloud'}</p>
              </div>
            </div>
            <button 
              onClick={async () => { await logout(); navigate('/auth/login'); }} 
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-soft-sm">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates, skills, requisition IDs, or notes..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAFBF9] border border-slate-200 rounded-xl focus:outline-none focus:border-teal-700 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/browse-jobs"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <span>Public Job Board</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 relative" title="Notifications">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-teal-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-600 hidden md:inline">
                {user?.companyName || 'TalentFlow Cloud'}
              </span>
              <img src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'} alt={user?.name || 'User'} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 bg-[#FAFBF9]">
          
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                  {role} Workspace
                </span>
                <span className="text-xs text-slate-400">• Operational ATS Mode</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-slate-600 mt-1">{subtitle}</p>}
            </div>

            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>

          {/* Actual Page Render */}
          {children}

        </main>
      </div>

    </div>
  );

  // If public route, render without strict auth gate
  if (isPublic) {
    return shellLayout;
  }

  // Otherwise, wrap in RouteGuard with role check
  return (
    <RouteGuard requiredRole={role}>
      {shellLayout}
    </RouteGuard>
  );
};
