import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// New User/Customer Management Routes
router.route('/customers')
  .get(protect, getUsers)
  .post(protect, createUser);

router.route('/customers/:id')
  .put(protect, updateUser)
  .delete(protect, deleteUser);

export default router;