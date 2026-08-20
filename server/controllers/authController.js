const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/jwt');

// @desc Register user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, rollNumber, hostel, phone, password } = req.body;

    if (!name || !email || !rollNumber || !hostel || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      rollNumber,
      hostel,
      phone: phone || '',
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      hostel: user.hostel,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been suspended by an admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      hostel: user.hostel,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      ratingAverage: user.ratingAverage,
      ratingCount: user.ratingCount,
      itemsSold: user.itemsSold,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, hostel, phone, avatar, rollNumber } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.hostel = hostel || user.hostel;
    user.phone = phone !== undefined ? phone : user.phone;
    user.avatar = avatar !== undefined ? avatar : user.avatar;
    user.rollNumber = rollNumber || user.rollNumber;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      rollNumber: updatedUser.rollNumber,
      hostel: updatedUser.hostel,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      ratingAverage: updatedUser.ratingAverage,
      ratingCount: updatedUser.ratingCount,
      itemsSold: updatedUser.itemsSold,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
