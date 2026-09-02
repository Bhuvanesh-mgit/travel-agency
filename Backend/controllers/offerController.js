import Offer from '../models/offerModel.js';

// @desc    Get all active promotional offers
// @route   GET /api/offers
export const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true });
    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new offer with Image/Video media banner (Admin)
// @route   POST /api/offers
export const createOffer = async (req, res) => {
  try {
    const { title, subtitle, bannerType, couponCode, discountPercentage, expiresAt } = req.body;
    
    // File upload path handled via Multer
    const mediaUrl = req.file ? `/uploads/banners/${req.file.filename}` : '';

    const offer = await Offer.create({
      title,
      subtitle,
      bannerType: bannerType || (req.file?.mimetype.startsWith('video/') ? 'video' : 'image'),
      mediaUrl,
      couponCode,
      discountPercentage,
      expiresAt,
    });

    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an offer (Admin)
// @route   DELETE /api/offers/:id
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.json({ success: true, message: 'Offer banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};