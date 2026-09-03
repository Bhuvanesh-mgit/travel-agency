import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaRobot, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate backend enquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Enquiry transmitted successfully! Our team will respond shortly.');
      
      // Reset form after a brief moment
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 relative overflow-hidden">
      
      {/* Ambient Background Accents */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-cyan-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono uppercase tracking-widest mb-4 shadow-sm">
          <FaRobot className="text-sm text-cyan-600 animate-pulse" /> 24/7 AI & Human Support Desk
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch With Us
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-3 max-w-xl mx-auto">
          Have questions regarding an itinerary, booking status, or custom package? Transmit your query below for instant routing.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Side: Contact Information Cards */}
        <div className="space-y-4 lg:col-span-1">
          
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-lg shrink-0 shadow-sm">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Headquarters</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                TravelGo Tech Hub, Cyber Park Avenue, Kochi, Kerala, India - 682030
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0 shadow-sm">
              <FaPhoneAlt />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Direct Line</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                +91 (484) 555-TRAVEL<br />Mon - Sat: 9:00 AM - 7:00 PM IST
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0 shadow-sm">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Secure Dispatch</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                support@travelgo.com<br />enquiries@travelgo.com
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-6 rounded-3xl text-white shadow-xl shadow-blue-500/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-100">
              <FaClock /> Response Time
            </div>
            <h4 className="text-base font-bold">Under 2 Hours</h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              Our AI assistant processes enquiries instantaneously, followed by human travel expert verification.
            </p>
          </div>

        </div>

        {/* Right Side: Interactive Enquiry Form */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Send an Official Enquiry</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Your Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Bhuvanesh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Subject / Package Interest</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Booking Enquiry for Bangkok Tour Package"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Message / Details</label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your travel dates, group size, or specific requirements..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                submitted 
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {submitted ? (
                <>
                  <FaCheckCircle className="text-sm" /> Transmission Successful!
                </>
              ) : isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Transmitting Payload...
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-xs" /> Submit Secure Enquiry
                </>
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default ContactUs;