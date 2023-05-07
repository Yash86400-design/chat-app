const express = require("express");
const router = express.Router();
const Chatroom = require('../../models/chatroom/Chatroom');
const User = require('../../models/user/User');
const { authenticateToken } = require("../../middlewares/authMiddleware");
const Joi = require("joi");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Message = require("../../models/message/Message");
const { isMember } = require("./IsUserMember");
const ListOfChats = require("../../models/listofchats/ListOfChats");

/* Removed during reshuffling
POST /api/chatrooms: Creating a chatroom
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = await User.findById(req.user.userId);

    const createdBy = req.user.userId;
    const chatroom = new Chatroom({ name, description, createdBy, members: [createdBy], admins: [createdBy] });

    // Update the user joinedChatrooms
    user.joinedChatrooms.push(chatroom._id);

    await chatroom.save();
    res.status(201).json({ chatroom, message: 'New Chatroom Created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/


/* Removed during reshuffling
GET /api/chatrooms: Getting all the chatrooms of the user: This should also be inside userController
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userChats = await Chatroom.find({
      $or: [
        { owner: req.user._id }, // Chats owned by the user
        { members: req.user._id } // Chats the user is a member of
      ],
      createdBy: req.user.userId // Only return chatrooms created by the user
    });
    res.status(200).json({ chatrooms: userChats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
*/

const upload = multer();

