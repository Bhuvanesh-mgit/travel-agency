import React, { useState, useEffect } from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import { FaArrowLeft, FaStar, FaCompass, FaShieldAlt } from 'react-icons/fa';

const bannerSlides = [
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
    title: 'Experience Tropical Elegance',
    subtitle: 'Private islands, pristine beaches, and world-class luxury.',
    tag: '🌴 Exclusive Escape',
  },
  {
    url: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=2000&q=80',
    title: 'Overwater Sanctuary Retreats',
    subtitle: 'Wake up to endless ocean views and direct reef access.',
    tag: '🌊 Ocean Sanctuary',
  },
  {
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80',
    title: 'Cultural Wonders & Heritage',
    subtitle: 'Immerse yourself in timeless landscapes and ancient temples.',
    tag: '⛩️ Cultural Horizons',
  },
];

export default function AuthLayout() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Grab auth state
  const { user, loading } = useAuth();

  // Auto-rotate background slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // ---------------- 1. AUTH GUARD REDIRECT ----------------

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-white">
        <p className="text-sm font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  // If user IS ALREADY LOGGED IN, redirect away from login/register pages
  if (user) {
    if (user.role === 'admin' || user.role === 'staff') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const slide = bannerSlides[activeSlide];

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center font-sans overflow-x-hidden bg-slate-900 text-slate-800">
      
      {/* ---------------- 2. FULL SCREEN BACKGROUND SLIDESHOW ---------------- */}
      {bannerSlides.map((item, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
            activeSlide === idx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ backgroundImage: `url('${item.url}')` }}
        />
      ))}

      {/* Responsive Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-white/90 lg:to-white/80 z-10" />
      <div className="absolute inset-0 bg-black/20 lg:bg-white/10 backdrop-blur-[2px] z-10" />

      {/* ---------------- 3. TOP HEADER NAVBAR ---------------- */}
      <header className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-lg sm:text-xl font-black shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            ✈️
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow-md lg:text-slate-900">
              Travel<span className="text-cyan-400 lg:text-cyan-500">Go</span>
            </span>
            <p className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-200 font-bold -mt-1 lg:text-slate-500">
              Explore Without Limits
            </p>
          </div>
        </Link>

        {/* Return Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 backdrop-blur-md shadow-md"
        >
          <FaArrowLeft className="text-[10px]" />
          <span>Return Home</span>
        </Link>
      </header>

      {/* ---------------- 4. MAIN CONTENT LAYOUT ---------------- */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 pt-40 pb-14 lg:py-24 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          
          {/* Left Hero Text Showcase */}
          <div className="col-span-1  lg:col-span-7 space-y-4 sm:space-y-6 select-none pr-0 lg:pr-8 text-center lg:text-left">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-blue-600 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-md">
                {slide.tag}
              </span>
              <div className="flex items-center gap-1.5 text-amber-500 text-[11px] sm:text-xs font-bold bg-white/90 px-3 py-1 sm:px-3.5 sm:py-1.5  rounded-full border border-slate-200/80 shadow-sm backdrop-blur-md">
                <FaStar className="text-[10px] sm:text-[11px]" />
                <span className="text-slate-800">4.95 / 5 Experience</span>
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-2xl sm:text-5xl lg:text-5xl font-black leading-tight text-white drop-shadow-lg">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-base text-slate-100 leading-relaxed max-w-lg mx-auto lg:mx-0 drop-shadow">
              {slide.subtitle} Unlock curated member rates, personalized travel concierges, and instant reservations worldwide.
            </p>

            {/* Feature Pills */}
            <div className="hidden sm:flex items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
                <FaCompass className="text-blue-600 text-sm" />
                <span>Custom Itineraries</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
                <FaShieldAlt className="text-emerald-500 text-sm" />
                <span>100% Protected</span>
              </div>
            </div>

            {/* Pagination Indicators */}
            <div className="pt-2 sm:pt-4 flex items-center justify-center lg:justify-start gap-2">
              {bannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all duration-500 rounded-full ${
                    activeSlide === idx
                      ? 'w-8 sm:w-10 h-2 bg-blue-600 shadow-md shadow-blue-500/50'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* Right Form Container */}
          <div className="col-span-1 lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md bg-white/95 lg:bg-white/90 backdrop-blur-lg p-6 sm:p-10 rounded-3xl shadow-2xl shadow-slate-950/10 border border-slate-100 overflow-hidden space-y-6 text-slate-800">
              {/* Gradient Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400" />
              <Outlet />
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- 5. FOOTER BAR ---------------- */}
      <footer className="absolute   bottom-0 left-0 right-0 z-20 text-center text-[10px] sm:text-xs  text-slate-200 lg:text-slate-500 font-medium px-4">
        © {new Date().getFullYear()} TravelGo Escapes. All rights reserved.
      </footer>

    </div>
  );
}