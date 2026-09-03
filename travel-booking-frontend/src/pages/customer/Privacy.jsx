import React from 'react';
import { FaLock, FaUserShield, FaDatabase, FaCookieBite, FaPhoneAlt, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-32 pb-20">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50/80 border border-cyan-100 text-cyan-600 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <FaLock className="text-sm" /> Data Protection & Security
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-3">
          Effective Date: September 2026 • Discover how TravelGo collects, utilizes, and safeguards your personal information.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section 1: Introduction */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group hover:border-cyan-100 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50/50 rounded-full blur-2xl -z-10 group-hover:bg-cyan-100/50 transition-all"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
              01
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Information We Collect</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When you create an account, browse destinations, submit enquiries, or book travel packages through TravelGo, we gather certain information to optimize your experience. This includes personal details like your name, email address, phone number, booking history, and secure payment verification data processed via Razorpay.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: How We Use Data */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group hover:border-blue-100 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -z-10 group-hover:bg-blue-100/50 transition-all"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              02
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaDatabase className="text-blue-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">How We Use Your Information</h2>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  To process tour bookings, manage your custom itineraries, and communicate booking updates.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  To power our context-aware AI travel assistant, offering personalized destination suggestions.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  To maintain rigorous account security, detect fraudulent login attempts, and enforce role-based access.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  To send promotional offers, travel tips, and updates (you can opt out at any time).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Data Security */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group hover:border-emerald-100 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-2xl -z-10 group-hover:bg-emerald-100/50 transition-all"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              03
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaUserShield className="text-emerald-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">Security & Encryption</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We implement robust security protocols, including encrypted password storage (bcrypt), JSON Web Tokens (JWT) for session authentication, and secure HTTPS channels. Your financial transactions are handled directly through certified gateways, ensuring your sensitive credit card data is never stored on our local database servers.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Cookies & Tracking */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group hover:border-amber-100 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-2xl -z-10 group-hover:bg-amber-100/50 transition-all"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              04
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <FaCookieBite className="text-amber-600 text-base" />
                <h2 className="text-lg font-bold text-slate-900">Cookies & Local Storage</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                TravelGo utilizes browser `localStorage` and basic cookies solely to maintain your active login session, remember your preferences, and track your wishlist items. You can choose to clear or disable cookies via your browser settings, though certain authentication features may require them to function correctly.
              </p>
            </div>
          </div>
        </div>

        {/* Support Help Box */}
        {/* <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-cyan-500/20">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-extrabold tracking-tight">Questions regarding your data privacy?</h3>
            <p className="text-xs sm:text-sm text-cyan-100 max-w-md">Our compliance and support team is ready to address any security concerns you may have.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-2xl bg-white text-cyan-600 text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2.5"
          >
            <FaPhoneAlt /> Contact Support <FaChevronRight className="text-[10px]" />
          </Link>
        </div> */}

      </div>

    </div>
  );
};

export default Privacy;