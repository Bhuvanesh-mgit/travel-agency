import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    bannerType: { type: String, enum: ['image', 'video'], default: 'image' },
    mediaUrl: { type: String, required: true },
    couponCode: { type: String, uppercase: true, default: '' },
    discountPercentage: { type: Number, default: 0 },
    primaryButtonLink: { type: String, default: '/destinations' },
    startDate: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);