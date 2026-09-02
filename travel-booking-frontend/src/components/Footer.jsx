import React from 'react';
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                ✈️
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-wide text-white">
                  Travel<span className="text-cyan-400">Go</span>
                </h2>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 -mt-1 font-medium">
                  Explore Without Limits
                </p>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Discover extraordinary destinations, curated travel packages, and seamless booking experiences tailored just for you.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-cyan-500 hover:text-white flex items-center justify-center transition-all duration-300 text-gray-400">
                <FaInstagram className="text-sm" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-cyan-500 hover:text-white flex items-center justify-center transition-all duration-300 text-gray-400">
                <FaTwitter className="text-sm" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-cyan-500 hover:text-white flex items-center justify-center transition-all duration-300 text-gray-400">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-cyan-500 hover:text-white flex items-center justify-center transition-all duration-300 text-gray-400">
                <FaYoutube className="text-sm" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition">About Us</Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-cyan-400 transition">Popular Destinations</Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-cyan-400 transition">Tour Packages</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-cyan-400 mt-1 shrink-0" />
                <span>123 Travel Avenue, Suite 400, New York, NY</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhoneAlt className="text-cyan-400 shrink-0" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-cyan-400 shrink-0" />
                <span>support@travelgo.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide">Newsletter</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Subscribe to receive updates on exclusive deals and seasonal travel discounts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 rounded-lg flex items-center justify-center hover:scale-105 transition-all"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} TravelGo Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-gray-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-400 transition">Terms of Service</Link>
            <Link to="/faqs" className="hover:text-gray-400 transition">Help & FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;