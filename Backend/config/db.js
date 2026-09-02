import mongoose from 'mongoose';


export const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};