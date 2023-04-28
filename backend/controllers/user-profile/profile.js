// Fetching the users information once he logged in
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const UserProfile = require('../../models/user-profile/User_v2');

router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get the user profile data from the database
    const userProfile = await UserProfile.findOne({ email: req.user.email });

    // Return the user profile data
    res.json(userProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;