import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaGlobe, FaChevronRight } from 'react-icons/fa';
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Extract current section title from URL path
  const currentSection = location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      
      {/* 1. SIDEBAR COMPONENT */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* 2. MAIN CONTENT AREA */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-60' : 'ml-16'
        }`}
      >
        
        {/* TOPBAR HEADER */}
        <header className="h-14 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-6 sm:px-8 flex items-center justify-between shadow-2xs">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Admin Portal</span>
            <FaChevronRight className="text-[9px] text-slate-300" />
            <span className="font-semibold text-slate-900 capitalize">
              {currentSection}
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100/80 hover:bg-slate-200/70 hover:text-slate-900 transition-all"
            >
              <FaGlobe className="text-slate-400 text-xs" />
              <span>View Storefront</span>
            </Link>

            <div className="h-4 w-px bg-slate-200" />

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-semibold text-slate-800 leading-none">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize font-medium mt-0.5">
                  {user?.role || 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC NESTED PAGE CONTENT */}
        <main className="p-6 sm:p-8 flex-1">
          <Outlet/>
        </main>

      </div>
    </div>
  );
}