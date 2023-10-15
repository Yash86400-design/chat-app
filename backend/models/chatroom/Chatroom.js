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
    type: String, // URL string
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true,
  },
  members: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuthUser',
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
    joinedAt: {
      type: Date,
      required: true
    }
  }],
  admins: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuthUser',
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
    joinedAt: {
      type: Date,
      required: true
    }
  }],
  joinRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
  }],
  socketId: {
    type: String,
    required: true
  },
  notifications: [{
    notificationType: {
      type: String,
      required: true,
      enum: ['groupJoinRequest', 'groupJoinAccepted', 'groupJoinRejected', 'admin_demotion', 'admin_promotion', 'user_left', 'user_joined']
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuthUser',
      required: false,
    },
    senderName: {
      type: String,
      required: false
    },
    senderAvatar: {
      type: String,
      required: false
    },
    senderBio: {
      type: String,
      required: false
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

const Chatroom = mongoose.model('Chatroom', chatRoomSchema);

module.exports = Chatroom;


