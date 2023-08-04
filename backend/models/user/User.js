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
    type: String, // you can store the URL of the avatar image
    default: null
  },
  bio: {
    type: String,
    default: null
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
  /*  Cause now my joinedChats is working absolutely fine
  joinedChatrooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom'
  }],
  // array for saving whom I'm talking to one on one
  joinedPersonalChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser'
  }],
  */
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
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: function () {
        if (this.type === 'User') {
          return 'AuthUser';
        } else if (this.type === 'Chatroom') {
          return 'Chatroom';
        }
      }
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
    // notificationId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Notification'
    // },
    notificationType: {
      type: String,
      required: true,
      // enum: ['friendRequest', 'groupJoinRequest', 'personalMessage', 'groupMessage', 'admin_demotion', 'admin_promotion']
      enum: ['friendRequest', 'friendRequestAccepted', 'friendRequestRejected', 'personalMessage', 'groupMessage', 'groupJoinRequestSuccess', 'groupJoinRequestRejected', 'groupAdminPromotion', 'groupAdminDemotion']
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