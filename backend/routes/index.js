const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth/authController');
const profileController = require('../controllers/user-profile/profileController');
const groupChatroomController = require('../controllers/chatroom/groupChatroomController');
const personalChatroomController = require('../controllers/chatroom/personalChatroomController');
const ListOfChats = require('../models/listofchats/ListOfChats');

// Authentication API routes
const authRoutes = router.use('/auth', authController);

// User profile API routes
const profileRoutes = router.use('/api/profile', profileController);

// Chatroom API routes
// const chatroomRoutes = router.use('/api/chatrooms', chatroomController);

// Nested Chatroom API routes within profileRoutes
// profileRoutes.use('/chatrooms/', groupChatroomController);

profileRoutes.use('/chatrooms/:id', async (req, res, next) => {
  const chatroomId = req.params.id;
  const chatroom = await ListOfChats.findById(chatroomId);
  try {
    if (!chatroom) {
      return res.status(404).json({ message: 'Person/Chatroom Not Found' });
    }

    if (chatroom.type === 'User') {
      req.chatroomId = chatroomId;
      personalChatroomController(req, res, next);
    } else if (chatroom.type == 'Chatroom') {
      req.chatroomId = chatroomId;
      groupChatroomController(req, res, next);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// module.exports = { authRoutes, profileRoutes, chatroomRoutes };
module.exports = { authRoutes, profileRoutes };