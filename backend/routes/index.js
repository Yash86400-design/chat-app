const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const profileController = require('../controllers/user-profile/profile');

// Authentication API routes
router.use('/auth', authController);
router.use('/api/profile', profileController);

module.exports = router;