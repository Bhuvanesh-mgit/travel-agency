import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a destination name'],
      trim: true,
      unique: true,
    },
    country: {
      type: String,
      required: [true, 'Please specify the country'],
      trim: true,
    },
    continent: {
      type: String,
      enum: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Antarctica'],
      default: 'Asia',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '/uploads/packages/default-destination.jpg',
    },
    isPopular: {
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

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;