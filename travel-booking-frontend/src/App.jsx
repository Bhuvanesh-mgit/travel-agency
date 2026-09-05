import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Wrappers
import MainLayout from './components/layout/MainLayout';     // Customer Navbar + Footer
import AdminLayout from './pages/admin/adminLayout/AdminLayout';   // Admin/Staff Sidebar + Topbar
import AuthLayout from './pages/auth/AuthLayout';     // Clean center box layout

// Route Guard
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Customer Pages
import Home from './pages/customer/Home';
import Destinations from './pages/customer/Destination';

import PackageDetails from './pages/customer/PackageDetail';
import BookingCheckout from './pages/customer/BookingCheckout';
import BookingHistory from './pages/customer/BookingHistory';
import Wishlist from './pages/customer/Wishlist';
import Profile from './pages/customer/Profile';
import BookingSuccess from './pages/customer/BookingSuccess';
import AboutUs from './pages/customer/AboutUs';
import ContactUs from './pages/customer/ContactUs';
import Privacy from './pages/customer/Privacy';
import TermsCondition from './pages/customer/TermsCondition';
import SafetyTrust from './pages/customer/SafetyTrust';
import CancelRefund from './pages/customer/CancelRefund';
import Help_faq from './pages/customer/Help_faq';

// Admin / Staff Shared & Exclusive Pages
import Dashboard from './pages/admin/DashBoard';
import ManagePackages from './pages/admin/ManagePackage';
import ManageBookings from './pages/admin/ManageBooking';
import ManageCustomers from './pages/admin/ManageCustomer';
import ManagePayments from './pages/admin/ManagePayment';
import ManageOffers from './pages/admin/ManageOffers';
import ManageDestinations from './pages/admin/ManageDestination';
import ManageStaff from './pages/admin/ManageStaff';
import Enquiry from './pages/admin/Enquiry';
// import CustomerEnquiries from './pages/admin/Enquiry';
import Reports from './pages/admin/Report';

// Fallback Page
import NotFound from './pages/NotFound';
import PackagesSection from './components/customer/PackageSection';




export default function AppRoutes() {
  
  return (
    <>
      {/* Global Toast Container for React-Toastify */}
      <ToastContainer position="top-right" autoClose={1500} />

      <Routes>
        
        {/* 1. AUTHENTICATION ROUTES (Public)          */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 2. PUBLIC CUSTOMER ROUTES                  */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path='/packages' element={<PackagesSection/>}/>
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<TermsCondition />} />
          <Route path="/safety" element={<SafetyTrust />} />
          <Route path="/cancel-refund" element={<CancelRefund />} />
          <Route path="/help-faq" element={<Help_faq />} />

          {/* CUSTOMER PROTECTED ROUTES (Requires Login) */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'staff']} />}>
            <Route path="/contact" element={<ContactUs />} /> {/* Moved here */}
            <Route path="/checkout" element={<BookingCheckout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        

        {/* 3. STAFF & ADMIN SHARED ROUTES             */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
          
          {/* Layout Parent: AdminLayout renders ONCE for all nested routes */}
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* Redirect /admin directly to /admin/dashboard */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Shared Operations */}
            <Route path="packages" element={<ManagePackages />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="Enquiries" element={<Enquiry />} />
            {/* <Route path="enquiries" element={<CustomerEnquiries />} /> */}
            <Route path="destinations" element={<ManageDestinations />} />

            {/* Admin-Only Nested Guard */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="customers" element={<ManageCustomers />} />
              <Route path="payments" element={<ManagePayments />} />
              <Route path="offers" element={<ManageOffers />} />
              <Route path="staff" element={<ManageStaff />} />
              <Route path="reports" element={<Reports />} />
            </Route>

          </Route>

        </Route>

        {/* 5. WILDCARD & REDIRECTS                    */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}