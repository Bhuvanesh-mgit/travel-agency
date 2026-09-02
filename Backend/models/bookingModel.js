import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      default: () => 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    travelDate: {
      type: Date,
      required: [true, 'Please provide a travel date'],
    },
    travelers: {
      type: Number,
      required: true,
      min: [1, 'At least 1 traveler is required'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    specialRequests: {
      type: String,
      default: '',
      trim: true,
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'razorpay', 'cash', 'none'],
      default: 'none',
    },
    paymentDetails: {
      razorpayOrderId: { type: String, default: '' },
      razorpayPaymentId: { type: String, default: '' },
      razorpaySignature: { type: String, default: '' },
      paidAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;