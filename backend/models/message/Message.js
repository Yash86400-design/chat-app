const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // chatroomId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Chatroom',
  //   required: true,
  // },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
  },
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom',
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;