import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png';
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
  FaInfoCircle,
  FaFileContract,
  FaMoneyBillWave,
  FaLock,
  FaQuestionCircle,
  FaHandsHelping,
  FaBars,
  FaTimes
} from 'react-icons/fa';

import { toast } from 'react-toastify';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔑 1. Initialize Dark Mode state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const dropdownRef = useRef(null);
  const aboutRef = useRef(null);

  const isHomePage = location.pathname === '/';

  // Sync dark mode class with root html element and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setAboutOpen(false);
  }, [location.pathname]);

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
    toast.success('Logged out successfully!', { autoClose: 2000 });
    setProfileOpen(false);
    logout();
    navigate('/auth/login');
  };

  const handleContactClick = (e) => {
    const token = localStorage.getItem('token') || user;
    if (!token) {
      e.preventDefault();
      toast.error('Please sign in to access the Contact page.', { autoClose: 3000 });
      setTimeout(() => {
        navigate('/auth/login');
      }, 1900);
    }
  };

  const isTransparent = isHomePage && !scrolled;
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        isTransparent
          ? 'bg-transparent text-white py-5'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-sm border-b border-slate-100 dark:border-slate-800 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-extrabold tracking-tight">
            <img src={logo} alt="TravelGo Logo" width={150} />
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider">
          <Link
            to="/"
            className={`transition-colors hover:text-cyan-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Home
          </Link>
          
          <Link
            to="/destinations"
            className={`transition-colors hover:text-cyan-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Popular Destinations
          </Link>
          <Link
            to="/packages"
            className={`transition-colors hover:text-cyan-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'
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
                isTransparent ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>ABOUT US</span>
              <FaChevronDown
                className={`text-[9px] transition-transform duration-200 ${
                  aboutOpen ? 'rotate-180 text-cyan-500' : ''
                }`}
              />
            </button>

            {aboutOpen && (
              <div className="absolute left-0 mt-3 w-56 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-100 dark:border-slate-800 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 normal-case font-medium text-xs">
                <Link
                  to="/about"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 transition-colors"
                >
                  <FaInfoCircle className="text-slate-400 text-sm" />
                  <span>About Us</span>
                </Link>
                <Link
                  to="/cancel-refund"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 transition-colors"
                >
                  <FaMoneyBillWave className="text-slate-400 text-sm" />
                  <span>Cancellation & Refunds</span>
                </Link>
                <Link
                  to="/terms"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 transition-colors"
                >
                  <FaFileContract className="text-slate-400 text-sm" />
                  <span>Terms & Conditions</span>
                </Link>
                <Link
                  to="/privacy"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 transition-colors"
                >
                  <FaLock className="text-slate-400 text-sm" />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  to="/safety"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 transition-colors"
                >
                  <FaHandsHelping className="text-slate-400 text-sm" />
                  <span>Safety & Trust</span>
                </Link>
                <Link
                  to="/help-faq"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 transition-colors"
                >
                  <FaQuestionCircle className="text-slate-400 text-sm" />
                  <span>Help & FAQs</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/contact"
            onClick={handleContactClick}
            className={`transition-colors hover:text-cyan-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* User Actions & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
             <button
  type="button"
  onClick={() => setProfileOpen(!profileOpen)}
  className={`flex items-center gap-2.5 p-1.5 pl-3 rounded-full transition-all border ${
    isTransparent
      ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
  }`}
>
  {/* 🔑 Avatar Display with Initial Fallback */}
  <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-inner">
    {user?.avatar ? (
      <img 
        src={user.avatar} 
        alt={user.name || 'User'} 
        className="w-full h-full object-cover" 
      />
    ) : (
      <span>{user?.name ? user.name.charAt(0) : 'U'}</span>
    )}
  </div>

  <span className="text-xs font-bold max-w-[100px] truncate hidden sm:inline-block">
    {user?.name || 'Account'}
  </span>
  <FaChevronDown
    className={`text-[10px] transition-transform duration-200 mr-1 ${
      profileOpen ? 'rotate-180' : ''
    }`}
  />
</button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
  {user?.avatar ? (
    <img 
      src={user.avatar} 
      alt={user?.name || 'User'} 
      className="w-full h-full object-cover" 
    />
  ) : (
    <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
  )}
</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name || 'Traveler'}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 space-y-0.5">
                    {isAdminOrStaff ? (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FaShieldAlt className="text-blue-500 text-sm" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <FaUser className="text-slate-400 text-sm" />
                          View Profile
                        </Link>
                        <Link
                          to="/booking-history"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <FaSuitcase className="text-slate-400 text-sm" />
                          My Bookings
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <FaCog className="text-slate-400 text-sm" />
                          Settings
                        </Link>
                      </>
                    )}

                    {/* 🔑 Functional Dark Mode Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setDarkMode(!darkMode)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        {darkMode ? <FaSun className="text-amber-500 text-sm" /> : <FaMoon className="text-slate-400 text-sm" />}
                        Appearance
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {darkMode ? 'Dark' : 'Light'}
                      </span>
                    </button>
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <FaSignOutAlt className="text-rose-500 text-sm" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/auth/login"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isTransparent ? 'text-white hover:bg-white/10' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
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

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl border transition-colors ${
              isTransparent
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl border-t border-slate-100 dark:border-slate-800 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider">
            <Link to="/" className="px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
              Home
            </Link>
            <Link to="/destinations" className="px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
              Popular Destinations
            </Link>
            <Link to="/packages" className="px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
              All Packages
            </Link>
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 pb-1 text-slate-400 text-[10px]">Company & Policies</div>
            <Link to="/about" className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 normal-case font-medium">
              About Us
            </Link>
            <Link to="/cancel-refund" className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 normal-case font-medium">
              Cancellation & Refunds
            </Link>
            <Link to="/terms" className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 normal-case font-medium">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 normal-case font-medium">
              Privacy Policy
            </Link>
            <Link to="/safety" className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 normal-case font-medium">
              Safety & Trust
            </Link>
            <Link to="/help-faq" className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 normal-case font-medium">
              Help & FAQs
            </Link>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
              <Link 
                to="/contact" 
                onClick={handleContactClick}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 block uppercase font-bold"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {!user && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
              <Link
                to="/auth/login"
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}