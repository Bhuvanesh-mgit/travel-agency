import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, 
  FiUsers, 
  FiBookmark, 
  FiClock, 
  FiTrendingUp, 
  FiLoader, 
  FiCheckCircle 
} from 'react-icons/fi';

const API_BOOKINGS_URL = 'http://localhost:5000/api/bookings';
const API_USERS_URL = 'http://localhost:5000/api/auth/customers';

const Report = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings and customers concurrently
      const [bookingsRes, usersRes] = await Promise.all([
        fetch(API_BOOKINGS_URL, { headers: getAuthHeaders() }),
        fetch(API_USERS_URL, { headers: getAuthHeaders() }),
      ]);

      const bookingsData = await bookingsRes.json();
      const usersData = await usersRes.json();

      if (!bookingsRes.ok || !bookingsData.success) {
        throw new Error(bookingsData.message || 'Failed to fetch bookings for reports');
      }
      if (!usersRes.ok || !usersData.success) {
        throw new Error(usersData.message || 'Failed to fetch users for reports');
      }

      setBookings(bookingsData.data || []);
      setCustomers(usersData.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Analytics Calculations ---
  const totalBookings = bookings.length;
  const totalCustomers = customers.length;
  
  // Total Revenue calculation from paid bookings
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  const paidBookingsCount = bookings.filter((b) => b.paymentStatus === 'paid').length;
  const pendingBookingsCount = bookings.filter((b) => b.paymentStatus === 'pending').length;
  const cancelledBookingsCount = bookings.filter((b) => b.bookingStatus === 'cancelled').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-24 text-gray-500 gap-2 min-h-screen bg-gray-50">
        <FiLoader className="animate-spin" size={24} />
        <span>Generating analytics report...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Overview of platform revenue, booking performance, and user growth.</p>
        </div>
        <button
          onClick={fetchReportData}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              <FiTrendingUp /> Verified payments
            </span>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <FiDollarSign size={24} />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalBookings}</h3>
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
              <FiCheckCircle /> {paidBookingsCount} Successful
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FiBookmark size={24} />
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Users</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalCustomers}</h3>
            <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-1">
              Active platform base
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <FiUsers size={24} />
          </div>
        </div>

        {/* Pending Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending / Unpaid</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{pendingBookingsCount}</h3>
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
              Awaiting confirmation
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <FiClock size={24} />
          </div>
        </div>

      </div>

      {/* Detailed Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Booking Status Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Status Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Confirmed & Paid Bookings</span>
              <span className="font-bold text-green-600">{paidBookingsCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Pending Payment Bookings</span>
              <span className="font-bold text-amber-600">{pendingBookingsCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Cancelled Bookings</span>
              <span className="font-bold text-red-600">{cancelledBookingsCount}</span>
            </div>
          </div>
        </div>

        {/* Recent Platform Activity Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Latest Platform Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                  <th className="pb-3">Ref</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id}>
                    <td className="py-3 font-bold text-blue-600">{b.bookingRef}</td>
                    <td className="py-3 font-medium">{b.user?.name || 'Guest'}</td>
                    <td className="py-3 font-bold">₹{b.totalPrice}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Report;