import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// -----------------------------------------------------------------------------
// CUSTOMER ROUTES (Requires Login)
// -----------------------------------------------------------------------------

// @route   POST /api/bookings
// @desc    Create a new trip booking
// @access  Private (Customer)
router.post('/', protect, createBooking);

// @route   GET /api/bookings/my-bookings
// @desc    Get all bookings for the currently logged-in user
// @access  Private (Customer)
router.get('/my-bookings', protect, getMyBookings);


// -----------------------------------------------------------------------------
// ADMIN & STAFF ROUTES (Requires Login + Specific Role)
// -----------------------------------------------------------------------------

// @route   GET /api/bookings
// @desc    Get all customer bookings across the system
// @access  Private (Admin & Staff)
router.get('/', protect, authorizeRoles('admin', 'staff'), getAllBookings);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking or payment status (e.g., confirm, cancel, mark paid)
// @access  Private (Admin & Staff)
router.put('/:id/status', protect, authorizeRoles('admin', 'staff'), updateBookingStatus);

export default router;