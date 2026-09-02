import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Global Navbar */}
      <Navbar />

      {/* 2. Dynamic Page Content (Home, Destination, PackageDetail, etc.) */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;