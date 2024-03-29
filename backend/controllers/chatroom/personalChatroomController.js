const express = require('express');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const router = express.Router();
const multer = require('multer');
const Message = require('../../models/message/Message');
const { isUserInJoinedPersonalChatrooms } = require('./isUserFriend');

const upload = multer();

// Getting all the messages related to specific user
router.get('/:id', authenticateToken, async (req, res) => {

  try {

    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      return res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    // find messages sent between the sender and the receiver
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort('createdAt');

    return res.status(200).json({ messages: messages, senderId: senderId, receiverId: receiverId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Sending message to specific user
router.post('/:id', authenticateToken, upload.none(), async (req, res) => {

  try {
    const { message } = req.body;
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend, receiverInfo, senderInfo } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      return res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: message
    });

    const notification = {
      notificationType: 'personalMessage',
      title: `New message from ${senderInfo?.name}`,
      sender: senderId,
      recipient: receiverId,
      link: `/api/profile/personal-chat/${senderId}`
    };

    receiverInfo.notifications.unshift(notification);
    await receiverInfo.save();

    await newMessage.save();

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Finding the user info when user clicks on info section of second user
router.get('/:id/info', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend, receiverInfo } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      return res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    return res.status(200).json(receiverInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Add request for making friend
router.post('/:id/request', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend, senderInfo, receiverInfo } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (isUserFriend) {
      return res.status(404).json({ message: 'Action not allowed, Both of the user are friend' });
    }

    const isInPendingRequests = receiverInfo?.pendingRequests.some(request => String(request) === String(senderInfo._id));

    if (isInPendingRequests) {
      return res.status(200).json({ message: 'You have already sent the request to this user!!!' });
    }

    const notification = {
      notificationType: 'friendRequest',
      title: `A new friend request came from ${senderInfo?.name}`,
      sender: senderInfo?._id,
      recipient: receiverInfo?._id,
      link: `/api/profile/personal-chat/${senderId}`
    };

    receiverInfo?.notifications.unshift(notification);
    receiverInfo?.pendingRequests.push(senderInfo);
    await receiverInfo.save();

    return res.status(200).json({ message: 'Request Sent Successfully', senderId: senderId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit message will look stupid, so only delete message api I'll allow. No let's build this too, It'll be fun..
router.patch('/:id/:messageId/edit', authenticateToken, upload.none(), async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;
    const messageId = req.params.messageId;

    const { isUserFriend } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      return res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    // Find the message by messageId and userId
    const message = await Message.findOne({ _id: messageId, sender: senderId });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or not authorized' });
    }

    const { content } = req.body;

    message.content = content;
    await message.save();

    return res.status(200).json({ message: 'Message updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a particular message of the authenticated user
router.delete('/:id/:messageId/delete', authenticateToken, async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      return res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    // Directly deleting the message, remove is taking time...
    const result = await Message.deleteOne({ _id: messageId, sender: senderId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Message not found or not authorized' });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: 'Internal server error' });
  }
});

// Unfriend route
router.post('/:id/info/unfriend', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend, senderInfo, receiverInfo } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      return res.status(404).json({ message: 'Both users are not friends, so no action is needed' });
    }

    // Send notification to the receiver 
    const unfriendNotificationForReceiver = {
      notificationType: 'unfriend',
      title: `You have been removed from the friend list by ${senderInfo?.name}`,
      sender: senderId,
      recipient: receiverId,
      link: `/api/profile/personal-chat/${senderId}`
    };

    const unfriendNotificationForSender = {
      notificationType: 'unfriend',
      title: `You removed ${receiverInfo?.name} from your friend list`,
      sender: senderId,
      recipient: senderId,
      link: `/api/profile/personal-chat/${receiverId}`
    };

    receiverInfo.notifications.unshift(unfriendNotificationForReceiver);
    senderInfo.notifications.unshift(unfriendNotificationForSender);

    await receiverInfo.save();
    await senderInfo.save();

    // Remove related messages from the Message collection
    await Message.deleteMany({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    // Remove each other from their friend lists
    const senderChatIndex = senderInfo.joinedChats.findIndex(chat => chat.id.toString() === receiverId);
    if (senderChatIndex !== -1) {
      senderInfo.joinedChats.splice(senderChatIndex, 1);
    }

    const receiverChatIndex = receiverInfo.joinedChats.findIndex(chat => chat.id.toString() === senderId);
    if (receiverChatIndex !== -1) {
      receiverInfo.joinedChats.splice(receiverChatIndex, 1);
    }

    // Save the changes
    await senderInfo.save();
    await receiverInfo.save();

    return res.status(200).json({ message: 'Unfriended successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;