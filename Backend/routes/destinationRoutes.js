import express from 'express';
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { uploadMedia } from '../middleware/multer.js';

const router = express.Router();

// Public routes
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);

// Protected Admin/Staff routes
router.post(
  '/',
  protect,
  authorizeRoles('admin', 'staff'),
  uploadMedia.single('image'),
  createDestination
);

router.put(
  '/:id',
  protect,
  authorizeRoles('admin', 'staff'),
  uploadMedia.single('image'),
  updateDestination
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin', 'staff'),
  deleteDestination
);

export default router;