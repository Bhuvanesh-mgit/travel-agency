import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSpinner, FaCheckCircle, FaTimesCircle, FaClock, FaSuitcase, FaDownload, FaUser, FaShieldAlt } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
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
        setError(data.message || 'Failed to load booking history.');
      }
    } catch (err) {
      console.error('Error fetching booking history:', err);
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Booking cancelled successfully.');
        fetchBookings();
      } else {
        toast.error(data.message || 'Failed to cancel booking.');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Could not connect to server.');
    } finally {
      setCancellingId(null);
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="text-xs font-bold">Loading your booking history...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">My Bookings</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your active itineraries, download invoices, and review past tour reservations.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Explore More Packages
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
              <h3 className="font-bold text-slate-800 text-sm">No Bookings Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">You haven't booked any tour packages yet. Once you complete a booking, it will appear here.</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-block"
            >
              Browse Packages
            </button>
          </div>
        )}

        {/* Bookings List Grid */}
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const packageInfo = typeof booking.package === 'object' && booking.package !== null ? booking.package : {};
            const userInfo = typeof booking.user === 'object' && booking.user !== null ? booking.user : {};
            const paymentDetails = booking.paymentDetails || {};

            const packageTitle = packageInfo.title || 'Tour Package';
            const packageImage = resolveImageUrl(packageInfo.image || packageInfo.gallery?.[0]);
            
            // 🔑 Robust Destination Name Resolver (handles raw IDs, objects, or strings)
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
            const isCancelled = booking.bookingStatus === 'cancelled';

            return (
              <div 
                key={booking._id} 
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-5 transition-all hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Package Thumbnail */}
                  <div className="w-full md:w-36 h-36 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                    <img 
                      src={packageImage} 
                      alt={packageTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Booking Meta Details */}
                  <div className="flex-1 space-y-3 w-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-[11px] font-bold text-slate-700">
                        <FaTicketAlt className="text-blue-600" /> Ref: {booking.bookingRef}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                        }`}>
                          {isPaid ? <FaCheckCircle /> : <FaClock />} Payment: {booking.paymentStatus}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCancelled ? 'bg-rose-50 text-rose-600 border border-rose-200/60' : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                        }`}>
                          Status: {booking.bookingStatus}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900">{packageTitle}</h3>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-rose-500" /> {destinationText}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-600" /> {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </span>
                      <span>• {booking.travelers} Guest(s)</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="w-full md:w-auto flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 gap-3 shrink-0">
                    <div className="text-center md:text-right">
                      <span className="text-[11px] text-slate-400 block font-semibold">Total Amount</span>
                      <span className="text-xl font-black text-blue-600">₹{booking.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Extended Details: Transaction & IDs */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 font-semibold block flex items-center gap-1"><FaUser className="text-blue-600" /> Traveler</span>
                    <span className="font-bold text-slate-800">{userInfo.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block flex items-center gap-1"><FaShieldAlt className="text-emerald-600" /> Payment ID</span>
                    <span className="font-mono text-slate-700 truncate block">{paymentDetails.razorpayPaymentId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Order ID</span>
                    <span className="font-mono text-slate-700 truncate block">{paymentDetails.razorpayOrderId || 'N/A'}</span>
                  </div>
                </div>

                {/* Actions: Download PDF & Cancel */}
                <div className="flex flex-wrap justify-end items-center gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleDownloadPDF(booking._id, booking.bookingRef)}
                    className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    <FaDownload /> Download PDF
                  </button>

                  {!isCancelled && booking.bookingStatus !== 'completed' && (
                    <button
                      onClick={() => haandleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaTimesCircle /> {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default BookingHistory;