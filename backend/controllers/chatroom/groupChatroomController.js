const express = require("express");
const router = express.Router();
const Chatroom = require('../../models/chatroom/Chatroom');
const User = require('../../models/user/User');
const { authenticateToken } = require("../../middlewares/authMiddleware");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Message = require("../../models/message/Message");
const { isMember } = require("./isUserMember");
const ListOfChats = require("../../models/listofchats/ListOfChats");
const fs = require('fs');
const AuthUser = require("../../models/user/User");
const { default: mongoose } = require("mongoose");


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

    const userJoinedDate = chatroomInfo.members.find((member) => member.id.toString() === senderId).joinedAt;
    const userComparisonTime = new Date(userJoinedDate).toISOString();

    const groupMessages = messages.filter((message) => message.chatroom.toString() === chatroomId);

    const filteredMessages = groupMessages.filter((message) => new Date(message.createdAt).toISOString() >= userComparisonTime);

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
    const chatroomMembers = chatroomInfo.members;

    // Check if admin (Just to show in notification whether the message is from admin or not.)
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId);

    // Create a new notification for each member of the chatroom except the sender
    chatroomMembers.forEach(async (member) => {
      if (member.id.toString() !== senderId.toString()) {

        const notification = {
          notificationType: 'groupMessage',
          title: `New message in group chatroom ${chatroomInfo?.name} (${isAdmin ? 'Admin' : 'Member'}) from ${senderInfo.name}`,
          sender: senderId,
          // recipient: member._id,
          link: `/api/profile/group-chat/${chatroomId}`
        };

        await User.findByIdAndUpdate(member.id, {
          $push: {
            notifications: {
              $each: [notification],
              $position: 0  // Just like for user messages adding new notification in the beginning
            }
          }
        });
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

    return res.status(200).json(chatroomInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }

});

// Put request to update chatroom details
router.patch('/:id/info/edit', authenticateToken, upload.single('avatar'), async (req, res) => {

  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    let isAvatarChanged = false;
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
    console.log("Name:", name, "Description:", description, "AvatarPath:", avatarPath);

    // Check if the user is authorized to update the chatroom
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!avatarPath && name.length === 0 && description.length === 0) {
      return res.status(200).json({ message: 'No changes found', editChatroomAdminId: senderInfo._id, editedChatroomId: chatroomId });
    }

    // Update the avatar of group if exist
    if (avatarPath) {
      isAvatarChanged = true;
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

    // Create a new message to show who updated the chatroom details
    const currentTime = new Date();
    const newMessage = new Message({
      chatroom: chatroomId,
      sender: senderId,
      content: `${senderInfo.name} updated the chatroom info(${name ? 'name' : ''} ${description ? 'bio' : ''} ${isAvatarChanged ? 'Avatar' : ''}).`,
      createdAt: currentTime,
      name: 'Chatroom Notifier'
    });

    await newMessage.save();

    await Chatroom.updateOne({ _id: chatroomId }, updateData);
    await ListOfChats.updateOne({ roomId: chatroomId }, updateData);

    await User.updateMany(
      { 'joinedChats.id': chatroomId }, // Filter criteria to match the user with the specified userId in the joinedChats array
      { $set: { 'joinedChats.$.name': updateData.name, 'joinedChats.$.type': updateData.type, 'joinedChats.$.avatar': updateData.avatar, 'joinedChats.$.bio': updateData.description } } // Update operation to set specific fields of the matched joinedChats array element
    );

    return res.status(200).json({ chatroomInfo, message: `${chatroomInfo.name} Info Updated Successfully.`, editChatroomAdminId: senderInfo._id, editedChatroomId: chatroomId });
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
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Not allowed, Only admin can do this action!' });
    }

    // Deleting the chatroom id from the joinedChatrooms array
    senderInfo.joinedChatrooms = senderInfo.joinedChatrooms.filter(room => room._id.toString() !== chatroomId.toString());
    senderInfo.adminOf = senderInfo.adminOf.filter(room => room._id.toString() !== chatroomId.toString());

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

    // Check if the user has already requested to join
    if (chatroomInfo.joinRequests.some(request => request.toString() === senderId.toString())) {
      return res.status(200).json({ message: 'You have already requested to join the chatroom' });
    }

    chatroomInfo.joinRequests.push(senderInfo);
    await chatroomInfo.save();

    // Send notification to chatroom members
    const notificationMessage = `${senderInfo.name} has requested to join the chatroom`;

    const notification = {
      sender: senderInfo?._id,
      senderAvatar: senderInfo?.avatar,
      senderName: senderInfo?.name,
      senderBio: senderInfo?.bio,
      title: notificationMessage,
      notificationType: 'groupJoinRequest'
    };

    // chatroomInfo.notifications.push(notification);
    chatroomInfo?.notifications.unshift(notification);
    await chatroomInfo.save();

    return res.status(200).json({ message: 'Join request sent successfully', id: senderId });
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
router.put('/:id/requests/:notificationId/:userId/accept', authenticateToken, async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const requestedUserId = req.params.userId;

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound, socketId } = await (isMember(chatroomId, senderId));

    const isAdmin = chatroomInfo.admins.some((user) => user.id.toString() === senderId);
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

    // Find the user in the join requests array
    const joinRequestIndex = chatroomInfo?.joinRequests.findIndex(request => request._id.toString() === requestedUserId.toString());

    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Remove the user from the join requests array and add them to the members array
    const requestedUserData = await User.findById(requestedUserId);

    chatroomInfo.joinRequests.splice(joinRequestIndex, 1);
    chatroomInfo.members.push({ id: requestedUserId, name: requestedUserData?.name, bio: requestedUserData?.bio, avatar: requestedUserData?.avatar, joinedAt: new Date() });

    // Send notification to the requester
    const notificationMessage = `Your request to join ${chatroomInfo.name} has been accepted.`;

    const notificationForUser = {
      title: notificationMessage,
      notificationType: 'groupJoinRequestSuccess',
      link: `/api/profile/chatroom/${chatroomId}`,
    };

    chatroomInfo?.notifications.map((notification) => {
      if (notification._id.toString() === notificationId) {
        notification['notificationType'] = 'groupJoinAccepted';
        notification['title'] = `${requestedUserData?.name} has joined our chatroom (admin: ${senderInfo.name} accepted the request)🥳🥳🥳...`;
        notification['read'] = true;
      }
    });

    requestedUserData?.joinedChats.push({ name: chatroomInfo.name, 'id': chatroomId, avatar: chatroomInfo.avatar, bio: chatroomInfo.bio, type: 'Chatroom', socketRoomId: socketId });

    requestedUserData.notifications.unshift(notificationForUser);

    // Create a new message to show who joined the chatroom
    const currentTime = new Date();
    const newMessage = new Message({
      chatroom: chatroomId,
      sender: senderId,
      content: `${requestedUserData?.name} has joined the chatroom (admin: ${senderInfo.name} accepted the request).`,
      createdAt: currentTime,
      name: 'Chatroom Notifier'
    });

    await newMessage.save();


    await chatroomInfo.save();
    await requestedUserData.save();
    // await notification.save();

    return res.status(200).json({ message: `${requestedUserData.name} has been added to the chatroom` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Put request for rejecting the joining chatroom request
router.put('/:id/requests/:notificationId/:userId/reject', authenticateToken, async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const chatroomId = req.params.id;
    const senderId = req.user.userId;
    const requestedUserId = req.params.userId;

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await (isMember(chatroomId, senderId));
    const isAdmin = chatroomInfo.admins.some((user) => user.id.toString() === senderId);

    if (!isGroupMember) {
      return res.status(200).json({ message: 'You are not a member of this group' });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    if (!isAdmin) {
      return res.status(200).json({ message: 'Only admins can reject join requests' });
    }

    // Find the user in the join requests array
    const joinRequestIndex = chatroomInfo.joinRequests.findIndex(request => request._id.toString() === requestedUserId.toString());


    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Remove the user from the join requests array
    chatroomInfo.joinRequests.splice(joinRequestIndex, 1);

    // Requester Data
    const requesterData = await User.findById(requestedUserId).select('name');

    chatroomInfo?.notifications.map((notification) => {
      if (notification._id.toString() === notificationId) {
        notification['notificationType'] = 'groupJoinRejected';
        notification['title'] = `${requesterData?.name} join request has been rejected... (by ${senderInfo.name})`;
        notification['read'] = true;
      }
    });

    const notification = {
      // recipient: requestedUserId,
      sender: senderId,
      title: `Your request has been rejected to join: ${chatroomInfo.name}`,
      notificationType: 'groupJoinRequestRejected',
    };

    const requestedUserData = await User.findById(requestedUserId).select('notifications');
    // await notification.save();

    requestedUserData.notifications.unshift(notification);

    await chatroomInfo.save();
    await requestedUserData.save();

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
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId.toString());
    if (!isAdmin) {
      return res.status(401).json({ message: 'Only admins are allowed to promote members' });
    }

    // Check if the user to be promoted is already an admin of the chatroom
    const isAlreadyAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === userId.toString());
    if (isAlreadyAdmin) {
      return res.status(400).json({ message: 'User is already an admin of the chatroom' });
    }

    // Promote the user to be an admin of the chatroom
    // chatroomInfo.admins.push(userId);
    const userData = await User.findById(userId).select('name avatar bio _id');

    chatroomInfo.members.push({ id: userData?._id, name: userData?.name, bio: userData?.bio, avatar: userData?.avatar, joinedAt: new Date() });

    const notificationForUser = {
      // recipient: userId,
      // sender: senderId,
      message: `You have been promoted to admin in the chatroom ${chatroomInfo.name}`,
      link: `/api/profile/chatroom/${chatroomId}`,
      notificationType: 'groupAdminPromotion',
    };

    const notificationForChatroom = {
      message: `${userData.name} has been promoted as admin...`,
      notificationType: 'admin_promotion',
    };

    // chatroomInfo.notifications.push(notificationForChatroom);
    chatroomInfo?.notifications.unshift(notificationForChatroom);

    // Create a new message to show who gets promoted as admin
    const currentTime = new Date();
    const newMessage = new Message({
      chatroom: chatroomId,
      sender: senderId,
      content: `${userData.name} gets promoted to admin to role.`,
      createdAt: currentTime,
      name: 'Chatroom Notifier'
    });

    await newMessage.save();


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
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId);
    if (!isAdmin) {
      return res.status(401).json({ message: 'Only admins are allowed to remove admin role from members' });
    }

    // Check if the user to be removed is an admin of the chatroom
    const isAnotherAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === userId);
    if (!isAnotherAdmin) {
      return res.status(404).json({ message: 'User is not an admin of the chatroom' });
    }

    // Remove the user's admin role
    chatroomInfo.admins = chatroomInfo.admins.filter(admin => admin.toString() !== userId.toString());

    const userName = await User.findById(userId).select('name');

    const notificationForUser = {
      message: `You have been removed from the admin role in the chatroom "${chatroomInfo.name}".`,
      notificationType: 'groupAdminDemotion',
      link: `/api/profile/chatroom/${chatroomId}`,
    };

    const notificationForChatroom = {
      notificationType: 'admin_demotion',
      title: `${userName.name} has been removed from admin role by ${senderInfo?.name}...`
    };

    // chatroomInfo.notifications.push(notificationForChatroom);
    chatroomInfo?.notifications.unshift(notificationForChatroom);

    const chatroomIdToRemove = mongoose.Types.ObjectId(chatroomId);

    await chatroomInfo.save();
    await User.findByIdAndUpdate(userId, { $push: { notifications: notificationForUser }, $pull: { adminOf: chatroomIdToRemove } });

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
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId);
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
        const userName = await User.findById(newAdmin._id).select('name');

        const notificationForUser = {
          notificationType: 'groupAdminPromotion',
          title: `You have been promoted to admin in the chatroom ${chatroomInfo.name}`,
          link: `/api/profile/chatroom/${chatroomId}`
        };

        const notificationForChatroom = {
          notificationType: 'admin_promotion',
          title: `${userName.name} has been promoted as admin, as previous left his admin role...`
        };

        const chatroomIdToRemove = mongoose.Types.ObjectId(chatroomId);

        chatroomInfo?.notifications.unshift(notificationForChatroom);
        await User.findByIdAndUpdate(newAdmin._id, { $push: { notifications: notificationForUser }, $pull: { adminOf: chatroomIdToRemove } });
      }
    } else {
      // Remove the user's admin role
      const adminIndex = chatroomInfo.admins.findIndex(admin => admin.toString() === senderId.toString());
      if (adminIndex === -1) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      chatroomInfo.admins = chatroomInfo.admins.filter(admin => admin.toString() !== senderId.toString());

      // Notify the user who left admin role
      const userName = await User.findById(senderId).select('name');

      const notificationForUser = {
        title: `You have left your admin role in the chatroom ${chatroomInfo.name}`,
        link: `/api/profile/chatroom/${chatroomId}`,
        notificationType: 'groupAdminDemotion'
      };

      const notificationForChatroom = {
        title: `${userName.name} has left his admin role of our group...`,
        notificationType: 'admin_demotion'
      };

      senderInfo?.notifications.unshift(notificationForUser);
      senderInfo.adminOf = senderInfo.adminOf.filter(room => room._id.toString() !== chatroomId.toString());

      await senderInfo.save();

      // Notify the remaining admins
      chatroomInfo?.notifications.unshift(notificationForChatroom);
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

// Route to allow regular members to leave the group 
router.delete("/:id/info/leave", authenticateToken, async (req, res) => {
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
    // If the sender is not an admin, simply remove them from the group
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId);
    if (!isAdmin) {
      const notificationForUser = {
        notificationType: 'groupLeft',
        title: `You have exited the group ${chatroomInfo?.name}`,
        link: `/api/profile/chatroom/${chatroomId}`
      };
      const notificationForChatroom = {
        notificationType: 'user_left',
        title: `${senderInfo?.name} has left the chatroom`
      };
      chatroomInfo.notifications.unshift(notificationForChatroom);
      senderInfo.notifications.unshift(notificationForUser);

      senderInfo.joinedChats = senderInfo.joinedChats.filter(room => room.id.toString() !== chatroomId.toString());
      chatroomInfo.members = chatroomInfo.members.filter(user => user.id.toString() !== senderId.toString());

      // Create a new message to show who exited the chatroom
      const currentTime = new Date();
      const newMessage = new Message({
        chatroom: chatroomId,
        sender: senderId,
        content: `${senderInfo.name} has left the chatroom.`,
        createdAt: currentTime,
        name: 'Chatroom Notifier'
      });

      await newMessage.save();


      await senderInfo.save();
      await chatroomInfo.save();

      return res.status(200).json({ message: 'You left the group' });
    }
    // Handle admin leaving the group
    if (chatroomInfo.admins.length === 1) {
      if (chatroomInfo.members.length === 1) {
        // Only admin and one member, delete the group
        const notificationForUser = {
          notificationType: 'groupLeft',
          title: `You have exited the group ${chatroomInfo?.name} and since you were the only member the group also gets deleted...`
        };
        senderInfo.joinedChats = senderInfo.joinedChats.filter((chatroom) => chatroom.id.toString() !== chatroomId);
        senderInfo.adminOf = senderInfo.adminOf.filter(room => room._id.toString() !== chatroomId);
        senderInfo.notifications.unshift(notificationForUser);
        await senderInfo.save();
        await Message.deleteMany({ chatroom: chatroomId });
        await ListOfChats.deleteOne({ roomId: chatroomId.toString() });
        await Chatroom.deleteOne({ _id: chatroomId });
        return res.status(200).json({ message: 'You have exited the group and Chatroom deleted successfully' });
      } else {
        // Notifications for both user and chatroom
        const notificationForUser = {
          notificationType: 'groupLeft',
          title: `You have exited the group ${chatroomInfo?.name}`,
          link: `/api/profile/chatroom/${chatroomId}`
        };
        const notificationForChatroom = {
          notificationType: 'user_left',
          title: `${senderInfo?.name} has left the chatroom. He was also a member.`
        };

        senderInfo.notifications.unshift(notificationForUser);
        chatroomInfo.notifications.unshift(notificationForChatroom);
        senderInfo.adminOf = senderInfo.adminOf.filter(room => room._id.toString() !== chatroomId);

        // Randomly select a new admin from group members
        const remainingMembers = chatroomInfo?.members.filter(member => member.id.toString() !== senderId.toString());
        const newAdminIndex = Math.floor(Math.random() * remainingMembers.length);
        const newAdmin = remainingMembers[newAdminIndex];
        chatroomInfo?.admins.push(newAdmin);

        // Removing the user from group
        chatroomInfo.admins = chatroomInfo?.admins.filter(admin => admin.id.toString() !== senderId.toString());

        // Create a new message for chatroom exit
        const currentTime = new Date();
        const newMessage = new Message({
          chatroom: chatroomId,
          sender: senderId,
          content: `${senderInfo.name} has left the chatroom.`,
          createdAt: currentTime,
          name: 'Chatroom Notifier'
        });

        await newMessage.save();


        await senderInfo.save();
        await chatroomInfo.save();
        // await updatedAdminsAndMembers.save();
        await remainingAdmins.save();
        await remainingMembers.save();

        return res.status(200).json({ message: 'You left the group' });
      }
    }
    // Remove the group from the user's joined chat list
    senderInfo.joinedChats = senderInfo.joinedChats.filter(room => room.id.toString() !== chatroomId.toString());

    await senderInfo.save();

    res.status(200).json({ message: 'Successfully exited the group...' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/:id/notifications/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await isMember(chatroomId, senderId);

    if (!isGroupMember) {
      return res.status(403).json({ message: `${senderInfo?.name} is not a member of chatroom.` });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if user is admin 
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have the necessary permissions to perform this action. This task is restricted to administrators. Please contact an administrator for assistance.' });
    }

    for (const notification of chatroomInfo.notifications) {
      if (!notification.read) {
        if (notification.notificationType !== 'groupJoinRequest') {
          notification.read = true;
        }
      }
    }

    // Save the changes
    await chatroomInfo.save();

    res.status(200).json({ message: 'All unread notifications marked as read successfully except user join requests.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete all notifications of the chatroom
router.delete('/:id/notifications/delete-all', authenticateToken, async (req, res) => {
  try {
    const chatroomId = req.params.id;
    const senderId = req.user.userId;

    const { isGroupMember, chatroomInfo, senderInfo, chatroomNotFound } = await isMember(chatroomId, senderId);

    if (!isGroupMember) {
      return res.status(403).json({ message: `${senderInfo?.name} is not a member of chatroom.` });
    }

    if (chatroomNotFound) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    // Check if user is admin 
    const isAdmin = chatroomInfo.admins.some((admin) => admin.id.toString() === senderId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have the necessary permissions to perform this action. This task is restricted to administrators. Please contact an administrator for assistance.' });
    }

    for (const notification of chatroomInfo.notifications) {
      if (notification.notificationType === 'groupJoinRequest') {
        const requestSender = await User.findById(notification.sender);
        const notificationForSender = {
          recipient: requestSender._id,
          sender: senderId,
          notificationType: 'groupJoinRequestRejected',
          read: false
        };

        // For request sender
        requestSender.notifications.unshift(notificationForSender);
        await requestSender.save();
      }
    }

    senderInfo.notifications = [];
    await senderInfo.save();

    // Create a new message to show who deleted all the notifications
    const currentTime = new Date();
    const newMessage = new Message({
      chatroom: chatroomId,
      sender: senderId,
      content: `${senderInfo.name} deleted all the notifications.`,
      createdAt: currentTime,
      name: 'Chatroom Notifier'
    });

    await newMessage.save();

    return res.status(200).json({ message: 'Deleted all notifications. Successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;