import Review from '../models/reviewModel.js';
import Package from '../models/packageModel.js';

// @desc    Add a review to a package
// @route   POST /api/reviews/:packageId
// @access  Private (Customer, Staff, Admin)
export const addReview = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id; // Extracted from protect/auth middleware

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
    }

    // Verify package exists
    const tourPackage = await Package.findById(packageId);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }

    // Create review
    const review = await Review.create({
      package: packageId,
      user: userId,
      rating: Number(rating),
      comment
    });

    // Populate user details for immediate frontend rendering
    await review.populate('user', 'name email');

    // Recalculate average rating for the package
    const allReviews = await Review.find({ package: packageId });
    const totalRating = allReviews.reduce((acc, item) => acc + item.rating, 0);
    const avgRating = Number((totalRating / allReviews.length).toFixed(1));

    tourPackage.rating = avgRating;
    tourPackage.reviewsCount = allReviews.length;
    await tourPackage.save();

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review: {
        name: review.user.name,
        rating: review.rating,
        comment: review.comment,
        date: 'Just now'
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, message: 'Server error while posting review.' });
  }
};

// @desc    Get all reviews for a package
// @route   GET /api/reviews/:packageId
// @access  Public
export const getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;

    const reviews = await Review.find({ package: packageId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map(rev => ({
      name: rev.user ? rev.user.name : 'Anonymous Traveler',
      rating: rev.rating,
      comment: rev.comment,
      date: new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));

    res.status(200).json({
      success: true,
      count: formattedReviews.length,
      reviews: formattedReviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching reviews.' });
  }
};

// @desc    Get all reviews across all packages for testimonials
// @route   GET /api/reviews
// @access  Public
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 }) // 🔑 Latest reviews come first
      .limit(10); // Limits to latest 10 for performance

    const formattedReviews = reviews.map(rev => ({
      id: rev._id,
      name: rev.user ? rev.user.name : 'Anonymous Traveler',
      rating: rev.rating,
      comment: rev.comment,
      date: new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));

    res.status(200).json({
      success: true,
      count: formattedReviews.length,
      reviews: formattedReviews
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching all reviews.' });
  }
};