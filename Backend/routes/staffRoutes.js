import express from 'express';
import { getStaffMembers, removeStaffAccess } from '../controllers/staffController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getStaffMembers);
router.delete('/:id', protect, admin, removeStaffAccess);

export default router;