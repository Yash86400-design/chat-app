// Check if the user is the member of Group
const Chatroom = require('../../models/chatroom/Chatroom');
const User = require('../../models/user/User');

async function isMember(chatroomId, userId) {

  let chatroomNotFound;

  if (chatroomId === userId) {
    return false;
  }

  const chatroom = await Chatroom.findById(chatroomId);

  if (!chatroom) {
    chatroomNotFound = true;
  }
  const user = await User.findById(userId);
  if (!user) {
    return false;
  }

  return { isGroupMember: chatroom.members.includes(userId), chatroomInfo: chatroom, senderInfo: user, chatroomNotFound: chatroomNotFound, socketId: chatroom.socketId };
}

module.exports = {
  isMember
};