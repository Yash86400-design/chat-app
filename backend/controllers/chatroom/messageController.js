const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authMiddleware');
const Chatroom = require('../models/chatroom/Chatroom');
const Message = require('../models/chatroom/Message');

router.get('/:id/messages', authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const userId = req.user.userId;

    const chatroom = await Chatroom.findById(chatroomId);

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is a member of the chatroom
    const isMember = chatroom.members.includes;
    if (!isMember) {
      return res.status(401).json({ message: 'You are not a member of this chatroom' });
    }

    // Find all messages in the chatroom and populate the sender field
    const messages = await Message.find({ chatroomId })
      .populate('sender', '_id name')
      .exec();

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:id/messages', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const userId = req.user.userId;
    const content = req.body.content;

    const chatroom = await Chatroom.findById(chatroomId);

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is a member of the chatroom
    const isMember = chatroom.members.includes(userId);
    if (!isMember) {
      return res.status(401).json({ message: 'You are not a member of this chatroom' });
    }

    const message = new Message({
      chatroomId,
      sender: userId,
      content,
    });

    await message.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;