// Configure Cloudinary with your account credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Fetch all the messages of the group
router.get('/:id', authenticateToken, async (req, res) => {

  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    await Chatroom.populate(chatroomInfo, {
      path: 'members',
      select: '_id name email'
    }, {
      path: 'joinRequests',
      select: '_id name email'
    }, {
      path: 'admins',
      select: '_id name email'
    });

    // Find the chatroom by ID and populate the member field
    const messages = await Message.find({ chatroom: chatroomId })
      .populate('sender', '_id name email');

    if (!messages) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    res.status(200).json({ messages: messages, otherInfos: chatroomInfo });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send message in the group
router.post('/:id', authenticateToken, upload.none(), async (req, res) => {

  try {
    const { message } = req.body;
    const senderId = req.user.userId;
    const chatroomId = req.params.id;

    const { isGroupMember, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    if (senderId === chatroomId) {
      res.status(404).json({ message: 'Action not allowed' });
    }

    const newMessage = new Message({
      chatroom: chatroomId,
      sender: senderId,
      content: message
    });

    const savedMessage = await newMessage.save();

    res.status(200).json({ message: 'Message sent successfully', savedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all the info about the ChatGroup: Only members allowed
router.get('/:id/info', authenticateToken, async (req, res) => {

  try {
    const senderId = req.user.userId;
    const chatroomId = req.params.id;
    // Check if the sender is the member of chatroom or not
    const { isGroupMember, chatroomInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' });
    // await Chatroom.populate(chatroomInfo, { path: 'joinRequests', select: '_id name email' });

    // We can merge above two like this..
    await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' }, { path: 'joinRequests', select: '_id name email' });

    // await Chatroom.populate(chatroomInfo, {  //This fucking error killed my 2 hours... 
    //   path: 'avatar',
    //   select: 'avatar'
    // });

    res.status(200).json({ listofMembers: chatroomInfo.members, name: chatroomInfo.name, listofAdmins: chatroomInfo.admins, description: chatroomInfo.description, listofPendingRequests: chatroomInfo.joinRequests, avatar: chatroomInfo.avatar });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

// Put request to update chatroom details
router.patch('/:id/info/update', authenticateToken, upload.single('avatar'), async (req, res) => {

  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    const { name, description } = req.body;
    const avatarPath = req.file ? req.file.path : null;

    // Validate the request body
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).trim().required(),
      description: Joi.string().min(10).max(200).trim().required(),
    });

    const { error } = schema.validate({ name, description });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the chatroom by ID
    // const chatroom = await Chatroom.findById(chatroomId);
    // if (!chatroom) {
    //   return res.status(404).json({ message: 'Chatroom not found' });
    // }

    // Check if the user is authorized to update the chatroom
    if (!chatroomInfo.admins.includes(senderId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Update the avatar of group if exist
    if (avatarPath) {
      const result = await cloudinary.uploader.upload(avatarPath, {
        folder: 'Chat App', overwrite: true, public_id: `avatar_${chatroomId}`
      });
      const avatarUrl = result.secure_url;
      chatroomInfo.avatar = avatarUrl;
    }

    // Update the chatroom name and description
    chatroomInfo.name = name;
    chatroomInfo.description = description;
    await chatroomInfo.save();

    res.status(200).json({ chatroomInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete the chatroom
router.delete("/:id/info/delete", authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Find the chatroom by ID if any
    // const chatroom = await Chatroom.findById(chatroomId);
    // if (!chatroom) {
    //   return res.status(404).json({ message: 'Chatroom not found' });
    // }

    // Check if the user is an admin of the chatroom 
    const isAdmin = chatroomInfo.admins.includes(senderId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Not allowed, Only admin can do this action!' });
    }

    // Deleting the chatroom id from the joinedChatrooms array
    senderInfo.joinedChatrooms = senderInfo.joinedChatrooms.filter(room => room._id.toString() !== chatroomId.toString());

    await senderInfo.save();
    await ListOfChats.deleteOne({ roomId: chatroomId.toString() });

    // Delete the chatroom
    await Chatroom.deleteOne({ _id: chatroomId });

    res.status(200).json({ message: 'Chatroom deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Request to join the chatroom : This should be inside userController
router.post('/:id/request', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomInfo, senderInfo } = await (isMember(chatroomId, senderId));

    // Check if the user is already a member
    if (isGroupMember) {
      return res.status(400).json({ message: 'User is already a member of the chatroom' });
    }

    Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' });

    // if (!chatroom) {
    //   return res.status(404).json({ message: 'Chatroom not found' });
    // }

    // Check if the user has already requested to join
    if (chatroomInfo.joinRequests.some(request => request.toString() === senderId.toString())) {
      return res.status(400).json({ message: 'User has already requested to join the chatroom' });
    }

    chatroomInfo.joinRequests.push(senderInfo);
    await chatroomInfo.save();

    res.status(200).json({ message: 'Join request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT request for accepting the request to join chatroom
router.put('/:id/requests/:userId/accept', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const requestedUserId = req.params.userId;

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' }, { path: 'joinRequests', select: '_id name email' });

    // Find the user in the join requests array
    const joinRequestIndex = chatroomInfo.joinRequests.findIndex(request => request._id.toString() === requestedUserId.toString());

    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Remove the user from the join requests array and add them to the members array
    chatroomInfo.joinRequests.splice(joinRequestIndex, 1);
    chatroomInfo.members.push(requestedUserId);


    await chatroomInfo.save();
    await User.findByIdAndUpdate(requestedUserId, { joinedChatrooms: chatroomId });

    res.status(200).json({ message: 'User has been added to the chatroom' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Put request for rejecting the joining chatroom request
router.put('/:id/requests/:userId/reject', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const requestedUserId = req.params.userId;

    const { isGroupMember, chatroomInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' }, { path: 'joinRequests', select: '_id name email' });

    // Find the user in the join requests array
    const joinRequestIndex = chatroomInfo.joinRequests.findIndex(request => request._id.toString() === requestedUserId.toString());

    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Remove the user from the join requests array
    chatroomInfo.joinRequests.splice(joinRequestIndex, 1);
    await chatroomInfo.save();

    res.status(200).json({ message: 'Join request has been rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Promoting a member as admin
router.patch('/:id/admins/:userId/make-admin', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const userId = req.params.userId;

    const { isGroupMember, chatroomInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' });

    // Check if the user is an admin of the chatroom
    const isAdmin = chatroomInfo.admins.includes(senderId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Only admins are allowed to promote members' });
    }

    // Check if the user to be promoted is already an admin of the chatroom
    const isAlreadyAdmin = chatroomInfo.admins.includes(userId);
    if (isAlreadyAdmin) {
      return res.status(400).json({ message: 'User is already an admin of the chatroom' });
    }

    // Promote the user to be an admin of the chatroom
    chatroomInfo.admins.push(userId);

    await chatroomInfo.save();
    await User.findByIdAndUpdate(userId, { $push: { adminOf: chatroomId } });

    /* Or you can do this to save in adminOf
    const user = await User.findById(userId).exec();
    user.adminOf.push(chatroomId);
    await user.save();
    */

    res.status(200).json({ message: 'User has been promoted to an admin of the chatroom' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin role is taken up by other admin
router.put('/:id/members/:userId/remove-admin', authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const userId = req.params.userId;

    const { isGroupMember, chatroomInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' }, {
      path: 'admins',
      select: '_id name email'
    });

    // Check if the user is an admin of the chatroom
    const isAdmin = chatroomInfo.admins.includes(senderId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Only admins are allowed to remove admin role from members' });
    }

    // Check if the user to be removed is an admin of the chatroom
    if (!chatroomInfo.admins.includes(userId)) {
      return res.status(404).json({ message: 'User is not an admin of the chatroom' });
    }

    // Remove the user's admin role
    chatroomInfo.admins = chatroomInfo.admins.filter(admin => admin.toString() !== userId.toString());

    await chatroomInfo.save();

    res.status(200).json({ message: 'User has been removed from the admin role in the chatroom' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin role is given up by current logged in user
router.put('/:id/members/leave-admin', authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' }, {
      path: 'admins',
      select: '_id name email'
    });

    if (!chatroomInfo) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is an admin of the chatroom
    const isAdmin = chatroomInfo.admins.includes(senderId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Only admins are allowed to leave admin role' });
    }

    // If the user is the only admin of the chatroom, randomly assign admin role to another member
    if (chatroomInfo.admins.length === 1) {
      const members = chatroomInfo.members.filter(member => member._id.toString() !== senderId.toString());
      if (members.length > 0) {
        const newAdminIndex = Math.floor(Math.random() * members.length);
        const newAdmin = chatroomInfo.members[newAdminIndex];
        chatroomInfo.admins.push(newAdmin);
      }
    } else {
      // Remove the user's admin role
      const adminIndex = chatroomInfo.admins.findIndex(admin => admin.toString() === senderId.toString());
      if (adminIndex === -1) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      chatroomInfo.admins = chatroomInfo.admins.filter(admin => admin.toString() !== senderId.toString());
    }
    await chatroomInfo.save();

    res.status(200).json({ message: 'User has left their admin role in the chatroom' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;