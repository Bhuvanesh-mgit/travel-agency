import React, { useState, useEffect } from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  // Fetch all destinations from MongoDB backend
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const heroEndpoint = `${backendUrl}/api/hero`;

    fetch(heroEndpoint)
      .then((response) => response.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const formattedSlides = json.data.map((hero, index) => {
            const formatUrl = (path) => {
              if (!path) return '';
              if (path.startsWith('http://') || path.startsWith('https://')) {
                return path;
              }
              return `${backendUrl}/${path.replace(/\\/g, '/')}`;
            };

            const rawCards = (hero?.cardImages && hero.cardImages.length > 0) 
              ? hero.cardImages 
              : (hero?.cards && hero.cards.length > 0 ? hero.cards : []);
            
            const formattedCards = Array.isArray(rawCards) ? rawCards.map(formatUrl) : [];

            return {
              id: hero._id || `slide-${index}`,
              title: hero.title || '',
              description: hero.description || '',
              video: formatUrl(hero?.video || hero.videoUrl || ''),
              cards: formattedCards,
            };
          });
          setSlides(formattedSlides);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching hero data:', err);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (animating || slides.length <= 1) return;
    setAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setAnimating(false), 700);
  };

  const handlePrev = () => {
    if (animating || slides.length <= 1) return;
    setAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setAnimating(false), 700);
  };

  // Continuous auto-play timer that loops through slides every 9 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 9000);

    return () => clearInterval(timer);
  }, [slides.length, currentIndex, animating]);

  if (loading || slides.length === 0) {
    return (
      <div className="relative min-h-screen w-full bg-gray-900 flex items-center justify-center text-white -mt-20">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">Loading Hero Destinations...</h2>
        </div>
      </div>
    );
  }

  const activeSlide = slides[currentIndex];
  const total = slides.length;
  const frontSlide = slides[currentIndex];
  const middleSlide = slides[(currentIndex + 1) % total];
  const backSlide = slides[(currentIndex + 2) % total];

  const frontImage = frontSlide.cards[0] || '';
  const middleImage = middleSlide.cards[0] || frontSlide.cards[1] || frontImage;
  const backImage = backSlide.cards[0] || frontSlide.cards[2] || middleImage;

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white font-sans -mt-20">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          key={activeSlide.id || activeSlide.video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        >
          <source src={activeSlide.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      </div>

      {/* Main Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20 md:pb-12 grid grid-cols-12 gap-8 items-center min-h-screen">
        
        {/* Left Column - Hero Details (Completely Static & Stable) */}
        <div className="col-span-12 lg:col-span-5 space-y-4 md:space-y-6 text-center lg:text-left mt-6 lg:mt-0">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
            {activeSlide.title}
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0 drop-shadow">
            {activeSlide.description}
          </p>
          <div className="flex justify-center lg:justify-start pt-2">
            <Link to="/destinations">
              <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition shadow-lg group cursor-pointer">
                <span>Explore Destination</span>
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column - Smooth Organic Sliding Card Stack */}
        <div className="col-span-12 lg:col-span-7 relative h-[300px] sm:h-[380px] md:h-[420px] flex items-center justify-center lg:justify-end">
          
          {/* Mobile Single Card */}
          <div className="block lg:hidden w-full max-w-[280px] sm:max-w-[320px] h-full bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-2xl">
            <img 
              src={frontImage} 
              alt={activeSlide.title} 
              className={`w-full h-full object-cover rounded-xl transition-all duration-700 ease-out ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            />
          </div>

          {/* Desktop Smooth Sliding Card Stack */}
          <div className="hidden lg:flex relative w-full max-w-lg h-full items-center justify-end">
            
            {/* FRONT CARD (Gently glides out to the right and fades) */}
            <div 
              className={`absolute left-0 z-30 w-[280px] h-[350px] bg-white p-3 rounded-2xl shadow-2xl border-2 border-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${animating ? 'opacity-0 translate-x-16 scale-95' : 'opacity-100 translate-x-0 scale-100'}`}
              style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
            >
              <img 
                src={frontImage} 
                alt={`${frontSlide.title} active`} 
                className="w-full h-full object-cover rounded-xl shadow-inner"
              />
            </div>

            {/* MIDDLE CARD (Fluidly slides and expands into the main front slot) */}
            <div 
              onClick={handleNext}
              className={`absolute right-16 z-20 w-[250px] h-[325px] bg-white/20 p-2.5 rounded-2xl shadow-xl border border-white/40 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${animating ? 'translate-x-[-64px] scale-100 opacity-100 z-40 shadow-2xl bg-white p-3 border-2 border-white' : 'translate-x-0 scale-95 opacity-85 hover:opacity-100'}`}
              style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
            >
              <img 
                src={middleImage} 
                alt={`${middleSlide.title} next`} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* BACK CARD (Smoothly shifts up into the middle slot) */}
            <div 
              onClick={() => {
                if (animating) return;
                setAnimating(true);
                setCurrentIndex((currentIndex + 2) % total);
                setTimeout(() => setAnimating(false), 700);
              }}
              className={`absolute right-0 z-10 w-[220px] h-[300px] bg-white/10 p-2 rounded-2xl shadow-lg border border-white/25 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${animating ? 'translate-x-[-64px] scale-95 opacity-85' : 'translate-x-0 scale-90 opacity-60 hover:opacity-90'}`}
              style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
            >
              <img 
                src={backImage} 
                alt={`${backSlide.title} back`} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

          </div>

        </div>
      </div>

      {/* Social Icons */}
      <div className="absolute bottom-8 left-6 lg:left-12 z-20 hidden md:flex flex-col space-y-4">
        <a href="#instagram" className="p-2.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-white/20 transition border border-white/10">
          <FaInstagram className="text-white text-sm" />
        </a>
        <a href="#twitter" className="p-2.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-white/20 transition border border-white/10">
          <FaTwitter className="text-white text-sm" />
        </a>
        <a href="#facebook" className="p-2.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-white/20 transition border border-white/10">
          <FaFacebookF className="text-white text-sm" />
        </a>
      </div>

      {/* Carousel Controls & Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-4 sm:space-x-6">
        <button onClick={handlePrev} className="p-2 rounded-full bg-black/30 hover:bg-white/20 transition border border-white/20 text-white cursor-pointer">
          <FaChevronLeft className="text-xs" />
        </button>

        <div className="flex items-center space-x-3">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                if (animating || currentIndex === idx) return;
                setAnimating(true);
                setCurrentIndex(idx);
                setTimeout(() => setAnimating(false), 700);
              }}
              className={`transition-all duration-500 ease-in-out flex items-center justify-center rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 h-8 sm:w-9 sm:h-9 bg-white/30 backdrop-blur-md border border-white text-white font-bold text-xs shadow-lg'
                  : 'w-3 h-3 bg-white/50 hover:bg-white'
              }`}
            >
              {currentIndex === idx ? idx + 1 : ''}
            </button>
          ))}
        </div>

        <button onClick={handleNext} className="p-2 rounded-full bg-black/30 hover:bg-white/20 transition border border-white/20 text-white cursor-pointer">
          <FaChevronRight className="text-xs" />
        </button>
      </div>

    </div>
  );
};

export default HeroBanner;