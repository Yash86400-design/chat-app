const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

const Chatroom = mongoose.model('Chatroom', chatRoomSchema);

module.exports = Chatroom;