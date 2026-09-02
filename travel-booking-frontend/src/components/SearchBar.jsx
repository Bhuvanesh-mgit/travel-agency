import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('1 Guest');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({ destination, date, guests });
    // TODO: Trigger search filtering or navigate to /packages?destination=...
  };

  return (
    <div className="relative z-30 max-w-5xl mx-auto px-4 -mt-12 sm:-mt-16">
      <form
        onSubmit={handleSearch}
        className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
      >
        {/* 1. Destination Input */}
        <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-white transition">
          <FaMapMarkerAlt className="text-blue-600 text-lg shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Where to?
            </label>
            <input
              type="text"
              placeholder="e.g. Thailand, Bali"
              className="bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 w-full"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Date Selection */}
        <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-white transition">
          <FaCalendarAlt className="text-cyan-500 text-lg shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              When?
            </label>
            <input
              type="date"
              className="bg-transparent outline-none text-sm font-semibold text-gray-800 w-full cursor-pointer"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* 3. Guests Selector */}
        <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-white transition">
          <FaUserFriends className="text-blue-600 text-lg shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Guests
            </label>
            <select
              className="bg-transparent outline-none text-sm font-semibold text-gray-800 w-full cursor-pointer"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              <option value="1 Guest">1 Guest</option>
              <option value="2 Guests">2 Guests</option>
              <option value="3-5 Guests">3–5 Guests</option>
              <option value="Family / Group">Family / Group (6+)</option>
            </select>
          </div>
        </div>

        {/* 4. Search Button */}
        <button
          type="submit"
          className="w-full h-full min-h-[52px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <FaSearch className="text-xs" />
          <span>Search Packages</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;