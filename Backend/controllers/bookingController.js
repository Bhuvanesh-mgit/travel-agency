import Booking from '../models/bookingModel.js';
import Package from '../models/packageModel.js';

// Helper function to generate a random uppercase booking reference code
const generateBookingRef = () => {
  return 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create a new booking (Customer)
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    // 👈 Added 'phone' here to destructure from req.body
    const { packageId, travelDate, travelers, kidsCount, totalPrice, specialRequests, phone } = req.body;

    // 1. Check if package exists
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ 
        success: false, 
        message: 'Selected travel package not found.' 
      });
    }

    // 2. Verify seat availability (Adults + Kids)
    const numTravelers = Number(travelers) || 1;
    const numKids = Number(kidsCount) || 0;
    const totalGuests = numTravelers + numKids;

    if (pkg.availableSeats !== undefined && pkg.availableSeats < totalGuests) {
      return res.status(400).json({
        success: false,
        message: `Only ${pkg.availableSeats} seat(s) remaining for this package.`
      });
    }

    // 3. Use the exact totalPrice passed from the frontend (Tier price + Kids price)
    const unitPrice = pkg.salePrice && pkg.salePrice > 0 ? pkg.salePrice : pkg.price;
    const finalTotalPrice = totalPrice !== undefined && !isNaN(totalPrice) ? Number(totalPrice) : (unitPrice * numTravelers);

    // 4. Create booking entry with unique reference
    const booking = await Booking.create({
      bookingRef: generateBookingRef(),
      user: req.user._id,
      package: packageId,
      travelDate,
      travelers: numTravelers,
      kidsCount: numKids,
      totalPrice: finalTotalPrice,
      phone: phone || req.user.phone || '', // 👈 Saves submitted phone or falls back to user profile phone
      specialRequests: specialRequests || '',
      paymentStatus: 'pending',
      bookingStatus: 'confirmed',
    });

    // 5. Deduct total seats from package
    if (pkg.availableSeats !== undefined) {
      pkg.availableSeats -= totalGuests;
      await pkg.save();
    }

    // Populate package details before returning
    const populatedBooking = await Booking.findById(booking._id).populate('package', 'title price salePrice image destination duration');

    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully!',
      data: populatedBooking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's bookings (or all bookings if admin/staff)
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    let query = {};

    const isAdminOrStaff = req.user.role === 'admin' || req.user.role === 'staff' || req.user._id === 'admin_env_id';
    
    if (!isAdminOrStaff) {
      // 🔑 Show bookings that are PAID OR CANCELLED (hiding unpaid abandoned checkouts)
      query = { 
        user: req.user._id,
        $or: [
          { paymentStatus: 'paid' },
          { bookingStatus: 'cancelled' }
        ]
      };
    }

    const bookings = await Booking.find(query)
      .populate('package', 'title image destination duration price salePrice locationName')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('package');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role === 'customer') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking.' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking (Customer)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer)
export const cancelMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Restore available seats back to the package
    const pkg = await Package.findById(booking.package);
    if (pkg && pkg.availableSeats !== undefined) {
      const restoredSeats = (booking.travelers || 1) + (booking.kidsCount || 0);
      pkg.availableSeats += restoredSeats;
      await pkg.save();
    }

    res.json({ success: true, message: 'Booking cancelled successfully.', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings across system (Admin/Staff)
// @route   GET /api/bookings
// @access  Private (Admin & Staff)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('package', 'title price destination')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking or payment status (Admin/Staff)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin & Staff)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    res.json({ success: true, message: 'Booking status updated.', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};