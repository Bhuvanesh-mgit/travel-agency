import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSpinner, FaCheckCircle, FaClock, FaSuitcase, FaDownload, FaUser, FaShieldAlt } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://travel-agency-kmy6.onrender.com';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

const ManageBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setBookings(data.data);
      } else {
        setError(data.message || 'Failed to load bookings.');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setProcessingId(bookingId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingStatus: newStatus })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(`Booking status updated to ${newStatus}.`);
        fetchAllBookings();
      } else {
        toast.error(data.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Server connection failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownloadPDF = async (bookingId, bookingRef) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/download-pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to generate PDF receipt.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${bookingRef}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Could not download PDF receipt.');
    }
  };

  const resolveImageUrl = (imgSrc) => {
    if (!imgSrc) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=300';
    if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
      return imgSrc;
    }
    const cleanPath = imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  // Helper color mapping for distinct status badges and active button states
  const getStatusColorStyle = (status, isActive) => {
    if (!isActive) return 'bg-slate-100 hover:bg-slate-200 text-slate-600';
    
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-200';
      case 'completed':
        return 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200';
      case 'cancelled':
        return 'bg-rose-600 text-white shadow-md ring-2 ring-rose-200';
      case 'pending':
      default:
        return 'bg-amber-500 text-white shadow-md ring-2 ring-amber-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="text-xs font-bold">Loading booking management dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Manage Bookings</h1>
            <p className="text-xs text-slate-500 mt-1">Comprehensive dashboard to inspect reservations, update workflow statuses, and download records.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Back to Home
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && !error && (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200/80 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
              <FaSuitcase />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm">No Active Bookings</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">There are no records available to manage right now.</p>
            </div>
          </div>
        )}

        {/* Bookings Management List */}
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const packageInfo = typeof booking.package === 'object' && booking.package !== null ? booking.package : {};
            const userInfo = typeof booking.user === 'object' && booking.user !== null ? booking.user : {};
            const paymentDetails = booking.paymentDetails || {};

            const packageTitle = packageInfo.title || 'Tour Package';
            const packageImage = resolveImageUrl(packageInfo.image || packageInfo.gallery?.[0]);
            
            const destinationText = (() => {
              const dest = packageInfo.destination;
              if (typeof dest === 'object' && dest !== null) {
                return dest.name || dest.title || 'Destination Included';
              }
              if (typeof dest === 'string' && dest.trim() !== '' && !dest.match(/^[0-9a-fA-F]{24}$/)) {
                return dest;
              }
              return packageInfo.locationName || 'Destination Included';
            })();

            const isPaid = booking.paymentStatus === 'paid';
            const isProcessing = processingId === booking._id;

            return (
              <div 
                key={booking._id} 
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/85 space-y-6 transition-all hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  {/* Thumbnail */}
                  <div className="w-full lg:w-36 h-36 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                    <img 
                      src={packageImage} 
                      alt={packageTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details Core */}
                  <div className="flex-1 space-y-3 w-full text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-[11px] font-bold text-slate-700">
                        <FaTicketAlt className="text-blue-600" /> Ref: {booking.bookingRef}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                        }`}>
                          {isPaid ? <FaCheckCircle /> : <FaClock />} Payment: {booking.paymentStatus}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200/60">
                          Status: {booking.bookingStatus}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900">{packageTitle}</h3>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-rose-500" /> {destinationText}</span>
                      <span className="flex items-center gap-1"><FaCalendarAlt className="text-blue-600" /> {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                      <span>• {booking.travelers} Guest(s)</span>
                    </div>
                  </div>

                  {/* Financial Total */}
                  <div className="w-full lg:w-auto text-center lg:text-right border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                    <span className="text-[11px] text-slate-400 block font-semibold">Total Amount</span>
                    <span className="text-2xl font-black text-blue-600">${booking.totalPrice}</span>
                  </div>
                </div>

                {/* Grid Metadata Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-semibold block flex items-center gap-1"><FaUser className="text-blue-600" /> Traveler Info</span>
                    <strong className="text-slate-800">{userInfo.name || 'N/A'}</strong>
                    <span className="block text-slate-500">{userInfo.email || 'N/A'} • {userInfo.phone || 'N/A'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-semibold block flex items-center gap-1"><FaShieldAlt className="text-emerald-600" /> Transaction IDs</span>
                    <span className="font-mono text-slate-700 block truncate">Pay ID: {paymentDetails.razorpayPaymentId || 'N/A'}</span>
                    <span className="font-mono text-slate-700 block truncate">Ord ID: {paymentDetails.razorpayOrderId || 'N/A'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-semibold block">Special Requests</span>
                    <p className="text-slate-600 italic">{booking.specialRequests || 'None provided'}</p>
                  </div>
                </div>

                {/* Management Action Toolbar */}
                <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500">Update Status:</span>
                    {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
                      const isActive = booking.bookingStatus === status;
                      return (
                        <button
                          key={status}
                          disabled={isProcessing || isActive}
                          onClick={() => handleUpdateStatus(booking._id, status)}
                          className={`px-3.5 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${getStatusColorStyle(status, isActive)} disabled:opacity-60`}
                        >
                          {isProcessing && isActive && <FaSpinner className="animate-spin text-[9px]" />}
                          {status}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleDownloadPDF(booking._id, booking.bookingRef)}
                    className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    <FaDownload /> Download Order PDF
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ManageBooking;