// Check If the two users are friend or not before any interaction. Otherwise they have to be friends first to send request.

const User = require('../../models/user/User');

async function isUserInJoinedPersonalChatrooms(senderId, receiverId) {

  if (senderId === receiverId) {
    return false;
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);


  if (!sender || !receiver) {
    return false;
  }

  return { isUserFriend: sender.joinedChats.some((user) => user.id.toString() === receiverId.toString()), senderInfo: sender, receiverInfo: receiver };
}

module.exports = {
  isUserInJoinedPersonalChatrooms
};