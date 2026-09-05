import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUserShield, FaTrash, FaUserPlus, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import Loader from '../../components/Loader';

export default function ManageStaff() {
  const { backendUrl, API_URL, token } = useAuth();
  const baseUrl = backendUrl || API_URL || 'http://localhost:5000' || 'https://travel-agency-kmy6.onrender.com'; // Fallback to local or live backend URL

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch all staff members
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/admin/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch staff list');
      }

      setStaffList(data.staff || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [token]);

  // Handle revoking staff or deleting user
  const handleRemoveStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to remove staff access for this user?')) return;

    try {
      const response = await fetch(`${baseUrl}/api/admin/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove staff');
      }

      setSuccessMsg('Staff member removed successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchStaff();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <Loader message="Loading staff accounts..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Manage Staff</h2>
          <p className="text-xs text-slate-500 font-medium">
            View and manage active staff members with limited dashboard access.
          </p>
        </div>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* Staff Table / List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {staffList.length > 0 ? (
                staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {staff.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{staff.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                      <FaEnvelope className="text-slate-400 text-[10px]" /> {staff.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <FaUserShield className="text-[9px]" /> Staff
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(staff.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemoveStaff(staff._id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                        title="Revoke Staff Access"
                      >
                        <FaTrash /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                    No database staff accounts found. Register a staff member using the secret key.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}