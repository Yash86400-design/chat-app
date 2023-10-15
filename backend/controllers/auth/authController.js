const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/user/User.js');
const { authenticateToken } = require('../../middlewares/authMiddleware.js');
const listOfChats = require('../../models/listofchats/ListOfChats.js');


// Register a new user
router.post('/register', [
  check('userName').notEmpty().withMessage('Name is required'),
  check('email').notEmpty().withMessage('Email is required'),
  check('password').notEmpty().withMessage('Password is requried').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
], async (req, res) => {
  try {

    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({ name: userName, email, password: hashedPassword, avatar: '', bio: '' });

    // Create a new user for listOfSearch too
    const newListUser = new listOfChats({ name: userName, roomId: user._id, type: 'User', avatar: '', bio: '' });

    await user.save();
    await newListUser.save();

    return res.json({ message: `${userName} registered successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Email Address' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id, userEmail: email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const userName = await User.findOne({ email }).select('name');

    return res.json({ message: `${userName.name} logged in successfully`, token_value: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User logout
router.get('/logout', authenticateToken, async (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie('token');

    return res.json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;