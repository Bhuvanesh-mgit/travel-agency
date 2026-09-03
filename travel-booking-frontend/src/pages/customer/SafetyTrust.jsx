import React from 'react';
import { FaShieldAlt, FaLock, FaCheckCircle, FaUserCheck, FaHandshake, FaPhoneAlt, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SafetyTrust = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 relative overflow-hidden">
      
      {/* Ambient Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-2/3 right-10 w-[350px] h-[350px] bg-blue-200/30 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono uppercase tracking-widest mb-4 shadow-sm">
          <FaShieldAlt className="text-sm text-emerald-600" /> Verified Security & Trust Standards
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Safety & Trust at TravelGo
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-3 max-w-xl mx-auto">
          Your peace of mind is our highest priority. Discover the rigorous security protocols and verified partnerships that protect your journeys.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        
        {/* Section 1: Secure Transactions */}
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-emerald-400/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              01
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FaLock className="text-emerald-600 text-sm" /> Bank-Grade Payment Security
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Every booking and financial transaction processed on TravelGo is routed securely through certified gateways like <span className="font-semibold text-slate-800">Razorpay</span>. We utilize end-to-end SSL encryption, ensuring your financial instruments and sensitive personal details remain completely protected from unauthorized interceptors.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Verified Partners */}
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-blue-400/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              02
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaHandshake className="text-blue-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">Handpicked & Verified Tour Operators</h2>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">▹</span>
                  All partner resorts, hotels, and transport coordinators undergo stringent quality and safety background audits.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">▹</span>
                  Itineraries are curated to comply with regional tourism standards and emergency medical protocols.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">▹</span>
                  Regular customer feedback integration ensures substandard operators are instantly removed from our network.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Account Protection */}
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-cyan-400/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
              03
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaUserCheck className="text-cyan-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">Account Access & RBAC Security</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                We enforce strict role-based access control (RBAC) separating customer, staff, and administrator permissions. Password hashing via bcrypt and secure JSON Web Tokens (JWT) guarantee that your personal dashboard and booking records remain strictly confidential.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: 24/7 Crisis Support */}
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-amber-400/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              04
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaCheckCircle className="text-amber-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">Around-the-Clock Emergency Assistance</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Whether you encounter a delay while traveling or need help modifying an active itinerary, our support squad and AI assistant remain accessible 24/7 to resolve emergencies quickly and efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Support Help Box */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="space-y-2 text-center sm:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 text-emerald-200 text-[10px] font-mono uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span> Safety Guaranteed
            </div>
            <h3 className="text-lg font-extrabold tracking-tight text-white">Have questions regarding travel safety?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md">Our customer success and safety experts are always ready to assist you.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-2xl bg-white text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2.5 relative z-10"
          >
            <FaPhoneAlt /> Contact Support <FaChevronRight className="text-[10px]" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default SafetyTrust;