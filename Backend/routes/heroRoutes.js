import express from 'express';
import { getHero, updateHero, deleteHero } from '../controllers/heroController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadMedia } from '../middleware/multer.js';

const router = express.Router();

router.get('/', getHero);
router.post(
  '/',
  protect,
  admin,
  uploadMedia.fields([
    { name: 'video', maxCount: 1 },
    { name: 'cards', maxCount: 3 },
  ]),
  updateHero
);
router.delete('/:id', protect, admin, deleteHero);

export default router;