const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');

// Authentication API routes
router.use('/auth', authController);

module.exports = router;