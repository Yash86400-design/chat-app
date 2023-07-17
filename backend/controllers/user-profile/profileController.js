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
const Joi = require('joi');
const { isUserInJoinedPersonalChatrooms } = require('../chatroom/isUserFriend');
const Notification = require('../../models/notification/Notification');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const upload = multer({ dest: 'uploads/' });
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log('File deleted successfully');
    }
  });
};


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
    const userProfile = await User.findById(req.user.userId);
    // console.log(userProfile);

    // Return the user profile data
    return res.json(userProfile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Getting the user's friend info to show on top of chat when rendering the list of chats
router.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const userProfile = await User.findById(req.params.id).select('name avatar bio');

    if (userProfile) {
      // return res.json(userProfile);
      const { name, avatar, bio } = userProfile;
      return res.json({ name, avatar, bio, type: 'User', _id: req.params.id }); // Quick fix of sending type of User and id
    } else {
      // If the userProfile not found
      return res.status(404).json({ error: 'User profile not found' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Getting the user's groupchat infos to show on top of chat when rendering the list of chats
router.get('/group/:id', authenticateToken, async (req, res) => {
  try {
    const groupProfile = await Chatroom.findById(req.params.id).select('name avatar bio');

    if (groupProfile) {
      // return res.json(groupProfile);
      const { name, avatar, bio } = groupProfile;
      return res.json({ name, avatar, bio, type: 'Chatroom', _id: req.params.id }); // Quick fix of sending type of User and id
    } else {
      // If the groupProfile not found
      return res.status(404).json({ error: 'Group profile not found' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new chatroom
router.post('/new-chatroom', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const avatarPath = req.file ? req.file.path : '';
    const user = await User.findById(req.user.userId);

    const createdBy = req.user.userId;

    const schema = Joi.object({
      name: Joi.string().min(3).max(30).trim().required(),
      description: Joi.string().min(10).max(200).trim().required()
    });

    const { error } = schema.validate({ name, description });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let avatarUrl = undefined;
    if (avatarPath != '') {
      const result = await cloudinary.uploader.upload(avatarPath, {
        folder: 'Chat App', overwrite: true, public_id: `avatar_${createdBy}`
      });
      avatarUrl = result.secure_url;

      // Delete the temporary image file stored in the local directory
      deleteFile(avatarPath);
    }

    const uniqueId = uuidv4();
    /*
        // Get current date
        const currentDate = new Date();
    
        // Options for formatting the date and time
        const options = {
          timeZone: 'Asia/Kolkata', // Indian time zone
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        };
    
        // Format the date and time as Indian date string
        const indianDate = currentDate.toLocaleString('en-IN', options);
        // console.log(indianDate);
    */
    const chatroom = new Chatroom({ name, description, createdBy, members: [{ id: createdBy, joinedAt: new Date() }], admins: [createdBy], avatar: avatarUrl, socketId: uniqueId });
    const newListChatroom = new listOfChats({ name: name, roomId: chatroom._id.toString(), type: 'Chatroom', bio: description ? description : null, avatar: avatarUrl ? avatarUrl : null });


    // Update the user joinedChatrooms
    user.joinedChats.push({ name: name, id: chatroom._id, avatar: avatarUrl, bio: description, type: 'Chatroom', socketRoomId: uniqueId });
    // user.joinedChatrooms.push(chatroom._id);
    user.adminOf.push(chatroom._id);

    await user.save();
    await chatroom.save();
    await newListChatroom.save();
    return res.status(201).json({ chatroom, message: 'New Chatroom Created' });

    // Redirect to the new chatroom page
    // res.redirect(`/api/profile/chatrooms/${chatroom._id}`);  //It will cause error in frontend...
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// View Profile
router.get('/view-profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.userId);

    return res.status(200).json({ profile: userProfile.avatar, bio: userProfile.bio, name: userProfile.name });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile (including avatar)
router.patch('/view-profile/edit', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const { name, bio } = req.body;
    const avatarPath = req.file ? req.file.path : null;
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
      const result = await cloudinary.uploader.upload(avatarPath, { folder: 'Chat App', overwrite: true, public_id: `avatar_${userId}` });
      const avatarUrl = result.url;
      updateData.avatar = avatarUrl;

      // Delete the temporary image file stored in the local directory
      deleteFile(avatarPath);
    }

    if (!name && !bio && !avatarPath) {
      return res.status(400).json({ success: false, message: 'No profile updates were provided' });
    }
    // Update user profile in the database
    await User.updateOne({ _id: userId }, updateData);
    await listOfChats.updateOne({ roomId: userId }, updateData);
    await User.updateMany(
      { 'joinedChats.id': userId }, // Filter criteria to match the user with the specified userId in the joinedChats array
      { $set: { 'joinedChats.$.name': updateData.name, 'joinedChats.$.type': updateData.type, 'joinedChats.$.avatar': updateData.avatar, 'joinedChats.$.bio': updateData.bio } } // Update operation to set specific fields of the matched joinedChats array element
    );

    // Return success response
    return res.json({ success: true, message: 'User profile updated successfully' });

  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

// For auto suggestion
router.get('/search', authenticateToken, async (req, res) => {
  const partialQuery = req.query.q; // retrieve the partial query from the query parameters
  const userId = req.user.userId;

  // retrieve a list of suggested search terms or results that match the partial query
  const suggestedTerms = await searchServices.getSuggestedTerms(partialQuery, userId);

  return res.json(suggestedTerms);  // return the suggested terms as a JSON object
});

// For getting query after auto suggestion didn't work. (will work after hitting enter)
router.post('/search-result', authenticateToken, upload.single('none'), async (req, res) => {
  const query = req.body.query;  // retrieve the complete search query from the request body
  const userId = req.user.userId;

  // process the search query and retrieve the search results
  const searchResults = await searchServices.getSearchResults(query, userId);

  return res.json({ searchResults });  // return the search results as a JSON object 
});

router.get('/notifications/requests/:userId/accept', authenticateToken, async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user.userId;

    const { isUserFriend, senderInfo: currentUser, receiverInfo: requester } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    // console.log(`SenderInfo: ${currentUser}. Requester Info: ${requester}`);

    if (isUserFriend) {
      return res.status(404).json({ message: 'User is already a friend' });
    }

    const uniqueId = uuidv4();
    // const io = req.app.get('socket');
    // console.log(io, uniqueId);
    // io.emit('joinRoom', )
    // io.on('connection', (socket) => {
    //   socket.join(uniqueId);
    //   console.log('Hi', uniqueId);
    // });
    currentUser.joinedChats.push({ name: requester.name, 'id': requester._id, avatar: requester.avatar, bio: requester.bio, type: 'User', socketRoomId: uniqueId });

    // Update the current user's list and pending requests
    currentUser.joinedPersonalChats.push(requester._id);
    currentUser.pendingRequests = currentUser.pendingRequests.filter(request => String(request) !== String(requester._id));
    await currentUser.save();

    // Update the requester's friend list
    requester.joinedPersonalChats.push(currentUser._id);
    requester.joinedChats.push({ name: currentUser.name, 'id': currentUser._id, avatar: currentUser.avatar, bio: currentUser.bio, type: 'User', socketRoomId: uniqueId });
    await requester.save();

    // Send Notification to the requester
    const notification = new Notification({
      recipient: requester,
      sender: currentUser,
      type: 'friendRequest',
      title: `Your friend request to ${currentUser.name} has been accepted.`,
      link: `/api/profile/personal-chat/${senderId}`
    });

    requester.notifications.push(notification);
    notification.save();
    requester.save();

    return res.status(200).json({ message: `Friend request from ${requester.name} accepted successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/notifications/requests/:userId/reject', authenticateToken, async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user.userId;

    const { isUserFriend, senderInfo: currentUser, receiverInfo: requester } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (isUserFriend) {
      return res.status(404).json({ message: 'User is already a friend' });
    }

    // Update the current user's pending requests
    currentUser.pendingRequests = currentUser.pendingRequests.filter(request => String(request) !== String(requester._id));
    await currentUser.save();

    // Send Notification to the requester
    const notification = new Notification({
      recipient: requester,
      sender: currentUser,
      type: 'friendRequest',
      title: `Your friend request to ${currentUser.name} has been rejected.`,
    });

    requester.notifications.push(notification);
    notification.save();
    requester.save();
    return res.status(200).json({ message: `Friend request from ${requester.name} rejected successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;