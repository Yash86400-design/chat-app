const express = require("express");
const router = express.Router();
const Chatroom = require('../../models/chatroom/Chatroom');
const { authenticateToken } = require("../../middlewares/authMiddleware");

// POST /api/chatrooms
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.userId;
    const chatroom = new Chatroom({ name, description, createdBy });
    await chatroom.save();
    res.status(201).json({ chatroom, message: 'New Chatroom Created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/chatrooms
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userChats = await Chatroom.find({
      $or: [
        { owner: req.user._id }, // Chats owned by the user
        { members: req.user._id } // Chats the user is a member of
      ],
      createdBy: req.user._id // Only return chatrooms created by the user
    });
    res.status(200).json({ chatrooms: userChats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;