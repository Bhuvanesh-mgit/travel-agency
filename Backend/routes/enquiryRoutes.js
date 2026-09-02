import express from 'express';
import {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public route: Allow any visitor/customer to submit a question
router.post('/', createEnquiry);

// Protected Staff/Admin routes
router.get('/', protect, authorizeRoles('admin', 'staff'), getAllEnquiries);
router.get('/:id', protect, authorizeRoles('admin', 'staff'), getEnquiryById);
router.put('/:id', protect, authorizeRoles('admin', 'staff'), updateEnquiryStatus);

// Restricted to Admin only
router.delete('/:id', protect, authorizeRoles('admin'), deleteEnquiry);

export default router;