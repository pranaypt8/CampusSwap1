const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredPrice: { type: Number, required: true },
    counterPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'countered'],
      default: 'pending',
    },
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
