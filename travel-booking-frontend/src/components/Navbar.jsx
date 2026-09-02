import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaSuitcase, 
  FaCog, 
  FaSignOutAlt, 
  FaChevronDown, 
  FaMoon, 
  FaSun,
  FaShieldAlt,
  FaCompass,
  FaInfoCircle,
  FaFileContract,
  FaMoneyBillWave,
  FaLock,
  FaQuestionCircle,
  FaHandsHelping
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const dropdownRef = useRef(null);
  const aboutRef = useRef(null);

  // Check if current route is Home page
  const isHomePage = location.pathname === '/';

  // Handle Navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/auth/login');
  };

  // Determine navbar styling based on route and scroll state
  const isTransparent = isHomePage && !scrolled;
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        isTransparent
          ? 'bg-transparent text-white py-5'
          : 'bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <FaCompass className="text-xl animate-spin-slow" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Travel<span className="text-cyan-500">Go</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider">
          <Link
            to="/"
            className={`transition-colors hover:text-cyan-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            Home
          </Link>
          
          <Link
            to="/destinations"
            className={`transition-colors hover:text-cyan-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            Popular Destinations
          </Link>
           <Link
            to="/packages"
            className={`transition-colors hover:text-cyan-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            ALL PACKAGES
          </Link>

          {/* About Dropdown Menu */}
          <div className="relative" ref={aboutRef}>
            <button
              type="button"
              onClick={() => setAboutOpen(!aboutOpen)}
              className={`flex items-center gap-1.5 transition-colors hover:text-cyan-500 ${
                isTransparent ? 'text-white/90' : 'text-slate-600'
              }`}
            >
              <span>ABOUT US</span>
              <FaChevronDown
                className={`text-[9px] transition-transform duration-200 ${
                  aboutOpen ? 'rotate-180 text-cyan-500' : ''
                }`}
              />
            </button>

            {/* Clean Standard About Popover Dropdown */}
            {aboutOpen && (
              <div className="absolute left-0 mt-3 w-56 rounded-xl bg-white text-slate-800 shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 normal-case font-medium text-xs">
                <Link
                  to="/about"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                >
                  <FaInfoCircle className="text-slate-400 text-sm" />
                  <span>About Us</span>
                </Link>

                <Link
                  to="/cancellation-policy"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                >
                  <FaMoneyBillWave className="text-slate-400 text-sm" />
                  <span>Cancellation & Refunds</span>
                </Link>

                <Link
                  to="/terms"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                >
                  <FaFileContract className="text-slate-400 text-sm" />
                  <span>Terms & Conditions</span>
                </Link>

                <Link
                  to="/privacy-policy"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                >
                  <FaLock className="text-slate-400 text-sm" />
                  <span>Privacy Policy</span>
                </Link>

                <Link
                  to="/safety"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                >
                  <FaHandsHelping className="text-slate-400 text-sm" />
                  <span>Safety & Trust</span>
                </Link>

                <Link
                  to="/faqs"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                >
                  <FaQuestionCircle className="text-slate-400 text-sm" />
                  <span>Help & FAQs</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className={`transition-colors hover:text-cyan-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* User / Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            /* Refined Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2.5 p-1.5 pl-3 rounded-full transition-all border ${
                  isTransparent
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-inner">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-bold max-w-[100px] truncate hidden sm:inline-block">
                  {user.name || 'Account'}
                </span>
                <FaChevronDown
                  className={`text-[10px] transition-transform duration-200 mr-1 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Sleek Modern Dropdown Card */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* User Info Header */}
                  <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.name || 'Traveler'}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-0.5">
                    {isAdminOrStaff ? (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <FaShieldAlt className="text-blue-500 text-sm" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <FaUser className="text-slate-400 text-sm" />
                          View Profile
                        </Link>

                        <Link
                          to="/booking-history"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <FaSuitcase className="text-slate-400 text-sm" />
                          My Bookings
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <FaCog className="text-slate-400 text-sm" />
                          Settings
                        </Link>
                      </>
                    )}

                    {/* Quick Theme Toggle Option */}
                    <button
                      type="button"
                      onClick={() => setDarkMode(!darkMode)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        {darkMode ? (
                          <FaSun className="text-amber-500 text-sm" />
                        ) : (
                          <FaMoon className="text-slate-400 text-sm" />
                        )}
                        Appearance
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {darkMode ? 'Dark' : 'Light'}
                      </span>
                    </button>
                  </div>

                  {/* Logout Action */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <FaSignOutAlt className="text-rose-500 text-sm" />
                      Sign Out
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}