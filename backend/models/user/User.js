const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String // you can store the URL of the avatar image
  },
  bio: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  pendingRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser'
  }]
  ,
  joinedChatrooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom'
  }],
  // array for saving whom I'm talking to one on one
  joinedPersonalChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser'
  }],
  adminOf: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom'
  }],
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }]
});

const AuthUser = mongoose.model('AuthUser', userSchema);

module.exports = AuthUser;