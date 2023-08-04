// Check If the two users are friend or not before any interaction. Otherwise they have to be friends first to send request.

const User = require('../../models/user/User');

async function isUserInJoinedPersonalChatrooms(senderId, receiverId) {

  if (senderId === receiverId) {
    return false;
  }

  // const sender = await User.findById(senderId).populate('joinedChatrooms');
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);


  if (!sender || !receiver) {
    return false;
  }

  // const joinedPersonalChatroomIds = sender.joinedPersonalChats.map((chatroom) => chatroom._id.toString());
  // const joinedPersonalChatroomIds = sender.joinedPersonalChats.map((chatroom) => chatroom._id.toString());
  return { isUserFriend: sender.joinedChats.some((user) => user.id.toString() === receiverId.toString()), senderInfo: sender, receiverInfo: receiver };
}

module.exports = {
  isUserInJoinedPersonalChatrooms
};