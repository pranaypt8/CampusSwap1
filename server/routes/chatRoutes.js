const express = require('express');
const router = express.Router();
const { getChats, initiateChat, getChatMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getChats);
router.post('/initiate', initiateChat);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendMessage);

module.exports = router;
