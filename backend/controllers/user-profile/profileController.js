// Fetching the users information once he logged in
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authMiddleware');
const AuthUser = require('../../models/user/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
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

// Update user profile
router.patch('/', authenticateToken, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const userId = req.user.userId;

    let updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (bio) {
      updateData.bio = bio;
    }
    if (avatar) {
      updateData.avatar = avatar;
    }

    // Update user profile in the database
    await AuthUser.updateOne({ _id: userId }, updateData);

    // Return success response
    res.json({ success: true, message: 'User profile updated successfully' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/*
// router.post('/:userId/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {

//   console.log(req.file);
//   try {

//     const storage = new CloudinaryStorage({
//       cloudinary: cloudinary,
//       params: {
//         // folder: (req, file) => `Chat App/avatars/${req.params.userId}`,
//         folder: 'Chat App',
//         // public_id: 'avatar',
//         overwrite: true,
//         width: 200,
//         height: 200,
//         crop: 'limit'
//       }
//     });

//     const upload = multer({ storage: storage }).single('avatar');

//     upload(req, res, async (err) => {
//       if (err) {
//         console.log("Error uploading image: ", err);
//         return res.status(400).json({ success: false, message: "error uploading image" });
//       }
//     });

//     const file = req.file;
//     const userId = req.params.userId;

//     // Upload the image to cloudinary
//     Saving in server than on cloud
//     const result = await cloudinary.uploader.upload(file.tempFilePath, {
//       folder: `Chat App/avatars/${req.params.userId}`,
//       public_id: 'avatar',
//       overwrite: true,
//       width: 200,
//       height: 200,
//       crop: 'limit'
//     });
//     

//     // Return error if no file is uploaded
//     if (!file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     // Update the user's avatar URL in the database
//     // const avatarUrl = file.path;
//     const avatarUrl = file.url;
//     await AuthUser.updateOne({ _id: userId }, { avatar: avatarUrl });

//     // Return success response
//     res.json({ success: true, message: "Avatar uploaded successfully" });
//   } catch (error) {
//     console.log("22");
//     console.error(error.message);
//     res.status(500).send('Server Error');
//   }
// });
*/

// Avatar Change Of User
router.post('/:userId/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    console.log(req.file);
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'Chat App', overwrite: true, public_id: 'avatar' });

    const avatarUrl = result.url;
    await AuthUser.updateOne({ _id: req.params.userId }, { avatar: avatarUrl });

    res.json({ success: true, message: "Avatar uploaded successfully" });

  } catch (error) {
    // console.log(error.message);
    res.status(500).send('Server Error');
  }
});


// This Controller Needs so many things to handle...


module.exports = router;