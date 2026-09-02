import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaUserFriends,
  FaCheck,
  FaCalendarAlt,
  FaShieldAlt,
  FaArrowLeft,
  FaSpinner,
  FaChild,
} from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || '';
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
  const [guestCount, setGuestCount] = useState(null); // Initially null to enforce explicit selection

  // 🔑 Kids Options State
  const [includeKids, setIncludeKids] = useState(false);
  const [kidsCount, setKidsCount] = useState(1);

  // Scroll to top and fetch package details whenever route param changes
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackageDetails();
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

        // Setup gallery images
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

  // Resolve Image Source (Supports local uploads and external URLs)
  const resolveImageUrl = (imgSrc) => {
    if (!imgSrc) return '/uploads/packages/default-package.jpg';
    if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
      return imgSrc;
    }
    const cleanPath = imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="text-xs font-bold">Loading package details...</span>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center font-sans">
        <h2 className="text-2xl font-bold text-slate-800">Package Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          {error || `Could not find package with ID: ${id}`}
        </p>
        <button
          onClick={() => navigate('/packages')}
          className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          Back to Packages
        </button>
      </div>
    );
  }

  // Gallery Array Fallback
  const rawGallery =
    packageData.gallery && packageData.gallery.length > 0
      ? packageData.gallery
      : packageData.image
      ? [packageData.image]
      : ['/uploads/packages/default-package.jpg'];

  const galleryImages = rawGallery.map((img) => resolveImageUrl(img));

  // Destination String Resolver
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

  // Price calculations
  const unitPrice = Number(packageData.salePrice || packageData.price) || 0;
  const originalPrice = Number(packageData.price) || 0;
  const hasSale = Number(packageData.salePrice) > 0 && originalPrice > unitPrice;

  // 🔑 Kids Price Calculation (Default to 50% of unit price per kid if specific kid pricing isn't defined)
  const kidUnitPrice = Number(packageData.kidPrice || unitPrice * 0.5);

  // Tiered Pricing Calculator (Adults + Optional Kids)
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

  // Redirect to Checkout with Booking State
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

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors mb-6 cursor-pointer"
        >
          <FaArrowLeft className="text-[10px]" /> Back
        </button>

        {/* Title & Rating Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              <span className="inline-flex items-center gap-1.5">
                <FaMapMarkerAlt /> {destinationText}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {packageData.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-2xl shrink-0 w-fit">
            <FaStar className="text-amber-400 text-sm" />
            <span className="font-extrabold text-slate-900 text-sm">{packageData.rating || 4.8}</span>
            <span className="text-xs text-slate-500">({packageData.reviewsCount || 0} reviews)</span>
          </div>
        </div>

        {/* Interactive Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {/* Main Hero Image */}
          <div className="lg:col-span-2 h-[340px] sm:h-[450px] rounded-3xl overflow-hidden shadow-xs border border-slate-200 bg-slate-200">
            <img
              src={selectedImage}
              alt={packageData.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[450px]">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`h-[100px] sm:h-[135px] w-full shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === img 
                    ? 'border-blue-600 scale-[0.98] shadow-md' 
                    : 'border-transparent opacity-75 hover:opacity-100'
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
          <div className="lg:col-span-7 space-y-10">
            
            {/* Quick Spec Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <FaClock className="text-blue-600 text-lg shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                  <p className="text-xs font-bold text-slate-800">
                    {typeof packageData.duration === 'object' && packageData.duration !== null
                      ? `${packageData.duration.days || 0}D / ${packageData.duration.nights || 0}N`
                      : packageData.duration || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUserFriends className="text-cyan-500 text-lg shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Group Size</p>
                  <p className="text-xs font-bold text-slate-800">{packageData.groupSize || 'Max 10 People'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <FaShieldAlt className="text-emerald-500 text-lg shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Insurance</p>
                  <p className="text-xs font-bold text-slate-800">Included</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">About Package</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {packageData.overview || packageData.description || 'No overview available for this tour package.'}
              </p>
            </div>

            {/* Inclusions */}
            {Array.isArray(packageData.inclusions) && packageData.inclusions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">What's Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packageData.inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shrink-0">
                        <FaCheck />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Tour Schedule</h3>
                <div className="space-y-3">
                  {packageData.itinerary.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
                      <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-xl text-xs font-bold shrink-0">
                        {step.day ? (String(step.day).toLowerCase().includes('day') ? step.day : `Day ${step.day}`) : `Day ${idx + 1}`}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">{step.title}</p>
                        {step.description && (
                          <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Booking Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-6">
              
              {/* Price Header */}
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Starting From
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-blue-600">₹{unitPrice}</span>
                    {hasSale && (
                      <span className="text-sm text-slate-400 line-through font-medium">
                        ₹{originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-normal">/ guest</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200/60">
                  Instant Booking
                </span>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Select Travel Date
                  </label>
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition">
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
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
                          className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                            guestCount === paxNum
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400'
                          }`}
                        >
                          <span>{paxNum} Pax</span>
                          <span className={`text-[9px] ${guestCount === paxNum ? 'text-blue-100' : 'text-slate-400'}`}>
                            ₹{tierPrice}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🔑 Optional Kids Rate Section */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FaChild className="text-blue-600 text-sm" />
                      <span className="text-xs font-bold text-slate-800">Traveling with Kids?</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeKids}
                      onChange={(e) => setIncludeKids(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer"
                    />
                  </label>

                  {includeKids && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-slate-700">Number of Kids</p>
                        <p className="text-[9px] text-slate-400">${kidUnitPrice} / kid</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setKidsCount(Math.max(1, kidsCount - 1))}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">{kidsCount}</span>
                        <button
                          type="button"
                          onClick={() => setKidsCount(kidsCount + 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Adult Travelers</span>
                    <span className="text-slate-800">{guestCount ? `${guestCount} Adult(s)` : 'None selected'}</span>
                  </div>
                  {includeKids && (
                    <div className="flex justify-between">
                      <span>Children Rate</span>
                      <span className="text-slate-800">{kidsCount} Kid(s) (₹{includeKids ? kidUnitPrice * kidsCount : 0})</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service & Taxes</span>
                    <span className="text-emerald-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Price</span>
                    <span className="text-blue-600">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all ${
                    guestCount 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/20 active:scale-[0.98] cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {guestCount ? 'Confirm & Reserve' : 'Please Select Adult Pax Option'}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}