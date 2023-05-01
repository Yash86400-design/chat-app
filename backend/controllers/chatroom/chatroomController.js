const express = require("express");
const router = express.Router();
const Chatroom = require('../../models/chatroom/Chatroom');
const { authenticateToken } = require("../../middlewares/authMiddleware");
const Joi = require("joi");

// POST /api/chatrooms
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.userId;
    const chatroom = new Chatroom({ name, description, createdBy, members: [createdBy], admins: [createdBy] });
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
      createdBy: req.user.userId // Only return chatrooms created by the user
    });
    res.status(200).json({ chatrooms: userChats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/chatrooms/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const chatroom = await Chatroom.findById(chatroomId).populate('members', '_id name email');
    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }
    // Check if the user is authorized to access the chatroom
    if (!chatroom.members.some(member => member._id.toString() === req.user.userId.toString())) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json({ chatroom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Put request to update chatroom details
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const { name, description } = req.body;

    // Validate the request body
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).trim().required(),
      description: Joi.string().min(10).max(200).trim().required(),
    });

    const { error } = schema.validate({ name, description });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the chatroom by ID
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is authorized to update the chatroom
    if (!chatroom.admins.includes(req.user.userId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Update the chatroom name and description
    chatroom.name = name;
    chatroom.description = description;
    await chatroom.save();

    res.status(200).json({ chatroom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete the chatroom
router.delete("/:id", authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;

    // Find the chatroom by ID if any
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is an admin of the chatroom 
    const isAdmin = chatroom.admins.includes(req.user.userId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Not allowed, Only admin can do this action!' });
    }

    // Delete the chatroom
    await chatroom.remove();

    res.status(200).json({ message: 'Chatroom deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;