const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth/authController');
const profileController = require('../controllers/user-profile/profileController');
const groupChatroomController = require('../controllers/chatroom/groupChatroomController');
const personalChatroomController = require('../controllers/chatroom/personalChatroomController');

// Authentication API routes
const authRoutes = router.use('/auth', authController);

// User profile API routes
const profileRoutes = router.use('/api/profile', profileController);

const groupChat = router.use('/api/profile/chatroom', groupChatroomController);

const personalChat = router.use('/api/profile/personal-chat', personalChatroomController);

module.exports = { authRoutes, profileRoutes, groupChat, personalChat };