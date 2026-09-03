import React from 'react';
import { FaFileContract, FaCheckCircle, FaExclamationCircle, FaUserShield, FaPhoneAlt, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TermsCondition = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-32 pb-20">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <FaFileContract className="text-sm" /> Legal Agreement & Guidelines
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-3">
          Effective Date: September 2026 • Please read these terms carefully before exploring or booking with TravelGo.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section 1: Acceptance */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group hover:border-blue-100 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -z-10 group-hover:bg-blue-100/50 transition-all"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              01
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Acceptance of Terms</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Welcome to TravelGo. By accessing our platform, browsing destinations, booking tour packages, or interacting with our AI travel assistant, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these stipulations, please discontinue use of our platform immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: User Accounts */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group hover:border-blue-100 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50/50 rounded-full blur-2xl -z-10 group-hover:bg-cyan-100/50 transition-all"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
              02
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaUserShield className="text-cyan-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">User Accounts & Booking Responsibilities</h2>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  You must provide accurate, current, and complete details during profile creation and checkout.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  You are solely responsible for maintaining the strict security and confidentiality of your login credentials.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  All tour reservations depend on real-time availability and final verification from our partner resorts.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  Listed pricing and package inclusions can change without notice until a booking transaction is fully secured.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Payments */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group hover:border-blue-100 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-2xl -z-10 group-hover:bg-emerald-100/50 transition-all"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              03
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaCheckCircle className="text-emerald-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">Payments & Secure Gateways</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All financial transfers on TravelGo are processed securely through industry-standard payment gateways like <span className="font-semibold text-slate-800">Razorpay</span>. By executing a transaction, you confirm that you are authorized to use the chosen payment instrument. TravelGo maintains the right to cancel unverified or failed transactions immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Liability */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group hover:border-amber-100 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-2xl -z-10 group-hover:bg-amber-100/50 transition-all"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              04
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaExclamationCircle className="text-amber-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">Limitation of Liability</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                TravelGo functions as a curated digital marketplace connecting travelers with third-party suppliers (hotels, transport providers, tour coordinators). We accept no direct liability for any unexpected personal injury, financial loss, itinerary disruption, delay, or extreme weather conditions outside our control.
              </p>
            </div>
          </div>
        </div>

        {/* Support Help Box */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-500/20">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-extrabold tracking-tight">Have questions about our legal policies?</h3>
            <p className="text-xs sm:text-sm text-cyan-100 max-w-md">Our customer success squad is available around the clock to help clarify any details.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2.5"
          >
            <FaPhoneAlt /> Contact Support <FaChevronRight className="text-[10px]" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default TermsCondition;