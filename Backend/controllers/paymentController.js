import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/bookingModel.js';
import Payment from '../models/paymentModel.js'; // 👈 Import your separate Payment model
import dotenv from 'dotenv';

dotenv.config();

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Logged-in User)
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Razorpay accepts amount in subunit/paise (e.g., ₹1000 -> 100000 paise)
    const options = {
      amount: Math.round(booking.totalPrice * 100),
      currency: 'INR',
      receipt: `receipt_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // 🔑 Create a record in your standalone Payment collection
    await Payment.create({
      user: req.user._id,
      booking: booking._id,
      razorpayOrderId: order.id,
      amount: booking.totalPrice,
      currency: order.currency,
      status: 'created',
    });

    // Also update order ID on the booking document if you want a reference there
    booking.paymentDetails = {
      razorpayOrderId: order.id,
      status: 'created',
    };
    await booking.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private (Logged-in User)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // 1. Find the booking document
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found' });
    }

    // 2. Explicitly update fields so they save into MongoDB
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    booking.paymentMethod = 'razorpay';
    booking.paymentDetails = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date(),
    };

    // 3. Save booking to database
    await booking.save();

    // 🔑 4. Update standalone Payment model status to 'paid' so payment history works properly
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        paidAt: new Date(),
      }
    );

    // 5. Populate package and user for frontend response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('package', 'title name image destination price salePrice locationName')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/my-payments
// @access  Private (Logged-in User)
export const getMyPayments = async (req, res) => {
  try {
    // You can query from the Payment model now!
    const payments = await Payment.find({
      user: req.user._id,
      status: 'paid',
    })
      .populate({
        path: 'booking',
        populate: {
          path: 'package',
          select: 'title image locationName destination',
        },
      })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};