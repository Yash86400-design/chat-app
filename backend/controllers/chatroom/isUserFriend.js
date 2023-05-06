// Check If the two users are friend or not before any interaction. Otherwise they have to be friends first to send request.

const User = require('../../models/user/User');

async function isUserInJoinedChatrooms(senderId, receiverId) {
  if (senderId === receiverId) {
    return false;
  }

  const sender = await User.findById(senderId).populate('joinedChatrooms');
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) {
    return false;
  }

  const joinedChatroomIds = sender.joinedChatrooms.map((chatroom) => chatroom._id.toString());
  return { isUserFriend: joinedChatroomIds.includes(receiverId.toString()), senderInfo: sender, receiverInfo: receiver };
}

module.exports = {
  isUserInJoinedChatrooms
};