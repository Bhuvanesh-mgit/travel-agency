import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaSuitcase, 
  FaDollarSign, 
  FaClock, 
  FaUsers, 
  FaPlus, 
  FaArrowRight, 
  FaCalendarAlt 
} from 'react-icons/fa';
import Loader from '../../components/Loader';

export default function DashBoard() {
  const { backendUrl, API_URL, token } = useAuth();
  const baseUrl = backendUrl || API_URL || 'http://localhost:5000' || 'https://travel-agency-kmy6.onrender.com';

  const [stats, setStats] = useState({
    totalBookings: '0',
    totalRevenue: '$0',
    pendingRequests: '0',
    activeTravelers: '0'
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch live bookings using your existing populated backend endpoint
        const response = await fetch(`${baseUrl}/api/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();

        if (response.ok && data.success) {
          const bookings = data.data || [];

          // Calculate real metrics dynamically from the live database bookings
          const totalBookingsCount = bookings.length;
          
          const totalRevenueCalc = bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

          const pendingCount = bookings.filter(b => b.bookingStatus === 'pending' || b.paymentStatus === 'pending').length;
          
          const activeTravelersCalc = bookings
            .filter(b => b.bookingStatus === 'confirmed')
            .reduce((acc, curr) => acc + (curr.travelers || 1), 0);

          setStats({
            totalBookings: totalBookingsCount.toString(),
            totalRevenue: `$${totalRevenueCalc.toLocaleString()}`,
            pendingRequests: pendingCount.toString(),
            activeTravelers: activeTravelersCalc.toString()
          });

          // Map the live database bookings into the table format
          const formattedRecent = bookings.slice(0, 6).map((item) => {
            const pkg = typeof item.package === 'object' && item.package !== null ? item.package : {};
            const usr = typeof item.user === 'object' && item.user !== null ? item.user : {};

            return {
              id: item.bookingRef || item._id.slice(-6).toUpperCase(),
              customer: usr.name || 'Valued Guest',
              packageName: pkg.title || 'Tour Package',
              date: item.travelDate ? new Date(item.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
              amount: `$${item.totalPrice || 0}`,
              status: item.bookingStatus ? item.bookingStatus.charAt(0).toUpperCase() + item.bookingStatus.slice(1) : 'Confirmed'
            };
          });

          setRecentBookings(formattedRecent);
        }
      } catch (err) {
        console.error('Failed to load live dashboard metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token, baseUrl]);

  const STATS_DATA = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      change: 'Live system records',
      icon: FaSuitcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      change: 'Verified paid transactions',
      icon: FaDollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      change: 'Requires review',
      icon: FaClock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Active Travelers',
      value: stats.activeTravelers,
      change: 'Confirmed guests',
      icon: FaUsers,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
  ];

  if (loading) return <Loader message="Loading dashboard overview..." />;

  return (
    <div className="space-y-8 w-full">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Welcome back! Here is what's happening with your travel bookings today.
          </p>
        </div>

        <Link
          to="/admin/packages"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all w-fit shrink-0"
        >
          <FaPlus className="text-[10px]" />
          <span>Explore Packages</span>
        </Link>
      </div>

      {/* Top KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STATS_DATA.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-[10px] font-semibold text-slate-500">{stat.change}</p>
              </div>

              <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} ${stat.color} flex items-center justify-center text-xl shrink-0`}>
                <Icon />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest travel reservations placed by guests.</p>
          </div>

          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                <th className="py-3.5 px-6">Booking ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Package</th>
                <th className="py-3.5 px-6">Travel Date</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {recentBookings.length > 0 ? (
                recentBookings.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {item.id}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {item.customer}
                    </td>
                    <td className="py-4 px-6 font-semibold text-blue-600 truncate max-w-[200px]">
                      {item.packageName}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-slate-400 text-[10px]" />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {item.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : item.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                    No recent bookings found.
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