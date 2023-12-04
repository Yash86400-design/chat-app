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

  const userJoinedDate = chatroom.members.find((member) => member.id.toString() === userId).joinedAt;
  const userComparisonTime = new Date(userJoinedDate).toISOString();

  // const filteredMessages = groupMessages.filter((message) => new Date(message.createdAt).toISOString() >= userComparisonTime);

  const isCurrentUserMember = chatroom.members.some((user) => user.id.toString() === userId.toString());

  const notificationForUser = chatroom.notifications.filter((notification) => new Date(notification.createdAt).toISOString() >= userComparisonTime);

  chatroom.notifications = notificationForUser;

  return { isGroupMember: isCurrentUserMember, chatroomInfo: chatroom, senderInfo: user, chatroomNotFound: chatroomNotFound, socketId: chatroom.socketId };
}

module.exports = {
  isMember
};