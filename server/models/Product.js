const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Books',
        'Electronics',
        'Hostel Essentials',
        'Cycles',
        'Clothing',
        'Sports',
        'Musical Instruments',
        'Furniture',
        'Others',
      ],
    },
    price: { type: Number, required: true },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair'],
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerHostel: { type: String, required: true },
    images: [{ type: String, required: true }],
    status: { type: String, enum: ['active', 'sold'], default: 'active' },
    isNegotiable: { type: Boolean, default: true },
    isBoosted: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', category: 'text', sellerHostel: 'text' });

module.exports = mongoose.model('Product', productSchema);
