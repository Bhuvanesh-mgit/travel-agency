import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonialsData = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Adventure Traveler",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 5,
    review: "Our trip to Bangkok and the surrounding islands was completely seamless. TravelGo handled every detail perfectly, from resort bookings to local guides.",
    location: "New York, USA"
  },
  {
    id: 2,
    name: "Alex Morgan",
    role: "Solo Explorer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 5,
    review: "The booking flow was super smooth and support answered all my questions instantly! The tour packages gave us incredible value for money.",
    location: "London, UK"
  },
  {
    id: 3,
    name: "David & Emma",
    role: "Honeymooners",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    rating: 5,
    review: "Our Thailand getaway was magical. Thanks to TravelGo for the amazing curated packages and top-tier hotel accommodations.",
    location: "Sydney, Australia"
  },
  {
    id: 4,
    name: "Rahul Sharma",
    role: "Wildlife Enthusiast",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    rating: 5,
    review: "Unbelievable experience! The local excursions and transport arrangements were completely hassle-free. Highly recommend TravelGo.",
    location: "Mumbai, India"
  },
  {
    id: 5,
    name: "Elena Rostova",
    role: "Culture Blogger",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    rating: 5,
    review: "From start to finish, booking was a breeze. I loved the custom itinerary options and the user dashboard tracking.",
    location: "Berlin, Germany"
  }
];

const TestimonialCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide effect every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, 4100);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
    );
  };

  return (
    <section 
      className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-600 bg-cyan-50 border border-cyan-100 px-3.5 py-1.5 rounded-full shadow-sm">
            Verified Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            What Our Travelers Say
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Discover real stories and unedited feedback from explorers around the globe.
          </p>
        </div>

        {/* Carousel Viewport (Hides overflowing cards) */}
        <div className="relative overflow-hidden py-4">
          
          {/* Sliding Track */}
          <div 
            className="flex transition-transform duration-700 ease-in-out gap-8"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / 3)}%)` 
            }}
          >
            {/* Map through a duplicated version to create an infinite feel */}
            {[...testimonialsData, ...testimonialsData].map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`}
                className="w-full md:w-[calc(33.333%-21.33px)] flex-shrink-0 bg-white rounded-3xl p-8 shadow-xl shadow-slate-100 border border-slate-100/80 flex flex-col justify-between relative group hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Decorative Quote Icon */}
                <div className="absolute top-6 right-6 text-slate-100 group-hover:text-cyan-50/80 transition-colors pointer-events-none">
                  <FaQuoteRight className="text-5xl" />
                </div>

                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`text-xs ${i < item.rating ? 'text-amber-400' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-8 relative z-10 font-normal">
                    "{item.review}"
                  </p>
                </div>

                {/* Customer Profile Footer */}
                <div className="flex items-center gap-4 pt-5 border-t border-slate-100">
                  <div className="relative">
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-cyan-500/10 shadow-md"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs font-medium text-slate-500">
                      {item.role} • <span className="text-cyan-600 font-semibold">{item.location}</span>
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Controls & Pagination Dots */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md flex items-center justify-center hover:bg-cyan-600 hover:text-white hover:border-cyan-600 hover:scale-105 active:scale-95 transition-all"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {/* Active Indicators */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex % testimonialsData.length === idx 
                      ? 'w-8 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm' 
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md flex items-center justify-center hover:bg-cyan-600 hover:text-white hover:border-cyan-600 hover:scale-105 active:scale-95 transition-all"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TestimonialCard;