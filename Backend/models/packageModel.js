import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, 'Day number is required'],
  },
  title: {
    type: String,
    required: [true, 'Day title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Day description is required'],
  },
  activities: [{ type: String }],
});

const paxPricingSchema = new mongoose.Schema({
  pax: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a package title'],
      trim: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Please select a destination'],
    },
    locationName: {
      type: String,
      required: [true, 'Please specify city/region (e.g., Paris, France)'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a detailed description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a base price'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    // 🔑 Added kidPrice schema field
    kidPrice: {
      type: Number,
      default: 0,
      min: [0, 'Kid price cannot be negative'],
    },
    paxPricing: [paxPricingSchema],
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    category: {
      type: String,
      enum: ['Honeymoon', 'Adventure', 'Family', 'Luxury', 'Budget', 'Group', 'Solo'],
      default: 'Family',
    },
    image: {
      type: String,
      default: '/uploads/packages/default-package.jpg',
    },
    gallery: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [itinerarySchema],
    availableSeats: {
      type: Number,
      required: true,
      default: 20,
    },
    maxCapacity: {
      type: Number,
      default: 30,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);

export default Package;