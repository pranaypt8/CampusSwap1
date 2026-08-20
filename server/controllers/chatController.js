const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc Get user's active chats
// @route GET /api/chats
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name email hostel rollNumber avatar ratingAverage itemsSold')
      .populate('product', 'title price images seller status')
      .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get or create a chat session with another user for a product
// @route POST /api/chats/initiate
const initiateChat = async (req, res) => {
  try {
    const { receiverId, productId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, receiverId] },
      ...(productId ? { product: productId } : {}),
    })
      .populate('participants', 'name email hostel rollNumber avatar ratingAverage itemsSold')
      .populate('product', 'title price images seller status');

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, receiverId],
        product: productId || null,
        lastMessage: 'Chat started',
        lastMessageAt: Date.now(),
      });

      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email hostel rollNumber avatar ratingAverage itemsSold')
        .populate('product', 'title price images seller status');
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get messages for a specific chat
// @route GET /api/chats/:chatId/messages
const getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat session not found' });

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read for this recipient
    await Message.updateMany(
      { chat: req.params.chatId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Send a message
// @route POST /api/chats/:chatId/messages
const sendMessage = async (req, res) => {
  try {
    const { content, receiverId, meetUpSuggestion } = req.body;
    const { chatId } = req.params;

    if (!content && !meetUpSuggestion?.location) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      receiver: receiverId,
      content: content || `Suggested meet-up location: ${meetUpSuggestion?.location}`,
      meetUpSuggestion: meetUpSuggestion || { location: '', time: '' },
    });

    chat.lastMessage = content || `Suggested meet-up location: ${meetUpSuggestion?.location}`;
    chat.lastMessageAt = Date.now();
    await chat.save();

    // Create Notification for receiver
    await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: 'message',
      title: `New message from ${req.user.name}`,
      message: content || `Suggested meet-up at ${meetUpSuggestion?.location}`,
      link: `/chat?chatId=${chatId}`,
    });

    const populatedMsg = await Message.findById(message._id).populate('sender', 'name avatar');
    res.status(201).json(populatedMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChats,
  initiateChat,
  getChatMessages,
  sendMessage,
};
