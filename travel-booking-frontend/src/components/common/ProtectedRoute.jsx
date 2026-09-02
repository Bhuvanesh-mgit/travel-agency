import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. ✋ MUST wait while AuthContext restores token from LocalStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans text-xs font-bold uppercase tracking-widest">
        Restoring session...
      </div>
    );
  }

  // 2. If no user after loading, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Normalize role checks so "admin", "Admin", and user.isAdmin = true all pass safely
  const userRole = user.role ? user.role.toLowerCase() : '';
  const isSuperAdmin = user.isAdmin || user._id === 'admin_env_id' || user.id === 'admin_env_id' || userRole === 'admin';

  // 3. Role authorization check
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRole || (isSuperAdmin && role.toLowerCase() === 'admin')
    );

    if (!hasRole && !isSuperAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}