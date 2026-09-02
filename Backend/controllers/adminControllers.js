import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';
import Package from '../models/packageModel.js';
import bcrypt from 'bcryptjs';

// @desc    Get Dashboard Statistics (Admin/Staff)
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalPackages = await Package.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue from paid bookings
    const paidBookings = await Booking.find({ paymentStatus: 'paid' });
    const totalRevenue = paidBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.json({
      success: true,
      data: {
        totalBookings,
        totalPackages,
        totalCustomers,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new Staff account (Admin Exclusive)
// @route   POST /api/admin/create-staff
export const createStaffAccount = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staffUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'staff',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: staffUser._id,
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};