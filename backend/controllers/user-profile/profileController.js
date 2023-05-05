// Fetching the users information once he logged in
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authMiddleware');
const User = require('../../models/user/User');
const Chatroom = require('../../models/chatroom/Chatroom');
const listOfChats = require('../../models/listofchats/ListOfChats');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const searchServices = require('../../services/searchServices');
const upload = multer({ dest: 'uploads/' });
// const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configure Cloudinary with your account credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer for getting image in response

/* Saving in server and then uploading on cloud
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + '-' + Date.now());
  }
});
*/



// router.get('/');
// router.post('/new-chatroom');
// router.get('/view-profile');
// router.post('/view-profile/edit');
// router.post('/search-chatroom');
// router.get('/notifications');
// router.post('/auth/logout');


router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get the user profile data from the database
    const userProfile = await User.findOne({ email: req.user.userEmail });
    // console.log(userProfile);

    // Return the user profile data
    res.json(userProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Create a new chatroom
router.post('/new-chatroom', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = await User.findById(req.user.userId);

    const createdBy = req.user.userId;
    const chatroom = new Chatroom({ name, description, createdBy, members: [createdBy], admins: [createdBy] });
    const newListChatroom = new listOfChats({ name: name, _id: chatroom._id, type: 'Chatroom' });

    // Update the user joinedChatrooms
    user.joinedChatrooms.push(chatroom._id);
    user.adminOf.push(chatroom._id);

    await user.save();
    await chatroom.save();
    await newListChatroom.save();
    res.status(201).json({ chatroom, message: 'New Chatroom Created' });

    // Redirect to the new chatroom page
    // res.redirect(`/api/profile/chatrooms/${chatroom._id}`);  //It will cause error in frontend...
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// View Profile
router.get('/view-profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.userId);

    res.status(200).json({ profile: userProfile.avatar, bio: userProfile.bio, name: userProfile.name });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile (including avatar)
router.patch('/view-profile/edit', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const { name, bio } = req.body;
    const avatarPath = req.file.path;
    const userId = req.user.userId;

    let updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (bio) {
      updateData.bio = bio;
    }
    if (avatarPath) {
      // updateData.avatar = avatar;
      const result = await cloudinary.uploader.upload(avatarPath, { folder: 'Chat App', overwrite: true, public_id: 'avatar' });
      const avatarUrl = result.url;
      updateData.avatar = avatarUrl;
    }

    // Update user profile in the database
    await User.updateOne({ _id: userId }, updateData);

    // Return success response
    res.json({ success: true, message: 'User profile updated successfully' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// For auto suggestion
router.get('/search', authenticateToken, async (req, res) => {
  const partialQuery = req.query.q; // retrieve the partial query from the query parameters

  // retrieve a list of suggested search terms or results that match the partial query
  const suggestedTerms = await searchServices.getSuggestedTerms(partialQuery);

  res.json({ suggestedTerms });  // return the suggested terms as a JSON object
});

// For getting query after auto suggestion didn't work. (will work after hitting enter)
router.post('/search-result', authenticateToken, async (req, res) => {
  const query = req.body.query;  // retrieve the complete search query from the request body

  // process the search query and retrieve the search results
  const searchResults = await searchServices.getSearchResults(query);

  res.json({ searchResults });  // return the search results as a JSON object 
});

module.exports = router;