const express = require('express');
const router = express.Router();
const {
  getLostFound,
  createLostFound,
  updateLostFoundStatus,
  deleteLostFound,
} = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getLostFound);
router.post('/', protect, createLostFound);
router.patch('/:id/resolved', protect, updateLostFoundStatus);
router.delete('/:id', protect, deleteLostFound);

module.exports = router;
