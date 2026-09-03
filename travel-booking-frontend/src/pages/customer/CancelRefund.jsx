import React from 'react';
import { FaMoneyBillWave, FaClock, FaExclamationTriangle, FaCheckCircle, FaPhoneAlt } from 'react-icons/fa';

const CancelRefund = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 text-cyan-600 text-xs font-bold uppercase tracking-wider mb-4">
          <FaMoneyBillWave className="text-sm" /> Policy Guidelines
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Last updated: September 2026 • Transparent terms for peace of mind.
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Overview Box */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900">Our Commitment to Fairness</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            At TravelGo, we understand that plans can change unexpectedly. We strive to make our cancellation and refund process as clear, transparent, and fair as possible. Please review the timelines and conditions below before requesting a modification or cancellation.
          </p>
        </div>

        {/* Cancellation Timelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
              <FaCheckCircle />
            </div>
            <h3 className="text-sm font-bold text-slate-900">30+ Days Prior</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full refund minus a nominal 5% administrative processing fee for payment gateway transactions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base">
              <FaClock />
            </div>
            <h3 className="text-sm font-bold text-slate-900">15 - 29 Days Prior</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              50% refund of the total package cost. Non-refundable partner hotel and transport deposits may apply.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-base">
              <FaExclamationTriangle />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Less than 15 Days</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Non-refundable. However, you may transfer your booking to another traveler or reschedule with approval.
            </p>
          </div>

        </div>

        {/* Refund Process & Timeline */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">How Refunds Are Processed</h2>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <li>Approved refunds are automatically initiated back to your original payment method via Razorpay.</li>
            <li>Processing typically takes between <span className="font-bold text-slate-800">5 to 7 business days</span> depending on your banking institution.</li>
            <li>For customized itineraries, specific resort or airline cancellation penalties will be deducted directly from the refund amount.</li>
          </ul>
        </div>

        {/* Support Help Box */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/10">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-extrabold">Need to cancel or modify a booking?</h3>
            <p className="text-xs text-cyan-100">Our customer support team is available 24/7 to help you out.</p>
          </div>
          <a
            href="/contact"
            className="px-6 py-3 rounded-xl bg-white text-blue-600 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-slate-50 transition-all shrink-0 flex items-center gap-2"
          >
            <FaPhoneAlt /> Contact Support
          </a>
        </div>

      </div>

    </div>
  );
};

export default CancelRefund;