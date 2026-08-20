const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc Get current user's wishlist
// @route GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'seller', select: 'name hostel ratingAverage' },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add or remove product from wishlist
// @route POST /api/wishlist/toggle
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    let isSaved = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      isSaved = false;
    } else {
      wishlist.products.push(productId);
      isSaved = true;
    }

    await wishlist.save();

    res.json({
      message: isSaved ? 'Added to wishlist' : 'Removed from wishlist',
      isSaved,
      wishlist: wishlist.products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
};
