const express = require('express');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const router = express.Router();
const multer = require('multer');
const Message = require('../../models/message/Message');
const User = require('../../models/user/User');
const { isUserInJoinedChatrooms } = require('./isUserFriend');


const upload = multer();

router.get('/:id', authenticateToken, async (req, res) => {
  const senderId = req.user.userId;
  const receiverId = req.params.id;

  try {

    if (!await (isUserInJoinedChatrooms(senderId, receiverId))) {
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

router.post('/:id', authenticateToken, upload.none(), async (req, res) => {
  const { message } = req.body;
  const senderId = req.user.userId;
  const receiverId = req.params.id;

  try {

    if (!await (isUserInJoinedChatrooms(senderId, receiverId))) {
      res.status(404).json({ message: 'Both users are not friend, So action not allowed' });
    }


    if (senderId === receiverId) {
      res.status(404).json({ message: 'Action not allowed' });
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


module.exports = router;