const User = require('../models/User');
const Product = require('../models/Product');
const Report = require('../models/Report');
const Offer = require('../models/Offer');

// @desc Get Admin Dashboard Statistics
// @route GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalListings = await Product.countDocuments();
    const activeListings = await Product.countDocuments({ status: 'active' });
    const soldListings = await Product.countDocuments({ status: 'sold' });
    const reportedListings = await Report.countDocuments({ status: 'pending' });
    const acceptedOffers = await Offer.countDocuments({ status: 'accepted' });

    res.json({
      totalUsers,
      totalListings,
      activeListings,
      soldListings,
      reportedListings,
      successfulTrades: soldListings + acceptedOffers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Ban / Unban user
// @route PATCH /api/admin/users/:id/ban
const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot ban an admin user.' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete listing by Admin
// @route DELETE /api/admin/products/:id
const deleteListingAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Product.findByIdAndDelete(req.params.id);
    await Report.deleteMany({ product: req.params.id });

    res.json({ message: 'Listing deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get reported listings
// @route GET /api/admin/reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email hostel')
      .populate({
        path: 'product',
        populate: { path: 'seller', select: 'name email hostel' },
      })
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Dismiss or review report
// @route PATCH /api/admin/reports/:id
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status || 'dismissed';
    await report.save();

    res.json({ message: `Report marked as ${report.status}`, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleBanUser,
  deleteListingAdmin,
  getReports,
  updateReportStatus,
};
