import express from 'express';
import {
  getActiveOffers,
  createOffer,
  deleteOffer,
} from '../controllers/offerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { uploadMedia } from '../middleware/multer.js';

const router = express.Router();

// Public route to fetch banners and promo offers
router.get('/', getActiveOffers);

// Protected Admin routes for banner management
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  uploadMedia.single('banner'),
  createOffer
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  deleteOffer
);

// 🟢 THIS IS THE MISSING LINE THAT CAUSES THE SYNTAX ERROR:
export default router;