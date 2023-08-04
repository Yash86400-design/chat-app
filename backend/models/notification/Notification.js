const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['friendRequest', 'personalMessage', 'groupMessage', 'groupJoinRequest', 'admin_demotion', 'admin_promotion']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: false,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true,
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
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;