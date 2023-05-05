const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  roomId: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['User', 'Chatroom'],
    required: true
  }
});

module.exports = mongoose.model('ListOfChats', listSchema);