const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  markAsSold,
  boostListing,
  getMyListings,
  reportProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/mylistings', protect, getMyListings);
router.get('/:id', getProductById);

router.post('/', protect, upload.array('images', 6), createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/sold', protect, markAsSold);
router.patch('/:id/boost', protect, boostListing);
router.post('/:id/report', protect, reportProduct);

module.exports = router;
