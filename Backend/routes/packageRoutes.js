import express from 'express';
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { uploadMedia } from '../middleware/multer.js';

const router = express.Router();

// 🔑 Define fields middleware to accept 1 cover image + up to 5 gallery images
const packageMediaUpload = uploadMedia.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 },
]);

// -----------------------------------------------------------------------------
// PUBLIC ROUTES (No Login Required)
// -----------------------------------------------------------------------------
// @desc    Get all packages (supports search, filters by destination, price, etc.)
router.get('/', getAllPackages);

// @desc    Get single package details by ID

router.get('/:id', getPackageById);


// -----------------------------------------------------------------------------
// ADMIN & STAFF ROUTES (Requires Authentication + Role Checks)
// -----------------------------------------------------------------------------

//  Create a new tour package with cover & gallery uploads

router.post(
  '/',
  protect,
  authorizeRoles('admin', 'staff'),
  packageMediaUpload, 
  createPackage
);

  // PUT /api/packages/:id

router.put(
  '/:id',
  protect,
  authorizeRoles('admin', 'staff'),
  packageMediaUpload, 
  updatePackage
);

  //  DELETE /api/packages/:id

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin', 'staff'),
  deletePackage
);

export default router;