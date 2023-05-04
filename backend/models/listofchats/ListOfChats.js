const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    enum: ['User', 'Chatroom'],
    required: true
  }
});

module.exports = mongoose.model('ListOfChats', listSchema);