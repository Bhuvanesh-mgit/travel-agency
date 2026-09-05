import React from 'react';
import Hero from '../../components/customer/HeroBanner';
import SearchBar from '../../components/SearchBar';
import Destination from './Destination';
import TestimonialCard from '../../components/customer/TestimonialCard';
import EnquiryModal from './EnquiryModel';


const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-13">
      {/* 1. Hero Banner Video Slider */}
      <Hero />

      {/* 2. Floating Search Filter Bar */}
      <SearchBar />

      {/* 3. Popular Destinations Grid */}
      <Destination  />
      <EnquiryModal/>
    
      <TestimonialCard/>
    </div>
  );
};

export default Home;