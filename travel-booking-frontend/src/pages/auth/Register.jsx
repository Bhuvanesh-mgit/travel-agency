import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaGoogle, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';
import Loader from '../../components/Loader';

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.email || '',
    password: '',
    confirmPassword: '',
    secretKey: '', // Added for staff registration key
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStaffSignup, setIsStaffSignup] = useState(false); // Toggle to show Staff Key field

  const { login, backendUrl, API_URL } = useAuth();
  const baseUrl = backendUrl || API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);
    setError('');

    const minLoaderTime = new Promise((resolve) => setTimeout(resolve, 2200));

    try {
      const [response] = await Promise.all([
        fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            secretKey: isStaffSignup ? formData.secretKey : undefined, // Send secret key if staff mode is on
          }),
        }),
        minLoaderTime,
      ]);

      const data = await response.json();

      if (!response.ok) {
        if (
          data.message?.toLowerCase().includes('already exists') ||
          data.message?.toLowerCase().includes('already registered')
        ) {
          setError('Account already exists! Redirecting to Sign In...');
          setTimeout(() => {
            navigate('/auth/login', { state: { email: formData.email } });
          }, 1500);
          setLoading(false);
          return;
        }

        throw new Error(data.message || 'Registration failed');
      }

      login(data.user, data.token);
      setLoading(false);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader message="Setting up your account..." />}
      <div className="space-y-3.5">
        {/* Header */}
        <div className="space-y-0.5 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Create Account
            </h2>
            <p className="text-[11px] font-medium text-slate-500">
              Join TravelGo to unlock exclusive deals and itineraries
            </p>
          </div>
          {/* Toggle Staff Signup Button */}
          <button
            type="button"
            onClick={() => setIsStaffSignup(!isStaffSignup)}
            className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1 mt-1"
          >
            <FaUserShield /> {isStaffSignup ? 'Customer Signup' : 'Register as Staff'}
          </button>
        </div>

        {/* Compact Social Register */}
        {!isStaffSignup && (
          <>
            <div className="flex gap-1">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all shadow-sm"
              >
                <FaGoogle className="text-rose-500 text-xs" /> Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest absolute">
                or register with email
              </span>
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-2.5">
          
          {/* Staff Registration Badge Notice */}
          {isStaffSignup && (
            <div className="p-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-semibold flex items-center gap-1.5">
              <FaUserShield className="text-blue-600 flex-shrink-0" />
              <span>Staff Registration Mode Active. Enter secret staff key.</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-0.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          {/* Email */}
          <div className="space-y-0.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          {/* Staff Secret Key Field (Conditionally Rendered) */}
          {isStaffSignup && (
            <div className="space-y-0.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">
                Staff Secret Registration Key
              </label>
              <input
                type="password"
                name="secretKey"
                required={isStaffSignup}
                placeholder="Enter admin-provided secret key"
                value={formData.secretKey}
                onChange={handleChange}
                className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
          )}

          {/* Password & Confirm Password Side-by-Side */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 transition-colors text-xs"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="space-y-0.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">
                Confirm
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 transition-colors text-xs"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-[11px] text-slate-600 cursor-pointer font-medium leading-tight">
              I agree to{' '}
              <a href="#terms" className="text-blue-600 font-bold hover:underline">
                Terms
              </a>{' '}
              &{' '}
              <a href="#privacy" className="text-blue-600 font-bold hover:underline">
                Privacy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-lg uppercase tracking-wider text-[11px] shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-80 mt-1 flex items-center justify-center min-h-[40px]"
          >
            {isStaffSignup ? 'Register as Staff' : 'Create Account'}
          </button>
        </form>

        {error && (
          <div className="p-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-[11px] font-semibold text-center transition-all">
            {error}
          </div>
        )}

        {/* Login Redirect */}
        <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
}