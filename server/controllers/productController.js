const Product = require('../models/Product');
const User = require('../models/User');
const Report = require('../models/Report');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc Get all marketplace products with search, filter, and sorting
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category, hostel, condition, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { sellerHostel: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (hostel && hostel !== 'All') {
      query.sellerHostel = hostel;
    }

    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { isBoosted: -1, createdAt: -1 }; // Boosted listings prioritize top
    if (sort === 'oldest') {
      sortOptions = { isBoosted: -1, createdAt: 1 };
    } else if (sort === 'price_asc') {
      sortOptions = { isBoosted: -1, price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { isBoosted: -1, price: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name email hostel ratingAverage ratingCount avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single product details
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name email rollNumber hostel phone ratingAverage ratingCount avatar itemsSold'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.viewsCount += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a new product listing
// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, condition, hostel, isNegotiable } = req.body;
    let imageUrls = [];

    // Process uploaded files if passed via multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const url = await uploadToCloudinary(file.buffer);
          imageUrls.push(url);
        } catch (err) {
          console.error('[Cloudinary Upload Fail] Fallback to base64 data URI:', err.message);
          const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          imageUrls.push(base64);
        }
      }
    } else if (req.body.images) {
      // If client sent image URLs or base64 strings array directly
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (!imageUrls || imageUrls.length === 0) {
      // Provide high quality default image per category if none provided
      imageUrls = ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop'];
    }

    const product = await Product.create({
      title,
      description,
      category,
      price: Number(price),
      condition,
      seller: req.user._id,
      sellerHostel: hostel || req.user.hostel,
      images: imageUrls.slice(0, 6),
      isNegotiable: isNegotiable === true || isNegotiable === 'true',
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update product
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const { title, description, category, price, condition, isNegotiable, status } = req.body;

    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price !== undefined ? Number(price) : product.price;
    product.condition = condition || product.condition;
    if (isNegotiable !== undefined) product.isNegotiable = isNegotiable;
    if (status) product.status = status;

    if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
      product.images = req.body.images.slice(0, 6);
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark product as sold
// @route PATCH /api/products/:id/sold
const markAsSold = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.status = 'sold';
    await product.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { itemsSold: 1 } });

    res.json({ message: 'Product marked as sold!', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Boost product listing (UI Feature)
// @route PATCH /api/products/:id/boost
const boostListing = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.isBoosted = true;
    await product.save();

    res.json({ message: 'Listing boosted to top successfully!', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged in user's listings
// @route GET /api/products/mylistings
const getMyListings = async (req, res) => {
  try {
    const listings = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Report a listing
// @route POST /api/products/:id/report
const reportProduct = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: 'Please specify reason for report.' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Report.create({
      reporter: req.user._id,
      product: product._id,
      reason,
    });

    res.status(201).json({ message: 'Report submitted for admin review. Thank you!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  markAsSold,
  boostListing,
  getMyListings,
  reportProduct,
};
