const express = require('express');
const router = express.Router();
const { createOffer, getUserOffers, updateOfferStatus } = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOffer);
router.get('/', getUserOffers);
router.put('/:id', updateOfferStatus);

module.exports = router;
