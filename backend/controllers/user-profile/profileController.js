// Fetching the users information once he logged in
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authMiddleware');
const AuthUser = require('../../models/user/User');

router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get the user profile data from the database
    const userProfile = await AuthUser.findOne({ email: req.user.userEmail });
    console.log(userProfile);

    // Return the user profile data
    res.json(userProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;