import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaHome, FaListAlt, FaSpinner, FaUser, FaEnvelope, FaPhone, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Grab booking passed from router state after successful payment verification
  const initialBooking = location.state?.booking || location.state?.data || null;

  const [booking, setBooking] = useState(initialBooking);
  const [loading, setLoading] = useState(!initialBooking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialBooking) {
      fetchLatestBooking();
    }
  }, [initialBooking]);

  const fetchLatestBooking = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success && data.data.length > 0) {
        setBooking(data.data[0]); // Most recent booking
        toast.success('Booking details retrieved successfully.');
      } else {
        setError('No recent booking records found.');
        toast.error('No recent booking records found.');
      }
    } catch (err) {
      console.error('Error fetching latest booking:', err);
      setError('Could not connect to the server.');
      toast.error('Could not connect to the server.');
    } finally {
      setLoading(false);
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
        <span className="text-xs font-bold">Loading your booking confirmation...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-xl font-bold text-slate-800">No Booking Found</h2>
        <p className="text-xs text-slate-500">{error || 'Unable to retrieve booking information.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Safe Mapping with multi-level fallbacks for package, user, and payment details
  const packageInfo = (booking.package && typeof booking.package === 'object') ? booking.package : {};
  const userInfo = (booking.user && typeof booking.user === 'object') ? booking.user : {};
  const paymentDetails = booking.paymentDetails || {};
  
  // Package Title Fallback
  const packageTitle = packageInfo.title || packageInfo.name || booking.title || 'Tour Package';
  
  // User Info Fallbacks
  const userName = userInfo.name || booking.userName || 'Valued Traveler';
  const userEmail = userInfo.email || booking.email || 'N/A';
  const userPhone = userInfo.phone || booking.phone || 'N/A';
  
  // Destination Resolver
  const destinationText = (() => {
    const dest = packageInfo.destination || packageInfo.location;
    if (typeof dest === 'object' && dest !== null) {
      return dest.name || dest.title || 'Destination Included';
    }
    if (typeof dest === 'string' && dest.trim() !== '') {
      return dest;
    }
    return packageInfo.locationName || booking.destination || 'Destination Included';
  })();

  const packageImage = resolveImageUrl(packageInfo.image || packageInfo.gallery?.[0] || booking.image);

  // Payment IDs Resolution
  const paymentId = paymentDetails.razorpayPaymentId || booking.razorpayPaymentId || 'N/A';
  const orderId = paymentDetails.razorpayOrderId || booking.razorpayOrderId || 'N/A';
  const paymentMethod = booking.paymentMethod || 'Razorpay';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-200/80 text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
            <FaCheckCircle />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Official E-Receipt & Confirmation
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Booking Confirmed Successfully!</h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your payment has been securely verified. Below is your official trip summary and secure transaction receipt.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200/60 text-xs font-bold text-slate-700 mt-2">
            <FaTicketAlt className="text-blue-600" /> Booking Reference: <span className="text-blue-600 font-black">{booking.bookingRef || 'N/A'}</span>
          </div>
        </div>

        {/* Detailed Professional Summary Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Trip Itinerary & Payment Receipt
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
            </span>
          </div>

          {/* Traveler Account Profile Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <FaUser className="text-blue-600" /> Primary Guest: <span className="text-slate-600 font-normal">{userName}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span className="flex items-center gap-1"><FaEnvelope className="text-slate-400" /> {userEmail}</span>
              <span className="flex items-center gap-1"><FaPhone className="text-slate-400" /> {userPhone}</span>
            </div>
          </div>

          {/* Package Visual Overview */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-full sm:w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-xs">
              <img 
                src={packageImage} 
                alt={packageTitle} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 w-full text-center sm:text-left">
              <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                {packageTitle}
              </h4>
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
                <FaMapMarkerAlt className="text-rose-500" /> Destination: <strong className="text-slate-700">{destinationText}</strong>
              </p>
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
                <FaCalendarAlt className="text-blue-600" /> Scheduled Travel Date: <strong className="text-slate-700">{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
              </p>
            </div>
          </div>

          {/* Financial & Guest Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-slate-400 block font-semibold">Travelers Count</span>
              <span className="font-bold text-slate-800 block text-sm">{booking.travelers || 1} Guest(s)</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-slate-400 block font-semibold">Total Amount</span>
              <span className="font-bold text-blue-600 block text-sm">₹{booking.totalPrice || 0}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-slate-400 block font-semibold">Payment Status</span>
              <span className="font-bold text-emerald-600 uppercase block text-sm">{booking.paymentStatus || 'Pending'}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-slate-400 block font-semibold">Booking Status</span>
              <span className="font-bold text-blue-600 uppercase block text-sm">{booking.bookingStatus || 'Confirmed'}</span>
            </div>
          </div>

          {/* Secure Transaction & Gateway Details Breakdown */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
              <FaCreditCard className="text-blue-600" /> Gateway & Transaction Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="text-slate-400 font-semibold block">Payment Method</span>
                <strong className="text-slate-800 uppercase">{paymentMethod}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Razorpay Payment ID</span>
                <span className="font-mono text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 block truncate">
                  {paymentId}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-semibold block">Razorpay Order ID</span>
                <span className="font-mono text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 block truncate">
                  {orderId}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests Section */}
          {booking.specialRequests && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-700 block">Notes & Special Requests:</span>
              <p>{booking.specialRequests}</p>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={() => navigate('/booking-history')}
            className="flex-1 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FaListAlt /> View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <FaHome /> Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccess;