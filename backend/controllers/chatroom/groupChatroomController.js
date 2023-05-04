const express = require("express");
const router = express.Router();
const Chatroom = require('../../models/chatroom/Chatroom');
const User = require('../../models/user/User');
const { authenticateToken } = require("../../middlewares/authMiddleware");
const Joi = require("joi");

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

// Fetch all the messages of the group
router.get('/:id', authenticateToken, async (req, res) => {

  const { message } = req.body;
  const sender = req.user.userId

  try {
    const chatroomId = req.params.id;

    // Find the chatroom by ID and populate the member field
    const chatroom = await Chatroom.findById(chatroomId)
      .populate('members', '_id name email')
      .populate('joinRequests', '_id name email');

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is authorized to access the chatroom
    if (!chatroom.members.some(member => member._id.toString() === req.user.userId.toString())) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // res.status(200).json({ chatroom });

    // Redirect the user to the messages page if they are a member of the chatroom
    res.status(200).json({});  // show all the message and then redirect him to chat with someone
    res.redirect(`/chatroom/${chatroomId}/messages`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send message in the group
router.post('/:id', authenticateToken, async (req, rest) => {
  console.log('Welcome in the chatroom');
})

// Put request to update chatroom details
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const { name, description } = req.body;

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
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is authorized to update the chatroom
    if (!chatroom.admins.includes(req.user.userId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Update the chatroom name and description
    chatroom.name = name;
    chatroom.description = description;
    await chatroom.save();

    res.status(200).json({ chatroom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete the chatroom
router.delete("/:id/info/delete", authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const user = await User.findById(req.user.userId);

    // Find the chatroom by ID if any
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is an admin of the chatroom 
    const isAdmin = chatroom.admins.includes(req.user.userId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Not allowed, Only admin can do this action!' });
    }

    // Deleting the chatroom id from the joinedChatrooms array
    user.joinedChatrooms = user.joinedChatrooms.filter(room => room._id.toString() !== chatroomId.toString());

    // Delete the chatroom
    await chatroom.remove();

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
    const userId = req.user.userId;

    const chatroom = await Chatroom.findById(chatroomId).populate('members', '_id name email');

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is already a member
    if (chatroom.members.some(member => member._id.toString() === userId.toString())) {
      return res.status(400).json({ message: 'User is already a member of the chatroom' });
    }

    // Check if the user has already requested to join
    if (chatroom.joinRequests.some(request => request.toString() === userId.toString())) {
      return res.status(400).json({ message: 'User has already requested to join the chatroom' });
    }

    chatroom.joinRequests.push(userId);
    await chatroom.save();

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
    const userId = req.params.userId;

    const chatroom = await Chatroom.findById(chatroomId).populate('members', '_id name email').populate('joinRequests', '_id name email');

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is an admin of the chatroom
    const isMember = chatroom.members.some(member => member._id.toString() === req.user.userId);

    if (!isMember) {
      return res.status(401).json({ message: 'Only members are allowed to accept join requests' });
    }

    // Find the user in the join requests array
    const joinRequestIndex = chatroom.joinRequests.findIndex(request => request._id.toString() === userId.toString());

    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Remove the user from the join requests array and add them to the members array
    chatroom.joinRequests.splice(joinRequestIndex, 1);
    chatroom.members.push(userId);
    await chatroom.save();

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
    const userId = req.params.userId;

    const chatroom = await Chatroom.findById(chatroomId).populate('members', '_id name email').populate('joinRequests', '_id name email');

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is a member of the chatroom
    const isMember = chatroom.members.some(member => member._id.toString() === req.user.userId);

    if (!isMember) {
      return res.status(401).json({ message: 'Only members are allowed to reject join requests' });
    }

    // Find the user in the join requests array
    const joinRequestIndex = chatroom.joinRequests.findIndex(request => request._id.toString() === userId.toString());

    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Remove the user from the join requests array
    chatroom.joinRequests.splice(joinRequestIndex, 1);
    await chatroom.save();

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
    const userId = req.params.userId;

    const chatroom = await Chatroom.findById(chatroomId).populate('members', '_id name email');
    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is an admin of the chatroom
    const isAdmin = chatroom.admins.includes(req.user.userId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Only admins are allowed to promote members' });
    }

    // Check if the user to be promoted is already a member of the chatroom
    const isMember = chatroom.members.some(member => member._id.toString() === userId);
    if (!isMember) {
      return res.status(404).json({ message: 'User is not a member of the chatroom' });
    }

    // Check if the user to be promoted is already an admin of the chatroom
    const isAlreadyAdmin = chatroom.admins.includes(userId);
    if (isAlreadyAdmin) {
      return res.status(400).json({ message: 'User is already an admin of the chatroom' });
    }

    // Promote the user to be an admin of the chatroom
    chatroom.admins.push(userId);
    await chatroom.save();

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
    const userId = req.params.userId;

    const chatroom = await Chatroom.findById(chatroomId).populate('members', '_id name email');
    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is an admin of the chatroom
    const isAdmin = chatroom.admins.includes(req.user.userId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Only admins are allowed to remove admin role from members' });
    }

    // Check if the user to be removed is an admin of the chatroom
    if (!chatroom.admins.includes(userId)) {
      return res.status(404).json({ message: 'User is not an admin of the chatroom' });
    }

    // Remove the user's admin role
    chatroom.admins = chatroom.admins.filter(admin => admin.toString() !== userId.toString());

    await chatroom.save();

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
    const userId = req.user.userId;

    const chatroom = await Chatroom.findById(chatroomId).populate('members', '_id name email');

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if the user is an admin of the chatroom
    const isAdmin = chatroom.admins.includes(userId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Only admins are allowed to leave admin role' });
    }

    // If the user is the only admin of the chatroom, randomly assign admin role to another member
    if (chatroom.admins.length === 1) {
      const members = chatroom.members.filter(member => member._id.toString() !== userId.toString());
      if (members.length > 0) {
        const newAdminIndex = Math.floor(Math.random() * members.length);
        const newAdmin = chatroom.members[newAdminIndex];
        chatroom.admins.push(newAdmin);
      }
    } else {
      // Remove the user's admin role
      const adminIndex = chatroom.admins.findIndex(admin => admin.toString() === userId.toString());
      if (adminIndex === -1) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      chatroom.admins = chatroom.admins.filter(admin => admin.toString() !== userId.toString());
    }
    await chatroom.save();

    res.status(200).json({ message: 'User has left their admin role in the chatroom' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;