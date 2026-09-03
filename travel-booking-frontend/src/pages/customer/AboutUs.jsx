import React from 'react';
import { FaGlobeAmericas, FaShieldAlt, FaSmile, FaHeadset, FaCompass } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      
      {/* Hero Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
          <FaCompass className="text-sm animate-spin-slow" /> Discover TravelGo
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
          We Turn Your Dream Getaways Into Unforgettable Memories
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
          At TravelGo, we believe that traveling is more than just visiting new places—it's about immersing yourself in cultures, discovering hidden gems, and creating stories that last a lifetime.
        </p>
      </div>

      {/* Stats / Highlights Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <h3 className="text-3xl font-extrabold text-blue-600">15K+</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Happy Travelers</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <h3 className="text-3xl font-extrabold text-cyan-500">120+</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Destinations</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <h3 className="text-3xl font-extrabold text-blue-600">98%</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Satisfaction Rate</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <h3 className="text-3xl font-extrabold text-cyan-500">24/7</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Support & AI Chat</p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900">Why Travel With Us?</h2>
          <p className="text-xs text-slate-500 mt-1">We go above and beyond to ensure your journey is seamless and safe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <FaGlobeAmericas />
            </div>
            <h3 className="text-base font-bold text-slate-900">Handcrafted Itineraries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every package is meticulously designed by local experts to provide authentic experiences, premium accommodations, and stress-free schedules.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-lg">
              <FaShieldAlt />
            </div>
            <h3 className="text-base font-bold text-slate-900">Secure Bookings & Payments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book with absolute confidence using our secure Razorpay payment gateway and verified customer accounts protected by robust encryption.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <FaHeadset />
            </div>
            <h3 className="text-base font-bold text-slate-900">Dedicated AI & Human Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have questions about dates or pricing? Use our context-aware AI assistant or reach out directly to our expert support team anytime.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AboutUs;