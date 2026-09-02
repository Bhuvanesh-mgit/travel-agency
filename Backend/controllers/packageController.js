import Package from '../models/packageModel.js';
import { uploadMedia, cloudinary } from '../middleWare/Multer.js';
import fs from 'fs';
import path from 'path';

/**
 * Helper to resolve uploaded image paths safely (Handles Cloudinary URLs vs Local Disk Paths)
 */
const formatImagePath = (file, fallback = '/uploads/packages/default-package.jpg') => {
  if (!file) return fallback;

  // 1. Cloudinary direct URL
  const cloudinaryUrl = file.secure_url || file.path;
  if (cloudinaryUrl && /^https?:\/\//i.test(cloudinaryUrl)) {
    return cloudinaryUrl;
  }

  // 2. Local disk path (normalizes backslashes and ensures leading slash)
  if (file.path) {
    const cleanPath = file.path.replace(/\\/g, '/');
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  }

  return `/uploads/${file.filename}`;
};

// Helper to clean up stored media (Local + Cloudinary)
const deleteStoredMedia = async (filePath) => {
  if (!filePath) return;

  // Protect default placeholder images from deletion
  if (filePath.includes('default-package.jpg') || filePath.includes('default-destination.jpg')) {
    return;
  }

  if (filePath.includes('cloudinary.com')) {
    const parts = filePath.split('/');
    const filenameWithExt = parts.slice(-2).join('/');
    const publicId = filenameWithExt.substring(0, filenameWithExt.lastIndexOf('.'));
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Cloudinary deletion error:', err.message);
      }
    }
  } else {
    // Strip leading slash for proper relative pathing with process.cwd()
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const absolutePath = path.join(process.cwd(), cleanPath);

    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
      } catch (err) {
        console.error('File deletion error:', err.message);
      }
    }
  }
};

const safeJSONParse = (field, fallback) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      return fallback;
    }
  }
  return field || fallback;
};

// @desc    Get all packages
// @route   GET /api/packages
export const getAllPackages = async (req, res) => {
  try {
    const { search, destination, category, minPrice, maxPrice, isFeatured } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { locationName: { $regex: search, $options: 'i' } }
      ];
    }
    if (destination) query.destination = destination;
    if (category && category !== 'All') query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const packages = await Package.find(query)
      .populate('destination', 'name title country continent image')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single package by ID
// @route   GET /api/packages/:id
export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('destination');

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Tour package not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: pkg,
    });
  } catch (error) {
    console.error('Error in getPackageById:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Tour package not found (Invalid ID format).',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching package details.',
      error: error.message,
    });
  }
};

// @desc    Create a new package with cover image & up to 5 gallery images
// @route   POST /api/packages
export const createPackage = async (req, res) => {
  try {
    const coverFile = req.files?.image ? req.files.image[0] : null;
    const image = formatImagePath(coverFile, '/uploads/packages/default-package.jpg');

    const galleryFiles = req.files?.gallery || [];
    const gallery = galleryFiles.map((file) => formatImagePath(file));

    const duration = safeJSONParse(req.body.duration, { days: 1, nights: 0 });
    const itinerary = safeJSONParse(req.body.itinerary, []);
    const inclusions = safeJSONParse(req.body.inclusions, []);
    const exclusions = safeJSONParse(req.body.exclusions, []);
    const paxPricing = safeJSONParse(req.body.paxPricing, []);

    const packageData = {
      ...req.body,
      image,
      gallery,
      duration: {
        days: Number(duration.days || 1),
        nights: Number(duration.nights || 0)
      },
      price: Number(req.body.price),
      salePrice: Number(req.body.salePrice || 0),
      kidPrice: Number(req.body.kidPrice || 0), // 🔑 Added kidPrice conversion
      availableSeats: Number(req.body.availableSeats || 20),
      maxCapacity: Number(req.body.maxCapacity || 30),
      itinerary,
      inclusions,
      exclusions,
      paxPricing,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isActive: req.body.isActive === 'true' || req.body.isActive === true || req.body.isActive === undefined,
    };

    if (!packageData.destination) {
      delete packageData.destination;
    }

    const newPackage = await Package.create(packageData);
    const populatedPackage = await Package.findById(newPackage._id).populate('destination');

    res.status(201).json({ success: true, data: populatedPackage });
  } catch (error) {
    console.error('🔥 Error in createPackage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update package & gallery images
// @route   PUT /api/packages/:id
export const updatePackage = async (req, res) => {
  try {
    const existingPackage = await Package.findById(req.params.id);
    if (!existingPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    let updateData = { ...req.body };

    if (req.files?.image) {
      if (existingPackage.image) {
        await deleteStoredMedia(existingPackage.image);
      }
      const file = req.files.image[0];
      updateData.image = formatImagePath(file);
    }

    if (req.files?.gallery && req.files.gallery.length > 0) {
      const newGalleryPaths = req.files.gallery.map((f) => formatImagePath(f));
      updateData.gallery = [...(existingPackage.gallery || []), ...newGalleryPaths].slice(0, 5);
    }

    if (updateData.duration) updateData.duration = safeJSONParse(updateData.duration, updateData.duration);
    if (updateData.itinerary) updateData.itinerary = safeJSONParse(updateData.itinerary, updateData.itinerary);
    if (updateData.inclusions) updateData.inclusions = safeJSONParse(updateData.inclusions, updateData.inclusions);
    if (updateData.exclusions) updateData.exclusions = safeJSONParse(updateData.exclusions, updateData.exclusions);
    if (updateData.paxPricing) updateData.paxPricing = safeJSONParse(updateData.paxPricing, updateData.paxPricing);

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.salePrice !== undefined) updateData.salePrice = Number(updateData.salePrice);
    if (updateData.kidPrice !== undefined) updateData.kidPrice = Number(updateData.kidPrice); // 🔑 Added kidPrice conversion on update
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('destination');

    res.status(200).json({ success: true, data: updatedPackage });
  } catch (error) {
    console.error('🔥 Error in updatePackage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete package and all associated gallery images
// @route   DELETE /api/packages/:id
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    if (pkg.image) await deleteStoredMedia(pkg.image);

    if (pkg.gallery && pkg.gallery.length > 0) {
      for (const imgPath of pkg.gallery) {
        await deleteStoredMedia(imgPath);
      }
    }

    await pkg.deleteOne();
    res.status(200).json({ success: true, message: 'Package and images deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};