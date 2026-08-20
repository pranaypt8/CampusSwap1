const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleBanUser,
  deleteListingAdmin,
  getReports,
  updateReportStatus,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/ban', toggleBanUser);
router.delete('/products/:id', deleteListingAdmin);
router.get('/reports', getReports);
router.patch('/reports/:id', updateReportStatus);

module.exports = router;
