// Check if the user is the member of Group
const Chatroom = require('../../models/chatroom/Chatroom');
const User = require('../../models/user/User');

async function isMember(chatroomId, userId) {

  if (chatroomId === userId) {
    return false;
  }

  const chatroom = await Chatroom.findById(chatroomId);

  if (!chatroom) {
    return false;
  }
  const user = await User.findById(userId);
  if (!user) {
    return false;
  }

  return chatroom.members.includes(user._id);
}

module.exports = {
  isMember
};