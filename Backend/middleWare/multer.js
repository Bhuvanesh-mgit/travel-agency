import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer v';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// 1. Check if Cloudinary credentials exist
const hasCloudinaryKeys =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryKeys) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('⚠️ [Multer Warning] Cloudinary API keys missing in .env! Falling back to local disk storage.');
}

// 2. Local Disk Storage (Fallback)
const localStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = file.mimetype.startsWith('image/') ? 'uploads/destinations/' : 'uploads/banners/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    const prefix = file.mimetype.startsWith('image/') ? 'img' : 'video';
    cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 3. Cloudinary Storage Instance (Supports both images and videos via 'auto')
let cloudinaryStorage = null;
if (hasCloudinaryKeys) {
  cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const isVideo = file.mimetype.startsWith('video/');
      return {
        folder: 'travel_booking/hero',
        resource_type: 'auto', // Automatically detects and handles images or videos
        allowed_formats: isVideo ? ['mp4', 'webm', 'mov'] : ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `${isVideo ? 'video' : 'img'}-${Date.now()}`,
      };
    },
  });
}

// 4. Robust Custom Storage Engine
const customStorage = {
  _handleFile(req, file, cb) {
    if (cloudinaryStorage) {
      cloudinaryStorage._handleFile(req, file, (err, info) => {
        if (err) {
          console.error('🔥 [Cloudinary Error] Upload failed, falling back to local storage:', err.message);
          localStorage._handleFile(req, file, cb);
        } else {
          cb(null, info);
        }
      });
    } else {
      localStorage._handleFile(req, file, cb);
    }
  },
  _removeFile(req, file, cb) {
    if (cloudinaryStorage) {
      cloudinaryStorage._removeFile(req, file, cb);
    } else {
      localStorage._removeFile(req, file, cb);
    }
  },
};

// 5. File Validation Filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|mp4|webm|mov/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only images (.png, .jpg, .webp) and videos (.mp4, .webm, .mov) are allowed!'), false);
  }
};

export const uploadMedia = multer({
  storage: customStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter,
});

export { cloudinary };