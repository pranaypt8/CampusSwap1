const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    hostel: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    ratingAverage: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
    itemsSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
