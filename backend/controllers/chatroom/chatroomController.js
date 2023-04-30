const express = require("express");
const router = express.Router();
const Chatroom = require('../../models/chatroom/Chatroom');
const { authenticateToken } = require("../../middlewares/authMiddleware");

// Post /api/chatrooms
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const chatroom = new Chatroom({ name, description });
    await chatroom.save();
    res.status(201).json({ chatroom, message: 'New Chatroom Created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;