import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaCamera, FaSave, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, login, backendUrl, API_URL, token } = useAuth();
  const baseUrl = backendUrl || API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'male',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);

  // Sync user context data when available
useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'male',
      });
      if (user.avatar) {
        setPreviewUrl(user?.avatar);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle local image file selection & instant preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create local preview URL
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Use FormData to handle file upload + text fields together
      const dataToSend = new FormData();
      // Only send phone (name and gender are locked/unchangeable here)
      dataToSend.append('phone', formData.phone);
      
      if (avatarFile) {
        dataToSend.append('avatar', avatarFile); // Matches multer upload field
      }

      const response = await fetch(`${baseUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        body: dataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user in auth context with the new profile data and uploaded image URL returned from backend
      login(data.user, token);
      toast.success('Profile updated successfully!');
      setAvatarFile(null);
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 relative overflow-hidden">
      
      {/* Ambient Background Accents */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-cyan-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Update your profile picture and phone number. Name, email, and gender are locked.
          </p>
        </div>

        <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white flex flex-col items-center justify-center text-center">
            
            {/* Clickable Avatar Container for Upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              title="Click to change profile picture"
            >
             <div className="w-28 h-28 rounded-full overflow-hidden bg-white/20 border-4 border-white/30 shadow-inner flex items-center justify-center text-3xl font-black uppercase transition-transform group-hover:scale-105">
  {previewUrl || user?.avatar ? (
    <img 
      src={previewUrl || user?.avatar} 
      alt={formData.name || 'User'} 
      className="w-full h-full object-cover" 
    />
  ) : (
    <span>{formData.name ? formData.name.charAt(0) : 'U'}</span>
  )}
</div>
              
              {/* Camera Icon Overlay */}
              <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <FaCamera className="text-xl" />
              </div>
            </div>

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <p className="text-[11px] text-cyan-100 mt-2 underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              Change Photo
            </p>

            <h2 className="text-lg font-extrabold mt-3 tracking-tight">{formData.name || 'TravelGo User'}</h2>
            <p className="text-xs text-cyan-100 font-medium truncate max-w-[200px] mt-0.5">{formData.email}</p>
            
            <div className="mt-5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider border border-white/20">
              Role: {user?.role || 'Customer'}
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-2 p-8 sm:p-10">
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              
              {/* Full Name (Locked) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FaUser className="text-slate-400 text-[11px]" /> Full Name</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 lowercase"><FaLock className="text-[9px]" /> locked</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.name}
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              {/* Email (Locked) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FaEnvelope className="text-slate-400 text-[11px]" /> Email Address</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 lowercase"><FaLock className="text-[9px]" /> locked</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              {/* Phone Number (Editable) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <FaPhone className="text-blue-600 text-[11px]" /> Phone Number (Editable)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition font-medium"
                />
              </div>

              {/* Gender Selection (Locked) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FaVenusMars className="text-slate-400 text-[11px]" /> Gender</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 lowercase"><FaLock className="text-[9px]" /> locked</span>
                </label>
                <select
                  disabled
                  value={formData.gender}
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 cursor-not-allowed font-medium"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Uploading & Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="text-xs" /> Save Changes
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;