const Review = require('../models/Review');
const User = require('../models/User');

// @desc Add rating/review for a seller
// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { sellerId, rating, comment, productId } = req.body;

    if (!sellerId || !rating || !comment) {
      return res.status(400).json({ message: 'Seller, rating score, and comment are required.' });
    }

    if (sellerId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself.' });
    }

    const review = await Review.create({
      seller: sellerId,
      reviewer: req.user._id,
      rating: Number(rating),
      comment,
      product: productId || null,
    });

    // Recalculate Seller Average Rating
    const allReviews = await Review.find({ seller: sellerId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(sellerId, {
      ratingAverage: Number(avg.toFixed(1)),
      ratingCount: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate('reviewer', 'name avatar hostel');
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller reviews
// @route GET /api/reviews/seller/:sellerId
const getSellerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate('reviewer', 'name avatar hostel')
      .populate('product', 'title')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getSellerReviews,
};
