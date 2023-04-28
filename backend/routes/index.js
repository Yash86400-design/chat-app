const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const profileController = require('../controllers/user-profile/profileController');

// Authentication API routes
const authRoutes = router.use('/auth', authController);
const profileRoutes = router.use('/api/profile', profileController);

module.exports = { authRoutes, profileRoutes };