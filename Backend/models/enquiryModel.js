import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact number'],
      trim: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null, // Optional: linked if enquired from a specific package page
    },
    subject: {
      type: String,
      default: 'General Inquiry',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please enter your message or question'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'closed'],
      default: 'pending',
    },
    staffNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;