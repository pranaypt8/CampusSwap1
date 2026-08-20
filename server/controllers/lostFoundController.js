const LostFound = require('../models/LostFound');

// @desc Get Lost & Found items
// @route GET /api/lostfound
const getLostFound = async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const query = {};

    if (type && (type === 'lost' || type === 'found')) {
      query.type = type;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await LostFound.find(query)
      .populate('user', 'name hostel email phone avatar')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create Lost or Found Post
// @route POST /api/lostfound
const createLostFound = async (req, res) => {
  try {
    const { type, category, title, description, location, date, contactInfo, image } = req.body;

    if (!type || !category || !title || !description || !location || !date || !contactInfo) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const post = await LostFound.create({
      type,
      category,
      title,
      description,
      location,
      date,
      contactInfo,
      image: image || '',
      user: req.user._id,
    });

    const populatedPost = await LostFound.findById(post._id).populate('user', 'name hostel email avatar');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark post as resolved
// @route PATCH /api/lostfound/:id/resolved
const updateLostFoundStatus = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.status = 'resolved';
    await post.save();

    res.json({ message: 'Post marked as resolved!', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete Lost or Found Post
// @route DELETE /api/lostfound/:id
const deleteLostFound = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await LostFound.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lost & Found post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLostFound,
  createLostFound,
  updateLostFoundStatus,
  deleteLostFound,
};
