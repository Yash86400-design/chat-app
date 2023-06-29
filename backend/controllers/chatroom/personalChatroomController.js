const express = require('express');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const router = express.Router();
const multer = require('multer');
const Message = require('../../models/message/Message');
const User = require('../../models/user/User');
const { isUserInJoinedPersonalChatrooms } = require('./isUserFriend');
const Notification = require('../../models/notification/Notification');
const socket = require('../../server');


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

    // // Establish socket connection with the client
    // const socket = req.app.get('socket');

    // // Emit an event to the client
    // socket.emit('connected', 'Connected to the socket server');

    // // Listen for events from the client
    // socket.on('chatMessage', (message) => {
    //   console.log(`Received message: ${message}`);
    // });

    return res.status(200).json(messages);
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

    const { isUserFriend, receiverInfo } = await isUserInJoinedPersonalChatrooms(senderId, receiverId);

    if (!isUserFriend) {
      return res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: message
    });

    // Get the socket instance from the request's io object
    const io = req.app.get('socket');
    // socket.ioObject.sockets.on('userMessage', (msg) => {
    //   console.log(msg);
    // });
    // io.on('connection', socket => {
    //   console.log(socket);
    //   socket.on('userMessage', (msg) => {
    //   });
    // });
    // io.on('userMessage', (msg) => {
    //   console.log(msg);
    // });
    // io.on('connection', (socket) => {
    //   console.log(socket);
    //   socket.on('personalMessage', (data) => {
    //     console.log('Received data:', data);
    //     socket.emit('sendingPersonalMessageReturn', (data.message))
    //     io.emit('helloMessage' ,'To all user')
    //   });
    // });
    // Emit an event to the connected clients with the new message
    // io.to(senderId).emit('newPersonalMessage', newMessage);


    // Create notification for the receiver

    const notification = Notification({
      type: 'personalMessage',
      title: `${message.slice(10)}...`,
      sender: senderId,
      recipient: receiverId,
      link: `/api/profile/personal-chat/${senderId}`
    });

    await notification.save();

    receiverInfo.notifications.push(notification);
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

    const isInPendingRequests = receiverInfo.pendingRequests.some(request => String(request) === String(senderInfo._id));

    if (isInPendingRequests) {
      return res.status(422).json({ message: 'You have already sent the request to this user!!!' });
    }

    // Create notification for the receiver
    const notification = new Notification({
      type: 'friendRequest',
      title: `A new friend request came from ${senderInfo.name}`,
      sender: senderId,
      recipient: receiverId,
      link: `/api/profile/personal-chat/${senderId}`
    });

    await notification.save();

    receiverInfo.notifications.push(notification);

    receiverInfo.pendingRequests.push(senderInfo);
    await receiverInfo.save();

    return res.status(200).json('Request Sent Successfully');
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


module.exports = router;