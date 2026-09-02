import express from 'express';
import dns from "node:dns";
import dotenv from 'dotenv';
import cors from 'cors';

// Config Imports
import { connectDB } from './config/db.js';
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Route Imports
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import heroRoutes from './routes/heroRoutes.js'
import staffRoutes from './routes/staffRoutes.js';

// 1. LOAD ENV & CONNECT DB
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. GLOBAL MIDDLEWARES
const allowedOrigins = [
  'http://localhost:5173',
  'https://travel-agency-frontend-6mjk.onrender.com' // Your live frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. API ROUTE MOUNTING
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/staff', staffRoutes);

// 4. HEALTH CHECK ROUTE
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 5. START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});

export default app;