import Destination from '../models/destinationModel.js';


const formatImagePath = (file) => {
  if (!file) return '/uploads/packages/default-destination.jpg';

  // 1. Cloudinary URL takes precedence if available
  const cloudinaryUrl = file.secure_url || file.path;
  if (cloudinaryUrl && /^https?:\/\//i.test(cloudinaryUrl)) {
    return cloudinaryUrl; 
  }

  // 2. Fallback for Local Storage (Normalizes Windows \ to / for static serving)
  if (file.path) {
    const cleanPath = file.path.replace(/\\/g, '/');
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  }

  return `/uploads/${file.filename}`;
};

// get all destinations
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    console.error('Error in getAllDestinations:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving destinations.',
      error: error.message,
    });
  }
};

// get destination by id

export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    console.error('Error in getDestinationById:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Destination not found (Invalid ID format).',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving destination details.',
      error: error.message,
    });
  }
};

  //  Create a new destination

export const createDestination = async (req, res) => {
  try {
    const { name, country, continent, description, isPopular, isActive } = req.body;

    // Validation for required fields
    if (!name || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both destination name and country.',
      });
    }

    // Case-insensitive duplicate name check
    const existingDestination = await Destination.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingDestination) {
      return res.status(400).json({
        success: false,
        message: 'A destination with this name already exists.',
      });
    }

    // 🔑 Resolve Image URL safely (Cloudinary HTTPS link vs Local Relative Path)
    const imagePath = formatImagePath(req.file);

    // Parse boolean values sent via multipart FormData
    const parsedIsPopular = isPopular === 'true' || isPopular === true;
    const parsedIsActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : true;

    const newDestination = await Destination.create({
      name: name.trim(),
      country: country.trim(),
      continent: continent || 'Asia',
      description: description ? description.trim() : '',
      image: imagePath,
      isPopular: parsedIsPopular,
      isActive: parsedIsActive,
    });

    return res.status(201).json({
      success: true,
      message: 'Destination created successfully.',
      data: newDestination,
    });
  } catch (error) {
    console.error('🔥 Error in createDestination:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating destination.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update an existing destination
 * @route   PUT /api/destinations/:id
 * @access  Private (Admin / Staff)
 */
export const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.',
      });
    }

    const { name, country, continent, description, isPopular, isActive } = req.body;

    // Case-insensitive check if name is being changed to an existing target name
    if (name && name.trim().toLowerCase() !== destination.name.toLowerCase()) {
      const existingDestination = await Destination.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });

      if (existingDestination) {
        return res.status(400).json({
          success: false,
          message: 'Another destination with this name already exists.',
        });
      }
      destination.name = name.trim();
    }

    // Apply updates
    if (country !== undefined) destination.country = country.trim();
    if (continent !== undefined) destination.continent = continent;
    if (description !== undefined) destination.description = description.trim();

    if (isPopular !== undefined) {
      destination.isPopular = isPopular === 'true' || isPopular === true;
    }

    if (isActive !== undefined) {
      destination.isActive = isActive === 'true' || isActive === true;
    }

    // 🔑 Format new image path if uploaded
    if (req.file) {
      destination.image = formatImagePath(req.file);
    }

    const updatedDestination = await destination.save();

    return res.status(200).json({
      success: true,
      message: 'Destination updated successfully.',
      data: updatedDestination,
    });
  } catch (error) {
    console.error('🔥 Error in updateDestination:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Destination not found (Invalid ID format).',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while updating destination.',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a destination
 * @route   DELETE /api/destinations/:id
 * @access  Private (Admin / Staff)
 */
export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.',
      });
    }

    await destination.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Destination deleted successfully.',
    });
  } catch (error) {
    console.error('Error in deleteDestination:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Destination not found (Invalid ID format).',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while deleting destination.',
      error: error.message,
    });
  }
};