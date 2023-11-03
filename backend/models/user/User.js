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
    type: String, // Url string
    default: null
  },
  bio: {
    type: String,
    default: null
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
  joinedChats: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['User', 'Chatroom'],
      required: true
    },
    id: {
      type: String,
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null
    },
    socketRoomId: {
      type: String,
      required: true
    }
  }
  ],
  adminOf: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom'
  }],
  notifications: [{
    notificationType: {
      type: String,
      required: true,
      enum: ['friendRequest', 'friendRequestAccepted', 'friendRequestRejected', 'personalMessage', 'groupMessage', 'groupJoinRequestSuccess', 'groupJoinRequestRejected', 'groupAdminPromotion', 'groupAdminDemotion', 'unfriend', 'groupLeft']
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuthUser',
      required: false,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuthUser',
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const AuthUser = mongoose.model('AuthUser', userSchema);

module.exports = AuthUser;