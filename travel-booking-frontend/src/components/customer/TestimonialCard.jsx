import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteRight, FaSpinner } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://travel-agency-kmy6.onrender.com';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

const TestimonialCard = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Handle responsive card count per view on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all reviews dynamically from backend on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/reviews`);
      const data = await response.json();

      if (response.ok && data.success && data.reviews?.length > 0) {
        // Sort latest reviews first (newest date/timestamp at the top)
        const sortedReviews = data.reviews.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

        // Deduplicate by user name (keeping their most recent review)
        const uniqueReviews = Array.from(
          new Map(sortedReviews.map(item => [item.name, item])).values()
        );

        setTestimonials(uniqueReviews);
      } else {
        // Fallback default testimonials if database is empty
        setTestimonials([
          {
            id: 1,
            name: "Sarah Jenkins",
            role: "Adventure Traveler",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            rating: 5,
            comment: "Our trip to Bangkok and the surrounding islands was completely seamless. TravelGo handled every detail perfectly, from resort bookings to local guides.",
            location: "New York, USA"
          },
          {
            id: 2,
            name: "Alex Morgan",
            role: "Solo Explorer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            rating: 5,
            comment: "The booking flow was super smooth and support answered all my questions instantly! The tour packages gave us incredible value for money.",
            location: "London, UK"
          },
          {
            id: 3,
            name: "David & Emma",
            role: "Honeymooners",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            rating: 5,
            comment: "Our Thailand getaway was magical. Thanks to TravelGo for the amazing curated packages and top-tier hotel accommodations.",
            location: "Sydney, Australia"
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
          <FaSpinner className="animate-spin text-xl" /> Loading traveler reviews...
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section 
      className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full shadow-2xs">
            Verified Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
            What Our Travelers Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            Discover real stories and unedited feedback posted live by recent explorers around the globe.
          </p>
        </div>

        {/* Carousel Viewport */}
        <div className="relative overflow-hidden py-4 px-2">
          
          {/* Sliding Track with Smooth Cubic Bezier Transition */}
          <div 
            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] gap-6"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` 
            }}
          >
            {/* Infinite loop mapping helper */}
            {[...testimonials, ...testimonials, ...testimonials].map((item, idx) => (
              <div 
                key={`${item._id || item.id}-${idx}`}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 border border-slate-100/80 flex flex-col justify-between relative group hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Decorative Quote Icon */}
                <div className="absolute top-6 right-6 text-slate-100 group-hover:text-blue-50 transition-colors pointer-events-none">
                  <FaQuoteRight className="text-4xl sm:text-5xl" />
                </div>

                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-4 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`text-xs ${i < item.rating ? 'text-amber-400' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 relative z-10 font-normal">
                    "{item.comment || item.review}"
                  </p>
                </div>

                {/* Customer Profile Footer */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                  <div className="relative shrink-0">
                    <img 
                      src={item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} 
                      alt={item.name} 
                      className="w-11 h-11 rounded-full object-cover ring-4 ring-blue-500/10 shadow-xs bg-slate-100"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[11px] font-medium text-slate-500 truncate">
                      {item.role || 'Verified Explorer'} • <span className="text-blue-600 font-semibold">{item.date || item.location || 'Recent'}</span>
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Centered Dot-Only Pagination Indicators */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {testimonials.map((_, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  currentIndex % testimonials.length === idx 
                    ? 'w-8 bg-blue-600 shadow-sm' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default TestimonialCard;