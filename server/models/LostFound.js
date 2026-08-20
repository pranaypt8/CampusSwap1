const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['lost', 'found'], required: true },
    category: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    contactInfo: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostFound', lostFoundSchema);
