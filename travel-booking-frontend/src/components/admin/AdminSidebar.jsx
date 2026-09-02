import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaChartPie, 
  FaBoxOpen, 
  FaCalendarAlt, 
  FaCommentDots, 
  FaMapMarkedAlt, 
  FaUsers, 
  FaCreditCard, 
  FaPercent, 
  FaUserShield, 
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaCompass
} from 'react-icons/fa';

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Admin Sidebar Navigation Links
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FaChartPie, roles: ['admin', 'staff'] },
    { label: 'Manage Packages', path: '/admin/packages', icon: FaBoxOpen, roles: ['admin', 'staff'] },
    { label: 'Bookings', path: '/admin/bookings', icon: FaCalendarAlt, roles: ['admin', 'staff'] },
    { label: 'Customer Enquiries', path: '/admin/enquiries', icon: FaCommentDots, roles: ['admin', 'staff'] },
    { label: 'Destinations', path: '/admin/destinations', icon: FaMapMarkedAlt, roles: ['admin', 'staff'] },
    // Admin Exclusive Links
    { label: 'Customers', path: '/admin/customers', icon: FaUsers, roles: ['admin'] },
    { label: 'Payments', path: '/admin/payments', icon: FaCreditCard, roles: ['admin'] },
    { label: 'Offers & Banners', path: '/admin/offers', icon: FaPercent, roles: ['admin'] },
    { label: 'Manage Staff', path: '/admin/staff', icon: FaUserShield, roles: ['admin'] },
    { label: 'Reports', path: '/admin/reports', icon: FaChartLine, roles: ['admin'] },
  ];

  // Filter links based on current logged-in user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-60' : 'w-16'
      } bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out flex flex-col justify-between fixed top-0 bottom-0 left-0 z-40 select-none font-sans`}
    >
      <div>
        {/* Logo & Toggle Header */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-100">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 min-w-[32px] rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <FaCompass className="text-base" />
            </div>
            {sidebarOpen && (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  Aura<span className="text-blue-600">Travel</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                  Admin
                </span>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <FaChevronLeft className="text-xs" /> : <FaChevronRight className="text-xs" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-130px)] scrollbar-thin scrollbar-thumb-slate-200">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon className={`text-sm min-w-[16px] ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="p-2 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-2">
          {sidebarOpen && user && (
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs min-w-0 flex-1">
              <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase min-w-[28px]">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-slate-400 uppercase font-medium truncate">{user?.role || 'Admin'}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className={`p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors ${
              !sidebarOpen ? 'w-full flex justify-center' : ''
            }`}
          >
            <FaSignOutAlt className="text-sm" />
          </button>
        </div>
      </div>
    </aside>
  );
}