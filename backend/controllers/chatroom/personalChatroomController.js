const express = require('express');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const router = express.Router();
const multer = require('multer');
const Message = require('../../models/message/Message');
const User = require('../../models/user/User');
const { isUserInJoinedPersonalChatrooms } = require('./isUserFriend');


const upload = multer();

// Getting all the messages related to specific user
router.get('/:id', authenticateToken, async (req, res) => {

  try {

    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    // find messages sent between the sender and the receiver
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort('createdAt');

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sending message to specific user
router.post('/:id', authenticateToken, upload.none(), async (req, res) => {

  try {
    const { message } = req.body;
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: message
    });


    await newMessage.save();
    console.log(`Message saved successfully: ${message}`);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Finding the user info when user clicks on info section of second user
router.get('/:id/info', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend, receiverInfo } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    res.status(200).json(receiverInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add request for making friend
router.post('/:id/request', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend, senderInfo, receiverInfo } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (isUserFriend) {
      res.status(404).json({ message: 'Action not allowed, Both of the user are friend' });
    }

    const isInPendingRequests = receiverInfo.pendingRequests.some(request => String(request) === String(senderInfo._id));

    if (isInPendingRequests) {
      res.status(422).json({ message: 'You have already sent the request to this user!!!' });
    }

    receiverInfo.pendingRequests.push(senderInfo);
    await receiverInfo.save();

    res.status(200).json('Request Sent Successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit message will look stupid, so only delete message api I'll allow. No let's build this too, It'll be fun..
router.post('/:id/messageId/edit', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.id;
    const messageId = req.params.id;

    const { isUserFriend } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    // Find the message by messageId and userId
    const message = await Message.findOne({ _id: messageId, sender: senderId });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or not authorized' });
    }

    const { content } = req.body;

    message.content = content;
    await message.save();

    res.status(200).json({ message: 'Message updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a particular message of the authenticated user
router.delete('/:id/messageId/delete', authenticateToken, async (req, res) => {
  try {
    const messageId = req.params.id;
    const senderId = req.user.userId;
    const receiverId = req.params.id;

    const { isUserFriend } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    // Find the message by messageId and userId
    const message = await Message.findOne({ _id: messageId, sender: senderId });

    if (!message) {
      res.status(404).json({ message: 'Message not found or not authorized' });
    }

    await message.remove();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {

  }
});


module.exports = router;