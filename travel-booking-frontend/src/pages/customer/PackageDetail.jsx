import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaUserFriends,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaShieldAlt,
  FaArrowLeft,
  FaSpinner,
  FaChild,
  FaPaperPlane,
  FaCompass,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaRoute
} from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://travel-agency-kmy6.onrender.com';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Interactive UI States
  const [selectedImage, setSelectedImage] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [guestCount, setGuestCount] = useState(null);

  // Kids Options State
  const [includeKids, setIncludeKids] = useState(false);
  const [kidsCount, setKidsCount] = useState(1);

  // Review Form States
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackageDetails();
    fetchReviews();
  }, [id]);

  const fetchPackageDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/${id}`);
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const pkg = data.data;
        setPackageData(pkg);

        const imagesList =
          pkg.gallery && pkg.gallery.length > 0
            ? pkg.gallery
            : pkg.image
            ? [pkg.image]
            : ['/uploads/packages/default-package.jpg'];
        
        setSelectedImage(resolveImageUrl(imagesList[0]));
      } else {
        setError(data.message || 'Package not found.');
      }
    } catch (err) {
      console.error('Error fetching package details:', err);
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const resolveImageUrl = (imgSrc) => {
    if (!imgSrc) return '/uploads/packages/default-package.jpg';
    if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
      return imgSrc;
    }
    const cleanPath = imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please login to post a review.');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please write a comment for your review.');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: Number(newRating),
          comment: newComment.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReviews([data.review, ...reviews]);
        setNewComment('');
        setNewRating(5);
        toast.success('Thank you! Your review has been posted.');
      } else {
        toast.error(data.message || 'Failed to post review.');
      }
    } catch (err) {
      console.error('Error posting review:', err);
      toast.error('Network error while posting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-slate-400 bg-slate-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <span className="text-xs font-mono uppercase tracking-widest font-bold">Synchronizing package data...</span>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-10 text-center bg-slate-50 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl mb-4 shadow-sm">
          !
        </div>
        <h2 className="text-2xl font-black text-slate-900">Destination Unavailable</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-sm">
          {error || `Could not find package with ID: ${id}`}
        </p>
        <button
          onClick={() => navigate('/packages')}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer"
        >
          Return to Explorations
        </button>
      </div>
    );
  }

  const rawGallery =
    packageData.gallery && packageData.gallery.length > 0
      ? packageData.gallery
      : packageData.image
      ? [packageData.image]
      : ['/uploads/packages/default-package.jpg'];

  const galleryImages = rawGallery.map((img) => resolveImageUrl(img));

  const destinationText = (() => {
    const dest = packageData.destination;
    if (typeof dest === 'object' && dest !== null) {
      return dest.name || dest.title || packageData.locationName || 'Global Destination';
    }
    if (typeof dest === 'string' && dest.trim() !== '') {
      return dest;
    }
    return packageData.locationName || 'Global Destination';
  })();

  const unitPrice = Number(packageData.salePrice || packageData.price) || 0;
  const originalPrice = Number(packageData.price) || 0;
  const hasSale = Number(packageData.salePrice) > 0 && originalPrice > unitPrice;
  const kidUnitPrice = Number(packageData.kidPrice || unitPrice * 0.5);

  const getTieredPrice = () => {
    if (!guestCount) return 0;
    
    let adultTotal = 0;
    if (packageData.paxPricing && packageData.paxPricing.length > 0) {
      const matchedTier = packageData.paxPricing.find((p) => p.pax === guestCount);
      adultTotal = matchedTier ? Number(matchedTier.price) : unitPrice * guestCount;
    } else {
      adultTotal = unitPrice * guestCount;
    }

    const kidsTotal = includeKids ? kidUnitPrice * kidsCount : 0;
    return adultTotal + kidsTotal;
  };

  const totalPrice = getTieredPrice();

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!travelDate) {
      toast.error('Please select a travel date');
      return;
    }
    if (!guestCount) {
      toast.error('Please select the number of adult travelers (Pax 1 - 10)');
      return;
    }

    navigate('/checkout', {
      state: {
        packageId: packageData._id || id,
        title: packageData.title,
        image: galleryImages[0],
        travelDate,
        guestCount,
        includeKids,
        kidsCount: includeKids ? kidsCount : 0,
        totalPrice,
        duration: packageData.duration,
      },
    });
  };

  // Duration parser for Day / Night badge calculation
  const durationObj = packageData.duration;
  const totalDays = typeof durationObj === 'object' && durationObj !== null ? (durationObj.days || packageData.itinerary?.length || 1) : (packageData.itinerary?.length || 1);
  const totalNights = typeof durationObj === 'object' && durationObj !== null ? (durationObj.nights || Math.max(0, totalDays - 1)) : Math.max(0, totalDays - 1);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm mb-8 cursor-pointer"
        >
          <FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-1" /> Back to Packages
        </button>

        {/* Title & Rating Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono uppercase tracking-wider">
              <FaMapMarkerAlt className="text-xs" /> {destinationText}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {packageData.title}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 px-4 py-3 rounded-2xl shadow-sm shrink-0">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-sm shadow-inner">
              <FaStar />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-sm">{packageData.rating || 4.8}</span>
                <span className="text-xs text-slate-400 font-mono">/5.0</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{reviews.length} Verified Reviews</p>
            </div>
          </div>
        </div>

        {/* Immersive Image Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-14">
          <div className="lg:col-span-8 h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200/80 bg-slate-100 relative group">
            <img
              src={selectedImage}
              alt={packageData.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60"></div>
            <span className="absolute bottom-6 left-6 px-4 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold shadow-lg">
              Featured View
            </span>
          </div>

          <div className="lg:col-span-4 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto max-h-[480px] pr-1">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`h-[110px] sm:h-[144px] w-full shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shadow-sm ${
                  selectedImage === img 
                    ? 'border-blue-600 scale-[0.98] shadow-md ring-4 ring-blue-500/10' 
                    : 'border-white opacity-80 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Details & Booking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Quick Spec Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-sm shrink-0">
                  <FaClock />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Duration</p>
                  <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                    {totalDays} Days / {totalNights} Nights
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-lg shadow-sm shrink-0">
                  <FaUserFriends />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Group Size</p>
                  <p className="text-xs font-extrabold text-slate-900 mt-0.5">{packageData.groupSize || 'Max 10 People'}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shadow-sm shrink-0">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Insurance</p>
                  <p className="text-xs font-extrabold text-slate-900 mt-0.5">Fully Included</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FaCompass className="text-blue-600" /> Destination Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                {packageData.overview || packageData.description || 'No overview available for this tour package.'}
              </p>
            </div>

            {/* Inclusions & Exclusions Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Inclusions Card */}
              {Array.isArray(packageData.inclusions) && packageData.inclusions.length > 0 && (
                <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs"><FaCheck /></span> 
                    What's Included
                  </h3>
                  <ul className="space-y-2.5">
                    {packageData.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions Card */}
              {Array.isArray(packageData.exclusions) && packageData.exclusions.length > 0 && (
                <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs"><FaTimes /></span> 
                    What's Excluded
                  </h3>
                  <ul className="space-y-2.5">
                    {packageData.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                        <span className="text-rose-500 font-bold mt-0.5">✕</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            
           {/* ⭐ CLEAN MODERN ITINERARY CARD UI ⭐ */}
{Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0 && (
  <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
      <div>
        <h3 className="text-lg font-black text-slate-900">Day-by-Day Itinerary & Schedule</h3>
        <p className="text-xs text-slate-500 mt-0.5">Structured day and night breakdown</p>
      </div>
      <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold w-fit shadow-2xs">
        <FaRoute /> {totalDays} Days / {totalNights} Nights Tour
      </div>
    </div>

    <div className="space-y-6">
      {packageData.itinerary.map((step, idx) => {
        const dayLabel = step.day ? (String(step.day).toLowerCase().includes('day') ? step.day : `Day ${step.day}`) : `Day ${idx + 1}`;

        return (
          <div key={idx} className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40 border border-slate-200/80 shadow-xs space-y-4 transition-all hover:border-blue-300 hover:shadow-md">
            
            {/* Header: Day Badge & Title Stacking Together */}
            <div className="flex flex-col items-start gap-2 border-b border-slate-100 pb-4">
              <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold text-[11px] tracking-wider uppercase shadow-xs">
                {dayLabel}
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {step.title}
              </h4>
            </div>

            {/* Description */}
            {step.description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {step.description}
              </p>
            )}

            {/* Activities Tags */}
            {step.activities && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1.5">
                  <FaSun className="text-amber-500 text-xs" /> Activities:
                </span>
                {Array.isArray(step.activities) ? (
                  step.activities.map((act, actIdx) => (
                    <span key={actIdx} className="px-3 py-1 rounded-xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
                      {act}
                    </span>
                  ))
                ) : (
                  String(step.activities).split(',').map((act, actIdx) => (
                    <span key={actIdx} className="px-3 py-1 rounded-xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
                      {act.trim()}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

            {/* ⭐ RATINGS & REVIEWS SECTION ⭐ */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Traveler Ratings & Reviews</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real feedback from verified globetrotters</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-4 py-2 rounded-2xl">
                  <FaStar className="text-amber-400 text-sm" />
                  <span className="text-xs font-black text-slate-900">{packageData.rating || 4.8} / 5.0</span>
                </div>
              </div>

              {/* Review Cards List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/15">
                            {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900">{rev.name || 'Anonymous'}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{rev.date || 'Recent'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs bg-white px-3 py-1 rounded-xl border border-slate-200/60 shadow-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(rev.rating) ? 'text-amber-400' : 'text-slate-200'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No reviews yet. Be the first explorer to leave feedback!</p>
                )}
              </div>

              {/* Write Review Form */}
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/60 space-y-5">
                <h4 className="text-sm font-black text-slate-900">Leave Your Experience Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">Rating Score</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="5">★★★★★ (5/5 - Outstanding Journey)</option>
                      <option value="4">★★★★☆ (4/5 - Great Experience)</option>
                      <option value="3">★★★☆☆ (3/5 - Good)</option>
                      <option value="2">★★☆☆☆ (2/5 - Fair)</option>
                      <option value="1">★☆☆☆☆ (1/5 - Poor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">Your Review Comment</label>
                    <textarea
                      rows={4}
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share details regarding your guide, itinerary flow, sights, and accommodation..."
                      className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 resize-none shadow-xs"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FaPaperPlane className="text-[10px]" /> {submittingReview ? 'Transmitting Review...' : 'Post Verified Review'}
                  </button>
                </form>
              </div>

            </div>

          </div>

          {/* Right Column: Sticky Booking Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 space-y-6">
              
              {/* Price Header */}
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                    Investment
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-blue-600">₹{unitPrice}</span>
                    {hasSale && (
                      <span className="text-sm text-slate-400 line-through font-medium">
                        ₹{originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-normal">/ guest</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase font-mono px-3 py-1 rounded-full border border-emerald-200/60 shadow-xs">
                  Instant Confirmation
                </span>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">
                    Select Departure Date
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition shadow-xs">
                    <FaCalendarAlt className="text-slate-400 text-sm" />
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="bg-transparent outline-none text-xs font-bold text-slate-800 w-full cursor-pointer"
                    />
                  </div>
                </div>

                {/* Pax 1 to 10 Rate Selection Grid */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-bold">
                    Select Adult Travelers (Pax 1 - 10) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((paxNum) => {
                      const tier = packageData.paxPricing?.find((p) => p.pax === paxNum);
                      const tierPrice = tier ? tier.price : unitPrice * paxNum;

                      return (
                        <button
                          key={paxNum}
                          type="button"
                          onClick={() => setGuestCount(paxNum)}
                          className={`py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                            guestCount === paxNum
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-slate-100/60'
                          }`}
                        >
                          <span className="font-black">{paxNum}</span>
                          <span className={`text-[11px] font-mono ${guestCount === paxNum ? 'text-blue-100' : 'text-slate-400'}`}>
                            ₹{tierPrice}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Kids Rate Section */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 shadow-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <FaChild className="text-blue-600 text-sm" />
                      <span className="text-xs font-bold text-slate-800">Traveling with Children?</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeKids}
                      onChange={(e) => setIncludeKids(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer accent-blue-600"
                    />
                  </label>

                  {includeKids && (
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-700">Number of Kids</p>
                        <p className="text-[10px] text-slate-400 font-mono">₹{kidUnitPrice} / kid</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setKidsCount(Math.max(1, kidsCount - 1))}
                          className="w-7 h-7 rounded-xl bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-slate-900 w-4 text-center">{kidsCount}</span>
                        <button
                          type="button"
                          onClick={() => setKidsCount(kidsCount + 1)}
                          className="w-7 h-7 rounded-xl bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Totals */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Adult Travelers</span>
                    <span className="text-slate-800 font-bold">{guestCount ? `${guestCount} Adult(s)` : 'None selected'}</span>
                  </div>
                  {includeKids && (
                    <div className="flex justify-between">
                      <span>Children Rate</span>
                      <span className="text-slate-800 font-bold">{kidsCount} Kid(s) (₹{includeKids ? kidUnitPrice * kidsCount : 0})</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service & Taxes</span>
                    <span className="text-emerald-600 font-bold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total Investment</span>
                    <span className="text-blue-600">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                    guestCount 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/25 active:scale-[0.98] cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {guestCount ? (
                    <>
                      <FaCheckCircle className="text-sm" /> Proceed & Reserve Securely
                    </>
                  ) : (
                    'Please Select Traveler Pax'
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}