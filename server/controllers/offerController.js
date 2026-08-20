const Offer = require('../models/Offer');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

// @desc Send offer on product
// @route POST /api/offers
const createOffer = async (req, res) => {
  try {
    const { productId, offeredPrice, message } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot make an offer on your own listing.' });
    }

    const existingOffer = await Offer.findOne({
      product: productId,
      buyer: req.user._id,
      status: 'pending',
    });

    if (existingOffer) {
      existingOffer.offeredPrice = Number(offeredPrice);
      existingOffer.message = message || existingOffer.message;
      await existingOffer.save();

      return res.json({ message: 'Offer updated successfully!', offer: existingOffer });
    }

    const offer = await Offer.create({
      product: productId,
      buyer: req.user._id,
      seller: product.seller,
      offeredPrice: Number(offeredPrice),
      message: message || '',
    });

    // Send notification to seller
    await Notification.create({
      recipient: product.seller,
      sender: req.user._id,
      type: 'offer_received',
      title: 'New Offer Received!',
      message: `${req.user.name} offered ₹${offeredPrice} for "${product.title}"`,
      link: `/product/${product._id}`,
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user's offers (sent and received)
// @route GET /api/offers
const getUserOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate('product', 'title price images status category')
      .populate('buyer', 'name hostel rollNumber avatar ratingAverage')
      .populate('seller', 'name hostel rollNumber avatar ratingAverage')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update offer status (accept, reject, counter)
// @route PUT /api/offers/:id
const updateOfferStatus = async (req, res) => {
  try {
    const { status, counterPrice } = req.body;
    const offer = await Offer.findById(req.params.id).populate('product').populate('buyer');

    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    if (offer.seller.toString() !== req.user._id.toString() && offer.buyer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this offer' });
    }

    offer.status = status;
    if (status === 'countered' && counterPrice) {
      offer.counterPrice = Number(counterPrice);
    }

    await offer.save();

    // Create Notification for the buyer or seller
    const recipientId = offer.seller.toString() === req.user._id.toString() ? offer.buyer._id : offer.seller;
    const notifType = status === 'accepted' ? 'offer_accepted' : status === 'rejected' ? 'offer_rejected' : 'offer_received';

    let notifMsg = `Your offer of ₹${offer.offeredPrice} for "${offer.product.title}" was ${status}.`;
    if (status === 'countered') {
      notifMsg = `Seller countered your offer with ₹${counterPrice} for "${offer.product.title}".`;
    }

    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: notifType,
      title: `Offer ${status.toUpperCase()}!`,
      message: notifMsg,
      link: `/product/${offer.product._id}`,
    });

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOffer,
  getUserOffers,
  updateOfferStatus,
};
