import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, CheckSquare, Users, LogOut, Settings } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <Link to={to} className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout = ({ allowedRoles }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const getNavigation = () => {
    switch (user.role) {
      case 'Student':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, to: '/student/dashboard' },
          { label: 'Application Form', icon: FileText, to: '/student/application' },
          { label: 'Status Tracking', icon: CheckSquare, to: '/student/status' },
        ];
      case 'Chapter Coordinator':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, to: '/coordinator/dashboard' },
          { label: 'Applications', icon: FileText, to: '/coordinator/applications' },
        ];
      case 'Head Office Admin':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, to: '/head-office/dashboard' },
          { label: 'Final Approvals', icon: FileText, to: '/head-office/applications' },
          { label: 'Disbursements', icon: CheckSquare, to: '/head-office/disbursements' },
        ];
      case 'Super Admin':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
          { label: 'User Management', icon: Users, to: '/admin/users' },
          { label: 'Chapter Management', icon: Settings, to: '/admin/chapters' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigation();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-400">NSF Portal</h1>
          <p className="text-sm text-slate-400 mt-1">{user.role}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold">
              {user.fullName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 w-full text-slate-300 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
