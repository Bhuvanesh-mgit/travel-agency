import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiDollarSign, 
  FiCheckCircle, 
  FiClock, 
  FiLoader, 
  FiCreditCard 
} from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api/bookings'; // Fetches bookings with payment details

const ManagePayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch payment records');
      }

      setPayments(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter based on search term (Booking Ref, Customer Name/Email) and status
  const filteredPayments = payments.filter((item) => {
    const matchesSearch = 
      item.bookingRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
          <p className="text-sm text-gray-500">Monitor transactions, Razorpay payment statuses, and booking invoices.</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm">
          <p><strong>Connection Error:</strong> {error}</p>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100">
        <div className="flex items-center gap-3 w-full md:w-96">
          <FiSearch size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by Booking Ref, Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-gray-500 uppercase">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm bg-white text-gray-700"
          >
            <option value="all">All Transactions</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center p-12 text-gray-500 gap-2">
            <FiLoader className="animate-spin" size={24} />
            <span>Loading payment records from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Booking Ref</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Package</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold">Payment Status</th>
                  <th className="p-4 font-semibold">Razorpay Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-blue-600">{item.bookingRef}</td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{item.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{item.user?.email}</div>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{item.package?.title || 'N/A'}</td>
                      <td className="p-4 font-extrabold text-gray-900">₹{item.totalPrice}</td>
                      <td className="p-4 uppercase text-xs font-semibold text-gray-600">
                        {item.paymentMethod || 'none'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                            item.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : item.paymentStatus === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-gray-500">
                        {item.paymentDetails?.razorpayPaymentId || item.paymentDetails?.razorpayOrderId || 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-400">
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayment;