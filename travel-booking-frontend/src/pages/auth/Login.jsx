import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Loader from '../../components/Loader';

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, backendUrl, API_URL } = useAuth();
  const navigate = useNavigate();

  const baseUrl = backendUrl || API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const minLoaderTime = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      // 🔑 SEND LOGIN REQUEST TO BACKEND API
      // The backend will check both .env super admin credentials and MongoDB users
      const [response] = await Promise.all([
        fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }),
        minLoaderTime,
      ]);

      const data = await response.json();

      if (!response.ok) {
        if (
          data.message?.toLowerCase().includes('not found') ||
          data.message?.toLowerCase().includes('no account')
        ) {
          setLoading(false);
          setError('Account not found in database. Redirecting to Create Account...');

          setTimeout(() => {
            navigate('/auth/register', { state: { email } });
          }, 2200);

          return;
        }

        throw new Error(data.message || 'Invalid email or password');
      }

      // Store the real signed JWT token issued by the backend
      login(data.user, data.token);
      setLoading(false);

      if (data.user.role === 'admin' || data.user.role === 'staff' || data.user.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Direct local Loader overlay */}
      {loading && <Loader message="Logging into TravelGo..." />}

      <div className="space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Enter your email and password to access your account
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <FaGoogle className="text-rose-500 text-sm" /> Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
            or
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 text-[11px] font-bold transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-80 mt-2 flex items-center justify-center min-h-[48px]"
          >
            Sign In
          </button>

        </form>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold text-center transition-all animate-fadeIn">
            {error}
          </div>
        )}

        {/* Register Link */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            Create Account
          </Link>
        </div>

      </div>
    </>
  );
}