import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    // Build URL search query parameters dynamically
    const params = new URLSearchParams();
    if (destination.trim()) params.append('search', destination.trim());

    // Navigate to your packages page with query parameters
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <div className="relative z-30 max-w-3xl mx-auto px-4 -mt-12 sm:-mt-16">
      <form
        onSubmit={handleSearch}
        className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/50 flex flex-col sm:flex-row gap-3 items-center"
      >
        {/* Destination Input */}
        <div className="flex items-center gap-3 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-white transition flex-1 w-full">
          <FaMapMarkerAlt className="text-blue-600 text-lg shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Where to?
            </label>
            <input
              type="text"
              placeholder="Search destination, city, or package title..."
              className="bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 w-full"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-8 min-h-[52px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer"
        >
          <FaSearch className="text-xs" />
          <span>Search Packages</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;