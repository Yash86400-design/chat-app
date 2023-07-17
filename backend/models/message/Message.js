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
  },
  // createdAt: {
  //   type: String,
  //   required: true,
  // },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  //   get: function () {
  //     return new Date(this.createdAt).toLocaleString('en-IN', {
  //       timeZone: 'Asia/Kolkata',
  //       year: 'numeric',
  //       month: '2-digit',
  //       day: '2-digit',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       second: '2-digit'
  //     });
  //   }
  // }
}, { timestamps: true });


const Message = mongoose.model('Message', messageSchema);

module.exports = Message;