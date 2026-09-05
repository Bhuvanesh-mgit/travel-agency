import express from 'express';
import { addReview, getPackageReviews ,getAllReviews} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js'; // Use your existing auth middleware

const router = express.Router();

router.get('/:packageId', getPackageReviews);
router.get('/', getAllReviews);
router.post('/:packageId', protect, addReview);

export default router;