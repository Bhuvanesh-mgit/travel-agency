import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShieldAlt, FaCheckCircle, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaArrowLeft, FaSpinner, FaChild } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

const BookingCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Grab data passed via route state from PackageDetail, with safe fallback
  const bookingDetails = location.state || {
    packageId: '65a1b2c3d4e5f67890123456',
    title: 'Bali Tropical Paradise Getaway',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=300',
    travelDate: '2026-10-15',
    guestCount: 2,
    includeKids: false,
    kidsCount: 0,
    totalPrice: 48000,
  };

  // Traveller form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // Step 1: Create a booking record (including phone from form data)
      const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          packageId: bookingDetails.packageId,
          travelDate: bookingDetails.travelDate,
          travelers: bookingDetails.guestCount,
          kidsCount: bookingDetails.includeKids ? bookingDetails.kidsCount : 0,
          totalPrice: bookingDetails.totalPrice,
          phone: formData.phone, // 👈 Added phone number here so it saves in the database
          specialRequests: `Booked for ${formData.firstName} ${formData.lastName} (${formData.email}) - Adults: ${bookingDetails.guestCount}, Kids: ${bookingDetails.includeKids ? bookingDetails.kidsCount : 0}`,
        }),
      });

      const bookingResult = await bookingResponse.json();
      if (!bookingResponse.ok || !bookingResult.success) {
        throw new Error(bookingResult.message || 'Failed to create booking record.');
      }

      const bookingId = bookingResult.data._id;

      // Step 2: Create Razorpay order using the valid bookingId
      const orderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingId }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.message || 'Something went wrong while creating the order.');
      }

      const { orderId, amount, currency, key } = orderData;

      // Step 3: Setup Razorpay options
      const options = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency || 'INR',
        name: 'Travel Booking',
        description: `Booking for ${bookingDetails.title}`,
        image: bookingDetails.image,
        order_id: orderId,
        handler: async function (response) {
          // Step 4: Verify payment signature on backend
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyResponse.ok && verifyData.success) {
              toast.success('Payment successful! Booking confirmed.');
              navigate('/booking-success', { state: { booking: verifyData.data } });
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('Could not verify payment with server.');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.message || 'Payment initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors mb-6 cursor-pointer"
        >
          <FaArrowLeft className="text-[10px]" /> Back to Details
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Confirm and Pay</h1>
          <p className="text-xs text-slate-500 mt-1">Review your selected package details and complete your secure transaction.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column - Traveller Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/85 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <FaUser className="text-slate-400 text-sm" /> Traveller Information
              </h2>
              
              <form onSubmit={handlePayment} id="checkout-form" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required 
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John" 
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required 
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe" 
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-slate-800" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <FaEnvelope />
                    </span>
                    <input 
                      type="email" 
                      name="email"
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com" 
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-slate-800" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <FaPhone />
                    </span>
                    <input 
                      type="tel" 
                      name="phone"
                      required 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91" 
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-semibold text-slate-800" 
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Dynamic Trip Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/85 sticky top-28 space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Trip Summary</h3>

              {/* Dynamic Destination Overview */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                  <img 
                    src={bookingDetails.image} 
                    alt={bookingDetails.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{bookingDetails.title}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <FaCalendarAlt className="text-blue-600" /> {bookingDetails.travelDate}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {bookingDetails.guestCount} Adult(s) {bookingDetails.includeKids && `+ ${bookingDetails.kidsCount} Kid(s)`}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs pb-6 border-b border-slate-100 text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Selected Package Tier ({bookingDetails.guestCount} Pax)</span>
                  <span className="text-slate-800 font-bold">₹{bookingDetails.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Service Fees</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center font-black text-lg text-slate-900">
                <span>Total Amount</span>
                <span className="text-2xl text-blue-600">₹{bookingDetails.totalPrice}</span>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" /> Processing...
                  </>
                ) : (
                  <>
                    <FaShieldAlt /> Pay via Razorpay (₹{bookingDetails.totalPrice})
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Secured by Razorpay. Free cancellation up to 48 hours before check-in.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingCheckout;