const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true,
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
});

const Chatroom = mongoose.model('Chatroom', chatRoomSchema);

module.exports = Chatroom;