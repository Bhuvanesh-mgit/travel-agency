import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, required: true },
    cardImages: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Hero', heroSchema);