import Hero from '../models/heroModel.js';

// @desc    Get all hero destinations
// @route   GET /api/hero
export const getHero = async (req, res) => {
  try {
    const heroes = await Hero.find({});
    res.json({ success: true, data: heroes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new hero destination (Admin)
// @route   POST /api/hero
export const updateHero = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;

    // Handle video source (uploaded file path or direct link URL)
    const video = req.files?.video ? req.files.video[0].path : videoUrl;

    // Map through all uploaded card files and extract their Cloudinary secure URLs into cardImages
    const cardImages = req.files?.cards 
      ? req.files.cards.map((file) => file.path) 
      : [];

    if (!title || !description || !video || cardImages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, video, and at least one card image are required.' 
      });
    }

    const hero = await Hero.create({
      title,
      description,
      video,
      cardImages, // Matches your database document field name exactly
    });

    res.status(201).json({ 
      success: true, 
      data: hero, 
      message: 'New destination slide added successfully!' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a hero destination (Admin)
// @route   DELETE /api/hero/:id
export const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) {
      return res.status(404).json({ success: false, message: 'Slide not found.' });
    }
    res.json({ success: true, message: 'Slide deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};