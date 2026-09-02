import React from 'react';
import Hero from '../../components/customer/HeroBanner';
import SearchBar from '../../components/SearchBar';
import Destination from './Destination';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Hero Banner Video Slider */}
      <Hero />

      {/* 2. Floating Search Filter Bar */}
      <SearchBar />

      {/* 3. Popular Destinations Grid */}
      <Destination />
    </div>
  );
};

export default Home;