const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200,
    trim: true,
  },
  avatar: {
    type: String, // URL of the avatar image
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true,
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  joinRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
  }],
  socketId: {
    type: String,
    required: true
  }
});

const Chatroom = mongoose.model('Chatroom', chatRoomSchema);

module.exports = Chatroom;


