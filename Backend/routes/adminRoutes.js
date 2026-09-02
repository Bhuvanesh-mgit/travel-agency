import express from 'express';
// Import your admin controller functions here
// import { getDashboardStats, manageStaff } from '../controllers/adminController.js';

const router = express.Router();

// Define your admin endpoints
router.get('/dashboard-stats', (req, res) => {
  res.json({ success: true, message: 'Admin stats' });
});

// 🟢 THIS LINE IS REQUIRED TO FIX THE SYNTAXERROR:
export default router;