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

profileRoutes.use('/chatrooms/', (req, res, next) => {
  const id = req.params.id;
  const isUser = ListOfChats.findById(id);

  if (isUser === 'User') {
    personalChatroomController(req, res, next);
  } else {
    groupChatroomController(req, res, next);
  }

});


// module.exports = { authRoutes, profileRoutes, chatroomRoutes };
module.exports = { authRoutes, profileRoutes };