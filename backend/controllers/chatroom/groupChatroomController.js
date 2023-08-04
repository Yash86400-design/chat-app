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
const Notification = require("../../models/notification/Notification");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


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
    return res.status(500).json({ message: 'Internal server error' });
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
    return res.status(500).json({ message: "Internal server error" });
  }
});
*/

const upload = multer({ dest: 'uploads/' });

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

// Fetch all the messages of the group
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await isMember(chatroomId, senderId);

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of the group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    const messages = await Message.find({ chatroom: chatroomId });
    // .populate('sender', '_id name email');

    if (!messages) {
      return res.status(404).json({ message: 'No messages found' });
    }

    // Convert the Indian date string to a Date object
    // const indianDate = new Date().toLocaleString('en-IN', {
    //   timeZone: 'Asia/Kolkata',
    //   year: 'numeric',
    //   month: '2-digit',
    //   day: '2-digit',
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   second: '2-digit'
    // });

    // Filter messages based on the joinedAt date of the member
    // const filteredMessages = messages.filter(message => {
    //   const member = chatroomInfo.members.find(member => member.id.toString().equals(message.sender));

    //   if (member && member.joinedAt) {
    //     const memberJoinedAt = new Date(member.joinedAt);
    //     const createdAt = new Date(message.createdAt);
    //     return memberJoinedAt <= createdAt && memberJoinedAt <= new Date(indianDate);
    //   }

    //   return false;
    // });

    const userJoinedDate = chatroomInfo.members.find((member) => member.id.toString() === senderId).joinedAt;
    const userComparisonTime = new Date(userJoinedDate).toISOString();

    const groupMessages = messages.filter((message) => message.chatroom.toString() === chatroomId);
    // console.log(groupMessages);

    // const filteredMessages = groupMessages.filter((message) => new Date(message.createdAt).toDateString() <= userComparisonTime);  //! DateString was not worth it when I'm checking in terms of seconds difference...
    const filteredMessages = groupMessages.filter((message) => new Date(message.createdAt).toISOString() >= userComparisonTime);
    // console.log(filteredMessages);

    return res.status(200).json(filteredMessages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Send message in the group
router.post('/:id', authenticateToken, upload.none(), async (req, res) => {

  try {
    const { message } = req.body;
    const senderId = req.user.userId;
    const chatroomId = req.params.id;
    // console.log(message);

    const { isGroupMember, chatroomNotFound, chatroomInfo, senderInfo } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    if (senderId === chatroomId) {
      res.status(404).json({ message: 'Action not allowed' });
    }
    /*
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
    */
    const currentTime = new Date();
    const newMessage = new Message({
      chatroom: chatroomId,
      sender: senderId,
      content: message,
      name: senderInfo.name,
      email: senderInfo.email,
      createdAt: currentTime
    });

    const savedMessage = await newMessage.save();

    // Emit the newMessage event to the socket server
    // const user = await User.findById(userId);
    const io = req.app.get('socket');
    console.log('Emitting newChatroomMessage event');
    io.to(chatroomId).emit('newChatroomMessage', {
      chatroom: chatroomId,
      // sender: { _id: senderId, name: senderInfo.name, email: senderInfo.email },
      sender: senderId,
      name: senderInfo.name,
      email: senderInfo.email,
      content: newMessage,
      createdAt: currentTime
    });


    // Get the chatroom members
    // const chatroomMembers = chatroomInfo.select('members').populate('members', '-password');
    const chatroomMembers = chatroomInfo.members;

    // Create a new notification for each member of the chatroom except the sender
    chatroomMembers.forEach(async (member) => {
      if (member.id.toString() !== senderId.toString()) {
        // const notification = new Notification({
        //   type: 'groupMessage',
        //   title: `New message in group chatroom from ${member.name}`,
        //   sender: senderId,
        //   recipient: member._id,
        //   link: `/api/profile/group-chat/${chatroomId}`
        // });
        const notification = {
          notificationType: 'groupMessage',
          title: `New message in group chatroom ${chatroomInfo?.name} from ${member.name}`,
          sender: senderId,
          // recipient: member._id,
          link: `/api/profile/group-chat/${chatroomId}`
        };

        // await notification.save();

        // await User.findByIdAndUpdate(member._id, { $push: { notifications: notification } });
        await User.findByIdAndUpdate(member.id, { $push: { notifications: notification } });
      };
    });

    return res.status(200).json({ message: 'Message sent successfully', savedMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
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
      return res.status(404).json({ message: 'User is not a member of group' });
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
    const responseData = { listofMembers: chatroomInfo.members, name: chatroomInfo.name, listofAdmins: chatroomInfo.admins, description: chatroomInfo.description, listofPendingRequests: chatroomInfo.joinRequests, avatar: chatroomInfo.avatar };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }

});

// Put request to update chatroom details
router.patch('/:id/info/update', authenticateToken, upload.single('avatar'), async (req, res) => {

  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    const updateData = {};

    const { name, description } = req.body;
    const avatarPath = req.file ? req.file.path : null;


    // Validate the request body
    /* No need of this as of now, Now user can provide any of the value
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).trim().required(),
      description: Joi.string().min(10).max(200).trim().required(),
    });

    const { error } = schema.validate({ name, description });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    */

    // Find the chatroom by ID
    // const chatroom = await Chatroom.findById(chatroomId);
    // if (!chatroom) {
    //   return res.status(404).json({ message: 'Chatroom not found' });
    // }

    // Check if the user is authorized to update the chatroom
    if (!chatroomInfo.admins.includes(senderId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (avatarPath.length <= 0 && !name && !description) {
      return res.status(200).json({ message: "Profile updated. No changes made. Fill in required fields to update." });
    }

    // Update the avatar of group if exist
    if (avatarPath) {
      const result = await cloudinary.uploader.upload(avatarPath, {
        folder: 'Chat App', overwrite: true, public_id: `avatar_${chatroomId}`
      });
      const avatarUrl = result.secure_url;
      chatroomInfo.avatar = avatarUrl;
      updateData.avatar = avatarUrl;

      // Delete the temporary image file stored in the local directory
      deleteFile(avatarPath);
    }

    // Update the chatroom name and description
    if (name !== undefined && name.length > 0) {
      updateData.name = name;
    }
    if (description !== undefined && description.length > 0) {
      updateData.description = description;
    }

    await Chatroom.updateOne({ _id: chatroomId }, updateData);
    await ListOfChats.updateOne({ roomId: chatroomId }, updateData);
    // await User.updateMany({ 'joinedChats.id': chatroomId }, { $set: { 'joinedChats.$': updateData } }); // Updating all the joinedChats where the current Chatroom is present..

    await User.updateMany(
      { 'joinedChats.id': chatroomId }, // Filter criteria to match the user with the specified userId in the joinedChats array
      { $set: { 'joinedChats.$.name': updateData.name, 'joinedChats.$.type': updateData.type, 'joinedChats.$.avatar': updateData.avatar, 'joinedChats.$.bio': updateData.description } } // Update operation to set specific fields of the matched joinedChats array element
    );

    return res.status(200).json({ chatroomInfo, message: `${chatroomInfo.name} Info Updated Successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete the chatroom
router.delete("/:id/info/delete", authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

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

    return res.status(200).json({ message: 'Chatroom deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
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

    await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' });

    // if (!chatroom) {
    //   return res.status(404).json({ message: 'Chatroom not found' });
    // }

    // Check if the user has already requested to join
    if (chatroomInfo.joinRequests.some(request => request.toString() === senderId.toString())) {
      return res.status(400).json({ message: 'User has already requested to join the chatroom' });
    }

    chatroomInfo.joinRequests.push(senderInfo);
    await chatroomInfo.save();

    // Send notification to chatroom members
    const notificationMessage = `${senderInfo.name} has requested to join the chatroom`;

    // Create a notification for each member of the chatroom
    /*
    for (const member of chatroomInfo.members) {
      if (member.id.toString() !== senderId.toString()) {
        const notification = new Notification({
          recipient: member._id,
          title: notificationMessage,
          type: 'groupJoinRequest',
          link: `/api/profile/chatrooms/${chatroomId}`
        });

        await User.findByIdAndUpdate(member._id, { $push: { notifications: notification } });
        await notification.save();
      }
    }
    */

    const notification = {
      sender: senderInfo?._id,
      senderAvatar: senderInfo?.avatar,
      senderName: senderInfo?.name,
      senderBio: senderInfo?.bio,
      title: notificationMessage,
      notificationType: 'groupJoinRequest'
    };

    chatroomInfo.notifications.push(notification);
    await chatroomInfo.save();

    return res.status(200).json({ message: 'Join request sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// View the pending request of the chatroom
router.get('/:id/requests', authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const userId = req.user.userId;

    const { isGroupMember, chatroomInfo } = await isMember(chatroomId, userId);

    // Check if the user is a member of the chatroom
    if (!isGroupMember) {
      return res.status(403).json({ message: 'User is not a member of the chatroom' });
    }

    await Chatroom.populate(chatroomInfo, { path: 'joinRequests', select: '_id name email' });

    return res.status(200).json(chatroomInfo.joinRequests);
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

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound, socketId } = await (isMember(chatroomId, senderId));

    const isAdmin = chatroomInfo.admins.some((user) => user.toString() === senderId);
    // console.log(isAdmin);

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can accept join requests' });
    }

    /* Not needed this as I'm already getting most of the infos
    await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' }, { path: 'joinRequests', select: '_id name email' });
    */

    // Find the user in the join requests array
    const joinRequestIndex = chatroomInfo?.joinRequests.findIndex(request => request._id.toString() === requestedUserId.toString());

    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }
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
    */

    // Remove the user from the join requests array and add them to the members array

    const requesterName = await User.findById(requestedUserId).select('name');

    chatroomInfo.joinRequests.splice(joinRequestIndex, 1);
    chatroomInfo.members.push({ id: requestedUserId, name: requesterName.name, joinedAt: new Date() });

    // Send notification to the requester
    const requester = await User.findById(requestedUserId);
    const notificationMessage = `Your request to join ${chatroomInfo.name} has been accepted.`;

    /*const notification = new Notification({
      recipient: requester._id,
      sender: senderId,
      message: notificationMessage,
      type: 'groupJoinRequest',
      link: `/api/profile/chatrooms/${chatroomId}`,
    });
    */

    const notificationForUser = {
      // recipient: requester._id,
      // sender: senderId,
      title: notificationMessage,
      notificationType: 'groupJoinRequestSuccess',
      link: `/api/profile/chatrooms/${chatroomId}`,
    };

    const notificationForChatroom = {
      message: `{requester?.name} has joined our chatroom🥳🥳🥳...`,
      notificationType: 'user_joined'
    };

    chatroomInfo?.notifications.push(notificationForChatroom);

    // const uniqueId = uuidv4();

    // await User.findByIdAndUpdate(requestedUserId, { $push: { joinedChatrooms: chatroomId, joinedChats: { name: chatroomInfo.name, 'id': chatroomId, avatar: chatroomInfo.avatar, bio: chatroomInfo.bio, type: 'Chatroom', socketRoomId: socketId } }, $addToSet: { notifications: notification } });
    await User.findByIdAndUpdate(requestedUserId, { $push: { joinedChats: { name: chatroomInfo.name, 'id': chatroomId, avatar: chatroomInfo.avatar, bio: chatroomInfo.bio, type: 'Chatroom', socketRoomId: socketId } }, $addToSet: { notifications: notificationForUser } });

    await chatroomInfo.save();
    // await notification.save();

    return res.status(200).json({ message: `${requester.name} has been added to the chatroom` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Put request for rejecting the joining chatroom request
router.put('/:id/requests/:userId/reject', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const requestedUserId = req.params.userId;

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));
    const isAdmin = chatroomInfo.admins.some((user) => user.toString() === senderId);

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can accept join requests' });
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

    // Create a notification for the requester that their request has been rejected
    // const notification = new Notification({
    //   recipient: requestedUserId,
    //   sender: senderId,
    //   title: `Your request has been rejected for the group `,
    //   type: 'groupJoinRequest',
    // });
    const notification = {
      // recipient: requestedUserId,
      sender: senderId,
      title: `Your request has been rejected to join: ${chatroomInfo.name}`,
      notificationType: 'groupJoinRequestRejected',
    };

    await User.findByIdAndUpdate(requestedUserId, { $push: { notifications: notification } });
    // await notification.save();

    return res.status(200).json({ message: 'Join request has been rejected' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
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
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' });

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


    /* Or you can do this to save in adminOf
    const user = await User.findById(userId).exec();
    user.adminOf.push(chatroomId);
    await user.save();
    */

    // Create a notification for the user that was promoted to admin
    /*
    const notification = new Notification({
      recipient: userId,
      sender: senderId,
      message: `You have been promoted to admin in the chatroom ${chatroomInfo.name}`,
      link: `/api/profile/chatrooms/${chatroomId}`,
      type: 'admin_promotion',
    });
    */

    const userName = await User.findById(userId).select('name');

    const notificationForUser = {
      // recipient: userId,
      // sender: senderId,
      message: `You have been promoted to admin in the chatroom ${chatroomInfo.name}`,
      link: `/api/profile/chatrooms/${chatroomId}`,
      notificationType: 'groupAdminPromotion',
    };

    const notificationForChatroom = {
      message: `${userName.name} has been promoted as admin...`,
      notificationType: 'admin_promotion',
    };

    chatroomInfo.notifications.push(notificationForChatroom);

    await chatroomInfo.save();
    await User.findByIdAndUpdate(userId, { $push: { adminOf: chatroomId }, $addToSet: { notifications: notificationForUser } });
    // await notification.save();

    return res.status(200).json({ message: 'User has been promoted to an admin of the chatroom' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin role is taken up by other admin
router.put('/:id/members/:userId/remove-admin', authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const userId = req.params.userId;

    const { isGroupMember, chatroomInfo, chatroomNotFound, senderInfo } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' }, {
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

    const userName = await User.findById(userId).select('name');

    // Create a notification for the user who got removed from admin role
    /* const notification = new Notification({
      recipient: userId,
      sender: senderId,
      message: `You have been removed from the admin role in the chatroom "${chatroomInfo.name}".`,
      type: 'admin_demotion',
      link: `/api/profile/chatrooms/${chatroomId}`,
    });
    */
    const notificationForUser = {
      // recipient: userId,
      // sender: senderId,
      message: `You have been removed from the admin role in the chatroom "${chatroomInfo.name}".`,
      notificationType: 'groupAdminDemotion',
      link: `/api/profile/chatrooms/${chatroomId}`,
    };

    const notificationForChatroom = {
      notificationType: 'admin_demotion',
      title: `${userName.name} has been removed from admin role by ${senderInfo?.name}...`
    };

    chatroomInfo.notifications.push(notificationForChatroom);

    // await notification.save();

    // Create a notification for the user who removed the admin role
    /*
    const notification2 = new Notification({
      sender: senderId,
      recipient: senderId,
      message: `You removed the admin role of user "${userId}" in the chatroom "${chatroomInfo.name}".`,
      type: 'admin_demotion',
      link: `/api/profile/chatrooms/${chatroomId}`,
    });
    */

    await chatroomInfo.save();
    await User.findByIdAndUpdate(userId, { $push: { notifications: notificationForUser } });
    // await senderInfo.notifications.push(notification2);
    // await senderInfo.save();

    // await notification2.save();

    return res.status(200).json({ message: 'User has been removed from the admin role in the chatroom' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin role is given up by current logged in user
router.put('/:id/members/leave-admin', authenticateToken, async (req, res) => {
  try {

    const chatroomId = req.params.id;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomInfo, chatroomNotFound, senderInfo } = await (isMember(chatroomId, senderId));

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    await Chatroom.populate(chatroomInfo, { path: 'members', select: '_id name email' }, {
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
      const members = chatroomInfo.members.filter(member => member.id.toString() !== senderId.toString());
      if (members.length > 0) {
        const newAdminIndex = Math.floor(Math.random() * members.length);
        const newAdmin = chatroomInfo.members[newAdminIndex];
        chatroomInfo.admins.push(newAdmin);

        // Notify the new admin
        /*
        const newAdminNotification = new Notification({
          recipient: newAdmin._id,
          sender: senderId,
          type: 'admin_promotion',
          title: `You have been promoted to admin in the chatroom ${chatroomInfo.name}`,
          link: `/api/profile/chatrooms/${chatroomId}`,
        });
        */

        const userName = await User.findById(newAdmin._id).select('name');

        const notificationForUser = {
          notificationType: 'groupAdminPromotion',
          title: `You have been promoted to admin in the chatroom ${chatroomInfo.name}`,
          link: `/api/profile/chatrooms/${chatroomId}`
        };

        const notificationForChatroom = {
          notificationType: 'admin_promotion',
          title: `${userName.name} has been promoted as admin, as previous left his admin role...`
        };

        // await User.findByIdAndUpdate(newAdmin._id, { $push: { notifications: newAdminNotification } });
        chatroomInfo.notifications.push(notificationForChatroom);
        await User.findByIdAndUpdate(newAdmin._id, { $push: { notifications: notificationForUser } });
        // await newAdminNotification.save();
      }
    } else {
      // Remove the user's admin role
      const adminIndex = chatroomInfo.admins.findIndex(admin => admin.toString() === senderId.toString());
      if (adminIndex === -1) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      chatroomInfo.admins = chatroomInfo.admins.filter(admin => admin.toString() !== senderId.toString());

      // Notify the user who left admin role
      /*
      const senderNotification = new Notification({
        recipient: senderId,
        sender: senderId,
        type: 'admin_demotion',
        title: `You have left your admin role in the chatroom ${chatroomInfo.name}`,
        link: `/api/profile/chatrooms/${chatroomId}`,
      });
      */

      const userName = await User.findById(senderId).select('name');

      const notificationForUser = {
        title: `You have left your admin role in the chatroom ${chatroomInfo.name}`,
        link: `/api/profile/chatrooms/${chatroomId}`,
        notificationType: 'groupAdminDemotion'
      };

      const notificationForChatroom = {
        title: `${userName.name} has left his admin role of our group...`,
        notificationType: 'admin_demotion'
      };

      // senderInfo.notifications.push(senderNotification);
      senderInfo.notifications.push(notificationForUser);

      await senderInfo.save();
      // await senderNotification.save();

      // Notify the remaining admins
      /*
      chatroomInfo.admins.forEach(async (adminId) => {
        if (adminId.toString() !== senderId.toString()) {
          const adminNotification = new Notification({
            recipient: adminId,
            sender: senderId,
            type: 'admin_demotion',
            title: `Admin ${senderId.name} has left their admin role in the chatroom ${chatroomInfo.name}`,
            link: `/api/profile/chatrooms/${chatroomId}`,
          });

          await adminNotification.save();
          await User.findByIdAndUpdate(adminId, { $push: { notifications: adminNotification } });
        }
      });
      */
      chatroomInfo.notifications.push(notificationForChatroom);
    }
    await chatroomInfo.save();

    res.status(200).json({ message: 'User has left their admin role in the chatroom' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a particular message in the group (User's own message)
router.patch('/:id/:messageId/edit', authenticateToken, upload.none(), async (req, res) => {

  try {
    const { id, messageId } = req.params;
    const { message } = req.body;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomNotFound } = await isMember(id, senderId);

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of this group!' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Group chatroom not found' });
    }

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, sender: senderId },
      { content: message },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found or not authorized' });
    }

    return res.status(200).json({ message: 'Message updated successfully', message: updatedMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Deleting a particular message (It's his own message not of the other users)
router.delete('/:id/:messageId/delete', authenticateToken, async (req, res) => {

  try {
    const { id, messageId } = req.params;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomNotFound } = await isMember(id, senderId);

    if (!isGroupMember) {
      return res.status(404).json({ message: 'User is not a member of this group!' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Group chatroom not found' });
    }

    const message = await Message.findOneAndDelete(
      { _id: messageId, chatroom: id, sender: senderId, },
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found or not authorized' });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;