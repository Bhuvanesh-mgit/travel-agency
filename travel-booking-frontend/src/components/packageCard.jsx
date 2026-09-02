import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaStar, 
  FaArrowRight, 
  FaCheckCircle 
} from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

export default function PackageCard({ packageData }) {
  const navigate = useNavigate();

  if (!packageData) return null;

  const {
    _id,
    id,
    title,
    destination,
    locationName,
    duration,
    rating = 4.8,
    reviewsCount = 0,
    price = 0,
    salePrice = 0,
    isFeatured = false,
    featured = false,
    category = 'Holiday',
    image,
    inclusions = []
  } = packageData;

  const targetId = _id || id;

  // 🔑 SAFE STRING RESOLVER: Ensures destinationText is NEVER a React object
  const destinationId = typeof destination === 'object' && destination !== null ? destination._id || destination.id : destination;
  
  const destinationText = (() => {
    if (typeof destination === 'object' && destination !== null) {
      return destination.name || destination.title || locationName || 'Global Destination';
    }
    if (typeof destination === 'string' && destination.trim() !== '') {
      return destination;
    }
    return locationName || 'Global Destination';
  })();

  const handleDestinationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (destinationId && typeof destinationId === 'string' && destinationId.length > 5) {
      navigate(`/packages?destination=${destinationId}`);
    } else if (destination && typeof destination === 'object' && destination._id) {
      navigate(`/packages?destination=${destination._id}`);
    } else {
      navigate(`/packages?search=${encodeURIComponent(destinationText)}`);
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

  const displayImage = resolveImageUrl(image);

  let durationText = '';
  if (typeof duration === 'object' && duration !== null) {
    const d = duration.days || 0;
    const n = duration.nights || 0;
    durationText = d > 0 ? `${d}D / ${n}N` : '';
  } else if (typeof duration === 'string') {
    durationText = duration;
  }

  const numPrice = Number(price) || 0;
  const numSalePrice = Number(salePrice) || 0;
  const hasSale = numSalePrice > 0 && numPrice > numSalePrice;

  const discountPercent = hasSale
    ? Math.round(((numPrice - numSalePrice) / numPrice) * 100)
    : 0;

  const displayPrice = hasSale ? numSalePrice : numPrice;
  const isFeaturedBadge = isFeatured || featured;

  return (
    <Link 
      to={`/packages/${targetId}`}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={title || 'Tour Package'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/uploads/packages/default-package.jpg';
          }}
        />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {isFeaturedBadge ? (
            <span className="px-2.5 py-1 rounded-xl bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
              Featured
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
              {category}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-xs border border-slate-100">
          <FaStar className="text-amber-400 text-xs" />
          <span className="text-xs font-bold text-slate-800">
            {rating}
          </span>
          {reviewsCount > 0 && (
            <span className="text-[10px] text-slate-500 font-medium">
              ({reviewsCount})
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            
            <button
              type="button"
              onClick={handleDestinationClick}
              className="flex items-center gap-1.5 truncate max-w-[65%] text-blue-600 hover:text-blue-800 hover:underline font-bold uppercase tracking-wider text-[10px] cursor-pointer border-none bg-transparent p-0 z-20"
              title={`View all packages in ${destinationText}`}
            >
              <FaMapMarkerAlt className="shrink-0 text-blue-600" />
              <span className="truncate">{destinationText}</span>
            </button>

            {durationText && (
              <span className="flex items-center gap-1 shrink-0 bg-slate-100 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
                <FaClock className="text-slate-400 text-[10px]" />
                {durationText}
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </div>

        {Array.isArray(inclusions) && inclusions.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            {inclusions.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600"
              >
                <FaCheckCircle className="text-emerald-500 text-[9px]" />
                {item}
              </span>
            ))}
            {inclusions.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{inclusions.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Starting From
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-900">
                ${displayPrice}
              </span>
              {hasSale && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ${numPrice}
                </span>
              )}
              <span className="text-[10px] text-slate-500 font-normal">/ guest</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all">
            <span>Explore</span>
            <FaArrowRight className="text-[10px]" />
          </span>
        </div>
      </div>
    </Link>
  );
}