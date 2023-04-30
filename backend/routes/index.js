const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth/authController');
const profileController = require('../controllers/user-profile/profileController');
const chatroomController = require('../controllers/chatroom/chatroomController');

// Authentication API routes
const authRoutes = router.use('/auth', authController);

// User profile API routes
const profileRoutes = router.use('/api/profile', profileController);

// Chatroom API routes
const chatroomRoutes = router.use('/api/chatrooms', chatroomController);

module.exports = { authRoutes, profileRoutes, chatroomRoutes };